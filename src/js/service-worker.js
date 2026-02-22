const api = typeof browser !== 'undefined' ? browser : chrome;
console.log("BACKGROUND LOADED")
api.storage.local.set({ "mode": "default" })
api.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("HELLO o/")
    if (request.action === "getSetting") {
        api.storage.local.get(request.key)
            .then((result) => {
                console.log(result[request.key])
                sendResponse({ success: true, value: result[request.key] });
            })
            .catch((error) => {
                sendResponse({ success: false, error: error.message });
            });
        return true;
    } else if (request.action === "handleVideo") {
        handleVideo(request.url,request.prompt).then(data => {
            sendResponse({ success: true, content: data })
        }
        ).catch(error => {
            sendResponse({ succes: false, content: error })
        }
        )
        return true;
    }
});



async function handleVideo(url,prompt) {
    let res = await fetch(url)
    let blob = await res.blob()
    const API_KEY = (await api.storage.local.get("api")).api
    console.log(blob, "a")
    const formData = new FormData()
    const metadata = {
        file: {
            display_name: "Test"
        }
    }
    formData.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" })
    )
    formData.append("file", blob)
    const urlB64=btoa(url)
    let uri=await getCookie(urlB64)
    if(!uri){
        console.log("cookie not found")
        let upload=await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?uploadType=multipart&key=${API_KEY}`, {
            method:"POST",
            body:formData
        })
        upload = await upload.json()
        let state = "PROCESSING"
        uri = upload.file.uri
        while (state == "PROCESSING") {
            let resp = await fetch(uri + `?key=${API_KEY}`)
            resp = await resp.json()
            console.log(resp)
            state = resp.state
            if(state=="ACTIVE") break
            await sleep(5000)
        }
        setCookie(urlB64,uri,2)
        console.log(state)
    }
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "image/jpeg");

    let payload = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { file_data: { mime_type: "video/mp4", file_uri: uri } }
                ]
            }]
        })
    }
    let model = "gemini-2.5-flash"
    let geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`, payload)

    console.log(geminiResponse)
    geminiResponse = await geminiResponse.json()
    let text = geminiResponse.candidates[0].content.parts[0].text
    console.log(text)
    return text
}
/**
    * Sleep for a given amount of time in ms
    *
    * @param time - ammount of ms for how long should sleep
*/
async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time))
}
async function getCookie(cname) {
    let cookie=await api.storage.local.get(cname)
    cookie=cookie[cname]
    const d = new Date();
    if(!cookie || cookie.exp<=d.getTime()-5*60*60*1000){//5 minute margin just to be safe
        return null
    }
    return cookie.val
}
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  let expires=d.getTime() + (exdays*24*60*60*1000);
  let temp={}
  temp[cname]={val:cvalue,exp:expires}
  api.storage.local.set(temp)
}

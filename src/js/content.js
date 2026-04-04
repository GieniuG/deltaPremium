const dryRun=true
const api = typeof browser !== 'undefined' ? browser : chrome;
console.log("content")
const videos = document.querySelectorAll('video')

videos.forEach(async video => {
    url = video.querySelector('source').src
    let div = document.createElement("div")
    div.style.width = "100%"
    div.style.textAlign = "center"
    let a = document.createElement("a")
    a.href = url
    a.target = "_blank"
    a.style.fontSize = "1rem"
    a.innerText = "Download"
    div.appendChild(a)
    video.parentNode.appendChild(div)
    //---------------
    div.style.display = "flex"
    div.style.flexDirection = "column"
    let textArea = document.createElement("textarea")
    textArea.rows="7"
    let defaultMessage="Keep it concise; Respond to these questions based on the provided video:"
    textArea.value=defaultMessage
    div.appendChild(textArea)
    let button=document.createElement("button")

    const api = typeof browser !== 'undefined' ? browser : chrome;
    button.innerHTML="SEND"
    div.appendChild(button)
    button.addEventListener("click",async ()=>{
        console.log("click")
        

        let infoBoard=document.createElement("div")
        infoBoard.classList.add("infoBoard")
        div.append(infoBoard)
        let spinner=document.createElement("div")
        let spinnerContainer=document.createElement("div")
        spinnerContainer.append(spinner)
        spinner.classList.add("spinner")

        infoBoard.appendChild(spinnerContainer)
        let stageInfoContainer = document.createElement("div")
        let stageInfo = document.createElement("p")
        stageInfoContainer.append(stageInfo)
        stageInfo.innerHTML="lorem 0/4"
        infoBoard.append(stageInfoContainer)

        const port=api.runtime.connect({name:"HEY"})
        console.log(port)
        port.onMessage.addListener((msg)=>{
            stageInfoContainer.innerHTML=`${msg.stage} ${msg.idx}/4`
        })
        if(!dryRun){
            let response=await api.runtime.sendMessage({
              action: "handleVideo",
              url: url,
              prompt:textArea.value+" \n\n\n!!IMPORTANT!! Format your output as HTML tags; DO NOT include markdown codeblocks"
            })
            console.log(response)
            infoBoard.style.display="none"
            let outputArea=document.createElement("div")
            outputArea.style.textAlign="left"
            outputArea.innerHTML=response.content
            div.appendChild(outputArea)

        }
    })
})



const api = typeof browser !== 'undefined' ? browser : chrome;
console.log("content")
const videos = document.querySelectorAll('video')

videos.forEach(video=>{
    url = video.querySelector('source').src
    let div=document.createElement("div")
    div.style.width="100%"
    div.style.textAlign="center"
    let a=document.createElement("a")
    a.href=url
    a.target="_blank"
    a.style.fontSize="1rem"
    a.innerText="Download"
    div.appendChild(a)
    video.parentNode.appendChild(div)
})
getSetting("mode").then(resolvedValue => {
  console.log("Resolved value:", resolvedValue);
});


async function getSetting(key) {
  try {
    const response = await api.runtime.sendMessage({
      action: "getSetting",
      key: key
    });
    if (response.success) {
        console.log(response)
      return response.value;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e)
    return null;
  }
}

async function getSetting(key) {
  try {
    const response = await api.runtime.sendMessage({
      action: "getSetting",
      key: key
    });
    if (response.success) {
        console.log(response)
      return response.value;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e)
    return null;
  }
}

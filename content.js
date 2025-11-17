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
    a.innerText="Download"
    div.appendChild(a)
    video.parentNode.appendChild(div)
})

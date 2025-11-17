console.log("learningapps")

function quizSolver(){
    document.querySelectorAll("input").forEach(input=>{
        input.value=input.nextElementSibling.getAttribute("data-content")
    })
}
async function cardSolver(){
    console.log("cards")
    let cards=document.querySelectorAll("#cards .card")
    for(let i=0;i<cards.length;i+=2){
        cards[i].style.left=cards[i+1].style.left
        cards[i].style.top=cards[i+1].style.top
        cards[i].dispatchEvent(new Event("mousedown",{bubbles:true}))
        let cX=cards[i].getBoundingClientRect().left
        let cY=cards[i].getBoundingClientRect().top
        document.querySelector("#cards").dispatchEvent(new MouseEvent("mousemove",{bubbles:true,clientX:cX+10,clientY:cY}))
        await wait(cards[i+1])
        cards[i].dispatchEvent(new Event("mouseup",{bubbles:true}))
    }
    console.log("cards done")
}
async function wait(element){
    return new Promise(resolve=>{
        let observer=new MutationObserver(()=>{
            resolve()
            observer.disconnect()
        })
        observer.observe(element,{attributes:true})
    })
}
function start(){
    if(document.querySelector("#cards")){
        button.innerText="SOLVE"
        cardSolver()
    }else{
        button.innerText="FILL IN"
        quizSolver()
    }
}

let button=document.createElement("button")
button.style.float="right"
button.addEventListener("click",()=>{
    start()
})
let div=document.createElement("div")
div.append(button)
div.style.width="100%"
div.style.height="50px"

window.addEventListener("load",()=>{
    if(!document.querySelector("iframe")){
        document.querySelector("body").prepend(div)
    }
})


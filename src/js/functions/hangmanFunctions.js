function hangmanSolver() {
  while ((button = document.querySelector("#nextRoundBtn"))) {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
}
function hangmanHelper(){
    let letter=document.querySelector(".line:not(:has(*))").getAttribute("data-letter").toUpperCase()
    document.querySelector(`#keyboard [data-letter="${letter}"]`).dispatchEvent(new MouseEvent("click",{bubbles:true}))
}

function useKeyboard(){
    document.addEventListener("keypress",e=>{
        let letter=e.key.toUpperCase()
        document.querySelector(`#keyboard [data-letter="${letter}"]`).dispatchEvent(new MouseEvent("click",{bubbles:true}))
    })
}

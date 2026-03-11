function memorySolver(){
    let nrOfElements=document.querySelectorAll("#boxcard > div").length/2
    for(let i=0;i<nrOfElements;i++){
        document.querySelector(`#e${i}_1`).dispatchEvent(new MouseEvent("click",{bubbles:true}))
        document.querySelector(`#e${i}_2`).dispatchEvent(new MouseEvent("click",{bubbles:true}))
    }
}

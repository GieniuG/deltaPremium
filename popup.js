document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', ()=>{
        if(checkbox.id==='auto-solve'){
            //todo
        }else if(checkbox.id==='helper'){
            let modeSlider=document.querySelector(".mode-slider")
            if(!checkbox.checked){
                modeSlider.parentElement.classList.add("off");
                modeSlider.previousElementSibling.disabled=true;
            }else{
                modeSlider.parentElement.classList.remove("off");
                modeSlider.previousElementSibling.disabled=false;
            }
        }else if(checkbox.id==='mode'){
            //todo
        }
    });
});
browser.storage.local.set({'test':'worked'})

const api = typeof browser !== 'undefined' ? browser : chrome;

document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', ()=>{
        if(checkbox.id=='auto-solve'){
            api.storage.local.set({"autoSolve":checkbox.checked})
        }else if(checkbox.id=='helper'){
            api.storage.local.set({"helper":checkbox.checked})
            changeModeEnabledStateTo(!checkbox.checked)
        }else if(checkbox.id=='mode'){
            api.storage.local.set({"mode":checkbox.checked?"wordle":"default"})
        }
    });
});
async function getSetting(key) {
  try {
    const response = await api.runtime.sendMessage({
      action: "getSetting",
      key: key
    });
    if (response.success) {
      return response.value;
    } else {
      return null;
    }
  } catch (e) {
    console.error(e)
    return null;
  }
}
function changeModeEnabledStateTo(flag){
    let modeSlider=document.querySelector(".mode-slider")
    if(flag){
        modeSlider.parentElement.classList.add("off");
        modeSlider.previousElementSibling.disabled=true;
    }else{
        modeSlider.parentElement.classList.remove("off");
        modeSlider.previousElementSibling.disabled=false;
    }
}
async function setSliders(){
    let modeChecked=await getSetting("mode")=="wordle"
    mode=document.querySelector("#mode")
    mode.checked=modeChecked
    let helperChecked=await getSetting("helper")
    helper=document.querySelector("#helper")
    changeModeEnabledStateTo(!helperChecked)
    helper.checked=helperChecked
    let autoSolveChecked=await getSetting("autoSolve")
    autoSolve=document.querySelector("#auto-solve")
    autoSolve.checked=autoSolveChecked
}
setSliders()

//Pojebie mnie ale to najlepsze co mogę wymyślić by transistion
//się nie odpalało przy każdym otwarciu popupa 
//można by użyć mutatin observer znowu ale mi się nie chce kekw
setTimeout(()=>{
    document.querySelectorAll(".slider").forEach(el=>{
        el.classList.add("trans")
    })
},100)


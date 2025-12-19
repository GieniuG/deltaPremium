let a,map;
async function crosswordSolver(){
    map=mapOutCrossword()
    a.forEach((word,wordIndex)=>{
        word.split("").forEach((letter,letterIndex)=>{
            map[wordIndex][letterIndex].innerText=letter
        })
    })
}
async function prepCrossword(){
    console.log("prep crossword")
    url = getJsonpUrl();
    let data = await getInitpar(url);
    data = data.toUpperCase();
    a=[...data.matchAll(/WORD\d+=TEXT%7C(.*?)&/g)].map(x=>x[1].replace(/%20/,""));
    map=mapOutCrossword()
}
function crosswordHelper(){
    let blocks=[...document.querySelectorAll("#questionDisplay .field.filled")]
    let blink=document.querySelector(".blink")
    let wordId=parseInt(document.querySelector("#questionDisplay div").id.match(/\d+/)[0])-1
    let letterId=blocks.indexOf(blink)
    let input=document.querySelector(".inputElement.filled")

    input.value=a[wordId][letterId]
    input.dispatchEvent(new KeyboardEvent("keyup",{bubbles:true,keyCode:65}))
}
function mapOutCrossword(){
    let map=[]
    let crossword = document.querySelector("#innerCrossword");
    let startFields = [...crossword.querySelectorAll("td:has(:last-child:nth-child(2))")];
    //find first grid
    startFields=startFields.filter(el=>{
        if(el.childElementCount==2 && !el.querySelector(".solution") || el.childElementCount==3){
           return el
        }
    })
    startFields.forEach(el=>{
        let numberDiv=el.querySelector("div")
        let x=parseInt(numberDiv.id.split("_")[1]),
            y=parseInt(numberDiv.id.split("_")[2])
        numberDiv.innerText.split(",").forEach(n=>{
            n=parseInt(n)-1
            //check down then up:
            if(document.querySelector(`#innerCrossword #grid_${x}_${y+1}.filled`)){
                //if up then go left
                if(document.querySelector(`#innerCrossword #grid_${x}_${y-1}.filled`)){
                    map[n]=getFields(x,y,1,0)
                }else{
                    map[n]=getFields(x,y,0,1)
                }
            }else if(document.querySelector(`#innerCrossword #grid_${x+1}_${y}.filled`)){
                map[n]= getFields(x,y,1,0)
            }
        })
    })
    return map
}
/*
* map out to an array
* set a to 1 to go right
* set b to 1 to go down
*/
function getFields(x,y,a,b){
    let arr=[]
    for(let i=0;i<100;i++){
        if(document.querySelector(`#innerCrossword #grid_${x}_${y}.filled`)){
            arr.push(document.querySelector(`#innerCrossword #grid_${x}_${y}.filled`))
            x+=a
            y+=b
        }else{
            break
        }
    }
    return arr
}

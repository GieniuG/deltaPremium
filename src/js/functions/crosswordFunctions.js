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
    a=[...data.matchAll(/WORD\d+=TEXT%7C(.*?)&/g)].map(x=>x[1].replaceAll("%20",""));
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
        //divs with numbers ie. start of (possibly) multiple words
        let numberDiv=el.querySelector("div")
        // numberDiv.id follows a pattern: grid_{x coordinate}_{y coordinate}
        let x=parseInt(numberDiv.id.split("_")[1]),
            y=parseInt(numberDiv.id.split("_")[2])
        numberDiv.innerText.split(",").forEach(n=>{
            n=parseInt(n)-1

            el.querySelector(".field").dispatchEvent(new MouseEvent("click",{bubbles:true}))
            let b=document.querySelector("#questionDisplay b")
            let direction=b.innerText.match(/\(.*\)/)[0]
            if(direction=="(horizontal)"){
                map[n]=getFields(x,y,1,0)
            }else{
                map[n]=getFields(x,y,0,1)
            }
        })
    })
    document.querySelector("#questionSidePanel > div:nth-child(2) > img").dispatchEvent(new MouseEvent("click",{bubbles:true}))
    return map
}
/**
    * map out fields for a word to an array
    * @param {int} a set this to 1 to go right
    * @param {int} b set this to 1 to go down
    * @param {int} x x coordinate
    * @param {int} y y coordinate
*/
function getFields(x,y,a,b){
    let arr=[]
    while(document.querySelector(`#innerCrossword #grid_${x}_${y}.filled`)){
        arr.push(document.querySelector(`#innerCrossword #grid_${x}_${y}.filled`))
        x+=a
        y+=b
    }
    return arr
}

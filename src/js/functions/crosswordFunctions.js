let a,map;

async function crosswordSolver(){
    map=mapOutCrossword()

    a.forEach((word,wordIndex)=>{
        word.split("").forEach((letter,letterIndex)=>{
            console.log(wordIndex,letterIndex)
            map[wordIndex][letterIndex].innerText=letter
        })
    })
}
async function prepCrossword(){
    console.log("prep crossword")
    url = getJsonpUrl();
    let data = await getInitpar(url);
    data = data.toUpperCase();
    console.log(data)
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
        let wasRightAlready=false,swap=false
        let prevNumber=0 //for the swap operation
        //divs with numbers ie. start of (possibly) multiple words
        let numberDiv=el.querySelector("div")
        // numberDiv.id follows a pattern: grid_{x coordinate}_{y coordinate}
        let x=parseInt(numberDiv.id.split("_")[1]),
            y=parseInt(numberDiv.id.split("_")[2])
        numberDiv.innerText.split(",").forEach(n=>{
            n=parseInt(n)-1
            //check down; if tue then up:
            if(document.querySelector(`#innerCrossword #grid_${x}_${y+1}.filled`)){
                //if up then go right
                if(document.querySelector(`#innerCrossword #grid_${x}_${y-1}.filled`)){
                    map[n]=getFields(x,y,1,0)
                //if not up check right and make sure there's nothing to the left
                }else if(!wasRightAlready && document.querySelector(`#innerCrossword #grid_${x+1}_${y}.filled`) && !document.querySelector(`#innerCrossword #grid_${x-1}_${y}.filled`)){
                    wasRightAlready=true
                    map[n]=getFields(x,y,1,0)
                }else{
                    map[n]=getFields(x,y,0,1)
                }
            }else if(document.querySelector(`#innerCrossword #grid_${x+1}_${y}.filled`)){
                map[n]= getFields(x,y,1,0)
            }
            //we have no idea which number corresponds to vertical/horizontal fields so we're gonna have to swap them out if the number of letters is different from the number of fields
            //its far from a perfect solution but it works i guess? Unless ofc both words have the same length
            if(swap){
                let temp=map[prevNumber]
                map[prevNumber]=map[n]
                map[n]=temp
            }else if(a[n].length!=map[n].length){
                swap=true
                prevNumber=n
            }
        })
    })
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

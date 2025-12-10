let a,map;
async function crosswordSolver(){
    console.log(map)
    map=mapOutCrossword()
    a.forEach((word,wordIndex)=>{
        word.split("").forEach((letter,letterIndex)=>{
            map[wordIndex][letterIndex].innerText=letter
        })
    })
}
async function prepCrossword(){
    console.log("prep crossword")
    let scripts = document.querySelectorAll("script");
    for(const script of scripts){
        if(script.src.includes("jsonp")){
            let data = await getInitpar(script.src);
            data = data.toUpperCase();
            a=[...data.matchAll(/WORD\d+=TEXT%7C(.*?)&/g)].map(x=>x[1].replace(/%20/,""));
            map=mapOutCrossword()
        }
    }
}
function crosswordHelper(){
    idx=parseInt(document.querySelector("#questionDisplay").querySelector("div").id.replace("item",""))-1
    console.log(map)
    document.querySelector("#"+map[idx][0].id).innerText="A"
}
async function getInitpar(url){
    const res = await fetch(url);
    let text = await res.text()
    text = text
        .replace(/^var\s+AppClientAppData\s*=\s*/, "")
        .replace(/;\s*$/, "");
    const json = JSON.parse(text);

    return json.initparameters
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

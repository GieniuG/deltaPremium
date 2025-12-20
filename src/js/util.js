/**
    * Get the "initparameter" field from **jsonp**
    * this field contains the data needed to solve the quiz
    * - exmple use in *crosswordFunctions.js*
    *
    * @param url - string taken from the "src" attribute of the script tag
*/
async function getInitpar(url) {
    const res = await fetch(url);
    let text = await res.text()
    text = text
        .replace(/^var\s+AppClientAppData\s*=\s*/, "")
        .replace(/;\s*$/, "");
    const json = JSON.parse(text);

    return json.initparameters
}

/**
    * Get the url of the **jsonp** script
    * this script contains the data needed to solve the quiz
    * - exmple use in *crosswordFunctions.js*
    *
    * @returns url - string taken from the "src" attribute of the script tag
*/
function getJsonpUrl(){
    let scripts = document.querySelectorAll("script");
    for(const script of scripts){
        if(script.src.includes("jsonp")){
            return script.src
        }
    }
}

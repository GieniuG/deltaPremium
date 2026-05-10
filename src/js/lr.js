console.log("learningapps");
const api = typeof browser !== "undefined" ? browser : chrome;

let HELP = false;
let SOLVE = false;
let MODE = "default";
async function applySettings() {
    HELP = await getSetting("helper");
    SOLVE = await getSetting("autoSolve");
    MODE = await getSetting("mode");
}

let showHelp = false;
let currInput = undefined;
let currWordle = undefined;

let prepareLock = false;


chrome.runtime.onMessage.addListener((r)=>{
    applySettings().then(()=>{
        if(!HELP){
            document.querySelector(".help").style.display="none"
        }else{
            document.querySelector(".help").style.display=""
        }
        if(!SOLVE){
            document.querySelector(".solve").style.display="none"
        }else{
            document.querySelector(".solve").style.display=""
        }
    })
})




async function main() {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("deltaPremium-button-container");
    //prepare:
    //quiz is prepared lower
    if (document.querySelector("#crossword")) {
        await prepCrossword();
    }
    if(document.querySelector("#keyboard")){
        useKeyboard() //use your real keyboard instead of the screen one
    }
    //-------------------------------------------------------------SOLVE
    if (SOLVE) {
        let unknownGame=false;
        let solveButton = document.createElement("button");
        solveButton.innerText = "SOLVE";
        solveButton.classList.add("deltaPremium-button","solve");


        //----------------------------------------------------------BUTTON
        solveButton.addEventListener("click", () => {
            if (document.querySelector("#cards")) {
                if(document.querySelector(".card textarea")){
                    oppositesSolver();
                }else{
                    cardSolver();
                }
            } else if (document.querySelector("#content")) {
                if(document.querySelector(".dropdown")){
                    dropdownSolver();
                }else if(document.querySelector("#keyboard")){
                    hangmanSolver();
                }
                else{
                    console.log("quiz")
                    quizSolver();
                }
            } else if (document.querySelector("#crossword")) {
                crosswordSolver();
            }else if(document.querySelector("#boxcard")){
                memorySolver()
            } else{
                console.log("Unknown game")
                unknownGame=true
            }
        });
        if(!unknownGame){
            buttonContainer.append(solveButton);
        }
    }
    //-------------------------------------------------------------HELP
    if (HELP) {
        let unknownGame=false
        let helpButton = document.createElement("button");
        helpButton.innerText = "HELP";
        helpButton.classList.add("deltaPremium-button","help");
        if (document.querySelector("#content")) {
            //quiz only needs to be prepared for help
                if (MODE == "default") {
                    prepareQuiz();
                } else if (MODE == "wordle") {
                    buttonContainer.style.display = "none";
                    prepareQuizWordle();
                }
        }
        //----------------------------------------------------------BUTTON
        helpButton.addEventListener("click", () => {
            if (document.querySelector("#cards")) {
                if(document.querySelector(".card textarea")){
                    alert("Pomoc nie jest dostepna w tym trybie (na razie)")
                }else{
                    showHelp = true;
                    cardHelper();
                }
            } else if (document.querySelector("#content")) {
                if(document.querySelector(".dropdown")){
                    alert("Pomoc nie jest dostepna w tym trybie (i nie będzie)")
                }else if(document.querySelector("#keyboard")){
                    hangmanHelper();
                }else{
                    quizHelper();
                }
            } else if (document.querySelector("#crossword")) {
                crosswordHelper();
            }else if(document.querySelector("#boxcard")){
                alert("Pomoc nie jest tu dostępna bo common, zrobisz to chyba cnie? Wystarczy klikać")
            }else{
                console.log("Unknown game")
                unknownGame=true
            }
        });
        if(!unknownGame){
            buttonContainer.append(helpButton);
        }
    }





    if (!document.querySelector("iframe")) {
        document.querySelector("body").prepend(buttonContainer);
    }
}

applySettings().then(() => main());

console.log("learningapps");
const api = typeof browser !== "undefined" ? browser : chrome;

async function getSetting(key) {
    try {
        const response = await api.runtime.sendMessage({
            action: "getSetting",
            key: key,
        });
        if (response.success) {
            return response.value;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
}
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

async function main() {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("deltaPremium-button-container");
    //prepare:
    //quiz is prepared lower
    if (document.querySelector("#crossword")) {
        await prepCrossword();
    }
    if (SOLVE) {
        let solveButton = document.createElement("button");
        solveButton.innerText = "SOLVE";
        solveButton.classList.add("deltaPremium-button");
        solveButton.addEventListener("click", () => {
            if (document.querySelector("#cards")) {
                if(document.querySelector(".card textarea")){
                    oppositesSolver();
                }else{
                    cardSolver();
                }
            } else if (document.querySelector("#content")) {
                quizSolver();
            } else if (document.querySelector("#crossword")) {
                crosswordSolver();
            }
        });
        buttonContainer.append(solveButton);
    }
    if (HELP) {
        let helpButton = document.createElement("button");
        helpButton.innerText = "HELP";
        helpButton.classList.add("deltaPremium-button");
        if (document.querySelector("#content")) {
            //quiz only needs to be prepared for help
            if (MODE == "default") {
                prepareQuiz();
            } else if (MODE == "wordle") {
                buttonContainer.style.display = "none";
                prepareQuizWordle();
            }
        }
        helpButton.addEventListener("click", () => {
            if (document.querySelector("#cards")) {
                if(document.querySelector(".card textarea")){
                    alert("Pomoc nie jest dostepna w tym trybie (na razie)")
                }else{
                    showHelp = true;
                    cardHelper();
                }
            } else if (document.querySelector("#content")) {
                quizHelper();
            } else if (document.querySelector("#crossword")) {
                crosswordHelper();
            }
        });
        buttonContainer.append(helpButton);
    }
    if (!document.querySelector("iframe")) {
        document.querySelector("body").prepend(buttonContainer);
    }
}

applySettings().then(() => main());

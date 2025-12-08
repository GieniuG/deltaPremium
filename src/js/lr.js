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
  if (SOLVE) {
    let solveButton = document.createElement("button");
    solveButton.innerText = "SOLVE";
    solveButton.classList.add("deltaPremium-button");
    solveButton.addEventListener("click", () => {
      if (document.querySelector("#cards")) {
        cardSolver();
      } else {
        quizSolver();
      }
    });
    buttonContainer.append(solveButton);
  }
  if (HELP) {
    let helpButton = document.createElement("button");
    helpButton.innerText = "HELP";
    helpButton.classList.add("deltaPremium-button");
    if (!document.querySelector("#cards") && MODE == "default") {
        //console.log("get jsonp url")
        //let scripts = document.querySelectorAll("script");
        //for(const script of scripts){
        //    if(script.src.includes("jsonp")){
        //        const data = await getJsonp(script.src);
        //        let solutionTerm = data.replace(/ /g,"").toUpperCase();
        //        console.log(solutionTerm)
        //        let a=[...solutionTerm.matchAll(/WORD\d+=TEXT%7C(.*?)&/g)].map(x=>x[1].replace(/%20/,""));
        //        let map=mapOutCrossword()
        //        a.forEach((word,wordIndex)=>{
        //            word.split("").forEach((letter,letterIndex)=>{
        //                map[wordIndex][letterIndex].innerText=letter
        //            })

        //        })
        //    }
        //}
      prepareQuiz();
    }
    helpButton.addEventListener("click", () => {
      if (document.querySelector("#cards")) {
        showHelp = true;
        cardHelper();
      } else {
        quizHelper();
      }
    });
    buttonContainer.append(helpButton);
    if (MODE == "wordle" && document.querySelector("#checksolutionBtnPanel")) {
      buttonContainer.style.display = "none";
      if (!document.querySelector("#cards")) {
        prepareQuizWordle();
      }
    }
  }
  if (!document.querySelector("iframe")) {
    document.querySelector("body").prepend(buttonContainer);
  }
}

applySettings().then(() => main());

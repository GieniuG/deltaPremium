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

function quizSolver() {
  document.querySelectorAll("input").forEach((input) => {
    input.value = input.nextElementSibling.getAttribute("data-content");
  });
}
async function cardSolver() {
  console.log("cards");
  let cards = document.querySelectorAll("#cards .card");
  for (let i = 0; i < cards.length; i += 2) {
    cards[i].style.left = cards[i + 1].style.left;
    cards[i].style.top = cards[i + 1].style.top;
    cards[i].dispatchEvent(new Event("mousedown", { bubbles: true }));
    let cX = cards[i].getBoundingClientRect().left;
    let cY = cards[i].getBoundingClientRect().top;
    document.querySelector("#cards").dispatchEvent(
      new MouseEvent("mousemove", {
        bubbles: true,
        clientX: cX + 10,
        clientY: cY,
      }),
    );
    await wait(cards[i + 1]);
    cards[i].dispatchEvent(new Event("mouseup", { bubbles: true }));
  }
  console.log("cards done");
}
async function wait(element) {
  return new Promise((resolve) => {
    let observer = new MutationObserver(() => {
      resolve();
      observer.disconnect();
    });
    observer.observe(element, { attributes: true });
  });
}
function clearCards() {
  document
    .querySelectorAll(".selected")
    .forEach((n) => n.classList.remove("selected"));
  document
    .querySelectorAll(".possible")
    .forEach((n) => n.classList.remove("possible"));
}
function cardHelper() {
  console.log("HELPER ENABLED");
  if (!prepareLock) {
    document.querySelectorAll("#cards .card").forEach((card, index) => {
      card.addEventListener("click", () => {
        if (!showHelp) return;
        clearCards();
        let cards = document.querySelectorAll("#cards .card");
        card.classList.add("selected");
        cards[index + 1 - 2 * (index % 2)].classList.add("possible");

        let cardsLeft = document.querySelectorAll(".card:not(.correct)");
        for (let i = 0; i < cardsLeft.length / 2; i++) {
          let idx =
            2 * Math.floor(Math.random() * Math.floor(cardsLeft.length / 2)) +
            !(index % 2);
          cardsLeft[idx].classList.add("possible");
        }
        showHelp = false;
      });
    });
    prepareLock = true;
  }
  let observer = new MutationObserver((mutation) => {
    if (mutation[0].target.classList.contains("correct")) {
      clearCards();
    }
  });
  observer.observe(document.querySelector("#cards"), {
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
  });
}

function quizHelper() {
  if (currInput) {
    let answer = currInput.nextElementSibling.getAttribute("data-content");
    let hintElement = currInput.nextElementSibling.nextElementSibling;
    let revealed = parseInt(hintElement.getAttribute("data-letters"));
    if (!revealed) {
      revealed = 0;
    }
    if (answer[revealed] == " ") {
      revealed++;
    }
    hintElement.setAttribute("data-letters", revealed + 1);
    let hintText = "";
    for (let i = 0; i < answer.length; i++) {
      if (i <= revealed) {
        hintText += answer[i];
      } else if (answer[i] == " ") {
        hintText += " ";
      } else {
        hintText += "_";
      }
    }
    hintElement.innerText = hintText;
  }
}
function prepareQuiz() {
  let observer = new MutationObserver((mutations) => {
    if (mutations[0].target.firstElementChild) {
      observer.disconnect();
      document.querySelectorAll("input").forEach((input) => {
        let hintContainer = document.createElement("div");
        hintContainer.classList.add("hint");
        input.nextElementSibling.after(hintContainer);
        input.addEventListener("click", () => {
          currInput = input;
        });
      });
    }
  });
  observer.observe(document.querySelector("#content"), {
    subtree: true,
    childList: true,
  });
}
function prepareQuizWordle() {
  window.addEventListener("keydown", (event) => {
    if (currWordle) {
      //check if key is a letter/number
      let len = parseInt(currWordle.getAttribute("data-letters"));
      let input = currWordle.previousElementSibling.previousElementSibling;
      let boxes = currWordle.querySelectorAll(".wordle-box");
      if (event.key.length == 1) {
        if (len == boxes.length) {
          return;
        }
        if (!len) {
          len = 0;
        }
        if (len >= boxes.length) {
          return;
        }
        if (boxes[len].classList.contains("wordle-space")) {
          len++;
          input.value += " ";
        }
        boxes[len].innerText = event.key.toUpperCase();
        input.value += event.key.toUpperCase();
        len++;
        currWordle.setAttribute("data-letters", len);
      } else if (event.key == "Backspace") {
        len--;
        if (len >= 0) {
          let inputValueArray = input.value.split("");
          if (boxes[len].classList.contains("wordle-space")) {
            inputValueArray.pop();
            len--;
          }
          inputValueArray.pop();
          input.value = inputValueArray.join("");
          boxes[len].innerText = "";
          currWordle.setAttribute("data-letters", len);
        }
      }else if(event.key == "Enter") {
          let containers =document.querySelectorAll(".wordle-input-container")
            for(let i=0;i<containers.length;i++){
              if(containers[i].id=="currentWordle"){
                  currWordle.id = "";
                  containers[i+1].id = "currentWordle";
                  currWordle=containers[i+1];
                  break;
              }
            }
      }
    }
  });

  let observer = new MutationObserver((mutations) => {
    if (mutations[0].target.firstElementChild.children) {
      observer.disconnect();
      document.querySelectorAll("input").forEach((input) => {
        let wordleInputContainer = document.createElement("div");
        wordleInputContainer.classList.add("wordle-input-container");
        input.nextElementSibling.after(wordleInputContainer);
        input.style.display = "none";
        let answer = input.nextElementSibling
          .getAttribute("data-content")
          .toUpperCase();
        answer.split("").forEach((letter) => {
          let box = document.createElement("span");
          box.classList.add("wordle-box");
          if (letter == " ") {
            box.classList.add("wordle-space");
          }
          wordleInputContainer.appendChild(box);
        });
        wordleInputContainer.addEventListener("click", (event) => {
          if (currWordle) currWordle.id = "";
          currWordle = wordleInputContainer;
          currWordle.id = "currentWordle";
        });
      });
    }
  });
  observer.observe(document.querySelector("#content"), {
    subtree: true,
    childList: true,
  });
  document
    .querySelector("#checksolutionBtnPanel")
    .addEventListener("click", () => {
      document.querySelectorAll("input").forEach((input, index) => {
        let wordleContainer = document.createElement("div");
        wordleContainer.classList.add("wordle-container");
        let usersAnswer = input.value.toUpperCase();
        let answer = input.nextElementSibling
          .getAttribute("data-content")
          .toUpperCase();
        let right = usersAnswer.length>0;
        usersAnswer.split("").forEach((letter, index) => {
          let box = document.createElement("div");
          box.classList.add("wordle-box");
          if (letter == answer[index]) {
            box.classList.add("wordle-right");
          } else if (answer.includes(letter)) {
            right = false;
            box.classList.add("wordle-exists");
          } else {
            right = false;
            box.classList.add("wordle-wrong");
          }
          box.innerText = letter;
          wordleContainer.appendChild(box);
          wordleContainer.setAttribute("data-right", right);
        });
        let inputContainer = document.querySelectorAll(
          ".wordle-input-container",
        )[index];
        if(!(inputContainer.nextElementSibling && inputContainer.nextElementSibling.getAttribute("data-right")=="true")){ 
            console.log("append")
            inputContainer.after(wordleContainer);
        }
      });
    });
}
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
async function getJsonp(url){
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
    let grids = crossword.querySelectorAll(".filled");
    let startFields = [...crossword.querySelectorAll("td:has(:last-child:nth-child(2))")];
    console.log("startFields 1:")
    console.log(startFields)
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

applySettings().then(() => main());

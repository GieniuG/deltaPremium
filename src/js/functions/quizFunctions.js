function quizSolver() {
    let i = 0;
    let nrOfAnswers = 0;
    document.querySelectorAll("input").forEach((input) => {
        let answer = input.nextElementSibling.getAttribute("data-content");
        if (answer.includes(";")) {
            nrOfAnswers = answer.split(";").length;
            answer = answer.split(";")[i];
            i++;
        }
        if (i >= nrOfAnswers) {
            i = 0;
            nrOfAnswers = 0;
        }
        input.value = answer;
    });
}

function quizHelper() {
    if (currInput) {
        let hintElement = currInput.nextElementSibling.nextElementSibling;
        let answer = hintElement.getAttribute("data-content");
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
    let i = 0;
    let nrOfAnswers = 0;
    let observer = new MutationObserver((mutations) => {
        if (mutations[0].target.firstElementChild) {
            observer.disconnect();
            document.querySelectorAll("input").forEach((input) => {
                let hintContainer = document.createElement("div");
                hintContainer.classList.add("hint");
                let answer = input.nextElementSibling.getAttribute("data-content");
                if (answer.includes(";")) {
                    nrOfAnswers = answer.split(";").length;
                    answer = answer.split(";")[i];
                    i++;
                }
                console.log(answer, i, nrOfAnswers);
                if (i >= nrOfAnswers) {
                    i = 0;
                    nrOfAnswers = 0;
                }
                hintContainer.setAttribute("data-content", answer);
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
            let len = parseInt(currWordle.getAttribute("data-letters"));
            let input = currWordle.previousElementSibling.previousElementSibling;
            let boxes = currWordle.querySelectorAll(".wordle-box");
            //check if key is a character
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
            } else if (event.key == "Enter") {
                let containers = document.querySelectorAll(".wordle-input-container");
                for (let i = 0; i < containers.length; i++) {
                    if (containers[i].id == "currentWordle") {
                        currWordle.id = "";
                        containers[i + 1].id = "currentWordle";
                        currWordle = containers[i + 1];
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
    //check if the user has solved the wordle
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
                let right = usersAnswer.length > 0;
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
                if (
                    !(
                        inputContainer.nextElementSibling &&
                        inputContainer.nextElementSibling.getAttribute("data-right") ==
                        "true"
                    )
                ) {
                    console.log("append");
                    inputContainer.after(wordleContainer);
                }
            });
        });
}

async function dropdownSolver() {
    let url = getJsonpUrl();
    let data = await getInitpar(url);
    data = data.toLowerCase().replace(/%20/g, "");
    let i = 0;
    let buttons = document.querySelectorAll(".btn");
    for (ans of data.matchAll(/cloze\d+=(.*?)&/g)) {
        let button = buttons[i++];
        button.dispatchEvent(
            new MouseEvent("click", { bubbles: true, button: 0 }),
        );
        button.nextElementSibling.querySelectorAll("li").forEach((li) => {
            let a = li.querySelector("a");
            if (
                a.getAttribute("data-value").toLowerCase() ==
                ans[1]
            ) {
                a.dispatchEvent(new MouseEvent("click", { bubbles: true, button: 0 }));
            }
        });
    }
}

console.log("learningapps");
const HELP = true;
let showHelp = false;
let lastInput = undefined;

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
    if (lastInput) {
        let answer =
            lastInput.nextElementSibling.getAttribute(
                "data-content",
            );
        console.log(answer);
        let hintElement = lastInput.nextElementSibling.nextElementSibling;
        let revealed = parseInt(hintElement.getAttribute("data-letters"));
        if (!revealed) {
            revealed = 0;
        }
        if(answer[revealed] == " "){
            revealed++;
        }
        hintElement.setAttribute("data-letters", revealed + 1);
        let hintText = "";
        for (let i = 0; i < answer.length; i++) {
            if (i <= revealed) {
                hintText += answer[i];
            }else if (answer[i] == " ") {
                hintText += " ";
            }else{
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
                let hintContainer = document.createElement("p");
                hintContainer.classList.add("hint");
                input.nextElementSibling.after(hintContainer);
                input.addEventListener("click", () => {
                    lastInput = input;
                });
            });
        }
    });
    observer.observe(document.querySelector("#content"), {
        subtree: true,
        childList: true,
    });
}
let button = document.createElement("button");
button.innerText = "SOLVE";
button.classList.add("deltaPremium-button");
button.addEventListener("click", () => {
    if (document.querySelector("#cards")) {
        if (HELP) {
            showHelp = true;
            cardHelper();
        } else {
            cardSolver();
        }
    } else {
        if (HELP) {
            quizHelper();
        } else {
            quizSolver();
        }
    }
});
let buttonContainer = document.createElement("div");
buttonContainer.append(button);
buttonContainer.classList.add("deltaPremium-button-container");

window.addEventListener("load", () => {
    if (!document.querySelector("iframe")) {
        document.querySelector("body").prepend(buttonContainer);
        if (!document.querySelector("#cards")) {
            prepareQuiz();
        }
    }
});

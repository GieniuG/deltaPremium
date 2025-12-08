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

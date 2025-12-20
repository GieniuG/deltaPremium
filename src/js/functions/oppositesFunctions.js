function oppositesSolver() {
    document.querySelectorAll("textarea").forEach(el=>el.value=el.nextElementSibling.getAttribute("data-content"))
}

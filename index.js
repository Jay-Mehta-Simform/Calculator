let buttonContainer = document.querySelector(".buttons");

let trigoElements = Array.from(document.getElementsByClassName("trigo"));

let screen = document.querySelector(".screen");

let buttonIds = Array.from(buttonContainer.children).map((item) => item.id);

let screenArr = [];

function display() {
	// screen.innerHTML += display
}

buttonContainer.addEventListener("click", (e) => {
	let pressed = e.target.id;
	handleClick(pressed);
});

function handleClick(keyPressed) {
	if (keyPressed === "second") {
		trigoElements.forEach((element) => element.classList.toggle("inverse"));
	}
	if (keyPressed === "clear") {
		screen.innerHTML = "";
	}
	if (keyPressed === "back") {
	}
}

const buttonContainer = document.querySelector(".buttons");

const trigoElements = Array.from(document.getElementsByClassName("trigo"));

const screen = document.querySelector(".screen");

let degree = document.querySelector("#degree");

// let buttonIds = Array.from(buttonContainer.children).map((item) => item.id);

const operators = ["+", "-", "*", "/", "%"];

const inputMap = new Map([
	["zero", 0],
	["one", 1],
	["two", 2],
	["three", 3],
	["four", 4],
	["five", 5],
	["six", 6],
	["seven", 7],
	["eight", 8],
	["nine", 9],
	["exponent", "e"],
	["sin", "sin("],
	["cos", "cos("],
	["tan", "tan("],
	["percent", "%"],
	["divide", "/"],
	["multiply", "*"],
	["subtract", "-"],
	["add", "+"],
	["power", "^"],
	["factorial", "!"],
	["logBase10", "log<sub>10</sub>("],
	["logBasee", "log<sub>e</sub>("],
	["leftBracket", "("],
	["rightBracket", ")"],
	["root", "&#8730;("],
	["divideBy", "<sup>-1</sup>"],
	["pi", "π"],
	["dot", "."],
]);

let screenArr = [];

function display() {
	screen.innerHTML = screenArr.toString().replaceAll(",", "");
	screen.scrollTop = screen.scrollHeight;
}

buttonContainer.addEventListener("click", (e) => {
	let pressed = e.target.id;
	handleClick(pressed);
});

function handleClick(keyPressed) {
	switch (keyPressed) {
		case "second":
			handleSecond();
			break;
		case "degree":
			handleDegree();
			break;
		case "clear":
			screen.innerHTML = "";
			screenArr = [];
			break;
		case "back":
			screenArr.pop();
			display();
			break;
		case inputMap.has(keyPressed) ? keyPressed : false:
			screenArr.push(inputMap.get(keyPressed));
			display();
			break;
		case "equals":
			evaluate();
			break;
		default:
			screenArr = [];
			screen.innerHTML = "Error";
	}
}

function handleSecond() {
	trigoElements.forEach((element) => {
		element.classList.toggle("inverse");
		if (element.classList.contains("inverse")) {
			element.innerHTML = `${element.id}<sup>-1</sup>`;

			inputMap.set(
				element.id,
				`${document.querySelector(`#${element.id}`).innerHTML}(`
			);
		} else {
			element.innerHTML = `${element.id}`;
			inputMap.set(
				element.id,
				`${document.querySelector(`#${element.id}`).innerHTML}(`
			);
		}
	});
}

function handleDegree() {
	degree.classList.toggle("rad");
	if (degree.classList.contains("rad")) {
		degree.innerHTML = "rad";
	} else {
		degree.innerHTML = "deg";
	}
}

function evaluate() {
	let ans = evaluateEvalString(toEvalString(screenArr.toString()));
	screenArr.splice(0, screenArr.length);
	// screenArr.push(ans);
	// display();
	screen.innerHTML = ans;
}

function* getCharFromArray() {
	while (screenArr.length) {
		yield screenArr.shift();
	}
}

function toEvalString(arrString) {
	console.debug("🚀 ~ toEvalString ~ arrString:", arrString);

	let evalString = arrString
		.replaceAll(",", "")
		.replaceAll("^", "**")
		.replaceAll("<sup>-1</sup>", "**-1")
		.replaceAll("sin", "Math.sin")
		.replaceAll("cos", "Math.cos")
		.replaceAll("tan", "Math.tan")
		.replaceAll("π", "Math.PI")
		.replaceAll("sin**-1", "asin")
		.replaceAll("cos**-1", "acos")
		.replaceAll("tan**-1", "atan")
		.replaceAll("log<sub>10</sub>", "Math.log10")
		.replaceAll("log<sub>e</sub>", "Math.log")
		.replaceAll("&#8730;", "Math.sqrt")
		.replaceAll("e", "Math.E");

	checkForFactorial(evalString);
	console.debug("🚀 ~ toEvalString ~ evalString:", evalString);
	return evalString;
}

function evaluateEvalString(evalString) {
	return eval(evalString);
}

function factorial(num) {
	if (num == 0) {
		return 1;
	}
	return num * factorial(num - 1);
}

function checkForFactorial(evalString) {
	if (evalString.indexOf("!") != -1) {
		let operand = "";
		let index = evalString.indexOf("!");
		if (evalString[index - 1] == ")") {
			console.log("Brackets");
		} else {
			let prevElemIndex = index - 1;
			while (
				!operators.includes(evalString[prevElemIndex]) &&
				prevElemIndex >= 0
			) {
				operand = evalString[prevElemIndex] + operand;
				evalString.splice(prevElemIndex + 1, 1);
				prevElemIndex--;
			}
			console.log(evalString);
			let ans = factorial(Number(operand));
		}
	}
}

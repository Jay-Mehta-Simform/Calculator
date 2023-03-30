const buttonContainer = document.querySelector(".buttons");

const trigoElements = Array.from(document.getElementsByClassName("trigo"));

let memoryElements = [
	'<button id="memorySave" class="btn lightFont memory">MS</button>',
	'<button id="memoryClear" class="btn lightFont memory">MC</button>',
	'<button id="memoryRecall" class="btn lightFont memory">MR</button>',
	'<button id="memoryAdd" class="btn lightFont memory">M+</button>',
	'<button id="memorySubtract" class="btn lightFont memory">M-</button>',
];

let nonMemoryElements = Array.from(
	document.getElementsByClassName("memoryNot")
);

let calcMemory = null;

const screen = document.querySelector(".screen");

const operators = ["+", "-", "*", "/", "%"];
const parser = new DOMParser();

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
	["logBaseE", "log<sub>e</sub>("],
	["leftBracket", "("],
	["rightBracket", ")"],
	["root", "&#8730;("],
	["divideBy", "<sup>-1</sup>"],
	["pi", "π"],
	["dot", "."],
]);

let screenArr = [];

buttonContainer.addEventListener("click", (e) => {
	let pressed = e.target.id;
	handleClick(pressed);
});

function handleClick(keyPressed) {
	switch (keyPressed) {
		case "second":
			handleSecond();
			break;
		case "memory":
			handleMemory();
			break;
		case "memorySave":
			saveMemory();
			break;
		case "memoryClear":
			calcMemory = null;
			break;
		case "memoryRecall":
			if (calcMemory) {
				console.log(calcMemory);
				screenArr.push(calcMemory);
				display();
			} else alert("Memory is empty!");
			break;
		case "memoryAdd":
			addMemory();
			break;
		case "memorySubtract":
			subtractMemory();
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

function evaluate() {
	const ans = toEvalString(screenArr.toString());
	displayAnswer(ans);
}

function* getCharFromArray() {
	while (screenArr.length) {
		yield screenArr.shift();
	}
}

function toEvalString(arrString) {
	console.debug("raw:", arrString);

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

	while (evalString.includes("!")) {
		evalString = checkForFactorial(evalString);
	}
	console.debug("formatted:", evalString);
	try {
		if (evalString) {
			return eval(evalString);
		} else {
			return "";
		}
	} catch (e) {
		return "Error";
	}
}

function factorial(num) {
	if (num == 0) {
		return 1;
	}
	return num * factorial(num - 1);
}

function checkForFactorial(evalString) {
	let index = evalString.indexOf("!");
	if (evalString[index - 1] == ")") {
		let rightBracketCount = 1;
		let indexLeftBracket = index - 2;
		while (rightBracketCount != 0) {
			if (evalString[indexLeftBracket] == "(") {
				rightBracketCount--;
			} else if (evalString[indexLeftBracket] == ")") {
				rightBracketCount++;
			}
			indexLeftBracket--;
		}
		indexLeftBracket++;
		let subString = evalString.substring(indexLeftBracket, index);
		let bracketAns = eval(subString);
		evalString = evalString.replaceAll(subString, bracketAns);
	} else {
		let operand = "";
		let prevElemIndex = index - 1;
		while (
			!operators.includes(evalString[prevElemIndex]) &&
			prevElemIndex >= 0
		) {
			operand = evalString[prevElemIndex] + operand;
			prevElemIndex--;
		}
		let ans = factorial(Number(operand));
		evalString = evalString.replaceAll(
			evalString.slice(prevElemIndex + 1, index + 1),
			ans
		);
	}
	return evalString;
}

function display() {
	screen.innerHTML = screenArr.toString().replaceAll(",", "");
	screen.scrollTop = screen.scrollHeight;
}

function displayAnswer(ans) {
	screenArr.splice(0, screenArr.length);
	screen.innerHTML += "<br>= " + ans;
}

function handleMemory() {
	if (document.getElementsByClassName("memoryNot").length != 0) {
		for (let i = 0; i < nonMemoryElements.length; i++) {
			nonMemoryElements[i].replaceWith(
				parser.parseFromString(memoryElements[i], "text/html").body.firstChild
			);
		}
	} else {
		let memoryElements = Array.from(document.getElementsByClassName("memory"));
		for (let i = 0; i < memoryElements.length; i++) {
			memoryElements[i].replaceWith(nonMemoryElements[i]);
		}
	}
}

function saveMemory() {
	try {
		calcMemory =
			Number(screen.innerText).toString() == "NaN"
				? null
				: Number(screen.innerText);
		console.log(calcMemory);
	} catch {
		screenArr.splice(0, screenArr.length);
		screen.innerHTML = "Error";
	}
}

function addMemory() {
	calcMemory +=
		Number(screen.innerText).toString() == "NaN" ? 0 : Number(screen.innerText);

	console.log(calcMemory);
}

function subtractMemory() {
	calcMemory -=
		Number(screen.innerText).toString() == "NaN" ? 0 : Number(screen.innerText);

	console.log(calcMemory);
}

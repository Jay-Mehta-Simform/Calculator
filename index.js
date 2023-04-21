(function () {
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
	const keypadMapping = new Map([
		["/", "divide"],
		["*", "multiply"],
		["-", "subtract"],
		["+", "add"],
		["^", "power"],
		["%", "percent"],
		["!", "factorial"],
		["(", "leftBracket"],
		[")", "rightBracket"],
		["Backspace", "back"],
		["Escape", "clear"],
		["Enter", "equals"],
		[".", "dot"],
		["e", "exponent"],
		["0", "zero"],
		["1", "one"],
		["2", "two"],
		["3", "three"],
		["4", "four"],
		["5", "five"],
		["6", "six"],
		["7", "seven"],
		["8", "eight"],
		["9", "nine"],
		["s", "sin"],
		["c", "cos"],
		["t", "tan"],
		["p", "pi"],
		["S", "second"],
		["m", "memory"],
		["r", "root"],
		["l", "logBase10"],
		["L", "logBaseE"],
		["d", "divideBy"],
	]);
	let screenArr = [];

	//Capture event through event delegation.
	buttonContainer.addEventListener("click", (e) => {
		handleInput(e.target.id);
	});

	//Capture keyboard events
	document.addEventListener("keydown", (e) => {
		if (keypadMapping.has(e.key)) handleInput(keypadMapping.get(e.key));
	});

	//Act based on which button is clicked.
	function handleInput(keyPressed) {
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
				if (calcMemory != null) {
					screenArr.push(calcMemory);
					display();
				} else notification("Memory is empty!");
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
			case "percent":
				handlePercent(screenArr);
				break;
			case inputMap.has(keyPressed) ? keyPressed : false:
				screenArr.push(inputMap.get(keyPressed));
				display();
				break;
			case "equals":
				evaluate();
				break;
			case "change":
				notification("Nothing Implemented here!");
				break;
			default:
				screenArr = [];
				screen.innerHTML = "Error";
		}
	}

	//Toggles between trigo and inverse trigo buttons
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

	//Evaluates the answer and displays it on the screen
	function evaluate() {
		const ans = toEvalString(screenArr.toString());
		if (ans != "") displayAnswer(ans);
	}

	// Prepare the string so that it can be evaluated by the eval function. Returns the result of evaluation of the passed string or error message.
	function toEvalString(arrString) {
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
		try {
			return evalString ? eval(evalString) : "";
		} catch {
			return "Error";
		}
	}

	//Recursive factorial of any number is returned
	function factorial(num) {
		if (num == 0) return 1;
		return num * factorial(num - 1);
	}

	// Receives a string and checks if there could be any factorials inside it. If there is, it would replace that with the result of that factorial.
	function checkForFactorial(evalString) {
		let index = evalString.indexOf("!");
		if (evalString[index - 1] == ")") {
			let rightBracketCount = 1,
				indexLeftBracket = index - 2;
			while (rightBracketCount != 0) {
				if (evalString[indexLeftBracket] == "(") rightBracketCount--;
				else if (evalString[indexLeftBracket] == ")") rightBracketCount++;
				indexLeftBracket--;
			}
			indexLeftBracket++;
			let subString = evalString.substring(indexLeftBracket, index);
			evalString = evalString.replaceAll(subString, eval(subString));
		} else {
			let operand = "",
				prevElemIndex = index - 1;
			while (
				!operators.includes(evalString[prevElemIndex]) &&
				prevElemIndex >= 0
			) {
				operand = evalString[prevElemIndex] + operand;
				prevElemIndex--;
			}
			evalString = evalString.replaceAll(
				evalString.slice(prevElemIndex + 1, index + 1),
				factorial(Number(operand))
			);
		}
		return evalString;
	}

	// If its an expression, it will evaluate the expression ahead and apply percentage on that. If there is only a single number, it will return the number divided by 100
	function handlePercent() {
		let totalPercent = "";
		if (
			screenArr.includes("+") ||
			screenArr.includes("-") ||
			screenArr.includes("*") ||
			screenArr.includes("/")
		) {
			while (!operators.includes(screenArr[screenArr.length - 1])) {
				totalPercent += screenArr.pop();
			}
			let operation = screenArr.pop();
			let ans = toEvalString(screenArr.toString());
			let percentAns = (ans * Number(totalPercent)) / 100;
			screenArr.push(operation);
			screenArr.push(percentAns);
			display();
		} else {
			displayAnswer(screen.innerHTML / 100);
		}
	}

	//Take elements from ScreenArr and puts them on the screen.
	function display() {
		screen.innerHTML = screenArr.toString().replaceAll(",", "");
		screen.scrollTop = screen.scrollHeight;
	}

	//Adds new line and attaches the parameter into the new line
	function displayAnswer(ans) {
		screenArr = [];
		screen.innerHTML += "<br>= " + ans;
	}

	//Toggle the memory buttons.
	function handleMemory() {
		if (document.getElementsByClassName("memoryNot").length != 0) {
			for (let i = nonMemoryElements.length - 1; i >= 0; i--) {
				nonMemoryElements[i].replaceWith(
					parser.parseFromString(memoryElements[i], "text/html").body.firstChild
				);
			}
		} else {
			let memoryElements = Array.from(
				document.getElementsByClassName("memory")
			);
			for (let i = memoryElements.length - 1; i >= 0; i--) {
				memoryElements[i].replaceWith(nonMemoryElements[i]);
			}
		}
	}

	//Store the number visible on the screen.
	function saveMemory() {
		let screenText = screen.innerText;
		if (screenText.includes("=")) {
			let number = screenText.slice(screenText.indexOf("=") + 2, screen.length);
			calcMemory = number.trim() === "Error" ? calcMemory : Number(number);
		} else {
			if (screenText != "") {
				try {
					calcMemory =
						Number(screenText).toString() == "NaN" ? null : Number(screenText);
				} catch {
					screenArr.splice(0, screenArr.length);
					screen.innerHTML = "Error";
				}
			} else {
				notification("Nothing to Save");
			}
		}
	}

	//Add to the stored number
	function addMemory() {
		calcMemory +=
			Number(screen.innerText).toString() == "NaN"
				? 0
				: Number(screen.innerText);
	}

	//Subtract from the stored number
	function subtractMemory() {
		calcMemory -=
			Number(screen.innerText).toString() == "NaN"
				? 0
				: Number(screen.innerText);
	}

	//Display notifications for warnings
	function notification(str) {
		if (Notification.permission != "granted") {
			Notification.requestPermission();
		}
		const notification = new Notification("Calculator Message :", {
			body: str,
			icon: "/Assets/calculator.svg",
		});
		setTimeout(() => notification.close(), 1500);
	}
})();

// After DOM content is loaded, defines characters, populates character navigation, sets Prophet as default, and ensures action log exists in local storage
document.addEventListener("DOMContentLoaded", function() {
	characters = [
		{
			name: "Casper",
			actions: [
				{name: "Prophet", preset: "ToHit: 1d20+10 || Physical: 1d8+8 || Psychic: 1d8"},
				{name: "Crossbow", preset: "ToHit: 1d20+8 || Physical: 1d6+4"},
				{name: "Unarmed", preset: "ToHit: 1d20+9 || Physical: 6"}
			]
		}, {
			name: "Parfait",
			actions: [
				{name: "Cloak Of Daggars", preset: "ToHit: 1d20+13 || Physical: 1d6+6d4+20"},
				{name: "Unarmed", preset: "ToHit: 1d20+13 || Physical: 1d4+10"}
			]
		}, {
			name: "Clover",
			actions: [
				{name: "Crossbow", preset: "ToHit: 1d20+3 || Physical: 1d6"},
				{name: "Hatchet", preset: "ToHit: 1d20+2 || Physical: 1d6"},
				// {name: "Decorative Dwarven Blade", preset: "ToHit: 1d20 || Physical: 1d6+"},
			]
		}, {
			name: "Stone Giant",
			actions: [
				{name: "Greatclub", preset: "ToHit: 1d20+9 || Bludgeoning: 3d8+6"},
				{name: "Rock", preset: "ToHit: 1d20+9 || Bludgeoning: 4d10+6"}
			]
		}
	];

	let urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("user") && urlParams.get("user") === "Alex") {
		characters.unshift(
			{
				name: "Alex's Secret Boss",
				actions: [
					{name:"Smite", preset: "Tohit: 20 || True Damage: 1200"}
				]
			}
		);
	}


	charactersCont = document.getElementById("charactersCont");
	characters.forEach(function(currentValue, index, array) {
		let buttonCont = document.createElement("li");
		let button = document.createElement("button");
		button.textContent = currentValue.name;
		button.onclick = function () {populateActions(currentValue.name);};
		buttonCont.appendChild(button);
		charactersCont.appendChild(buttonCont);
	});
	populateActions(characters[0].name);
	loadAction(characters[0].actions[0].name);

	if (!localStorage.getItem("actionLog")) {
		localStorage.setItem("actionLog", JSON.stringify([]));
	}
});

// Handles keyboard shortcuts
document.addEventListener("keydown", function(event) {
	// "Enter" = roll
	if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
		roll();
	}

	// "Alt+c" = clear action log
	if (event.key === "c" && !event.shiftKey && !event.ctrlKey && event.altKey) {
		clearActionLog();
	}

	// "Alt+x" to print the stored action log to the console
	if (event.key === "x" && !event.shiftKey && !event.ctrlKey && event.altKey) {
		console.log(JSON.parse(localStorage.getItem("actionLog")));
	}
});

// Populates actions bar
function populateActions(characterName) {
	actionsCont = document.getElementById("actionsCont");
	actionsCont.innerHTML = "";
	character = characters.filter(character => character.name == characterName)[0];
	actions = character.actions;
	actions.forEach(function(currentValue, index, array) {
		let button = document.createElement("button");
		button.textContent = currentValue.name;
		button.onclick = function () {loadAction(currentValue.name)};
		actionsCont.appendChild(button);
	});
}

// Fills input with actions
function loadAction(actionName) {
	inputReceiver = document.getElementById("input");
	action = actions.filter(action => action.name == actionName)[0];
	preset = "Name: " + action.name + " || " + action.preset;
	inputReceiver.value = preset;
}

// Handles rolling
function roll() {
	inputReceiver = document.getElementById("input");
	input = inputReceiver.value;
	parseInput(input);
	renderActionLog();
}

// Hadles clearing
function clearActionLog() {
	localStorage.clear();
	localStorage.setItem("actionLog", JSON.stringify([]));
	renderActionLog();
}

// Transforms user input from a string including rolls to a table row with calculated values
function parseInput(input) {
	effectsArray = input.split(/ \|\| |\: /);
	output = document.createElement("tr");
	output.addEventListener("click", removeRow);
	if (effectsArray.length > 200) {
		printMessage("Why do you need over a hundred effects?? Let me trim it down for ya.");
		effectsArray = effectsArray.slice(0, 6);
	};
	let action = {};
	while (effectsArray.length) {
		effectLabel = effectsArray.shift();
		effectRoll = effectsArray.shift();
		effectValue = effectLabel === "Name" ? effectRoll : evaluateRandoms(effectRoll.split("+"));
		isNaN(action[effectLabel]) ? action[effectLabel] = effectValue : action[effectLabel] += effectValue;
	}
	actionLog = JSON.parse(localStorage.getItem("actionLog"));
	actionLog.push(action);
	localStorage.setItem("actionLog", JSON.stringify(actionLog));
}

// Removes table rows from log
function removeRow (row) {
	actionLog = JSON.parse(localStorage.getItem("actionLog"));
	actionLog.splice(row, 1);
	localStorage.setItem("actionLog", JSON.stringify(actionLog));
	renderActionLog();
}

// Calculates individual rolls (1d20+6 => 26)
function evaluateRandoms(roll) {
	rollValue = 0;
	roll.forEach(function(currentValue, index, array) {
		if (currentValue.includes("d")) {
			dieQuantity = parseInt(currentValue.match(/^(\d+)d\d+$/)[1], 10);
			dieSides = parseInt(currentValue.match(/^\d+d(\d+)$/)[1], 10);
			if (dieQuantity > 10000000) {
				printMessage("Why do you need more than ten million dice in a single effect?? Let me trim that down to a mere ten thousand.");
				dieQuantity = 10000;
			}
			for (let i = 0; i < dieQuantity; i++) {
				rollValue += Math.floor(Math.random() * dieSides) + 1;
			}
		} else {
			rollValue += parseInt(currentValue);
		}
	});
	return(rollValue);
}

// Displays contents of the stored action log
function renderActionLog() {
	outputCont = document.getElementById("outputCont");
	outputCont.removeAttribute("hidden");
	outputDisplay = document.createElement("table");
	outputDisplay.setAttribute("id", "output");
	outputDisplay.setAttribute("class", "output");
	actionLog = JSON.parse(localStorage.getItem("actionLog"));
	if (actionLog.length === 0) {
		outputCont = document.getElementById ("outputCont");
		outputCont.setAttribute("hidden", "hidden");
	}

	// Adds header with all unique damage types
	let uniqueDamageTypes = new Set();
	actionLog.forEach(function(action) {
		Object.keys(action).forEach(function(damageType) {
			uniqueDamageTypes.add(damageType);
		});
	});
	tableHead = document.createElement("tr");
	uniqueDamageTypes.forEach(function(uniqueDamageType) {
		headCell = document.createElement("th");
		headCell.innerHTML = uniqueDamageType;
		tableHead.appendChild(headCell);
	});
	outputDisplay.appendChild(tableHead);

	// Adds rows, sorted according to the header
	actionLog.forEach((element, index) => {
		actionRow = document.createElement("tr");
		actionRow.addEventListener("click", function () {
			removeRow(index);
		});
		uniqueDamageTypes.forEach(function(uniqueDamageType) {
			tableCell = document.createElement("td");
			tableCell.innerHTML = element[uniqueDamageType] !== undefined ? element[uniqueDamageType] : "";
			actionRow.appendChild(tableCell);
		});
		outputDisplay.appendChild(actionRow);
	});
	outputCont.innerHTML = "";
	outputCont.appendChild(outputDisplay);
	
}

function printMessage(message) {
	messageRow = document.createElement("tr");
	messageRow.addEventListener("click", removeRow);
	messageCell = document.createElement("td");
	messageCell.setAttribute("colspan", 20);
	messageCell.innerHTML = message;
	messageRow.appendChild(messageCell);
	print(messageRow);
}

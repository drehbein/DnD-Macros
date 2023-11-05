// After DOM content is loaded, defines characters, populates character navigation, and sets Casper as default
document.addEventListener("DOMContentLoaded", function() {
	characters = [
		{
			name: "casper",
			actions: [
				{name: "prophet", preset: "ToHit: 1d20+10 || Physical: 1d8+8 || Psychic: 1d8"},
				{name: "crossbow", preset: "ToHit: 1d20+8 || Physical: 1d6+4"},
				{name: "unarmed", preset: "ToHit: 1d20+9 || Physical: 6"}
			]
		}, {
			name: "parfait",
			actions: [
				{name: "cloakOfDaggars", preset: "ToHit: 1d20+13 || Physical: 1d6+6d4+20"},
				{name: "unarmed", preset: "ToHit: 1d20+13 || Physical: 1d4+10"}
			]
		}
	]

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
});

// Rolls when enter key is pressed
document.addEventListener("keydown", function(event) {
	if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
		roll();
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
	preset = actions.filter(action => action.name == actionName)[0].preset;
	inputReceiver.value = preset;
}

// Handles rolling
function roll() {
	inputReceiver = document.getElementById("input");
	input = inputReceiver.value;
	output = parseInput(input);
	print(output);
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
	while (effectsArray.length) {
		let outputCell = document.createElement("td");
		effectLabel = effectsArray.shift();
		effectRoll = effectsArray.shift();
		effectValue = evaluateRandoms(effectRoll.split("+"));
		outputCell.innerHTML = effectLabel + ": " + effectValue;
		output.appendChild(outputCell);
	}
	return(output);
}

// Removes table rows from log
function removeRow (event) {
	let row = event.currentTarget;
	row.remove();
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

// Adds result to output log
function print(output) {
	outputDisplay = document.getElementById("output");
	outputDisplay.appendChild(output);
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

// After DOM content is loaded, defines characters, populates character navigation, and sets Casper as default
document.addEventListener("DOMContentLoaded", function() {
	characters = [
		{
			name: "casper",
			actions: [
				{name: "prophet", preset: "ToHit: 1d20+10 || Physical: 1d10+6 || Psychic: 1d8"},
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
	populateActions("casper");
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

// Handles rolling, referencing other functions for each step
function roll() {
	inputReceiver = document.getElementById("input");
	input = inputReceiver.value;
	output = parseInput(input);
	print(output);
}

// Transforms user input like "ToHit: +10 || Physical: 1d10+6 || Psychic: 1d8" into "ToHit: # || Physical: # || Psychic: #"
function parseInput(input) {
	effectsArray = input.split(/ \|\| |\: /);
	output = "";
	while (effectsArray.length) {
		effectLabel = effectsArray.shift();
		output += effectLabel + ": ";
		effectRoll = effectsArray.shift();
		effectValue = evaluateRandoms(effectRoll.split("+"));
		output += effectValue;
		if (effectsArray.length) {
			output += " || ";
		}
	}
	return(output);
}

// Calculates individual rolls (1d20+6 => 26)
function evaluateRandoms(roll) {
	rollValue = 0;
	roll.forEach(function(currentValue, index, array) {
		if (currentValue.includes("d")) {
			dieQuantity = parseInt(currentValue.match(/^(\d+)d\d+$/)[1], 10);
			dieSides = parseInt(currentValue.match(/^\d+d(\d+)$/)[1], 10);
			for (let i = 0; i < dieQuantity; i++) {
				rollValue += Math.floor(Math.random() * dieSides) + 1;
			}
		} else {
			rollValue += parseInt(currentValue);
		}
	});
	return(rollValue);
}

// Adds result to output/log (start as simply setting inner html, then change to adding to a cumulative log, then make log save to local storage)
function print(output) {
	outputDisplay = document.getElementById("output");
	let row = document.createElement("tr");
	row.innerHTML = output;
	outputDisplay.appendChild(row);
}

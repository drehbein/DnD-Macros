// After DOM content is loaded, defines characters, populates character navigation, sets Prophet as default, and ensures action log exists in local storage
document.addEventListener("DOMContentLoaded", function() {
	characters = [
		{
			name: "Casper",
			actions: [
				{name: "Prophet (A)", preset: "To-Hit: 1d20+11 || Physical: 1d8+8 || Psychic: 1d8", minCrit: "19"},
				{name: "Prophet (BA)", preset: "To-Hit: 1d20+11 || Physical: 1d2+8 || Psychic: 1d8", minCrit: "19"},
				{name: "Prophet (Repel)", preset: "Psychic: 1d8"},
				{name: "Green-Flame Blade", preset: "Fire: 2d8 || Fire (T2): 2d8+3"},
				{name: "Fire Bolt", preset: "To-Hit: 1d20+9 || Fire: 3d10"},
				{name: "Hellish Rebuke", preset: "DC: 17 || Fire: 2d10"},
				{name: "Burning Hands", preset: "DC: 17 || Fire: 3d6"}
			]
		}, {
			name: "Parfait",
			actions: [
				{name: "Dagger", preset: "To-Hit: 1d20+9 || Physical: 1d4+4"},
				{name: "Shortbow", preset: "To-Hit: 1d20+9 || Physical: 1d6+4"},
				{name: "Unarmed", preset: "To-Hit: 1d20+7 || Physical: 3"}
			]
		}, {
			name: "Clover",
			actions: [
				{name: "Crossbow", preset: "To-Hit: 1d20+3 || Physical: 1d6"},
				{name: "Hatchet", preset: "To-Hit: 1d20+2 || Physical: 1d6"},
			]
		}, {
			name: "Stone Giant",
			actions: [
				{name: "Greatclub", preset: "To-Hit: 1d20+9 || Bludgeoning: 3d8+6"},
				{name: "Rock", preset: "To-Hit: 1d20+9 || Bludgeoning: 4d10+6"}
			]
		}
	];

	let urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("user") && urlParams.get("user") === "Alex") {
		characters.unshift(
			{
				name: "Alex's Secret Boss",
				actions: [
					{name:"Smite", preset: "To-Hit: 20 || True Damage: 1200"}
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
	} else {
		renderActionLog();
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

// Fills input with action
function loadAction(actionName) {
	inputReceiver = document.getElementById("input");
	action = actions.filter(action => action.name == actionName)[0];
	preset = "Name: " + action.name + " || " + action.preset;
	if (action.minCrit) {
		preset = preset.concat(" || Min Crit: " + action.minCrit);
	}
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
	localStorage.setItem("actionLog", JSON.stringify([]));
	renderActionLog();
}

// Transforms user input from a string into an object
function parseInput(input) {
	effectsArray = input.split(/ \|\| |\: /);
	if (effectsArray.length > 200) {
		alert("Why do you need over a hundred effects?? Let me trim it down for ya.");
		effectsArray = effectsArray.slice(0, 6);
	};
	if (effectsArray.indexOf("Min Crit") !== -1 ) {
		var minCrit = effectsArray.splice(effectsArray.indexOf("Min Crit"), 2)[1] || 20;
		console.log(minCrit);
	}
	let action = {};
	while (effectsArray.length) {
		effectLabel = effectsArray.shift();
		effectRoll = effectsArray.shift();
		effectValue = /^[d+\d]+$/.test(effectRoll) ? evaluateRandoms(effectRoll.split("+")) : effectRoll;
		isNaN(action[effectLabel]) ? action[effectLabel] = effectValue : action[effectLabel] += effectValue;
		// Doubles all damage rolls on crits
		if (effectLabel === "To-Hit" && minCrit <= effectValue - /\+(\d+)/.exec(effectRoll)[1]) {
			effectsArray = doubleDamageDice(effectsArray);
			action["Crit"] = true;
		}
	}
	actionLog = JSON.parse(localStorage.getItem("actionLog"));
	actionLog.push(action);
	localStorage.setItem("actionLog", JSON.stringify(actionLog));
}

// Doubles damage dice for crits
function doubleDamageDice(effectArray) {
	// Condition for modification; matching a roll format like 4d5+3
	var shouldModify = function (inputString) {
		return inputString.includes("d");
	};

	// Modification logic
	var modifyItem = function (inputString) {
		var pattern = /(\d+)d(\d+)/g;

		function replaceCallback(match, number1, number2) {
			var newNumber1 = parseInt(number1) * 2;
			return newNumber1 + "d" + number2;
		}
		return inputString.replace(pattern, replaceCallback);
	};

	// Map for selective modification
	var modifiedArray = effectsArray.map(function (item) {
		if (shouldModify(item)) {
			return modifyItem(item);
		} else {
			return item;
		}
	});

	return modifiedArray;
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
				alert("Why do you need more than ten million dice in a single effect?? Let me trim that down to a mere ten thousand.");
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

	// Adds action rows, sorted according to the header
	actionLog.forEach((element, index) => {
		actionRow = document.createElement("tr");
		actionRow.addEventListener("click", function () {removeRow(index);});
		uniqueDamageTypes.forEach(function(uniqueDamageType) {
			tableCell = document.createElement("td");
			tableCell.innerHTML = element[uniqueDamageType] !== undefined ? element[uniqueDamageType] : "";
			actionRow.appendChild(tableCell);
		});
		outputDisplay.appendChild(actionRow);
	});

	// Adds total row at the bottom
	if (actionLog.length > 1) {
		totalRow = document.createElement("tr");
		totalRow.addEventListener("click", function () {removeRow(index);});
		uniqueDamageTypes.forEach(function(uniqueDamageType) {
			tableCell = document.createElement("td");
			switch (uniqueDamageType) {
				case "Name":
					tableCell.innerHTML = "Total";
					break;
				case "To-Hit":
					let minToHit = Infinity;
					actionLog.forEach((element) => {
						if (element["To-Hit"] < minToHit && element["To-Hit"]) {minToHit = element["To-Hit"];}
					});
					tableCell.innerHTML = minToHit;
					break;
				default:
					tableCell.innerHTML = 0;
					actionLog.forEach((element) => {
						valueToAdd = element[uniqueDamageType];
						if (typeof valueToAdd === "number") {
							tableCell.innerHTML = parseInt(tableCell.innerHTML) + valueToAdd;
						}
					});
			}
			totalRow.appendChild(tableCell);
		});
		outputDisplay.appendChild(totalRow);
	}

	outputCont.innerHTML = "";
	outputCont.appendChild(outputDisplay);
}

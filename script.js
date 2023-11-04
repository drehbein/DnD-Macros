// Function to handle rolling, referencing other functions for each step
function roll() {
	inputReceiver = document.getElementById("input")
	input = inputReceiver.value;
	output = parseInput(input);
	print(output);
}

// Function to transform user input like "ToHit: +10 || Physical: 1d10+6 || Psychic: 1d8" into "ToHit: # || Physical: # || Psychic: #"
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

// Function to print result to output/log (start as simply setting inner html, then change to adding to a cumulative log, then make log save to local storage)
function print(output) {
	outputDisplay = document.getElementById("output");
	let row = document.createElement("tr");
	row.innerHTML = output;
	outputDisplay.appendChild(row);
}

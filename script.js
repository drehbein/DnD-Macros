// Initializes character data and weapon selection
document.addEventListener("DOMContentLoaded", function() {
	// Weapon data
	weapons = [
		{
			name: "Prophet",
			description: "Badass talking halberd",
			uniqueOptions: [
				{name: "Knockback", checked: false, effect: ["Damage", ["Psychic", "1d8"]]}
			],
			toHit: 10,
			attack: ["Damage", ["Physical", "1d10+6"]],
			bonusAttack: ["Damage", ["Physical", "1d4+6"]],
			onHit: ["Damage", ["Psychic", "1d8"]]
		}, {
			name: "Unarmed strike",
			description: "Lame",
			uniqueOptions: [],
			toHit: 9,
			attack: ["Damage", ["Physical", "0d6+6"]]
		}
	];
	
	// Display weapon selection
	for (let i = 0; i < weapons.length; i++) {
		var choice = document.createElement("BUTTON");
		choice.innerHTML = weapons[i].name;
		choice.setAttribute("onclick", "chooseWeapon('"+weapons[i].name+"')");
		document.getElementById("weaponChoiceCont").appendChild(choice);
	}
});

// Selects appropriate weapon
function chooseWeapon(choice) {

	// Displays description
	weapon = weapons.find(x => x.name === choice);
	document.getElementById("descriptionCont").innerHTML = weapon.description;
	description = document.getElementById("description");
	description.removeAttribute("hidden");

	// Collects applicable options
	standardOptions = [
		{name: "Regular Action", checked: true, effect: ["Attacks", 3]},
		{name: "Action Surge", checked: false, effect: ["Attacks", 3]},
		{name: "Bonus Attack", checked: false, effect: ["Bonus Attacks", 1]},
		{name: "Opportunity Attack", checked: false, effect: ["Attacks", 1]}
	];
	options = standardOptions.concat(weapon.uniqueOptions);
	
	// Constructs options interface
	var optionsRow = document.createElement("TR");
	optionsRow.setAttribute("id", "optionsRow");
	var optionsTable = document.getElementById("optionsTable");
	optionsTable.innerHTML = "";
	optionsTable.appendChild(optionsRow);

	for (let i=0; i < options.length; i++) {
		let dataCell = document.createElement("TD");
		let input = document.createElement("INPUT");
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", "option" + (i+1));
		input.setAttribute("name", "attackOptions");
		input.setAttribute("value", options[i].name);
		dataCell.appendChild(input);
		input.checked = options[i].checked;
		let label = document.createElement("LABEL");
		label.setAttribute("for", "option" + (i + 1));
		label.innerHTML = " " + options[i].name;
		dataCell.appendChild(label);
		optionsRow.appendChild(dataCell);
	}
	optionsCont.removeAttribute("hidden");
}

// Rolls, tracking rolls, rerolls, and totals per ac
function roll() {
	console.log(weapon);
	console.log(options);

	// Collects chosen options' effects
	var selectedEffects = [];
	for (let i = 0; i < options.length; i++) {
		optionSelector = document.getElementById("option" + (i + 1));
		if (optionSelector.checked) {selectedEffects.push(options[i].effect);}
	}
	selectedEffects.sort();
	console.log(selectedEffects);
	
	// Narrates rolls
	var attacks = 0;
	var bonusAttacks = 0;
	var bonusDamage = [];
	for (let i = 0; i < selectedEffects.length; i++) {
		selectedEffect = selectedEffects[i];
		switch (selectedEffect[0]) {
			case "Attacks":
				attacks += selectedEffects[i][1];
				break;
			case "Bonus Attacks":
				bonusAttacks += selectedEffects[i][1];
				break;
			case "Damage":
				bonusDamage.push(selectedEffects[i]);
				break;
		}
	}

	hitCount = attacks + bonusAttacks;

	totalDamageEffects = [];
	for (let i = 0; i < attacks; i++) {
		totalDamageEffects.push(weapon.attack);
	}
	for (let i = 0; i < bonusAttacks; i++) {
		totalDamageEffects.push(weapon.bonusAttack);
	}
	for (let i = 0; i < hitCount; i++) {
		totalDamageEffects.push(weapon.onHit);
	}
	totalDamageEffects.push(bonusDamage);


	
	console.log(attacks);
	console.log(bonusAttacks);
	console.log(bonusDamage);
	console.log(hitCount);
	console.log(totalDamageEffects);

}

// Test
function test() {
	console.log(weapon);
}

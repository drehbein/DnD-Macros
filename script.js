// Initializes character data and weapon selection
document.addEventListener("DOMContentLoaded", function() {
	// Weapon data
	weapons = [
		{
			name: "Prophet",
			description: "Badass talking halberd",
			uniqueOptions: [
				{name: "Knockback", checked: false, effect: ["Psychic", "1d8"]}
			],
			toHit: "10",
			damage: "1d10+6"
		}, {
			name: "Unarmed strike",
			description: "Lame",
			uniqueOptions: [],
			toHit: "9",
			damage: "6"
		}
	];
	
	console.log(weapons);

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
	var weapon = weapons.find(x => x.name === choice);
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
		label.setAttribute("for", "option" + (i+1));
		label.innerHTML = " " + options[i].name;
		dataCell.appendChild(label);
		optionsRow.appendChild(dataCell);
	}
	console.log(optionsRow);
	optionsCont.removeAttribute("hidden");
}

// Test
function test() {
	console.log(weapon);
}

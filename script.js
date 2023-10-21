// Initializes character data and weapon selection
document.addEventListener("DOMContentLoaded", function() {
	// Weapon data
	weapons = [
		{
			name: "Prophet",
			description: "Badass talking halberd",
			toHit: "10",
			damage: "1d10+6"
		}, {
			name: "Unarmed strike",
			description: "Lame",
			toHit: "9",
			damage: "6"
		}
	]

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

	// Displays applicable options
}

// Test
function test() {
	console.log(weapon);
}

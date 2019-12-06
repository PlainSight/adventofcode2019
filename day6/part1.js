var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var direct = 0;
var indirect = 0;

var directOrbits = [];

for(var i = 0; i < input.length; i++) {
	var participants = input[i].split(')');
	var orbitee = participants[0];
	var orbiter = participants[1];

	directOrbits[orbiter] = orbitee;
	direct++;
}

for(var i = 0; i < input.length; i++) {
	var participants = input[i].split(')');
	var orbiter = participants[1];
	var orbitee = directOrbits[orbiter];

	while(directOrbits[orbitee]) {
		orbitee = directOrbits[orbitee];
		indirect++;
	}
}

console.log(direct+indirect);
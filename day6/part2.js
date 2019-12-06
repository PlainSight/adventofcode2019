var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var ancestorsOfYOU = [];

var directOrbits = [];

for(var i = 0; i < input.length; i++) {
	var participants = input[i].split(')');
	var orbitee = participants[0];
	var orbiter = participants[1];

	directOrbits[orbiter] = orbitee;
}

var start = directOrbits['YOU'];
var end = directOrbits['SAN'];

{
	var orbitee = start;

	while(directOrbits[orbitee]) {
		ancestorsOfYOU.push(orbitee);
		orbitee = directOrbits[orbitee];
	}
}

{
	var orbitee = end;

	var count = 0;
	while(directOrbits[orbitee]) {
		if (ancestorsOfYOU.includes(orbitee)) {
			console.log(ancestorsOfYOU.indexOf(orbitee) + count);
			return;
		}
		count++;
		orbitee = directOrbits[orbitee];
	}
}
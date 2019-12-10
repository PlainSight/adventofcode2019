var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var asteroids = [];

for(var row = 0; row < rawInput.length; row++) {
	for(var column = 0; column < rawInput[row].length; column++) {
		if(rawInput[row][column] == '#') {
			asteroids.push({y:row, x:column});
		}
	}
}

function isCollinear(a, b, c) {
	var brise = (b.y - a.y);
	var brun = (b.x - a.x);
	var baslope = 0;

	var crise = (c.y - a.y);
	var crun = (c.x - a.x);

	if ((crise < 0 && brise > 0) || (crise > 0 && brise < 0)) {
		return false;
	}

	if ((crun < 0 && brun > 0) || (crun > 0 && brun < 0)) {
		return false;
	}

	return (crun*brise == crise*brun);
}

var mostAsteroidsInVision = 0;
var best = 0;

for(var a = 0; a < asteroids.length; a++) {
	var asteroidsInVision = [];
inner:	for(var b = 0; b < asteroids.length; b++) {
		if (a != b) {
			for(var aiv = 0; aiv < asteroidsInVision.length; aiv++) {
				if (isCollinear(asteroids[a], asteroids[b], asteroidsInVision[aiv])) {
					continue inner;
				}
			}
			asteroidsInVision.push(asteroids[b]);
		}
	}

	if (asteroidsInVision.length > mostAsteroidsInVision) {
		mostAsteroidsInVision = asteroidsInVision.length;
		best = a;
	}
}

console.log(asteroids[best]);
console.log(mostAsteroidsInVision);

var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var asteroids = [];

for(var row = 0; row < rawInput.length; row++) {
	for(var column = 0; column < rawInput[row].length; column++) {
		if(rawInput[row][column] == '#') {
			asteroids.push({x:column, y:row});
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

function closer(a, b, c) {
	return (Math.hypot(b.x-a.x, b.y-a.y) < Math.hypot(c.x-a.x, c.y-a.y));
}

var destroyed = 0;
var lazerLocation = { x: 23, y: 19 };

var asteroidsInVision = [];
inner:	for(var b = 0; b < asteroids.length; b++) {
	if (lazerLocation.x != asteroids[b].x || lazerLocation.y != asteroids[b].y) {
		for(var aiv = 0; aiv < asteroidsInVision.length; aiv++) {
			if (isCollinear(lazerLocation, asteroids[b], asteroidsInVision[aiv])) {
				if (closer(lazerLocation, asteroids[b], asteroidsInVision[aiv])) {
					asteroidsInVision[aiv] = asteroids[b];
				}
				continue inner;
			}
		}
		asteroidsInVision.push(asteroids[b]);
	}
}

console.log(asteroidsInVision.length);

var sortedAsteroidsInVision = asteroidsInVision.sort(function(a, b) {
	var first = Math.atan2(a.y - lazerLocation.y, a.x - lazerLocation.x);
	var second = Math.atan2(b.y - lazerLocation.y, b.x - lazerLocation.x);
	a.angle = first;
	b.angle = second;
	a.dx = a.x - lazerLocation.x;
	a.dy = a.y - lazerLocation.y;
	b.dx = b.x - lazerLocation.x;
	b.dy = b.y - lazerLocation.y;
	if (first < second) {
		return -1;
	} else {
		return 1;
	}
});

var start = 0;
for(var v = 0; v < sortedAsteroidsInVision.length; v++) {
	if (sortedAsteroidsInVision[v].angle >= (-Math.PI/2)) {
		start = v;
		break;
	}
}

function visualise() {
	for(var row = 0; row < rawInput.length; row++) {
		var text = '';
		for(var column = 0; column < rawInput[row].length; column++) {
			if(rawInput[row][column] == '#') {
				if(lazerLocation.x == column && lazerLocation.y == row) {
					text += '!';
				} else {
					var iter = 0;
			inner:	for(var v = start; v < sortedAsteroidsInVision.length; v = (v + 1) %sortedAsteroidsInVision.length) {
						if(sortedAsteroidsInVision[v].x == column && sortedAsteroidsInVision[v].y == row) {
							text += (''+String.fromCharCode(65+(iter%26)));
							break inner;
						}
						if(iter > sortedAsteroidsInVision.length) {
							text += '#';
							break inner;
						}
						iter++;

					}
				}
			} else {
				text += ' ';
			}
		}
		console.log(text);
	}
}

visualise();

for(var v = start; v < sortedAsteroidsInVision.length; v = (v + 1) %sortedAsteroidsInVision.length) {
	sortedAsteroidsInVision[v].dead = true;
	destroyed++;
	if(destroyed == 200) {
		console.log(sortedAsteroidsInVision[v]);
		return;
	}
}
var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var moons = [];

for(var l = 0; l < rawInput.length; l++) {
	var coordinates = rawInput[l].replace(/[<>=xyz ]/g, '').split(',').map(x => parseInt(x));
	moons.push({ x: coordinates[0], y: coordinates[1], z: coordinates[2], dx: 0, dy: 0, dz: 0 })
}

function gravity1(a, b) {
	if (a == b) {
		return [0, 0];
	}
	if (a > b) {
		return [-1, 1];
	} else {
		return [1, -1];
	}
}

function gravity3(a, b) {
	var xChange = gravity1(a.x, b.x);
	var yChange = gravity1(a.y, b.y);
	var zChange = gravity1(a.z, b.z);
	return [xChange, yChange, zChange];
}

function step() {
	for(var m = 0; m < moons.length; m++) {
		for(var n = m+1; n < moons.length; n++) {
			var velocityChanges = gravity3(moons[m], moons[n]);
			moons[m].dx += velocityChanges[0][0];
			moons[m].dy += velocityChanges[1][0];
			moons[m].dz += velocityChanges[2][0];
			moons[n].dx += velocityChanges[0][1];
			moons[n].dy += velocityChanges[1][1];
			moons[n].dz += velocityChanges[2][1];
		}
	}

	for(var m = 0; m < moons.length; m++) {
		moons[m].x += moons[m].dx;
		moons[m].y += moons[m].dy;
		moons[m].z += moons[m].dz;
	}
}

var previousXs = {};
var previousYs = {};
var previousZs = {};

var xFound = 0;
var yFound = 0;
var zFound = 0;

function record(iter) {
	var xString = '';
	var yString = '';
	var zString = '';

	for(var m = 0; m < moons.length; m++) {
		xString += moons[m].x + ',' + moons[m].dx + ':';
		yString += moons[m].y + ',' + moons[m].dy + ':';
		zString += moons[m].z + ',' + moons[m].dz + ':';
	}

	if(previousXs[xString] && xFound == 0) {
		xFound = iter - previousXs[xString];
	} else {
		previousXs[xString] = iter;
	}
	if(previousYs[yString] && yFound == 0) {
		yFound = iter - previousYs[yString];
	} else {
		previousYs[yString] = iter;
	}
	if(previousZs[zString] && zFound == 0) {
		zFound = iter - previousZs[zString];
	} else {
		previousZs[zString] = iter;
	}
}

var iter = 0;
while(xFound == 0 || yFound  == 0 || zFound == 0) {
	record(iter);
	step();
	iter++;
}

console.log(xFound, yFound, zFound);

// find the 2 largest greatest common divisors between xFound, yFound, zFound, divide xFound*yFound*zFound by those 2 GCDS
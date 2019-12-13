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

for(var i = 0; i < 1000; i++) {
	step();
}

function potentialEnergy(m) {
	return Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z);
}

function kineticEnergy(m) {
	return Math.abs(m.dx) + Math.abs(m.dy) + Math.abs(m.dz);
}

function absoluteEnergy() {
	var sum = 0;
	for(var m = 0; m < moons.length; m++) {
		sum += potentialEnergy(moons[m])*kineticEnergy(moons[m]);
	}
	return sum;
}

console.log(absoluteEnergy());
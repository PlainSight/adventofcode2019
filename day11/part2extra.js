var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

function intComputer(rawInput) {
	var self = {};
	self.input = JSON.parse(JSON.stringify(rawInput));

	self.singleOutput = 0;
	self.inputBuffer = [];
	self.ip = 0;
	self.relativeBase = 0;

	self.readInput = function() {
		var i = self.inputBuffer.pop();
		return i;
	}

	self.writeOutput = function(value) {
		self.singleOutput = value;
	}

	self.add = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[self.decodePos(pos3, mp3)] = self.decodeValue(pos1, mp1) + self.decodeValue(pos2, mp2);
		return i + 4;
	}

	self.mul = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[self.decodePos(pos3, mp3)] = self.decodeValue(pos1, mp1) * self.decodeValue(pos2, mp2);
		return i + 4;
	}

	self.read = function(i, pos1, mp1) {
		self.input[self.decodePos(pos1, mp1)] = self.readInput();
		return i + 2;
	}

	self.write = function(i, pos1, mp1) {
		self.writeOutput(self.decodeValue(pos1, mp1));
		return i + 2;
	}

	self.jnz = function(i, pos1, mp1, pos2, mp2) {
		return self.decodeValue(pos1, mp1) != 0 ? self.decodeValue(pos2, mp2) : (i + 3);
	}

	self.jez = function(i, pos1, mp1, pos2, mp2) {
		return self.decodeValue(pos1, mp1) == 0 ? self.decodeValue(pos2, mp2) : (i + 3);
	}

	self.less = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[self.decodePos(pos3, mp3)] = self.decodeValue(pos1, mp1) < self.decodeValue(pos2, mp2) ? 1 : 0;
		return i + 4;
	}

	self.equal = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[self.decodePos(pos3, mp3)] = self.decodeValue(pos1, mp1) == self.decodeValue(pos2, mp2) ? 1 : 0;
		return i + 4;
	}

	self.rbo = function(i, pos1, mp1) {
		self.relativeBase += self.decodeValue(pos1, mp1);
		return i + 2;
	}

	self.functionMap = {
		1: self.add,
		2: self.mul,
		3: self.read,
		4: self.write,
		5: self.jnz,
		6: self.jez,
		7: self.less,
		8: self.equal,
		9: self.rbo
	};

	self.decodeOp = function(op) {
		var opAsString = op+'';

		var result = {
			mp1: 0,
			mp2: 0,
			mp3: 0
		};

		result.op = parseInt(opAsString.substring(opAsString.length - 2, opAsString.length));

		var j = 0;
		for(var i = opAsString.length - 3; i >= 0; i--) {
			j++;
			result['mp'+j] = parseInt(opAsString[i]);
		}

		return result;
	}

	self.decodePos = function(value, mode) {
		switch(mode) {
			case 0:
				return value;
			case 1:
				throw 'Cannot decode pos in immediate mode';
			case 2:
				return self.relativeBase + value;
		}
	}

	self.decodeValue = function(value, mode) {
		switch(mode) {
			case 0:
				return self.input[value];
			case 1:
				return value;
			case 2:
				return self.input[self.relativeBase + value];
		}
	}

	self.execute = function() {
		while(true) {
			var op = self.input[self.ip];
			var decodedOp = self.decodeOp(op);

			if (decodedOp.op == 99) {
				return 'HALT';
			}

			var params = [self.input[self.ip+1], decodedOp.mp1, self.input[self.ip+2], decodedOp.mp2, self.input[self.ip+3], decodedOp.mp3];
			self.ip = self.functionMap[decodedOp.op](self.ip, ... params);

			if (decodedOp.op == 4) {
				return 'YIELD';
			}
		}
	}

	self.readOutput = function() {
		return self.singleOutput;
	}

	self.writeInput = function(i) {
		self.inputBuffer.unshift(i);
	}

	return self;
}


var panels = { '0,0': 1 };

var comp = intComputer(rawInput);

var x = 0;
var y = 0;

var minx = Infinity;
var miny = Infinity;
var maxx = -Infinity;
var maxy = -Infinity;
var facings = [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 },  { dx: 0, dy: 1 }, { dx: -1, dy: 0 }];

var facing = 0;

var ps = [];

function visualise() {
	if (ps.length) {
		console.clear();
		var deserialised = JSON.parse(ps.shift());
		var output = '';
		for(var yy = 0; yy <= 5; yy++) {
			if (output.length) output += '\n';
			for(var xx = 0; xx <= 42; xx++) {
				if (deserialised.r.x == xx && deserialised.r.y == yy) {
					switch (deserialised.r.facing) {
						case 0:
							output += '^';
							break;
						case 1:
							output += '>';
							break;
						case 2:
							output += 'V';
							break;
						case 3:
							output += '<';
							break;
					}
				} else {
					output += (deserialised.p[xx+','+yy] || 0) == 1 ? '#' : ' ';
				}
			}
		}
		console.log(output);
	}
}

setInterval(function() { visualise() }, 160);

while(true) {
	comp.writeInput(panels[x+','+y] || 0);
	var reason = comp.execute();
	if (reason == 'YIELD') {
		var serialized = JSON.stringify({ p: panels, r: { facing: facing, x: x, y: y }});
		ps.push(serialized);
		var colorToPaint = comp.readOutput();
		panels[x+','+y] = colorToPaint;
		comp.execute();
		var turn = comp.readOutput();
		if (turn == 0) {
			facing = (facing + 3) % 4;
		} else {
			facing = (facing + 1) % 4;
		}
		x += facings[facing].dx;
		y += facings[facing].dy;
		if(x < minx) minx = x;
		if(y < miny) miny = y;
		if(x > maxx) maxx = x;
		if(y > maxy) maxy = y;
	} else {
		// for(var yy = miny; yy <= maxy; yy++) {
		// 	var output = '';
		// 	for(var xx = minx; xx <= maxx; xx++) {
		// 		output += (panels[xx+','+yy] || 0) == 1 ? '#' : ' ';
		// 	}
		// 	console.log(output);
		// }
		//console.log(ps.length);
		return;
	}
}



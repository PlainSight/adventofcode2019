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
		self.input[mp3 == 2 ? self.relativeBase + pos3 : pos3] = self.decodePos(pos1, mp1) + self.decodePos(pos2, mp2);
		return i + 4;
	}

	self.mul = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[mp3 == 2 ? self.relativeBase + pos3 : pos3] = self.decodePos(pos1, mp1) * self.decodePos(pos2, mp2);
		return i + 4;
	}

	self.read = function(i, pos1, mp1) {
		self.input[mp1 == 2 ? self.relativeBase + pos1 : pos1] = self.readInput();
		return i + 2;
	}

	self.write = function(i, pos1, mp1) {
		self.writeOutput(self.decodePos(pos1, mp1));
		return i + 2;
	}

	self.jnz = function(i, pos1, mp1, pos2, mp2) {
		return self.decodePos(pos1, mp1) != 0 ? self.decodePos(pos2, mp2) : (i + 3);
	}

	self.jez = function(i, pos1, mp1, pos2, mp2) {
		return self.decodePos(pos1, mp1) == 0 ? self.decodePos(pos2, mp2) : (i + 3);
	}

	self.less = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[mp3 == 2 ? self.relativeBase + pos3 : pos3] = self.decodePos(pos1, mp1) < self.decodePos(pos2, mp2) ? 1 : 0;
		return i + 4;
	}

	self.equal = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[mp3 == 2 ? self.relativeBase + pos3 : pos3] = self.decodePos(pos1, mp1) == self.decodePos(pos2, mp2) ? 1 : 0;
		return i + 4;
	}

	self.rbo = function(i, pos1, mp1) {
		self.relativeBase += self.decodePos(pos1, mp1);
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


var comp = intComputer(rawInput);
comp.writeInput(2);

while(true) {
	var reason = comp.execute();
	var newOutput = comp.readOutput();
	if (reason == 'YIELD') {
		console.log(newOutput);
	} else {
		return;
	}
}

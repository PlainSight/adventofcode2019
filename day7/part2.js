var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

function intComputer(rawInput) {
	var self = {};
	self.input = JSON.parse(JSON.stringify(rawInput));

	self.singleOutput = 0;
	self.inputBuffer = [];
	self.ip = 0;

	self.readInput = function() {
		var i = self.inputBuffer.pop();
		return i;
	}

	self.sendOutput = function(value) {
		self.singleOutput = value;
	}

	self.add = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[pos3] = (mp1 ? pos1 : self.input[pos1]) + (mp2 ? pos2 : self.input[pos2]);
		return i + 4;
	}

	self.mul = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[pos3] = (mp1 ? pos1 : self.input[pos1]) * (mp2 ? pos2 : self.input[pos2]);
		return i + 4;
	}

	self.read = function(i, pos1, mp1) {
		self.input[pos1] = self.readInput();
		return i + 2;
	}

	self.write = function(i, pos1, mp1) {
		self.sendOutput(mp1 ? pos1 : self.input[pos1]);
		return i + 2;
	}

	self.jnz = function(i, pos1, mp1, pos2, mp2) {
		return (mp1 ? pos1 : self.input[pos1]) != 0 ? (mp2 ? pos2 : self.input[pos2]) : (i + 3);
	}

	self.jez = function(i, pos1, mp1, pos2, mp2) {
		return (mp1 ? pos1 : self.input[pos1]) == 0 ? (mp2 ? pos2 : self.input[pos2]) : (i + 3);
	}

	self.less = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[pos3] = (mp1 ? pos1 : self.input[pos1]) < (mp2 ? pos2 : self.input[pos2]) ? 1 : 0;
		return i + 4;
	}

	self.equal = function(i, pos1, mp1, pos2, mp2, pos3, mp3) {
		self.input[pos3] = (mp1 ? pos1 : self.input[pos1]) == (mp2 ? pos2 : self.input[pos2]) ? 1 : 0;
		return i + 4;
	}

	self.functionMap = {
		1: self.add,
		2: self.mul,
		3: self.read,
		4: self.write,
		5: self.jnz,
		6: self.jez,
		7: self.less,
		8: self.equal
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

var phases = [5, 6, 7, 8, 9];

var phasePermutations = [];

function permute(picked, remaining) {
	if (remaining.length == 0) {
		phasePermutations.push(picked);
	}
	for(var i = 0; i < remaining.length; i++) {
		var newPicked = picked + remaining[i];
		var newRemaining = JSON.parse(JSON.stringify(remaining));
		newRemaining[i] = newRemaining[newRemaining.length-1];
		newRemaining.pop();
		permute(newPicked, newRemaining);
	}
}

permute('', phases);

var largestSingleOutput = 0;
var bestPhase = '';

for(var p = 0; p < phasePermutations.length; p++) {
	var lastOutput = 0;

	var amps = [intComputer(rawInput), intComputer(rawInput), intComputer(rawInput), intComputer(rawInput), intComputer(rawInput)]
	for(var i = 0; i < 5; i++) {
		amps[i].writeInput(parseInt(phasePermutations[p][i]));
	}

outer:	while(true) {
		for (var i = 0; i < 5; i++) {
			amps[i].writeInput(lastOutput);
			var reason = amps[i].execute();
			lastOutput = amps[i].readOutput();
			if (reason == 'HALT' && i == 4) {
				break outer;
			}
		}
	}

	if(lastOutput > largestSingleOutput) {
		largestSingleOutput = lastOutput;
		bestPhase = phasePermutations[p];
	}
}

console.log(largestSingleOutput);
console.log(bestPhase);

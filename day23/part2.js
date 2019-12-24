var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

function intComputer(rawInput) {
	var self = {};
	self.input = JSON.parse(JSON.stringify(rawInput));

	self.singleOutput = 0;
	self.inputBuffer = [];
	self.ip = 0;
	self.relativeBase = 0;
	self.tick = 0;
	self.staleRead = false;

	self.readInput = function() {
		var i = self.inputBuffer.pop();
		if (i != null) {
			return i;
		}
		self.staleRead = true;
		return -1;
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
				return self.input[value] || 0;
			case 1:
				return value;
			case 2:
				return self.input[self.relativeBase + value] || 0;
		}
	}

	self.execute = function() {
		self.staleRead = false;
		while(true) {
			self.tick++;
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

			if (self.staleRead) {
				return 'SHARE';
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

var computers = [];
var outbound = [];
var inbound = [];
var lastPauseReason = [];

for(var i = 0; i < 50; i++) {
	outbound.push([]);
	inbound.push([]);
	lastPauseReason.push('');

	var comp = intComputer(rawInput);
	computers.push(comp);

	comp.writeInput(i);
}

var natx = 0
var naty = 0;

var natyDelivered = -1;

while(true) {
	//console.log('loop', 'inbound', inbound, 'outbound', outbound);
	for(var i = 0; i < computers.length; i++) {
		while (inbound[i].length >= 2) {
			var part1 = inbound[i].shift();
			var part2 = inbound[i].shift();
			computers[i].writeInput(part1);
			computers[i].writeInput(part2);
		}

		var reason = computers[i].execute();

		lastPauseReason[i] = reason;

		if(reason == 'YIELD') {
			//console.log('yeilding');
			var output = computers[i].readOutput();
			//console.log('output', output);
			outbound[i].push(output)
		}
		if(reason == 'HALT') {
			//console.log('halting');
		}
		if(reason == 'SHARE') {
			//console.log('share');
		}

		if(outbound[i].length == 3) {
			if (outbound[i][0] == 255) {
				var natx = outbound[i][1];
				var naty = outbound[i][2];
				outbound[i] = [];
			} else {
				inbound[outbound[i][0]].push(outbound[i][1], outbound[i][2]);
				outbound[i] = [];
			}
		}
	}

	var emptyInbound = true;
	var emptyOutbound = true
	var lastPauseReasonShare = true;
	for(var i = 0; i < computers.length; i++) {
		if (inbound[i].length > 0) {
			emptyInbound = false;
		}
		if (outbound[i].length > 0) {
			emptyOutbound = false;
		}
		if (lastPauseReason[i] != 'SHARE') {
			lastPauseReasonShare = false;
		}
	}

	if (emptyInbound && emptyOutbound && lastPauseReasonShare) {
		if (natyDelivered == naty) {
			console.log(naty);
			return;
		}
		inbound[0].push(natx, naty);
		natyDelivered = naty;
	}
}

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


var comp = intComputer(rawInput);

var dx = [null, 0, 0, -1, 1];
var dy = [null, -1, 1, 0, 0];
var reverse = [null, 2, 1, 4, 3]
var x = 0;
var y = 0;

var open = {};

var map = { '0,0': 0 };

function cti(x, y) {
	return x+','+y;
}

function visualise(bm) {
	var m = bm.m;
	var minx = Infinity;
	var miny = Infinity;
	var maxx = -Infinity;
	var maxy = -Infinity;

	Object.keys(m).forEach(k => 
	{
		var xy = k.split(',').map(c => parseInt(c));
		if(xy[0] < minx) minx = xy[0];
		if(xy[1] < miny) miny = xy[1];
		if(xy[0] > maxx) maxx = xy[0];
		if(xy[1] > maxy) maxy = xy[1];
	});

	console.clear();
	var output = 'openset: ' + bm.l;
	for(var yy = miny; yy <= maxy; yy++) {
		if(output.length) {
			output += '\n';
		}
		for(var xx = minx; xx <= maxx; xx++) {
			switch(m[xx+','+yy]) {
				case -1: 
					output += '#';
					break;
				case 1: 
					output += '^';
					break;
				case 2: 
					output += 'v';
					break;
				case 3:
					output += '<';
					break;
				case 4:
					output += '>';
					break;
				default:
					output += ' ';
			}
		}
	}
	console.log(output);
}

function chooseDirection() {
	var result = 0;
	for(var i = 1; i <= 4; i++) {
		if(map[cti(x+dx[i], y+dy[i])] == null) {
			result = i;
			open[cti(x+dx[i], y+dy[i])] = true;
		}
	}
	if (result == 0) {
		return reverse[map[cti(x, y)]];
	}
	return result;
}


// if there are unexplored spaces, expore them
// if there are no unexplored spaces, backtrack

var mapQueue = [];

// var interval = setInterval(function () {
// 	if(mapQueue.length) {
// 		var m = mapQueue.shift();
// 		visualise(JSON.parse(m));
// 	} else {
// 		clearInterval(interval);
// 	}
// }, 16);

var found = false;
var target = { x: 0, y: 0 };

do {
	var direction = chooseDirection();
	comp.writeInput(direction);
	var reason = comp.execute();

	if (reason == 'YIELD') {
		var result = comp.readOutput();
		switch(result) {
			case 0:
				map[cti(x+dx[direction], y+dy[direction])] = -1;
				delete open[cti(x+dx[direction], y+dy[direction])];
				break;
			case 1:
				x += dx[direction];
				y += dy[direction];
				if(map[cti(x, y)] == null) {
					map[cti(x, y)] = direction;
					delete open[cti(x, y)];
				}
				break;
			case 2:
				found = true;
				x += dx[direction];
				y += dy[direction];
				target.x = x;
				target.y = y;
				if(map[cti(x, y)] == null) {
					map[cti(x, y)] = direction;
					delete open[cti(x, y)];
				}
				break;
		}
	} else {
		return;
	}
	//mapQueue.push(JSON.stringify({ m: map, l: Object.keys(open).length }));
} while(Object.keys(open).length || !found)

var stack = [];

stack.push({ x: 0, y: 0, d: 0});

var closed = [];

while(stack.length) {
	stack = stack.sort((a, b) =>  {
		if(a.d == b.d) {
			return 0;
		}
		return a.d > b.d ? 1 : -1;
	});
	var top = stack.pop();
	closed[cti(top.x, top.y)] = true;
	if (top.x == target.x && top.y == target.y) {
		console.log('distance: ' + top.d);
		return;
	}
	for(var i = 1; i <= 4; i++) {
		if(map[cti(top.x+dx[i], top.y+dy[i])] && map[cti(top.x+dx[i], top.y+dy[i])] != -1 && !closed[cti(top.x+dx[i], top.y+dy[i])]) {
			stack.push({ x: top.x+dx[i], y: top.y+dy[i], d: top.d+1 });
		}
	}
}
var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

var input = [];

var singleOutput;
var inputBuffer = [];

function readInput() {
	var i = inputBuffer.pop();
	return i;
}

function sendOutput(value) {
	singleOutput = value;
}

function add(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) + (mp2 ? pos2 : input[pos2]);
	return i + 4;
}

function mul(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) * (mp2 ? pos2 : input[pos2]);
	return i + 4;
}

function read(i, pos1, mp1) {
	input[pos1] = readInput();
	return i + 2;
}

function write(i, pos1, mp1) {
	sendOutput(mp1 ? pos1 : input[pos1]);
	return i + 2;
}

function jnz(i, pos1, mp1, pos2, mp2) {
	return (mp1 ? pos1 : input[pos1]) != 0 ? (mp2 ? pos2 : input[pos2]) : (i + 3);
}

function jez(i, pos1, mp1, pos2, mp2) {
	return (mp1 ? pos1 : input[pos1]) == 0 ? (mp2 ? pos2 : input[pos2]) : (i + 3);
}

function less(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) < (mp2 ? pos2 : input[pos2]) ? 1 : 0;
	return i + 4;
}

function equal(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) == (mp2 ? pos2 : input[pos2]) ? 1 : 0;
	return i + 4;
}

var functionMap = {
	1: add,
	2: mul,
	3: read,
	4: write,
	5: jnz,
	6: jez,
	7: less,
	8: equal
};

function decodeOp(op) {
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

function execute() {
	var i = 0;
	while(true) {
		var op = input[i];
		var decodedOp = decodeOp(op);

		if (decodedOp.op == 99) {
			return;
		}

		var params = [input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3];
		i = functionMap[decodedOp.op](i, ... params);
	}
}

var phases = [0, 1, 2, 3, 4];

var phasePermutations = [];

function permute(picked, remaining) {
	//console.log(picked, remaining);
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
	var singleOutput = 0;
	for (var i = 0; i < 5; i++) {
		inputBuffer = [singleOutput, parseInt(phasePermutations[p][i])]

		input = JSON.parse(JSON.stringify(rawInput));
		execute();
	}
	if(singleOutput > largestSingleOutput) {
		largestSingleOutput = singleOutput;
		bestPhase = phasePermutations[p];
	}
}

console.log(largestSingleOutput);
console.log(bestPhase);

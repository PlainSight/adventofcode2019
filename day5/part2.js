var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

var singleInput;
var singleOutput;

function readInput() {
	return 5;
}

function sendOutput(value) {
	console.log(value);
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

execute();
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


function opOne(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) + (mp2 ? pos2 : input[pos2]);
	return i + 4;
}

function opTwo(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) * (mp2 ? pos2 : input[pos2]);
	return i + 4;
}

function opThree(i, pos1, mp1) {
	input[pos1] = readInput();
	return i + 2;
}

function opFour(i, pos1, mp1) {
	sendOutput(mp1 ? pos1 : input[pos1]);
	return i + 2;
}

function opFive(i, pos1, mp1, pos2, mp2) {
	return (mp1 ? pos1 : input[pos1]) != 0 ? (mp2 ? pos2 : input[pos2]) : (i + 3);
}

function opSix(i, pos1, mp1, pos2, mp2) {
	return (mp1 ? pos1 : input[pos1]) == 0 ? (mp2 ? pos2 : input[pos2]) : (i + 3);
}

function opSeven(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) < (mp2 ? pos2 : input[pos2]) ? 1 : 0;
	return i + 4;
}

function opEight(i, pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) == (mp2 ? pos2 : input[pos2]) ? 1 : 0;
	return i + 4;
}

function decodeOp(op) {
	var result = {
		mp1: 0,
		mp2: 0,
		mp3: 0
	};

	result.op = parseInt(op.substring(op.length - 2, op.length));

	var j = 0;
	for(var i = op.length - 3; i >= 0; i--) {
		j++;
		result['mp'+j] = parseInt(op[i]);
	}

	return result;
}

function execute() {
	var i = 0;
outer:	while(true) {
		var op = input[i];
		var decodedOp = decodeOp(op+'');

		switch(decodedOp.op) {
			case 1:
				i = opOne(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				continue outer;
			case 2:
				i = opTwo(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				continue outer;
			case 3:
				i = opThree(i, input[i+1], decodedOp.mp1);
				continue outer;
			case 4:
				i = opFour(i, input[i+1], decodedOp.mp1);
				continue outer;
			case 5:
				i = opFive(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2);
				continue outer;
			case 6:
				i = opSix(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2);
				continue outer;
			case 7:
				i = opSeven(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				continue outer;
			case 8:
				i = opEight(i, input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				continue outer;
			case 99:
				return;
		}
	}
}

execute();
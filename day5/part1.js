var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

var singleInput;
var singleOutput;

function readInput() {
	return 1;
}

function sendOutput(value) {
	console.log(value);
}


function opOne(pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) + (mp2 ? pos2 : input[pos2]);
}

function opTwo(pos1, mp1, pos2, mp2, pos3, mp3) {
	input[pos3] = (mp1 ? pos1 : input[pos1]) * (mp2 ? pos2 : input[pos2]);
}

function opThree(pos1, mp1) {
	input[pos1] = readInput();
}

function opFour(pos1, mp1) {
	sendOutput(mp1 ? pos1 : input[pos1]);
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
				opOne(input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				i+=4;
				continue outer;
			case 2:
				opTwo(input[i+1], decodedOp.mp1, input[i+2], decodedOp.mp2, input[i+3], decodedOp.mp3);
				i+=4;
				continue outer;
			case 3:
				opThree(input[i+1], decodedOp.mp1);
				i+=2;
				continue outer;
			case 4:
				opFour(input[i+1], decodedOp.mp1);
				i+=2;
				continue outer;
			case 99:
				return;
		}
	}
}

execute();
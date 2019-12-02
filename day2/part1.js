var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

function opOne(pos1, pos2, pos3) {
	input[pos3] = input[pos1] + input[pos2];
}

function opTwo(pos1, pos2, pos3) {
	input[pos3] = input[pos1] * input[pos2];
}

function execute() {
	var i = 0;
outer:	while(true) {
		var op = input[i];
		switch(op) {
			case 1:
				opOne(input[i+1], input[i+2], input[i+3]);
				i+=4;
				continue outer;
			case 2:
				opTwo(input[i+1], input[i+2], input[i+3]);
				i+=4;
				continue outer;
			case 99:
				console.log(input[0]);
				return;
		}
	}
}

input[1] = 12;
input[2] = 2;

execute();
var fs = require('fs');

var rawinput = fs.readFileSync('./input.txt', 'utf8').split(',').map(num => parseInt(num));

var input = [];


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
				return;
		}
	}
}

for(var noun = 0; noun < 99; noun++) {
	for(var verb = 0; verb < 99; verb++) {
		input = JSON.parse(JSON.stringify(rawinput));
		input[1] = noun;
		input[2] = verb;

		execute();
		if(input[0] === 19690720) {
			console.log((100 * noun) + verb);
			return;
		}
	}
}



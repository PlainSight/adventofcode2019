var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var reactions = [];

for(var i = 0; i < rawInput.length; i++) {
	var parts = rawInput[i].split('=>');
	var inputs = parts[0];
	var output = parts[1];

	var reaction = {
		inputs: inputs.split(',').map(c => {
			var cc = c.trim().split(' ');
			return {
				amount: parseInt(cc[0]),
				chemical: cc[1]
			}
		}),
		output: output.split(',').map(c => {
			var cc = c.trim().split(' ');
			return {
				amount: parseInt(cc[0]),
				chemical: cc[1]
			}
		})[0]
	}

	reactions.push(reaction);
}

var stack = [];
var required = {
	'FUEL': 1
};

var fuelReaction = reactions.find(r => r.output.chemical == 'FUEL');

stack.push(fuelReaction);

while(stack.length > 0) {
	var requiree = stack.pop();

	if (required[requiree.output.chemical] <= 0) {
		continue;
	}

	var timesToRun = Math.ceil(required[requiree.output.chemical] / requiree.output.amount);

	required[requiree.output.chemical] -= (requiree.output.amount * timesToRun);

	for(var i = 0; i < timesToRun; i++) {
		for(var r = 0; r < requiree.inputs.length; r++) {
			var input = requiree.inputs[r];
			if(required[input.chemical]) {
				required[input.chemical] += input.amount;
			} else {
				required[input.chemical] = input.amount;
			}
		}
	}

	for(var r in required) {
		if(required[r] > 0) {
			if (r != 'ORE') {
				var creatorOfInput = reactions.find(c => c.output.chemical == r);
				stack.push(creatorOfInput);
			}
		}
	}
}

console.log(required['ORE']);
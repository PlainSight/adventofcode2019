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
	'FUEL': 1000
};

var fuelReaction = reactions.find(r => r.output.chemical == 'FUEL');

var loops = 0;

while(!required['ORE'] || required['ORE'] < 1000000000000) {
	stack.push(fuelReaction);

	if(loops == 6326) {
		loops *= 1000;
	}
	if (loops >= 6326) {
		required['FUEL'] = 1;
		console.log(loops, required['ORE']);
	} else {
		required['FUEL'] = 1000;
	}
	loops++;

	while(stack.length > 0) {
		var requiree = stack.pop();

		if (required[requiree.output.chemical] <= 0) {
			continue;
		}

		var timesToRun = Math.ceil(required[requiree.output.chemical] / requiree.output.amount);

		required[requiree.output.chemical] -= (requiree.output.amount * timesToRun);

		for(var r = 0; r < requiree.inputs.length; r++) {
			var input = requiree.inputs[r];
			if(required[input.chemical]) {
				required[input.chemical] += (input.amount*timesToRun);
			} else {
				required[input.chemical] = (input.amount*timesToRun);
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
}
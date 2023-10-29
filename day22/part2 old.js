var fs = require('fs');

var instructions = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var newInstructions = [];

for (var i = 0; i < instructions.length; i++) {
	var parts = instructions[i].split(' ');
	if (parts[0] == 'cut') {
		newInstructions.push({ type: 'cut', value: parseInt(parts[1]) });
	} else {
		if (parts[1] == 'into') {
			newInstructions.push({ type: 'deal' });
		} else {
			newInstructions.push({ type: 'increment', value: parseInt(parts[3]) });
		}
	}
}

instructions = newInstructions;

// we need to duplicate and clone the instructions 101741582076661 times
// we can do this by doubling and reducing over and over

var lastSize = instructions.length;

console.log(instructions, instructions.length);

do {
	lastSize = instructions.length;

	newInstructions = [instructions[0]];

	for (var i = 1; i < instructions.length; i++) {
		var one = newInstructions.pop();
		var two = instructions[i];

		switch (one.type+two.type) {
			case 'cutcut':
				newInstructions.push({ type: 'cut', value: one.value + two.value });
				break;
			case 'cutdeal':
				newInstructions.push({ type: 'deal' });
				newInstructions.push({ type: 'cut', value: -one.value });
				break;
			case 'dealcut':
				newInstructions.push({ type: 'cut', value: -two.value });
				newInstructions.push({ type: 'deal' });
				break;
			case 'dealdeal':
				break;
			case 'incrementincrement':
				newInstructions.push({ type: 'increment', value: one.value * two.value });
				break;
			case 'dealincrement':
			case 'incrementcut':
			case 'incrementdeal':
			case 'cutincrement':
			default:
				newInstructions.push(one);
				newInstructions.push(two);
				break;
		}
	}

	instructions = newInstructions;

} while(instructions.length < lastSize)

console.log(instructions, instructions.length);

var deckSize = 10007;

function dealIntoNewStack(ttp) {
	return (deckSize-1) - ttp;
}

function cut(ttp, number) {
	return ((ttp - number) + deckSize) % deckSize;
}

function dealWithIncrement(ttp, increment) {
	return (ttp*increment)%deckSize;
}

// 119315717514047 cards
// 101741582076661 times shuffled

var twentyTwentyPosition = 2019;

for (var j = 0; j < 1; j++) {
	for (var i = 0; i < instructions.length; i++) {
		var instruction = instructions[i];
		switch (instruction.type) {
			case 'cut':
				twentyTwentyPosition = cut(twentyTwentyPosition, parseInt(instruction.value));
				break;
			case 'deal':
				twentyTwentyPosition = dealIntoNewStack(twentyTwentyPosition);
				break;
			case 'increment':
				twentyTwentyPosition = dealWithIncrement(twentyTwentyPosition, parseInt(instruction.value));
				break;
		}
	}
	console.log(twentyTwentyPosition);
}

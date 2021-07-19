var fs = require('fs');

var instructions = fs.readFileSync('./input.txt', 'utf8').split('\n');

// we need to duplicate and clone the instructions 101741582076661 times
// we can do this by doubling and 






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
		var parts = instruction.split(' ');
		if (parts[0] == 'cut') {
			twentyTwentyPosition = cut(twentyTwentyPosition, parseInt(parts[1]));
		} else {
			if (parts[1] == 'into') {
				twentyTwentyPosition = dealIntoNewStack(twentyTwentyPosition);
			} else {
				twentyTwentyPosition = dealWithIncrement(twentyTwentyPosition, parseInt(parts[3]));
			}
		}
	}
	console.log(twentyTwentyPosition);
}

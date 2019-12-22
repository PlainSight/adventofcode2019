var fs = require('fs');

var instructions = fs.readFileSync('./input.txt', 'utf8').split('\n');

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

for (var i = 0; i < instructions.length; i++) {
	var instruction = instructions[i];
	var parts = instruction.split(' ');
	if (parts[0] == 'cut') {
		b += (deckSize - parseInt(parts[1]));
		//twentyTwentyPosition = cut(twentyTwentyPosition, parseInt(parts[1]));
	} else {
		if (parts[1] == 'into') {
			a *= -1;
			b += (deckSize - 1);
			//twentyTwentyPosition = dealIntoNewStack(twentyTwentyPosition);
		} else {
			a *= parseInt(parts[3]);
			a = a % deckSize;
			//twentyTwentyPosition = dealWithIncrement(twentyTwentyPosition, parseInt(parts[3]));
		}
	}
}

console.log(((a*twentyTwentyPosition) + b) % deckSize);

console.log(a, b);
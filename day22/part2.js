var fs = require('fs');

var instructions = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var cards = 119315717514047;
var shuffles = 101741582076661;

// var cards = 10007;
// var shuffles = 1;

var currentEq = null;

function parseLinearEquation(eq) {
	var parts = eq.split(' ');
	if (parts[0] == 'cut') {
		return {
			a: 1,
			b: cards - parseInt(parts[1])
		};
	} else {
		if (parts[1] == 'into') {
			return {
				a: -1,
				b: -1
			}
		} else {
			return {
				a: parseInt(parts[3]),
				b: 0
			}
		}
	}
}

function combineLinearEquations(eq1, eq2) {
	return {
		a: Number((BigInt(eq1.a) * BigInt(eq2.a)) % BigInt(cards)),
		b: Number(((BigInt(eq2.a) * BigInt(eq1.b)) + BigInt(eq2.b)) % BigInt(cards))
	};
}

function power(x, y, m)
{
    if (y == 0)
        return 1;
    let p = power(x, parseInt(y / 2), m) % m;
    p = Number((BigInt(p) * BigInt(p)) % BigInt(m));
 
    return (y % 2 == 0) ? p : Number((BigInt(x) * BigInt(p)) % BigInt(m));
}

function invertLinearEquation(eq1) {
	var ahat = power(eq1.a, cards-2, cards);

	// find bhat such that, ahat * b + bhat = 0

	var bhat = -Number((BigInt(eq1.b) * BigInt(ahat)) % BigInt(cards));

	return {
		a: ahat,
		b: bhat
	}
}


for (var i = 0; i < instructions.length; i++) {
	var eq = parseLinearEquation(instructions[i]);
	if (!currentEq) {
		currentEq = eq;
	} else {
		currentEq = combineLinearEquations(currentEq, eq);
	}
}

var shufflesRemaining = shuffles;

var aggregateEq = {
	a: 1,
	b: 0
};

var debug = false;

while (shufflesRemaining > 0) {
	if (debug) {
		aggregateEq = combineLinearEquations(aggregateEq, currentEq);
		shufflesRemaining--;
	} else {
		var log2 = Math.floor(Math.log2(shufflesRemaining));
		var expoFunction = currentEq;
		for(var i = 0; i < log2; i++) {
			expoFunction = combineLinearEquations(expoFunction, expoFunction);
		}
		console.log(shufflesRemaining, log2, Math.pow(2, log2));
		console.log('performed ', Math.pow(2, log2), 'shuffles');
		shufflesRemaining -= Math.pow(2, log2);
		aggregateEq = combineLinearEquations(aggregateEq, expoFunction);
	}
}

function executeLinearEquation(eq, x) {
	return (BigInt(cards) + (BigInt(eq.a) * BigInt(x)) + BigInt(eq.b)) % BigInt(cards);
}

console.log(cards, shuffles, aggregateEq);

var targetPosition = 2020;

aggregateEq = invertLinearEquation(aggregateEq);

console.log(executeLinearEquation(aggregateEq, targetPosition));
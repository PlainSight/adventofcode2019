var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('').map(num => parseInt(num));

var basePattern = [0, 1, 0, -1];

function patternForDigit(pattern, digit) {
	var p = [];
	for(var i = 0; i < pattern.length; i++) {
		for(var d = 0; d < digit; d++) {
			p.push(pattern[i]);
		}
	}

	var rotate = p.shift();
	p.push(rotate);

	return p;
}

var signal = rawInput;

for(var iter = 0; iter < 100; iter++) {
	var newSignal = [];
	for(var ns = 0; ns < signal.length; ns++) {
		var pattern = patternForDigit(basePattern, ns+1);
		//console.log(pattern, signal);
		var sum = 0;
		for(var c = 0; c < signal.length; c++) {
			sum += signal[c]*pattern[c%pattern.length];
		}
		var answer = Math.abs(sum)%10;
		newSignal.push(answer);
	}
	signal = newSignal;
}

console.log(signal.slice(0, 8));

// console.log(patternForDigit(basePattern, 1));
// console.log(patternForDigit(basePattern, 2));
// console.log(patternForDigit(basePattern, 3));
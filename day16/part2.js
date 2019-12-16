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

var offset = parseInt(rawInput.slice(0, 7).join(''));

var offsetModInputLength = offset % (rawInput.length*10000);

var signal = [];
for(var i = 0; i < 10000; i++) {
	signal.push(... rawInput);
}

for(var iter = 0; iter < 100; iter++) {
	console.log(iter);
	var newSignal = [];
	for(var ns = signal.length - 1; ns >= 0; ns--) {
		if(ns < (3*signal.length/4)) {
			// var pattern = patternForDigit(basePattern, ns+1);
			// var sum = 0;
			// for(var c = ns; c < signal.length; c++) {
			// 	sum += signal[c]*pattern[c%pattern.length];
			// }
			// var answer = Math.abs(sum)%10;
			// don't even need to calculate this
			newSignal.push(0);
		} else {
			if(ns == signal.length-1) {
				newSignal.push(signal[signal.length-1]);
			} else {
				var next = Math.abs(newSignal[newSignal.length-1]+signal[ns])%10;
				newSignal.push(next);
			}
		}
	}
	signal = newSignal.reverse();
}

console.log(signal.slice(offset, offset+8));
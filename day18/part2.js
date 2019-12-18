var fs = require('fs');

var rawInput = fs.readFileSync('./input.txt', 'utf8').split('\n');

var doodle = [5, 43, 7, 34,7, 8, 2, 6].sort(function(a, b) {
	if(a == b) {
		return 0;
	} else {
		return a > b ? -1 : 1;
	}
});

console.log(doodle);
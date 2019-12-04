var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('-');

var min = parseInt(input[0]);
var max = parseInt(input[1]);

var passwords = 0;

var twoSame = /(\d)\1/g

outer: for (var i = min; i <= max; i++) {
	var asString = '' + i;

	if (twoSame.test(asString)) {
		var matches = asString.match(twoSame);

		var hasTwoSame = false;

		for(var m = 0; m < matches.length; m++) {
			var match = matches[m];

			if(asString.split('').filter(c => c == match[0]).length == 2) {
				hasTwoSame = true;
			}
		}

		var ascending = true;

		for(var j = 0; j < 5; j++) {
			if (asString[j] > asString[j+1]) {
				ascending = false;
			}
		}

		if (ascending && hasTwoSame) {
			passwords++;
		}
	}
}

console.log(passwords);
var fs = require('fs');

var map = fs.readFileSync('./input.txt', 'utf8').split('\n');

function hash(map) {
	var sum = 0;
	for(var i = 0; i < map.length*map[0].length; i++) {
		var x = i % map[0].length;
		var y = Math.floor(i / map.length);
		if (map[y][x] == '#') {
			sum += Math.pow(2, i);
		}
	}
	return sum;
}

var dx = [0, -1, 0, 1];
var dy = [-1, 0, 1, 0];

function iterate(map) {
	var newMap = [];

	for(var y = 0; y < map.length; y++) {
		var newLine = [];
		for(var x = 0; x < map[0].length; x++) {
			var adjacentBugs = 0;
			for(var i = 0; i < 4; i++) {
				var tx = x+dx[i];
				var ty = y+dy[i];
				if (tx >= 0 && tx < map[0].length && ty >= 0 && ty < map.length && map[ty][tx] == '#') {
					adjacentBugs++;
				}
			}
			if (map[y][x] == '#') {
				if (adjacentBugs == 1) {
					newLine.push('#');
				} else {
					newLine.push('.');
				}
			} else {
				if (adjacentBugs == 1 || adjacentBugs == 2) {
					newLine.push('#');
				} else {
					newLine.push('.');
				}
			}
			
		}
		newMap.push(newLine);
	}
	return newMap;
}

var seen = {};

while (true) {
	var value = hash(map);

	if (seen[value] === true) {
		console.log(value);
		return;
	} else {
		seen[value] = true;
	}

	map = iterate(map);
}

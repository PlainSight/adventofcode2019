var fs = require('fs');

var originalmap = fs.readFileSync('./input.txt', 'utf8').split('\n').map(m => m.split(''));

originalmap[2][2] = '?';

var maps = [originalmap];

function count(maps) {
	var count = 0;

	for (var m = 0; m < maps.length; m++) {
		var map = maps[m];

		for(var i = 0; i < map.length*map[0].length; i++) {
			var x = i % map[0].length;
			var y = Math.floor(i / map.length);
			if (map[y][x] == '#') {
				count++;
			}
		}
	}
	return count;
}

var dx = [0, 0, -1, 1];
var dy = [-1, 1, 0, 0];

function adjacentCount(map, upper, lower, x, y) {
	var adjacentBugs = 0;

	// upper - outer
	if (upper) {
		if (x == 0) {
			adjacentBugs += (upper[2][1] == '#' ? 1 : 0);
		}
		if (x == 4) {
			adjacentBugs += (upper[2][3] == '#' ? 1 : 0);
		}
		if (y == 0) {
			adjacentBugs += (upper[1][2] == '#' ? 1 : 0);
		}
		if (y == 4) {
			adjacentBugs += (upper[3][2] == '#' ? 1 : 0);
		}
	}

	// lower - inner 
	if (lower) {
		// top
		if (x == 2 && y == 1) {
			for(var tx = 0; tx < 5; tx++) {
				adjacentBugs += (lower[0][tx] == '#' ? 1 : 0);
			}
		}

		// bottom
		if (x == 2 && y == 3) {
			for(var tx = 0; tx < 5; tx++) {
				adjacentBugs += (lower[4][tx] == '#' ? 1 : 0);
			}
		}

		// right
		if (x == 3 && y == 2) {
			for(var ty = 0; ty < 5; ty++) {
				adjacentBugs += (lower[ty][4] == '#' ? 1 : 0);
			}
		}

		// left
		if (x == 1 && y == 2) {
			for(var ty = 0; ty < 5; ty++) {
				adjacentBugs += (lower[ty][0] == '#' ? 1 : 0);
			}
		}
	}

	for(var i = 0; i < 4; i++) {
		var tx = x+dx[i];
		var ty = y+dy[i];
		if (tx >= 0 && tx < 5 && ty >= 0 && ty < 5 && (tx != 2 || ty != 2) && map[ty][tx] == '#') {
			adjacentBugs++;
		}
	}

	return adjacentBugs;
}

function freshMap() {
	var map = [];
	for(var y = 0; y < 5; y++) {
		var line = [];
		for(var x = 0; x < 5; x++) {
			if (x == 2 && y == 2) {
				line.push('?');
			} else {
				line.push('.');
			}
		}
		map.push(line);
	}
	return map;
}

function iterate(maps) {
	var newMaps = [];

	maps.unshift(freshMap());
	maps.push(freshMap());

	for (var m = 0; m < maps.length; m++) {
		var map = maps[m];

		var upperLayer = maps[m+1];
		var lowerLayer = maps[m-1];

		var newMap = [];

		for(var y = 0; y < 5; y++) {
			var newLine = [];
			for(var x = 0; x < 5; x++) {
				if (x != 2 || y != 2) {
					var adjacentBugs = adjacentCount(map, upperLayer, lowerLayer, x, y);
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
				} else {
					newLine.push('?');
				}
			}
			newMap.push(newLine);
		}
		newMaps.push(newMap);
	}
	return newMaps;
}

function render(maps) {
	console.log('count: ', count(maps));
	console.log(maps.map(m => m.map(l => l.join('')).join('\n')).join('\n\n'));
}

//render(maps);

for(var i = 0; i < 200; i++) {
	maps = iterate(maps);
	//render(maps);
}

console.log(count(maps));


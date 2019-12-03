var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\n');

var grid = [];

function index(x, y) {
	return x + ',' + y;
}

var closestIntersection = Infinity;

function putOrUpdate(x, y, wire) {
	if (grid[index(x, y)]) {
		grid[index(x, y)].first = (wire == 0) || grid[index(x, y)].first;
		grid[index(x, y)].second = (wire == 1) || grid[index(x, y)].second;
	} else {
		grid[index(x, y)] = {
			first: wire == 0,
			second: wire == 1
		}
	}

	if(grid[index(x, y)].first && grid[index(x, y)].second && (x != 0 || y != 0)) {
		if (Math.abs(x)+Math.abs(y) < closestIntersection) {
			closestIntersection = Math.abs(x)+Math.abs(y);
		}
	}
}

for(var i = 0; i < 2; i++) {
	var wire = input[i];
	var wireSegments = wire.split(',');

	var x = 0;
	var y = 0;

	for(var w = 0; w < wireSegments.length; w++) {
		var direction = wireSegments[w][0];
		var distance = parseInt(wireSegments[w].substring(1));

		switch(direction) {
			case 'U':
				var targetY = y - distance;
				for(;y > targetY; y--) {
					putOrUpdate(x, y, i);
				}
				break;
			case 'D':
				var targetY = y + distance;
				for(;y < targetY; y++) {
					putOrUpdate(x, y, i);
				}
				break;
			case 'L':
				var targetX = x - distance;
				for(;x > targetX; x--) {
					putOrUpdate(x, y, i);
				}
				break;
			case 'R':
				var targetX = x + distance;
				for(;x < targetX; x++) {
					putOrUpdate(x, y, i);
				}
				break;
		}
	}
}

console.log(closestIntersection);
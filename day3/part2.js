var fs = require('fs');

var input = fs.readFileSync('./input.txt', 'utf8').split('\n');

var grid = [];

function index(x, y) {
	return x + ',' + y;
}

var lowestStep = Infinity;

function putOrUpdate(x, y, wire, step) {
	if (grid[index(x, y)]) {
		if (wire == 0 && grid[index(x, y)].first < 0) {
			grid[index(x, y)].first = step;
		}
		if (wire == 1 && grid[index(x, y)].second < 0) {
			grid[index(x, y)].second = step;
		}
	} else {
		grid[index(x, y)] = {
			first: wire == 0 ? step : -1,
			second: wire == 1 ? step : -1
		}
	}

	if(grid[index(x, y)].first > 0 && grid[index(x, y)].second > 0 && step != 0) {
		var totalSteps = grid[index(x, y)].first + grid[index(x, y)].second;
		if (totalSteps < lowestStep) {
			lowestStep = totalSteps;
		}
	}
}

for(var i = 0; i < 2; i++) {
	var wire = input[i];
	var wireSegments = wire.split(',');

	var x = 0;
	var y = 0;
	var step = 0;

	for(var w = 0; w < wireSegments.length; w++) {
		var direction = wireSegments[w][0];
		var distance = parseInt(wireSegments[w].substring(1));

		switch(direction) {
			case 'U':
				var targetY = y - distance;
				for(;y > targetY; y--) {
					putOrUpdate(x, y, i, step);
					step++;
				}
				break;
			case 'D':
				var targetY = y + distance;
				for(;y < targetY; y++) {
					putOrUpdate(x, y, i, step);
					step++;
				}
				break;
			case 'L':
				var targetX = x - distance;
				for(;x > targetX; x--) {
					putOrUpdate(x, y, i, step);
					step++;
				}
				break;
			case 'R':
				var targetX = x + distance;
				for(;x < targetX; x++) {
					putOrUpdate(x, y, i, step);
					step++;
				}
				break;
		}
	}
}

console.log(lowestStep);
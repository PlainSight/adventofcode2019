var fs = require('fs');

var map = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var beginx = 0;
var beginy = 0;

var gates = {};
var keys = {};
var letters = 0;

for(var y = 0; y < map.length; y++) {
	for(var x = 0; x < map[y].length; x++) {
		switch (map[y][x]) {
			case '@':
				beginx = x;
				beginy = y;
				break;
			case '#':
				break;
			case '.':
				break;
			default:
				if (/[A-Z]/.test(map[y][x])) {
					gates[map[y][x]] = { x: x, y: y, v: map[y][x] };
				} else {
					letters++;
					keys[map[y][x]] = { x: x, y: y, v: map[y][x] };
				}
		}
	}
}

map[beginy-1] = map[beginy-1].substring(0, beginx-1) + '@#@' + map[beginy-1].substring(beginx+2, map[beginy-1].length);
map[beginy] = map[beginy].replace('.@.', '###');
map[beginy+1] = map[beginy+1].substring(0, beginx-1) + '@#@' + map[beginy+1].substring(beginx+2, map[beginy+1].length);

var robots = [
	{ x: beginx-1, y: beginy-1 },
	{ x: beginx+1, y: beginy-1 },
	{ x: beginx-1, y: beginy+1 },
	{ x: beginx+1, y: beginy+1 }
]

console.log(map.join('\n'));

var dx = [0, 1, 0, -1];
var dy = [1, 0, -1, 0];

var cullingSet = {};

// { location, [ keys ] }, distance

function cullingSetKey(positions, keys) {
	return positions.map(p => p.x+','+p.y).join(':')+ keys.sort(function(a, b) {
		return a < b ? -1 : 1;
	}).join(',');
}

var cachedPaths = {};

// start location: [ { key, required keys, len } ]

function findShortestPathWithRestriction(startx, starty, destination, notAllowed, origin) {
	var seen = {};
	var openSet = [];

	openSet.push({ x: startx, y: starty, d: 0, requires: [] });
	seen[startx+','+starty] = true;

findloop:	while(openSet.length > 0) {
		openSet.sort(function(a, b) {
			if(a.d == b.d) {
				return 0;
			} else {
				return a.d > b.d ? -1 : 1;
			}
		});

		var nom = openSet.pop();

inner:	for(var i = 0; i < 4; i++) {
			var x = nom.x+dx[i];
			var y = nom.y+dy[i];
			if(seen[x+','+y]) {
				continue inner;
			} else {
				seen[x+','+y] = true;
			}
			var char = map[y][x];
			switch(char) {
				case '.':
				case '@':
					openSet.push({ x: x, y: y, d: nom.d + 1, requires: nom.requires.slice(0) });
					break;
				case '#':
					break;
				default:
					if (/[A-Z]/.test(char)) {
						if(notAllowed.includes(char)) {
							break;
						}
						var req = nom.requires.slice(0);
						req.push(char.toLowerCase());
						openSet.push({ x: x, y: y, d: nom.d + 1, requires: req });
					} else {
						if(destination.v == char) {
							return {
								destination: destination.v,
								requires: nom.requires.slice(0),
								length: nom.d + 1,
								origin: origin
							};
							break findloop;
						} else {
							openSet.push({ x: x, y: y, d: nom.d + 1, requires: nom.requires.slice(0) });
						}
					}
					break;
			}
		}
	}
}

function findShortestPaths(startx, starty, origin) {
	if(!cachedPaths[startx+','+starty]) {
		cachedPaths[startx+','+starty] = [];
	}

	for(var k in keys) {
		if (keys[k].x != startx || keys[k].y != starty) {
			var destination = keys[k];

			var found = findShortestPathWithRestriction(startx, starty, destination, [], origin);

			if (found) {
				cachedPaths[startx+','+starty].push(found);
			}
		}
	}

}

for(var p in robots) {
	var pos = robots[p];
	findShortestPaths(pos.x, pos.y, '@');
}
for(var k in keys) {
	findShortestPaths(keys[k].x, keys[k].y, k);
}

console.log(JSON.stringify(cachedPaths));

function getAccessibleKeys(positions, existingKeys) {
	var nextKeys = [];

	for (var p in positions) {
		var pos = positions[p];
		var cachedPathsFromThisLocation = cachedPaths[pos.x+','+pos.y];

		for (var cp = 0; cp < cachedPathsFromThisLocation.length; cp++) {
			var path = cachedPathsFromThisLocation[cp];
			
			if(!existingKeys.includes(path.destination) && path.requires.every(r => existingKeys.includes(r))) {
				for(var nk = 0; nk < nextKeys.length; nk++) {
					if(nextKeys[nk].v == path.destination && nextKeys[nk].d > path.length) {
						nextKeys[nk] = nextKeys[nextKeys.length-1];
						nextKeys.pop();
					}
				}
				nextKeys.push({ x: keys[path.destination].x, y: keys[path.destination].y, v: path.destination, d: path.length, position: parseInt(p) });
			}
		}
	}

	return {
		keys: nextKeys
	}
}

var minDistance = Infinity;
var shortestPath = [];

function collectKeys(currentKeys, positions, distance) {
	if(cullingSet[cullingSetKey(positions, currentKeys)] <= distance) {
		return;
	} else {
		cullingSet[cullingSetKey(positions, currentKeys)] = distance;
	}

	var evaluate = getAccessibleKeys(positions, currentKeys);

	for(var k = 0; k < evaluate.keys.length; k++) {
		var key = evaluate.keys[k];

		var newKeys = currentKeys.slice(0);
		newKeys.push(key.v);
		var newDist = distance + key.d;
		var newPositions = [];
		for(var p in positions) {
			var pos = positions[p];
			newPositions.push({ x: pos.x, y: pos.y });
		}
		newPositions[key.position] = { x: key.x, y: key.y };

		if (newKeys.length == letters) {
			if(newDist < minDistance) {
				console.log(newDist);
				console.log(newKeys.join(','));
				shortestPath = newKeys.slice(0);
				minDistance = newDist;
			}
		} else {
			collectKeys(newKeys, newPositions, newDist);
		}
	}
}

collectKeys([], robots, 0);

console.log(minDistance);
console.log(shortestPath);
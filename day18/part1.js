var fs = require('fs');

var map = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var beginx = 0;
var beginy = 0;

var gates = {};
var keys = {};

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
					keys[map[y][x]] = { x: x, y: y, v: map[y][x] };
				}
		}
	}
}

map[beginy] = map[beginy].replace('@', '.');

console.log(map.join('\n'));

var dx = [0, 1, 0, -1];
var dy = [1, 0, -1, 0];

var cullingSet = {};

// { location, [ keys ] }, distance

function cullingSetKey(x, y, keys) {
	return x + ':' + y + keys.sort(function(a, b) {
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


findShortestPaths(beginx, beginy, '@');
for(var k in keys) {
	findShortestPaths(keys[k].x, keys[k].y, k);
}

console.log(JSON.stringify(cachedPaths));

function getAccessibleKeys(startx, starty, existingKeys) {
	var nextKeys = [];

	var cachedPathsFromThisLocation = cachedPaths[startx+','+starty];

	for (var cp = 0; cp < cachedPathsFromThisLocation.length; cp++) {
		var path = cachedPathsFromThisLocation[cp];
		
		if(!existingKeys.includes(path.destination) && path.requires.every(r => existingKeys.includes(r))) {
			for(var nk = 0; nk < nextKeys.length; nk++) {
				if(nextKeys[nk].v == path.destination && nextKeys[nk].d > path.length) {
					nextKeys[nk] = nextKeys[nextKeys.length-1];
					nextKeys.pop();
				}
			}
			nextKeys.push({ x: keys[path.destination].x, y: keys[path.destination].y, v: path.destination, d: path.length });
		}
	}

	return {
		keys: nextKeys
	}
}

var minDistance = Infinity;
var shortestPath = [];

function collectKeys(currentKeys, currentx, currenty, distance) {
	if(cullingSet[cullingSetKey(currentx, currenty, currentKeys)] <= distance) {
		return;
	} else {
		cullingSet[cullingSetKey(currentx, currenty, currentKeys)] = distance;
	}

	var evaluate = getAccessibleKeys(currentx, currenty, currentKeys);

	for(var k = 0; k < evaluate.keys.length; k++) {
		var key = evaluate.keys[k];

		var newKeys = currentKeys.slice(0);
		newKeys.push(key.v);
		var newDist = distance + key.d;
		var newX = key.x;
		var newY = key.y;

		if (newKeys.length == 26) {
			if(newDist < minDistance) {
				console.log(newDist);
				console.log(newKeys.join(','));
				shortestPath = newKeys.slice(0);
				minDistance = newDist;
			}
		} else {
			collectKeys(newKeys, newX, newY, newDist);
		}
	}
}

collectKeys([], beginx, beginy, 0);

console.log(minDistance);
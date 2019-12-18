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

function addRestrictionAndFindAgain(startx, starty, destination, lastFound, existingRestrictions, origin) {
	for(var r = 0; r < lastFound.requires.length; r++) {
		var restriction = lastFound.requires[r].toUpperCase();
		var newRestrictions = existingRestrictions.slice(0);
		newRestrictions.push(restriction);
		var newFound = findShortestPathWithRestriction(startx, starty, destination, newRestrictions, origin);
		if(newFound) {
			cachedPaths[startx+','+starty].push(newFound);
			addRestrictionAndFindAgain(startx, starty, destination, newFound, newRestrictions, origin);
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
				addRestrictionAndFindAgain(startx, starty, destination, found, [], origin);
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
			//console.log('existingKeys', existingKeys);
			//console.log('path', path);
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

//var searchStack = [];

function collectKeys(currentKeys, currentx, currenty, distance) {
	if(cullingSet[cullingSetKey(currentx, currenty, currentKeys)] <= distance) {
		return;
	}

	var evaluate = getAccessibleKeys(currentx, currenty, currentKeys);
	//console.log(evaluate);

	// evaluate.keys.sort(function(a, b) {
	// 	if(a.d == b.d) {
	// 		return 0;
	// 	} else {
	// 		return a.d > b.d ? 1 : -1;
	// 	}
	// });

	//console.log(currentKeys, evaluate);

	for(var k = 0; k < evaluate.keys.length; k++) {
		var key = evaluate.keys[k];

		//console.log(key);

		var newKeys = currentKeys.slice(0);
		newKeys.push(key.v);
		var newDist = distance + key.d;
		var newX = key.x;
		var newY = key.y;

		if(cullingSet[cullingSetKey(currentx, currenty, newKeys)]) {
			if (cullingSet[cullingSetKey(currentx, currenty, newKeys)] > newDist) {
				cullingSet[cullingSetKey(currentx, currenty, newKeys)] = newDist;
			}
		} else {
			cullingSet[cullingSetKey(currentx, currenty, newKeys)] = newDist;
		}

		//console.log(newKeys.length, minDistance);
		//console.log(newMap.join('\n'));

		if (newKeys.length == 26) {
			if(newDist < minDistance) {
				console.log(newDist);
				console.log(newKeys.join(','));
				shortestPath = newKeys.slice(0);
				minDistance = newDist;
			}
		} else {
			// searchStack.push({
			// 	a:newKeys,
			// 	b:currentMap,
			// 	c:newX,
			// 	d:newY,
			// 	e:newDist
			// });
			collectKeys(newKeys, newX, newY, newDist);
		}
	}
}

collectKeys([], beginx, beginy, 0);

// var iters = 0;

// while(searchStack.length > 0) {
// 	if(iters % 1000 == 0) {
// 		console.log(iters, minDistance);
// 	}
// 	iters++;
// 	searchStack.sort(function(a, b) {
// 		// var akd = a.a.length / a.e;
// 		// var bkd = b.a.length / b.e;
// 		// if(akd == bkd) {
// 		// 	return 0;
// 		// } else {
// 		// 	return akd > bkd ? -1 : 1;
// 		// }

// 		var aval = a.a.length;
// 		var bval = b.a.length;

// 		if(aval == bval) {
// 			return Math.random() < 0.5 ? -1 : 1;
// 		} else {
// 			return aval > bval ? 1 : -1;
// 		}
// 	});
// 	//console.log('ss: ', searchStack);
// 	var popped = searchStack.pop();
// 	collectKeys(popped.a, popped.b, popped.c, popped.d, popped.e);
// }

console.log(minDistance);
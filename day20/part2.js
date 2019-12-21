var fs = require('fs');

var map = fs.readFileSync('./input.txt', 'utf8').split('\r\n');

var portalParts = [];
var entraces = {};
var portals = {};

for(var y = 0; y < map.length; y++) {
	for(var x = 0; x < map[0].length; x++) {
		if (/[A-Z]/.test(map[y][x])) {
			portalParts.push({ x: x, y: y, char: map[y][x] });
		}
	}
}

function sortChar(part, otherPart) {
	if (part.x < otherPart.x || part.y < otherPart.y) {
		return part.char+otherPart.char;
	} else {
		return otherPart.char+part.char;
	}
}

function toIndex(x, y, z) {
	if (z) {
		return x+','+y+','+z;
	}
	return x+','+y;
}

for(var pp in portalParts) {
	var part = portalParts[pp];
	for(var opp in portalParts) {
		var otherPart = portalParts[opp];

		var dx = part.x - otherPart.x;
		var dy = part.y - otherPart.y;

		if (Math.abs(dx) + Math.abs(dy) == 1) {
			var xvalid = part.y+dy >= 0 && part.y+dy < map.length;
			var yvalid = part.x+dx >= 0 && part.x+dx < map[0].length;

			if(!entraces[sortChar(part, otherPart)]) {
				entraces[sortChar(part, otherPart)] = [];
			}

			if(xvalid && yvalid && map[part.y+dy][part.x+dx] == '.') {
				entraces[sortChar(part, otherPart)].push({ x: part.x, y: part.y, exit: { x: part.x+dx, y: part.y+dy } });
			} 
		}
	}
}

var start;
var end;

for (var e in entraces) {
	var entrance = entraces[e];
	var one = entrance[0];
	var two = entrance[1];
	if (one && two) {
		portals[toIndex(one.x, one.y)] = two.exit;
		if (one.x + 3 > map[0].length || one.x < 3 || one.y + 3 > map.length || one.y < 3) {
			portals[toIndex(one.x, one.y)].io = 'outer';
		} else {
			portals[toIndex(one.x, one.y)].io = 'inner';
		}
		portals[toIndex(two.x, two.y)] = one.exit;
		if (two.x + 3 > map[0].length || two.x < 3 || two.y + 3 > map.length || two.y < 3 ) {
			portals[toIndex(two.x, two.y)].io = 'outer';
		} else {
			portals[toIndex(two.x, two.y)].io = 'inner';
		}
	} else {
		if (e == 'AA') {
			start = one.exit;
		} else {
			if (e == 'ZZ') {
				end = { x: one.x, y: one.y };
			} else {
				console.log('BAD', e, entrance);
			}
		}
	}
}

console.log(portals, start, end);

var stack = [];
var seen = {};

var dx = [0, 1, 0, -1];
var dy = [1, 0, -1, 0];

stack.push({ x: start.x, y: start.y, z: 0, d: 0 });
seen[toIndex(start.x, start.y, start.z)] = true;

while(stack.length > 0) {
	stack.sort((a, b) => {
		if (a == b) return 0;
		return a.d < b.d ? 1 : -1;
	})

	var nom = stack.pop();

	for(var i = 0; i < 4; i++) {
		var x = nom.x+dx[i];
		var y = nom.y+dy[i];
		var z = nom.z;
		if (!seen[toIndex(x, y, z)]) {
			seen[toIndex(x, y, z)] = true;
			if (map[y][x] == '.') {
				stack.push({ x: x, y: y, z: z, d: nom.d + 1 });
			}
			var portal = portals[toIndex(x, y)];
			if (portal != null && !(portal.io == 'outer' && z == 0)) {
				stack.push({ x: portal.x, y: portal.y, z: nom.z + (portal.io == 'inner' ? 1 : -1), d: nom.d + 1 });
			}
			if (x == end.x && y == end.y && z == 0) {
				console.log('end', nom.d);		
				return;
			}
		}
	}
}

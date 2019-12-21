var fs = require('fs');

var map = fs.readFileSync('./input.txt', 'utf8').split('\r\n');
var map2 = fs.readFileSync('./input.txt', 'utf8').split('\r\n').map(l => l.split(''));

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

function toIndex(x, y) {
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
		portals[toIndex(two.x, two.y)] = one.exit;
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

stack.push({ x: start.x, y: start.y, d: 0 });
seen[toIndex(start.x, start.y)] = true;

while(stack.length > 0) {
	stack.sort((a, b) => {
		if (a == b) return 0;
		return a.d < b.d ? 1 : -1;
	})

	var nom = stack.pop();
	map2[nom.y][nom.x] = ''+nom.d%10;

	for(var i = 0; i < 4; i++) {
		var x = nom.x+dx[i];
		var y = nom.y+dy[i];
		if (!seen[toIndex(x, y)]) {
			seen[toIndex(x, y)] = true;
			if (map[y][x] == '.') {
				stack.push({ x: x, y: y, d: nom.d + 1 });
			}
			var portal = portals[toIndex(x, y)];
			if (portal) {
				stack.push({ x: portal.x, y: portal.y, d: nom.d + 1 });
			}
			if (x == end.x && y == end.y) {
				console.log('end', nom.d);		
			}
		}
	}
}

console.log(map2.map(l => l.join('')).join('\n'));

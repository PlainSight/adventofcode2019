var fs = require('fs');

var instructions = fs.readFileSync('./input.txt', 'utf8').split('\n');

var count = 10007;

function dealIntoNewStack(stack) {
	return stack.reverse();
}

function cut(stack, number) {
	if (number < 0) {
		var result = stack.slice(0, stack.length + number);
		var toPrepend  = stack.slice(number);
		result.unshift(...toPrepend);
		return result;
	} else {
		var result = stack.slice(number);
		var toAppend = stack.slice(0, number);
		result.push(...toAppend);
		return result;
	}
}

function dealWithIncrement(stack, increment) {
	var space = stack.length;
	var table = [];
	for(var i = 0; i < space; i++) {
		var position = ((i*increment)%space);
		table[position] = stack.shift();
	}
	return table;
}

var current = [];
for(var i = 0; i < 10007; i++) {
	current.push(i);
}

for (var i = 0; i < instructions.length; i++) {
	var instruction = instructions[i];
	var parts = instruction.split(' ');
	if (parts[0] == 'cut') {
		current = cut(current, parseInt(parts[1]));
	} else {
		if (parts[1] == 'into') {
			current = dealIntoNewStack(current);
		} else {
			current = dealWithIncrement(current, parseInt(parts[3]));
		}
	}
}

for(var i = 0; i < current.length; i++) {
	if (current[i] == 2019) {
		console.log(i);
	}
}


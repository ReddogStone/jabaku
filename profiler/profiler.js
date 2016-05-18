var g_averages = {};
var g_frameTimes = {};
var g_times = [];
var g_timeStack = [];
var g_level = 0;

function startFrame() {
	g_frameTimes = {};
	g_times.length = 0;
};
function stopFrame() {
	var nameStack = [];
	var level = -1;
	for (var i = 0; i < g_times.length; ++i) {
		var current = g_times[i];
		nameStack.splice(nameStack.length - level + current.level - 1, level - current.level + 1);
		level = current.level;
		nameStack.push(current.name);
		
		var name = nameStack.join('.');
		var duration = current.stop - current.start;
		if (g_frameTimes[name]) {
			g_frameTimes[name] += duration;
		} else {
			g_frameTimes[name] = duration;
		}
	}
	
	for (var name in g_frameTimes) {
		if (name in g_averages) {
			g_averages[name] = 0.95 * g_averages[name] + 0.05 * g_frameTimes[name];
		} else {
			g_averages[name] = g_frameTimes[name];
		}
	}
};
function start(name) {
	var newTime = {name: name, level: g_level, start: window.performance.now()};
	g_times.push(newTime);
	g_timeStack.push(newTime);
	++g_level;
};
function stop() {
	--g_level;
	var time = g_timeStack.pop();
	time.stop = window.performance.now();
};

function fixedLength(string, number) {
	return '            '.substr(string.length - number) + string;
}

function getReportStrings() {
	var maxLength = 0;
	for (var name in g_frameTimes) {
		if (name.length > maxLength) {
			maxLength = name.length;
		}
	}
	
	var lines = [];
	for (var name in g_frameTimes) {
		var value = g_frameTimes[name];
		var average = g_averages[name];
		lines.push(name + Array(maxLength - name.length + 4).join(' ') + '===' + 
			fixedLength(value.toFixed(2), 8) + ' ms' +
			fixedLength(average.toFixed(2), 8) + ' ms');
	}
	
	return lines;
};

var enabled = true;
exports.enable = function() {
	enabled = true;
	exports.startFrame = startFrame;
	exports.stopFrame = stopFrame;
	exports.start = start;
	exports.stop = stop;
	exports.getReportStrings = getReportStrings;
};

function empty() {}
exports.disable = function() {
	enabled = false;
	exports.startFrame = empty;
	exports.stopFrame = empty;
	exports.start = empty;
	exports.stop = empty;
	exports.getReportStrings = function() { return []; };
};

exports.toggle = function() {
	if (enabled) {
		exports.disable();
	} else {
		exports.enable();
	}
};

exports.disable();

/*! VZRF Version 2.20.0 */
/*!
 * Protect window.console method calls, e.g. console is not defined on IE
 * unless dev tools are open, and IE doesn't define console.debug
 * http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
 */
 
// Chrome 41.0.2272.118: debug,error,info,log,warn,dir,dirxml,table,trace,assert,count,markTimeline,profile,profileEnd,time,timeEnd,timeStamp,timeline,timelineEnd,group,groupCollapsed,groupEnd,clear
// Firefox 37.0.1: log,info,warn,error,exception,debug,table,trace,dir,group,groupCollapsed,groupEnd,time,timeEnd,profile,profileEnd,assert,count
// Internet Explorer 11: select,log,info,warn,error,debug,assert,time,timeEnd,timeStamp,group,groupCollapsed,groupEnd,trace,clear,dir,dirxml,count,countReset,cd
// Safari 6.2.4: debug,error,log,info,warn,clear,dir,dirxml,table,trace,assert,count,profile,profileEnd,time,timeEnd,timeStamp,group,groupCollapsed,groupEnd
// Opera 28.0.1750.48: debug,error,info,log,warn,dir,dirxml,table,trace,assert,count,markTimeline,profile,profileEnd,time,timeEnd,timeStamp,timeline,timelineEnd,group,groupCollapsed,groupEnd,clear
 
(function () {
	// Union of Chrome, Firefox, IE, Opera, and Safari console methods
	var methods = ["assert", "assert", "cd", "clear", "count", "countReset",
	  "debug", "dir", "dirxml", "dirxml", "dirxml", "error", "error", "exception",
	  "group", "group", "groupCollapsed", "groupCollapsed", "groupEnd", "info",
	  "info", "log", "log", "markTimeline", "profile", "profileEnd", "profileEnd",
	  "select", "table", "table", "time", "time", "timeEnd", "timeEnd", "timeEnd",
	  "timeEnd", "timeEnd", "timeStamp", "timeline", "timelineEnd", "trace",
	  "trace", "trace", "trace", "trace", "warn"];
	var length = methods.length;
	var console = (window.console = window.console || {});
	var method;
	var noop = function () { };
	while (length--) {
		method = methods[length];
		// define undefined methods as noops to prevent errors
		if (!console[method])
			console[method] = noop;
	}
})();
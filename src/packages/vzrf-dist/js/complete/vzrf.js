/*! VZRF Version 2.20.0 */
/*!
  * Bowser - a browser detector
  * https://github.com/ded/bowser
  * MIT License | (c) Dustin Diaz 2014
  */

!function (name, definition) {
	if (typeof module != 'undefined' && module.exports) module.exports['browser'] = definition()
	else if (typeof define == 'function') define(definition)
	else this[name] = definition()
}('bowser', function () {
	/**
	  * See useragents.js for examples of navigator.userAgent
	  */

	var t = true

	function detect(ua) {

		function getFirstMatch(regex) {
			var match = ua.match(regex);
			return (match && match.length > 1 && match[1]) || '';
		}

		var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
		  , likeAndroid = /like android/i.test(ua)
		  , android = !likeAndroid && /android/i.test(ua)
		  , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
		  , tablet = /tablet/i.test(ua)
		  , mobile = !tablet && /[^-]mobi/i.test(ua)
		  , result

		if (/opera|opr/i.test(ua)) {
			result = {
				name: 'Opera'
			, opera: t
			, version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
			}
		}
		else if (/windows phone/i.test(ua)) {
			result = {
				name: 'Windows Phone'
			, windowsphone: t
			, msie: t
			, version: getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/msie|trident/i.test(ua)) {
			result = {
				name: 'Internet Explorer'
			, msie: t
			, version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
			}
		}
		else if (/chrome|crios|crmo/i.test(ua)) {
			result = {
				name: 'Chrome'
			, chrome: t
			, version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
			}
		}
		else if (iosdevice) {
			result = {
				name: iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
			}
			// WTF: version is not part of user agent in web apps
			if (versionIdentifier) {
				result.version = versionIdentifier
			}
		}
		else if (/sailfish/i.test(ua)) {
			result = {
				name: 'Sailfish'
			, sailfish: t
			, version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/seamonkey\//i.test(ua)) {
			result = {
				name: 'SeaMonkey'
			, seamonkey: t
			, version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/firefox|iceweasel/i.test(ua)) {
			result = {
				name: 'Firefox'
			, firefox: t
			, version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
			}
			if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
				result.firefoxos = t
			}
		}
		else if (/silk/i.test(ua)) {
			result = {
				name: 'Amazon Silk'
			, silk: t
			, version: getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
			}
		}
		else if (android) {
			result = {
				name: 'Android'
			, version: versionIdentifier
			}
		}
		else if (/phantom/i.test(ua)) {
			result = {
				name: 'PhantomJS'
			, phantom: t
			, version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
			result = {
				name: 'BlackBerry'
			, blackberry: t
			, version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
			}
		}
		else if (/(web|hpw)os/i.test(ua)) {
			result = {
				name: 'WebOS'
			, webos: t
			, version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
			};
			/touchpad\//i.test(ua) && (result.touchpad = t)
		}
		else if (/bada/i.test(ua)) {
			result = {
				name: 'Bada'
			, bada: t
			, version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
			};
		}
		else if (/tizen/i.test(ua)) {
			result = {
				name: 'Tizen'
			, tizen: t
			, version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
			};
		}
		else if (/safari/i.test(ua)) {
			result = {
				name: 'Safari'
			, safari: t
			, version: versionIdentifier
			}
		}
		else result = {}

		// set webkit or gecko flag for browsers based on these engines
		if (/(apple)?webkit/i.test(ua)) {
			result.name = result.name || "Webkit"
			result.webkit = t
			if (!result.version && versionIdentifier) {
				result.version = versionIdentifier
			}
		} else if (!result.opera && /gecko\//i.test(ua)) {
			result.name = result.name || "Gecko"
			result.gecko = t
			result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
		}

		// set OS flags for platforms that have multiple browsers
		if (android || result.silk) {
			result.android = t
		} else if (iosdevice) {
			result[iosdevice] = t
			result.ios = t
		}

		// OS version extraction
		var osVersion = '';
		if (iosdevice) {
			osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
			osVersion = osVersion.replace(/[_\s]/g, '.');
		} else if (android) {
			osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
		} else if (result.windowsphone) {
			osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
		} else if (result.webos) {
			osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
		} else if (result.blackberry) {
			osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
		} else if (result.bada) {
			osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
		} else if (result.tizen) {
			osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
		}
		if (osVersion) {
			result.osversion = osVersion;
		}

		// device type extraction
		var osMajorVersion = osVersion.split('.')[0];
		if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
			result.tablet = t
		} else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
			result.mobile = t
		}

		// Graded Browser Support
		// http://developer.yahoo.com/yui/articles/gbs
		if ((result.msie && result.version >= 10) ||
			(result.chrome && result.version >= 20) ||
			(result.firefox && result.version >= 20.0) ||
			(result.safari && result.version >= 6) ||
			(result.opera && result.version >= 10.0) ||
			(result.ios && result.osversion && result.osversion.split(".")[0] >= 6)
			) {
			result.a = t;
		}
		else if ((result.msie && result.version < 10) ||
			(result.chrome && result.version < 20) ||
			(result.firefox && result.version < 20.0) ||
			(result.safari && result.version < 6) ||
			(result.opera && result.version < 10.0) ||
			(result.ios && result.osversion && result.osversion.split(".")[0] < 6)
			) {
			result.c = t
		} else result.x = t

		return result
	}

	var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')


	/*
	 * Set our detect method to the main bowser object so we can
	 * reuse it to test other user agents.
	 * This is needed to implement future tests.
	 */
	bowser._detect = detect;

	return bowser
});
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
; (function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 * @version 1.0.6
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function () { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function (type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function (type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function (event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function (event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function (target) {
		switch (target.nodeName.toLowerCase()) {

			// Don't send a synthetic click to disabled inputs (issue #62)
			case 'button':
			case 'select':
			case 'textarea':
				if (target.disabled) {
					return true;
				}

				break;
			case 'input':

				// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
				if ((deviceIsIOS && target.type === 'file') || target.disabled) {
					return true;
				}

				break;
			case 'label':
			case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
			case 'video':
				return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function (target) {
		switch (target.nodeName.toLowerCase()) {
			case 'textarea':
				return true;
			case 'select':
				return !deviceIsAndroid;
			case 'input':
				switch (target.type) {
					case 'button':
					case 'checkbox':
					case 'file':
					case 'image':
					case 'radio':
					case 'submit':
						return false;
				}

				// No point in attempting to focus disabled inputs
				return !target.disabled && !target.readOnly;
			default:
				return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function (targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function (targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function (targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function (targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function (eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function (event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function (event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function (event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function (labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function (event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function () {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function (event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function (event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function () {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function (layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

				// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function (layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function () {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());
/*!
 * jQuery JavaScript Library v2.2.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-04-05T19:26Z
 */

(function (global, factory) {

	if (typeof module === "object" && typeof module.exports === "object") {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory(global, true) :
			function (w) {
				if (!w.document) {
					throw new Error("jQuery requires a window with a document");
				}
				return factory(w);
			};
	} else {
		factory(global);
	}

	// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function (window, noGlobal) {

	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//"use strict";
	var arr = [];

	var document = window.document;

	var slice = arr.slice;

	var concat = arr.concat;

	var push = arr.push;

	var indexOf = arr.indexOf;

	var class2type = {};

	var toString = class2type.toString;

	var hasOwn = class2type.hasOwnProperty;

	var support = {};



	var
		version = "2.2.3",

		// Define a local copy of jQuery
		jQuery = function (selector, context) {

			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init(selector, context);
		},

		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function (all, letter) {
			return letter.toUpperCase();
		};

	jQuery.fn = jQuery.prototype = {

		// The current version of jQuery being used
		jquery: version,

		constructor: jQuery,

		// Start with an empty selector
		selector: "",

		// The default length of a jQuery object is 0
		length: 0,

		toArray: function () {
			return slice.call(this);
		},

		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function (num) {
			return num != null ?

				// Return just the one element from the set
				(num < 0 ? this[num + this.length] : this[num]) :

				// Return all the elements in a clean array
				slice.call(this);
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {

			// Build a new jQuery matched element set
			var ret = jQuery.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		// Execute a callback for every element in the matched set.
		each: function (callback) {
			return jQuery.each(this, callback);
		},

		map: function (callback) {
			return this.pushStack(jQuery.map(this, function (elem, i) {
				return callback.call(elem, i, elem);
			}));
		},

		slice: function () {
			return this.pushStack(slice.apply(this, arguments));
		},

		first: function () {
			return this.eq(0);
		},

		last: function () {
			return this.eq(-1);
		},

		eq: function (i) {
			var len = this.length,
				j = +i + (i < 0 ? len : 0);
			return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
		},

		end: function () {
			return this.prevObject || this.constructor();
		},

		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};

	jQuery.extend = jQuery.fn.extend = function () {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;

			// Skip the boolean and the target
			target = arguments[i] || {};
			i++;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !jQuery.isFunction(target)) {
			target = {};
		}

		// Extend jQuery itself if only one argument is passed
		if (i === length) {
			target = this;
			i--;
		}

		for (; i < length; i++) {

			// Only deal with non-null/undefined values
			if ((options = arguments[i]) != null) {

				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (jQuery.isPlainObject(copy) ||
						(copyIsArray = jQuery.isArray(copy)))) {

						if (copyIsArray) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];

						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = jQuery.extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	jQuery.extend({

		// Unique for each copy of jQuery on the page
		expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),

		// Assume jQuery is ready without the ready module
		isReady: true,

		error: function (msg) {
			throw new Error(msg);
		},

		noop: function () { },

		isFunction: function (obj) {
			return jQuery.type(obj) === "function";
		},

		isArray: Array.isArray,

		isWindow: function (obj) {
			return obj != null && obj === obj.window;
		},

		isNumeric: function (obj) {

			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			var realStringObj = obj && obj.toString();
			return !jQuery.isArray(obj) && (realStringObj - parseFloat(realStringObj) + 1) >= 0;
		},

		isPlainObject: function (obj) {
			var key;

			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
				return false;
			}

			// Not own constructor property must be Object
			if (obj.constructor &&
					!hasOwn.call(obj, "constructor") &&
					!hasOwn.call(obj.constructor.prototype || {}, "isPrototypeOf")) {
				return false;
			}

			// Own properties are enumerated firstly, so to speed up,
			// if last one is own, then all properties are own
			for (key in obj) { }

			return key === undefined || hasOwn.call(obj, key);
		},

		isEmptyObject: function (obj) {
			var name;
			for (name in obj) {
				return false;
			}
			return true;
		},

		type: function (obj) {
			if (obj == null) {
				return obj + "";
			}

			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[toString.call(obj)] || "object" :
				typeof obj;
		},

		// Evaluates a script in a global context
		globalEval: function (code) {
			var script,
				indirect = eval;

			code = jQuery.trim(code);

			if (code) {

				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if (code.indexOf("use strict") === 1) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild(script).parentNode.removeChild(script);
				} else {

					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval

					indirect(code);
				}
			}
		},

		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function (string) {
			return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
		},

		nodeName: function (elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		each: function (obj, callback) {
			var length, i = 0;

			if (isArrayLike(obj)) {
				length = obj.length;
					for (; i < length; i++) {
					if (callback.call(obj[i], i, obj[i]) === false) {
							break;
						}
					}
				} else {
					for (i in obj) {
					if (callback.call(obj[i], i, obj[i]) === false) {
							break;
						}
					}
				}

			return obj;
		},

		// Support: Android<4.1
		trim: function (text) {
			return text == null ?
				"" :
				(text + "").replace(rtrim, "");
		},

		// results is for internal usage only
		makeArray: function (arr, results) {
			var ret = results || [];

			if (arr != null) {
				if (isArrayLike(Object(arr))) {
					jQuery.merge(ret,
						typeof arr === "string" ?
						[arr] : arr
					);
				} else {
					push.call(ret, arr);
				}
			}

			return ret;
		},

		inArray: function (elem, arr, i) {
			return arr == null ? -1 : indexOf.call(arr, elem, i);
		},

		merge: function (first, second) {
			var len = +second.length,
				j = 0,
				i = first.length;

			for (; j < len; j++) {
				first[i++] = second[j];
			}

			first.length = i;

			return first;
		},

		grep: function (elems, callback, invert) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;

			// Go through the array, only saving the items
			// that pass the validator function
			for (; i < length; i++) {
				callbackInverse = !callback(elems[i], i);
				if (callbackInverse !== callbackExpect) {
					matches.push(elems[i]);
				}
			}

			return matches;
		},

		// arg is for internal usage only
		map: function (elems, callback, arg) {
			var length, value,
				i = 0,
				ret = [];

			// Go through the array, translating each of the items to their new values
			if (isArrayLike(elems)) {
				length = elems.length;
				for (; i < length; i++) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}

				// Go through every key on the object,
			} else {
				for (i in elems) {
					value = callback(elems[i], i, arg);

					if (value != null) {
						ret.push(value);
					}
				}
			}

			// Flatten any nested arrays
			return concat.apply([], ret);
		},

		// A global GUID counter for objects
		guid: 1,

		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function (fn, context) {
			var tmp, args, proxy;

			if (typeof context === "string") {
				tmp = fn[context];
				context = fn;
				fn = tmp;
			}

			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if (!jQuery.isFunction(fn)) {
				return undefined;
			}

			// Simulated bind
			args = slice.call(arguments, 2);
			proxy = function () {
				return fn.apply(context || this, args.concat(slice.call(arguments)));
			};

			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;

			return proxy;
		},

		now: Date.now,

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});

	// JSHint would error on this code due to the Symbol not being defined in ES5.
	// Defining this global in .jshintrc would create a danger of using the global
	// unguarded in another place, it seems safer to just disable JSHint for these
	// three lines.
	/* jshint ignore: start */
	if (typeof Symbol === "function") {
		jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
	}
	/* jshint ignore: end */

	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
	function (i, name) {
		class2type["[object " + name + "]"] = name.toLowerCase();
	});

	function isArrayLike(obj) {

		// Support: iOS 8.2 (not reproducible in simulator)
		// `in` check used to prevent JIT error (gh-2145)
		// hasOwn isn't used here due to false negatives
		// regarding Nodelist length in IE
		var length = !!obj && "length" in obj && obj.length,
			type = jQuery.type(obj);

		if (type === "function" || jQuery.isWindow(obj)) {
			return false;
		}

		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.1
	 * http://sizzlejs.com/
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2015-10-17
	 */
	(function (window) {

		var i,
			support,
			Expr,
			getText,
			isXML,
			tokenize,
			compile,
			select,
			outermostContext,
			sortInput,
			hasDuplicate,

			// Local document vars
			setDocument,
			document,
			docElem,
			documentIsHTML,
			rbuggyQSA,
			rbuggyMatches,
			matches,
			contains,

			// Instance-specific data
			expando = "sizzle" + 1 * new Date(),
			preferredDoc = window.document,
			dirruns = 0,
			done = 0,
			classCache = createCache(),
			tokenCache = createCache(),
			compilerCache = createCache(),
			sortOrder = function (a, b) {
				if (a === b) {
					hasDuplicate = true;
				}
				return 0;
			},

			// General-purpose constants
			MAX_NEGATIVE = 1 << 31,

			// Instance methods
			hasOwn = ({}).hasOwnProperty,
			arr = [],
			pop = arr.pop,
			push_native = arr.push,
			push = arr.push,
			slice = arr.slice,
			// Use a stripped-down indexOf as it's faster than native
			// http://jsperf.com/thor-indexof-vs-for/5
			indexOf = function (list, elem) {
				var i = 0,
					len = list.length;
				for (; i < len; i++) {
					if (list[i] === elem) {
						return i;
					}
				}
				return -1;
			},

			booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

			// Regular expressions

			// http://www.w3.org/TR/css3-selectors/#whitespace
			whitespace = "[\\x20\\t\\r\\n\\f]",

			// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
			identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

			// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
			attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
				// Operator (capture 2)
				"*([*^$|!~]?=)" + whitespace +
				// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
				"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
				"*\\]",

			pseudos = ":(" + identifier + ")(?:\\((" +
				// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
				// 1. quoted (capture 3; capture 4 or capture 5)
				"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
				// 2. simple (capture 6)
				"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
				// 3. anything else (capture 2)
				".*" +
				")\\)|)",

			// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
			rwhitespace = new RegExp(whitespace + "+", "g"),
			rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"),

			rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
			rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"),

			rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"),

			rpseudo = new RegExp(pseudos),
			ridentifier = new RegExp("^" + identifier + "$"),

			matchExpr = {
				"ID": new RegExp("^#(" + identifier + ")"),
				"CLASS": new RegExp("^\\.(" + identifier + ")"),
				"TAG": new RegExp("^(" + identifier + "|[*])"),
				"ATTR": new RegExp("^" + attributes),
				"PSEUDO": new RegExp("^" + pseudos),
				"CHILD": new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
					"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
					"*(\\d+)|))" + whitespace + "*\\)|)", "i"),
				"bool": new RegExp("^(?:" + booleans + ")$", "i"),
				// For use in libraries implementing .is()
				// We use this for POS matching in `select`
				"needsContext": new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
					whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
			},

			rinputs = /^(?:input|select|textarea|button)$/i,
			rheader = /^h\d$/i,

			rnative = /^[^{]+\{\s*\[native \w/,

			// Easily-parseable/retrievable ID or TAG or CLASS selectors
			rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

			rsibling = /[+~]/,
			rescape = /'|\\/g,

			// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
			runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"),
			funescape = function (_, escaped, escapedWhitespace) {
				var high = "0x" + escaped - 0x10000;
				// NaN means non-codepoint
				// Support: Firefox<24
				// Workaround erroneous numeric interpretation of +"0x"
				return high !== high || escapedWhitespace ?
					escaped :
					high < 0 ?
						// BMP codepoint
						String.fromCharCode(high + 0x10000) :
						// Supplemental Plane codepoint (surrogate pair)
						String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
			},

			// Used for iframes
			// See setDocument()
			// Removing the function wrapper causes a "Permission Denied"
			// error in IE
			unloadHandler = function () {
				setDocument();
			};

		// Optimize for push.apply( _, NodeList )
		try {
			push.apply(
				(arr = slice.call(preferredDoc.childNodes)),
				preferredDoc.childNodes
			);
			// Support: Android<4.0
			// Detect silently failing push.apply
			arr[preferredDoc.childNodes.length].nodeType;
		} catch (e) {
			push = {
				apply: arr.length ?

					// Leverage slice if possible
					function (target, els) {
						push_native.apply(target, slice.call(els));
					} :

					// Support: IE<9
					// Otherwise append directly
					function (target, els) {
						var j = target.length,
							i = 0;
						// Can't trust NodeList.length
						while ((target[j++] = els[i++])) { }
						target.length = j - 1;
					}
			};
		}

		function Sizzle(selector, context, results, seed) {
			var m, i, elem, nid, nidselect, match, groups, newSelector,
				newContext = context && context.ownerDocument,

				// nodeType defaults to 9, since context defaults to document
				nodeType = context ? context.nodeType : 9;

			results = results || [];

			// Return early from calls with invalid selector or context
			if (typeof selector !== "string" || !selector ||
				nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

				return results;
			}

			// Try to shortcut find operations (as opposed to filters) in HTML documents
			if (!seed) {

				if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
					setDocument(context);
				}
				context = context || document;

				if (documentIsHTML) {

					// If the selector is sufficiently simple, try using a "get*By*" DOM method
					// (excepting DocumentFragment context, where the methods don't exist)
				if (nodeType !== 11 && (match = rquickExpr.exec(selector))) {

						// ID selector
					if ((m = match[1])) {

							// Document context
						if (nodeType === 9) {
								if ((elem = context.getElementById(m))) {

									// Support: IE, Opera, Webkit
									// TODO: identify versions
									// getElementById can match elements by name instead of ID
								if (elem.id === m) {
									results.push(elem);
									return results;
								}
							} else {
								return results;
							}

								// Element context
						} else {

								// Support: IE, Opera, Webkit
								// TODO: identify versions
								// getElementById can match elements by name instead of ID
								if (newContext && (elem = newContext.getElementById(m)) &&
									contains(context, elem) &&
									elem.id === m) {

								results.push(elem);
								return results;
							}
						}

							// Type selector
					} else if (match[2]) {
						push.apply(results, context.getElementsByTagName(selector));
						return results;

							// Class selector
						} else if ((m = match[3]) && support.getElementsByClassName &&
							context.getElementsByClassName) {

						push.apply(results, context.getElementsByClassName(m));
						return results;
					}
				}

					// Take advantage of querySelectorAll
					if (support.qsa &&
						!compilerCache[selector + " "] &&
						(!rbuggyQSA || !rbuggyQSA.test(selector))) {

						if (nodeType !== 1) {
					newContext = context;
							newSelector = selector;

							// qSA looks outside Element context, which is not what we want
							// Thanks to Andrew Dupont for this workaround technique
							// Support: IE <=8
							// Exclude object elements
						} else if (context.nodeName.toLowerCase() !== "object") {

							// Capture the context ID, setting it first if necessary
							if ((nid = context.getAttribute("id"))) {
								nid = nid.replace(rescape, "\\$&");
						} else {
								context.setAttribute("id", (nid = expando));
						}

							// Prefix every selector in the list
							groups = tokenize(selector);
						i = groups.length;
							nidselect = ridentifier.test(nid) ? "#" + nid : "[id='" + nid + "']";
						while (i--) {
								groups[i] = nidselect + " " + toSelector(groups[i]);
						}
						newSelector = groups.join(",");

							// Expand context for sibling selectors
							newContext = rsibling.test(selector) && testContext(context.parentNode) ||
								context;
					}

					if (newSelector) {
						try {
							push.apply(results,
								newContext.querySelectorAll(newSelector)
							);
							return results;
						} catch (qsaError) {
						} finally {
								if (nid === expando) {
								context.removeAttribute("id");
							}
						}
					}
				}
			}
			}

			// All others
			return select(selector.replace(rtrim, "$1"), context, results, seed);
		}

		/**
		 * Create key-value caches of limited size
		 * @returns {function(string, object)} Returns the Object data after storing it on itself with
		 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
		 *	deleting the oldest entry
		 */
		function createCache() {
			var keys = [];

			function cache(key, value) {
				// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
				if (keys.push(key + " ") > Expr.cacheLength) {
					// Only keep the most recent entries
					delete cache[keys.shift()];
				}
				return (cache[key + " "] = value);
			}
			return cache;
		}

		/**
		 * Mark a function for special use by Sizzle
		 * @param {Function} fn The function to mark
		 */
		function markFunction(fn) {
			fn[expando] = true;
			return fn;
		}

		/**
		 * Support testing using an element
		 * @param {Function} fn Passed the created div and expects a boolean result
		 */
		function assert(fn) {
			var div = document.createElement("div");

			try {
				return !!fn(div);
			} catch (e) {
				return false;
			} finally {
				// Remove from its parent by default
				if (div.parentNode) {
					div.parentNode.removeChild(div);
				}
				// release memory in IE
				div = null;
			}
		}

		/**
		 * Adds the same handler for all of the specified attrs
		 * @param {String} attrs Pipe-separated list of attributes
		 * @param {Function} handler The method that will be applied
		 */
		function addHandle(attrs, handler) {
			var arr = attrs.split("|"),
				i = arr.length;

			while (i--) {
				Expr.attrHandle[arr[i]] = handler;
			}
		}

		/**
		 * Checks document order of two siblings
		 * @param {Element} a
		 * @param {Element} b
		 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
		 */
		function siblingCheck(a, b) {
			var cur = b && a,
				diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
					(~b.sourceIndex || MAX_NEGATIVE) -
					(~a.sourceIndex || MAX_NEGATIVE);

			// Use IE sourceIndex if available on both nodes
			if (diff) {
				return diff;
			}

			// Check if b follows a
			if (cur) {
				while ((cur = cur.nextSibling)) {
					if (cur === b) {
						return -1;
					}
				}
			}

			return a ? 1 : -1;
		}

		/**
		 * Returns a function to use in pseudos for input types
		 * @param {String} type
		 */
		function createInputPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === type;
			};
		}

		/**
		 * Returns a function to use in pseudos for buttons
		 * @param {String} type
		 */
		function createButtonPseudo(type) {
			return function (elem) {
				var name = elem.nodeName.toLowerCase();
				return (name === "input" || name === "button") && elem.type === type;
			};
		}

		/**
		 * Returns a function to use in pseudos for positionals
		 * @param {Function} fn
		 */
		function createPositionalPseudo(fn) {
			return markFunction(function (argument) {
				argument = +argument;
				return markFunction(function (seed, matches) {
					var j,
						matchIndexes = fn([], seed.length, argument),
						i = matchIndexes.length;

					// Match elements found at the specified indexes
					while (i--) {
						if (seed[(j = matchIndexes[i])]) {
							seed[j] = !(matches[j] = seed[j]);
						}
					}
				});
			});
		}

		/**
		 * Checks a node for validity as a Sizzle context
		 * @param {Element|Object=} context
		 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
		 */
		function testContext(context) {
			return context && typeof context.getElementsByTagName !== "undefined" && context;
		}

		// Expose support vars for convenience
		support = Sizzle.support = {};

		/**
		 * Detects XML nodes
		 * @param {Element|Object} elem An element or a document
		 * @returns {Boolean} True iff elem is a non-HTML XML node
		 */
		isXML = Sizzle.isXML = function (elem) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = elem && (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		/**
		 * Sets document-related variables once based on the current document
		 * @param {Element|Object} [doc] An element or document object to use to set the document
		 * @returns {Object} Returns the current document
		 */
		setDocument = Sizzle.setDocument = function (node) {
			var hasCompare, parent,
				doc = node ? node.ownerDocument || node : preferredDoc;

			// Return early if doc is invalid or already selected
			if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
				return document;
			}

			// Update global variables
			document = doc;
			docElem = document.documentElement;
			documentIsHTML = !isXML(document);

			// Support: IE 9-11, Edge
			// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
			if ((parent = document.defaultView) && parent.top !== parent) {
				// Support: IE 11
				if (parent.addEventListener) {
					parent.addEventListener("unload", unloadHandler, false);

					// Support: IE 9 - 10 only
				} else if (parent.attachEvent) {
					parent.attachEvent("onunload", unloadHandler);
				}
			}

			/* Attributes
			---------------------------------------------------------------------- */

			// Support: IE<8
			// Verify that getAttribute really returns attributes and not properties
			// (excepting IE8 booleans)
			support.attributes = assert(function (div) {
				div.className = "i";
				return !div.getAttribute("className");
			});

			/* getElement(s)By*
			---------------------------------------------------------------------- */

			// Check if getElementsByTagName("*") returns only elements
			support.getElementsByTagName = assert(function (div) {
				div.appendChild(document.createComment(""));
				return !div.getElementsByTagName("*").length;
			});

			// Support: IE<9
			support.getElementsByClassName = rnative.test(document.getElementsByClassName);

			// Support: IE<10
			// Check if getElementById returns elements by name
			// The broken getElementById methods don't pick up programatically-set names,
			// so use a roundabout getElementsByName test
			support.getById = assert(function (div) {
				docElem.appendChild(div).id = expando;
				return !document.getElementsByName || !document.getElementsByName(expando).length;
			});

			// ID find and filter
			if (support.getById) {
				Expr.find["ID"] = function (id, context) {
					if (typeof context.getElementById !== "undefined" && documentIsHTML) {
						var m = context.getElementById(id);
						return m ? [m] : [];
					}
				};
				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						return elem.getAttribute("id") === attrId;
					};
				};
			} else {
				// Support: IE6/7
				// getElementById is not reliable as a find shortcut
				delete Expr.find["ID"];

				Expr.filter["ID"] = function (id) {
					var attrId = id.replace(runescape, funescape);
					return function (elem) {
						var node = typeof elem.getAttributeNode !== "undefined" &&
							elem.getAttributeNode("id");
						return node && node.value === attrId;
					};
				};
			}

			// Tag
			Expr.find["TAG"] = support.getElementsByTagName ?
				function (tag, context) {
					if (typeof context.getElementsByTagName !== "undefined") {
						return context.getElementsByTagName(tag);

						// DocumentFragment nodes don't have gEBTN
					} else if (support.qsa) {
						return context.querySelectorAll(tag);
					}
				} :

				function (tag, context) {
					var elem,
						tmp = [],
						i = 0,
						// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
						results = context.getElementsByTagName(tag);

					// Filter out possible comments
					if (tag === "*") {
						while ((elem = results[i++])) {
							if (elem.nodeType === 1) {
								tmp.push(elem);
							}
						}

						return tmp;
					}
					return results;
				};

			// Class
			Expr.find["CLASS"] = support.getElementsByClassName && function (className, context) {
				if (typeof context.getElementsByClassName !== "undefined" && documentIsHTML) {
					return context.getElementsByClassName(className);
				}
			};

			/* QSA/matchesSelector
			---------------------------------------------------------------------- */

			// QSA and matchesSelector support

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			rbuggyMatches = [];

			// qSa(:focus) reports false when true (Chrome 21)
			// We allow this because of a bug in IE8/9 that throws an error
			// whenever `document.activeElement` is accessed on an iframe
			// So, we allow :focus to pass through QSA all the time to avoid the IE error
			// See http://bugs.jquery.com/ticket/13378
			rbuggyQSA = [];

			if ((support.qsa = rnative.test(document.querySelectorAll))) {
				// Build QSA regex
				// Regex strategy adopted from Diego Perini
				assert(function (div) {
					// Select is set to empty string on purpose
					// This is to test IE's treatment of not explicitly
					// setting a boolean content attribute,
					// since its presence should be enough
					// http://bugs.jquery.com/ticket/12359
					docElem.appendChild(div).innerHTML = "<a id='" + expando + "'></a>" +
						"<select id='" + expando + "-\r\\' msallowcapture=''>" +
						"<option selected=''></option></select>";

					// Support: IE8, Opera 11-12.16
					// Nothing should be selected when empty strings follow ^= or $= or *=
					// The test attribute must be unknown in Opera but "safe" for WinRT
					// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
					if (div.querySelectorAll("[msallowcapture^='']").length) {
						rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
					}

					// Support: IE8
					// Boolean attributes and "value" are not treated correctly
					if (!div.querySelectorAll("[selected]").length) {
						rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
					}

					// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
					if (!div.querySelectorAll("[id~=" + expando + "-]").length) {
						rbuggyQSA.push("~=");
					}

					// Webkit/Opera - :checked should return selected option elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					// IE8 throws error here and will not see later tests
					if (!div.querySelectorAll(":checked").length) {
						rbuggyQSA.push(":checked");
					}

					// Support: Safari 8+, iOS 8+
					// https://bugs.webkit.org/show_bug.cgi?id=136851
					// In-page `selector#id sibing-combinator selector` fails
					if (!div.querySelectorAll("a#" + expando + "+*").length) {
						rbuggyQSA.push(".#.+[+~]");
					}
				});

				assert(function (div) {
					// Support: Windows 8 Native Apps
					// The type and name attributes are restricted during .innerHTML assignment
					var input = document.createElement("input");
					input.setAttribute("type", "hidden");
					div.appendChild(input).setAttribute("name", "D");

					// Support: IE8
					// Enforce case-sensitivity of name attribute
					if (div.querySelectorAll("[name=d]").length) {
						rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
					}

					// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
					// IE8 throws error here and will not see later tests
					if (!div.querySelectorAll(":enabled").length) {
						rbuggyQSA.push(":enabled", ":disabled");
					}

					// Opera 10-11 does not throw on post-comma invalid pseudos
					div.querySelectorAll("*,:x");
					rbuggyQSA.push(",.*:");
				});
			}

			if ((support.matchesSelector = rnative.test((matches = docElem.matches ||
				docElem.webkitMatchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector)))) {

				assert(function (div) {
					// Check to see if it's possible to do matchesSelector
					// on a disconnected node (IE 9)
					support.disconnectedMatch = matches.call(div, "div");

					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(div, "[s!='']:x");
					rbuggyMatches.push("!=", pseudos);
				});
			}

			rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
			rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));

			/* Contains
			---------------------------------------------------------------------- */
			hasCompare = rnative.test(docElem.compareDocumentPosition);

			// Element contains another
			// Purposefully self-exclusive
			// As in, an element does not contain itself
			contains = hasCompare || rnative.test(docElem.contains) ?
				function (a, b) {
					var adown = a.nodeType === 9 ? a.documentElement : a,
						bup = b && b.parentNode;
					return a === bup || !!(bup && bup.nodeType === 1 && (
						adown.contains ?
							adown.contains(bup) :
							a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
					));
				} :
				function (a, b) {
					if (b) {
						while ((b = b.parentNode)) {
							if (b === a) {
								return true;
							}
						}
					}
					return false;
				};

			/* Sorting
			---------------------------------------------------------------------- */

			// Document order sorting
			sortOrder = hasCompare ?
			function (a, b) {

				// Flag for duplicate removal
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				// Sort on method existence if only one input has compareDocumentPosition
				var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
				if (compare) {
					return compare;
				}

				// Calculate position if both inputs belong to the same document
				compare = (a.ownerDocument || a) === (b.ownerDocument || b) ?
					a.compareDocumentPosition(b) :

					// Otherwise we know they are disconnected
					1;

				// Disconnected nodes
				if (compare & 1 ||
					(!support.sortDetached && b.compareDocumentPosition(a) === compare)) {

					// Choose the first element that is related to our preferred document
					if (a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
						return -1;
					}
					if (b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
						return 1;
					}

					// Maintain original order
					return sortInput ?
						(indexOf(sortInput, a) - indexOf(sortInput, b)) :
						0;
				}

				return compare & 4 ? -1 : 1;
			} :
			function (a, b) {
				// Exit early if the nodes are identical
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				var cur,
					i = 0,
					aup = a.parentNode,
					bup = b.parentNode,
					ap = [a],
					bp = [b];

				// Parentless nodes are either documents or disconnected
				if (!aup || !bup) {
					return a === document ? -1 :
						b === document ? 1 :
						aup ? -1 :
						bup ? 1 :
						sortInput ?
						(indexOf(sortInput, a) - indexOf(sortInput, b)) :
						0;

					// If the nodes are siblings, we can do a quick check
				} else if (aup === bup) {
					return siblingCheck(a, b);
				}

				// Otherwise we need full lists of their ancestors for comparison
				cur = a;
				while ((cur = cur.parentNode)) {
					ap.unshift(cur);
				}
				cur = b;
				while ((cur = cur.parentNode)) {
					bp.unshift(cur);
				}

				// Walk down the tree looking for a discrepancy
				while (ap[i] === bp[i]) {
					i++;
				}

				return i ?
					// Do a sibling check if the nodes have a common ancestor
					siblingCheck(ap[i], bp[i]) :

					// Otherwise nodes in our document sort first
					ap[i] === preferredDoc ? -1 :
					bp[i] === preferredDoc ? 1 :
					0;
			};

			return document;
		};

		Sizzle.matches = function (expr, elements) {
			return Sizzle(expr, null, null, elements);
		};

		Sizzle.matchesSelector = function (elem, expr) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			// Make sure that attribute selectors are quoted
			expr = expr.replace(rattributeQuotes, "='$1']");

			if (support.matchesSelector && documentIsHTML &&
				!compilerCache[expr + " "] &&
				(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
				(!rbuggyQSA || !rbuggyQSA.test(expr))) {

				try {
					var ret = matches.call(elem, expr);

					// IE 9's matchesSelector returns false on disconnected nodes
					if (ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
							elem.document && elem.document.nodeType !== 11) {
						return ret;
					}
				} catch (e) { }
			}

			return Sizzle(expr, document, null, [elem]).length > 0;
		};

		Sizzle.contains = function (context, elem) {
			// Set document vars if needed
			if ((context.ownerDocument || context) !== document) {
				setDocument(context);
			}
			return contains(context, elem);
		};

		Sizzle.attr = function (elem, name) {
			// Set document vars if needed
			if ((elem.ownerDocument || elem) !== document) {
				setDocument(elem);
			}

			var fn = Expr.attrHandle[name.toLowerCase()],
				// Don't get fooled by Object.prototype properties (jQuery #13807)
				val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
					fn(elem, name, !documentIsHTML) :
					undefined;

			return val !== undefined ?
				val :
				support.attributes || !documentIsHTML ?
					elem.getAttribute(name) :
					(val = elem.getAttributeNode(name)) && val.specified ?
						val.value :
						null;
		};

		Sizzle.error = function (msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
		 * Document sorting and removing duplicates
		 * @param {ArrayLike} results
		 */
		Sizzle.uniqueSort = function (results) {
			var elem,
				duplicates = [],
				j = 0,
				i = 0;

			// Unless we *know* we can detect duplicates, assume their presence
			hasDuplicate = !support.detectDuplicates;
			sortInput = !support.sortStable && results.slice(0);
			results.sort(sortOrder);

			if (hasDuplicate) {
				while ((elem = results[i++])) {
					if (elem === results[i]) {
						j = duplicates.push(i);
					}
				}
				while (j--) {
					results.splice(duplicates[j], 1);
				}
			}

			// Clear input after sorting to release objects
			// See https://github.com/jquery/sizzle/pull/225
			sortInput = null;

			return results;
		};

		/**
		 * Utility function for retrieving the text value of an array of DOM nodes
		 * @param {Array|Element} elem
		 */
		getText = Sizzle.getText = function (elem) {
			var node,
				ret = "",
				i = 0,
				nodeType = elem.nodeType;

			if (!nodeType) {
				// If no nodeType, this is expected to be an array
				while ((node = elem[i++])) {
					// Do not traverse comment nodes
					ret += getText(node);
				}
			} else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
				// Use textContent for elements
				// innerText usage removed for consistency of new lines (jQuery #11153)
				if (typeof elem.textContent === "string") {
					return elem.textContent;
				} else {
					// Traverse its children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						ret += getText(elem);
					}
				}
			} else if (nodeType === 3 || nodeType === 4) {
				return elem.nodeValue;
			}
			// Do not include comment or processing instruction nodes

			return ret;
		};

		Expr = Sizzle.selectors = {

			// Can be adjusted by the user
			cacheLength: 50,

			createPseudo: markFunction,

			match: matchExpr,

			attrHandle: {},

			find: {},

			relative: {
				">": { dir: "parentNode", first: true },
				" ": { dir: "parentNode" },
				"+": { dir: "previousSibling", first: true },
				"~": { dir: "previousSibling" }
			},

			preFilter: {
				"ATTR": function (match) {
					match[1] = match[1].replace(runescape, funescape);

					// Move the given value to match[3] whether quoted or unquoted
					match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);

					if (match[2] === "~=") {
						match[3] = " " + match[3] + " ";
					}

					return match.slice(0, 4);
				},

				"CHILD": function (match) {
					/* matches from matchExpr["CHILD"]
						1 type (only|nth|...)
						2 what (child|of-type)
						3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
						4 xn-component of xn+y argument ([+-]?\d*n|)
						5 sign of xn-component
						6 x of xn-component
						7 sign of y-component
						8 y of y-component
					*/
					match[1] = match[1].toLowerCase();

					if (match[1].slice(0, 3) === "nth") {
						// nth-* requires argument
						if (!match[3]) {
							Sizzle.error(match[0]);
						}

						// numeric x and y parameters for Expr.filter.CHILD
						// remember that false/true cast respectively to 0/1
						match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
						match[5] = +((match[7] + match[8]) || match[3] === "odd");

						// other types prohibit arguments
					} else if (match[3]) {
						Sizzle.error(match[0]);
					}

					return match;
				},

				"PSEUDO": function (match) {
					var excess,
						unquoted = !match[6] && match[2];

					if (matchExpr["CHILD"].test(match[0])) {
						return null;
					}

					// Accept quoted arguments as-is
					if (match[3]) {
						match[2] = match[4] || match[5] || "";

						// Strip excess characters from unquoted arguments
					} else if (unquoted && rpseudo.test(unquoted) &&
						// Get excess from tokenize (recursively)
						(excess = tokenize(unquoted, true)) &&
						// advance to the next closing parenthesis
						(excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {

						// excess is a negative index
						match[0] = match[0].slice(0, excess);
						match[2] = unquoted.slice(0, excess);
					}

					// Return only captures needed by the pseudo filter method (type and argument)
					return match.slice(0, 3);
				}
			},

			filter: {

				"TAG": function (nodeNameSelector) {
					var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
					return nodeNameSelector === "*" ?
						function () { return true; } :
						function (elem) {
							return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
						};
				},

				"CLASS": function (className) {
					var pattern = classCache[className + " "];

					return pattern ||
						(pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) &&
						classCache(className, function (elem) {
							return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "");
						});
				},

				"ATTR": function (name, operator, check) {
					return function (elem) {
						var result = Sizzle.attr(elem, name);

						if (result == null) {
							return operator === "!=";
						}
						if (!operator) {
							return true;
						}

						result += "";

						return operator === "=" ? result === check :
							operator === "!=" ? result !== check :
							operator === "^=" ? check && result.indexOf(check) === 0 :
							operator === "*=" ? check && result.indexOf(check) > -1 :
							operator === "$=" ? check && result.slice(-check.length) === check :
							operator === "~=" ? (" " + result.replace(rwhitespace, " ") + " ").indexOf(check) > -1 :
							operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" :
							false;
					};
				},

				"CHILD": function (type, what, argument, first, last) {
					var simple = type.slice(0, 3) !== "nth",
						forward = type.slice(-4) !== "last",
						ofType = what === "of-type";

					return first === 1 && last === 0 ?

						// Shortcut for :nth-*(n)
						function (elem) {
							return !!elem.parentNode;
						} :

						function (elem, context, xml) {
							var cache, uniqueCache, outerCache, node, nodeIndex, start,
								dir = simple !== forward ? "nextSibling" : "previousSibling",
								parent = elem.parentNode,
								name = ofType && elem.nodeName.toLowerCase(),
								useCache = !xml && !ofType,
								diff = false;

							if (parent) {

								// :(first|last|only)-(child|of-type)
								if (simple) {
									while (dir) {
										node = elem;
										while ((node = node[dir])) {
											if (ofType ?
												node.nodeName.toLowerCase() === name :
												node.nodeType === 1) {

												return false;
											}
										}
										// Reverse direction for :only-* (if we haven't yet done so)
										start = dir = type === "only" && !start && "nextSibling";
									}
									return true;
								}

								start = [forward ? parent.firstChild : parent.lastChild];

								// non-xml :nth-child(...) stores cache data on `parent`
								if (forward && useCache) {

									// Seek `elem` from a previously-cached index

									// ...in a gzip-friendly way
									node = parent;
									outerCache = node[expando] || (node[expando] = {});

									// Support: IE <9 only
									// Defend against cloned attroperties (jQuery gh-1709)
									uniqueCache = outerCache[node.uniqueID] ||
										(outerCache[node.uniqueID] = {});

									cache = uniqueCache[type] || [];
									nodeIndex = cache[0] === dirruns && cache[1];
									diff = nodeIndex && cache[2];
									node = nodeIndex && parent.childNodes[nodeIndex];

									while ((node = ++nodeIndex && node && node[dir] ||

										// Fallback to seeking `elem` from the start
										(diff = nodeIndex = 0) || start.pop())) {

										// When found, cache indexes on `parent` and break
										if (node.nodeType === 1 && ++diff && node === elem) {
											uniqueCache[type] = [dirruns, nodeIndex, diff];
											break;
										}
									}

								} else {
									// Use previously-cached element index if available
									if (useCache) {
										// ...in a gzip-friendly way
										node = elem;
										outerCache = node[expando] || (node[expando] = {});

										// Support: IE <9 only
										// Defend against cloned attroperties (jQuery gh-1709)
										uniqueCache = outerCache[node.uniqueID] ||
											(outerCache[node.uniqueID] = {});

										cache = uniqueCache[type] || [];
										nodeIndex = cache[0] === dirruns && cache[1];
										diff = nodeIndex;
									}

									// xml :nth-child(...)
									// or :nth-last-child(...) or :nth(-last)?-of-type(...)
									if (diff === false) {
									// Use the same loop as above to seek `elem` from the start
									while ((node = ++nodeIndex && node && node[dir] ||
										(diff = nodeIndex = 0) || start.pop())) {

											if ((ofType ?
												node.nodeName.toLowerCase() === name :
												node.nodeType === 1) &&
												++diff) {

											// Cache the index of each encountered element
											if (useCache) {
													outerCache = node[expando] || (node[expando] = {});

													// Support: IE <9 only
													// Defend against cloned attroperties (jQuery gh-1709)
													uniqueCache = outerCache[node.uniqueID] ||
														(outerCache[node.uniqueID] = {});

													uniqueCache[type] = [dirruns, diff];
											}

											if (node === elem) {
												break;
											}
										}
									}
								}
								}

								// Incorporate the offset, then check against cycle size
								diff -= last;
								return diff === first || (diff % first === 0 && diff / first >= 0);
							}
						};
				},

				"PSEUDO": function (pseudo, argument) {
					// pseudo-class names are case-insensitive
					// http://www.w3.org/TR/selectors/#pseudo-classes
					// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
					// Remember that setFilters inherits from pseudos
					var args,
						fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
							Sizzle.error("unsupported pseudo: " + pseudo);

					// The user may use createPseudo to indicate that
					// arguments are needed to create the filter function
					// just as Sizzle does
					if (fn[expando]) {
						return fn(argument);
					}

					// But maintain support for old signatures
					if (fn.length > 1) {
						args = [pseudo, pseudo, "", argument];
						return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
							markFunction(function (seed, matches) {
								var idx,
									matched = fn(seed, argument),
									i = matched.length;
								while (i--) {
									idx = indexOf(seed, matched[i]);
									seed[idx] = !(matches[idx] = matched[i]);
								}
							}) :
							function (elem) {
								return fn(elem, 0, args);
							};
					}

					return fn;
				}
			},

			pseudos: {
				// Potentially complex pseudos
				"not": markFunction(function (selector) {
					// Trim the selector passed to compile
					// to avoid treating leading and trailing
					// spaces as combinators
					var input = [],
						results = [],
						matcher = compile(selector.replace(rtrim, "$1"));

					return matcher[expando] ?
						markFunction(function (seed, matches, context, xml) {
							var elem,
								unmatched = matcher(seed, null, xml, []),
								i = seed.length;

							// Match elements unmatched by `matcher`
							while (i--) {
								if ((elem = unmatched[i])) {
									seed[i] = !(matches[i] = elem);
								}
							}
						}) :
						function (elem, context, xml) {
							input[0] = elem;
							matcher(input, null, xml, results);
							// Don't keep the element (issue #299)
							input[0] = null;
							return !results.pop();
						};
				}),

				"has": markFunction(function (selector) {
					return function (elem) {
						return Sizzle(selector, elem).length > 0;
					};
				}),

				"contains": markFunction(function (text) {
					text = text.replace(runescape, funescape);
					return function (elem) {
						return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
					};
				}),

				// "Whether an element is represented by a :lang() selector
				// is based solely on the element's language value
				// being equal to the identifier C,
				// or beginning with the identifier C immediately followed by "-".
				// The matching of C against the element's language value is performed case-insensitively.
				// The identifier C does not have to be a valid language name."
				// http://www.w3.org/TR/selectors/#lang-pseudo
				"lang": markFunction(function (lang) {
					// lang value must be a valid identifier
					if (!ridentifier.test(lang || "")) {
						Sizzle.error("unsupported lang: " + lang);
					}
					lang = lang.replace(runescape, funescape).toLowerCase();
					return function (elem) {
						var elemLang;
						do {
							if ((elemLang = documentIsHTML ?
								elem.lang :
								elem.getAttribute("xml:lang") || elem.getAttribute("lang"))) {

								elemLang = elemLang.toLowerCase();
								return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
							}
						} while ((elem = elem.parentNode) && elem.nodeType === 1);
						return false;
					};
				}),

				// Miscellaneous
				"target": function (elem) {
					var hash = window.location && window.location.hash;
					return hash && hash.slice(1) === elem.id;
				},

				"root": function (elem) {
					return elem === docElem;
				},

				"focus": function (elem) {
					return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
				},

				// Boolean properties
				"enabled": function (elem) {
					return elem.disabled === false;
				},

				"disabled": function (elem) {
					return elem.disabled === true;
				},

				"checked": function (elem) {
					// In CSS3, :checked should return both checked and selected elements
					// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
					var nodeName = elem.nodeName.toLowerCase();
					return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
				},

				"selected": function (elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex;
					}

					return elem.selected === true;
				},

				// Contents
				"empty": function (elem) {
					// http://www.w3.org/TR/selectors/#empty-pseudo
					// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
					//   but not by others (comment: 8; processing instruction: 7; etc.)
					// nodeType < 6 works because attributes (2) do not appear as children
					for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
						if (elem.nodeType < 6) {
							return false;
						}
					}
					return true;
				},

				"parent": function (elem) {
					return !Expr.pseudos["empty"](elem);
				},

				// Element/input types
				"header": function (elem) {
					return rheader.test(elem.nodeName);
				},

				"input": function (elem) {
					return rinputs.test(elem.nodeName);
				},

				"button": function (elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && elem.type === "button" || name === "button";
				},

				"text": function (elem) {
					var attr;
					return elem.nodeName.toLowerCase() === "input" &&
						elem.type === "text" &&

						// Support: IE<8
						// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
						((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
				},

				// Position-in-collection
				"first": createPositionalPseudo(function () {
					return [0];
				}),

				"last": createPositionalPseudo(function (matchIndexes, length) {
					return [length - 1];
				}),

				"eq": createPositionalPseudo(function (matchIndexes, length, argument) {
					return [argument < 0 ? argument + length : argument];
				}),

				"even": createPositionalPseudo(function (matchIndexes, length) {
					var i = 0;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"odd": createPositionalPseudo(function (matchIndexes, length) {
					var i = 1;
					for (; i < length; i += 2) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"lt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; --i >= 0;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				}),

				"gt": createPositionalPseudo(function (matchIndexes, length, argument) {
					var i = argument < 0 ? argument + length : argument;
					for (; ++i < length;) {
						matchIndexes.push(i);
					}
					return matchIndexes;
				})
			}
		};

		Expr.pseudos["nth"] = Expr.pseudos["eq"];

		// Add button/input type pseudos
		for (i in { radio: true, checkbox: true, file: true, password: true, image: true }) {
			Expr.pseudos[i] = createInputPseudo(i);
		}
		for (i in { submit: true, reset: true }) {
			Expr.pseudos[i] = createButtonPseudo(i);
		}

		// Easy API for creating new setFilters
		function setFilters() { }
		setFilters.prototype = Expr.filters = Expr.pseudos;
		Expr.setFilters = new setFilters();

		tokenize = Sizzle.tokenize = function (selector, parseOnly) {
			var matched, match, tokens, type,
				soFar, groups, preFilters,
				cached = tokenCache[selector + " "];

			if (cached) {
				return parseOnly ? 0 : cached.slice(0);
			}

			soFar = selector;
			groups = [];
			preFilters = Expr.preFilter;

			while (soFar) {

				// Comma and first run
				if (!matched || (match = rcomma.exec(soFar))) {
					if (match) {
						// Don't consume trailing commas as valid
						soFar = soFar.slice(match[0].length) || soFar;
					}
					groups.push((tokens = []));
				}

				matched = false;

				// Combinators
				if ((match = rcombinators.exec(soFar))) {
					matched = match.shift();
					tokens.push({
						value: matched,
						// Cast descendant combinators to space
						type: match[0].replace(rtrim, " ")
					});
					soFar = soFar.slice(matched.length);
				}

				// Filters
				for (type in Expr.filter) {
					if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
						(match = preFilters[type](match)))) {
						matched = match.shift();
						tokens.push({
							value: matched,
							type: type,
							matches: match
						});
						soFar = soFar.slice(matched.length);
					}
				}

				if (!matched) {
					break;
				}
			}

			// Return the length of the invalid excess
			// if we're just parsing
			// Otherwise, throw an error or return tokens
			return parseOnly ?
				soFar.length :
				soFar ?
					Sizzle.error(selector) :
					// Cache the tokens
					tokenCache(selector, groups).slice(0);
		};

		function toSelector(tokens) {
			var i = 0,
				len = tokens.length,
				selector = "";
			for (; i < len; i++) {
				selector += tokens[i].value;
			}
			return selector;
		}

		function addCombinator(matcher, combinator, base) {
			var dir = combinator.dir,
				checkNonElements = base && dir === "parentNode",
				doneName = done++;

			return combinator.first ?
				// Check against closest ancestor/preceding element
				function (elem, context, xml) {
					while ((elem = elem[dir])) {
						if (elem.nodeType === 1 || checkNonElements) {
							return matcher(elem, context, xml);
						}
					}
				} :

				// Check against all ancestor/preceding elements
				function (elem, context, xml) {
					var oldCache, uniqueCache, outerCache,
						newCache = [dirruns, doneName];

					// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
					if (xml) {
						while ((elem = elem[dir])) {
							if (elem.nodeType === 1 || checkNonElements) {
								if (matcher(elem, context, xml)) {
									return true;
								}
							}
						}
					} else {
						while ((elem = elem[dir])) {
							if (elem.nodeType === 1 || checkNonElements) {
								outerCache = elem[expando] || (elem[expando] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[elem.uniqueID] || (outerCache[elem.uniqueID] = {});

								if ((oldCache = uniqueCache[dir]) &&
									oldCache[0] === dirruns && oldCache[1] === doneName) {

									// Assign to newCache so results back-propagate to previous elements
									return (newCache[2] = oldCache[2]);
								} else {
									// Reuse newcache so results back-propagate to previous elements
									uniqueCache[dir] = newCache;

									// A match means we're done; a fail means we have to keep checking
									if ((newCache[2] = matcher(elem, context, xml))) {
										return true;
									}
								}
							}
						}
					}
				};
		}

		function elementMatcher(matchers) {
			return matchers.length > 1 ?
				function (elem, context, xml) {
					var i = matchers.length;
					while (i--) {
						if (!matchers[i](elem, context, xml)) {
							return false;
						}
					}
					return true;
				} :
				matchers[0];
		}

		function multipleContexts(selector, contexts, results) {
			var i = 0,
				len = contexts.length;
			for (; i < len; i++) {
				Sizzle(selector, contexts[i], results);
			}
			return results;
		}

		function condense(unmatched, map, filter, context, xml) {
			var elem,
				newUnmatched = [],
				i = 0,
				len = unmatched.length,
				mapped = map != null;

			for (; i < len; i++) {
				if ((elem = unmatched[i])) {
					if (!filter || filter(elem, context, xml)) {
						newUnmatched.push(elem);
						if (mapped) {
							map.push(i);
						}
					}
				}
			}

			return newUnmatched;
		}

		function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
			if (postFilter && !postFilter[expando]) {
				postFilter = setMatcher(postFilter);
			}
			if (postFinder && !postFinder[expando]) {
				postFinder = setMatcher(postFinder, postSelector);
			}
			return markFunction(function (seed, results, context, xml) {
				var temp, i, elem,
					preMap = [],
					postMap = [],
					preexisting = results.length,

					// Get initial elements from seed or context
					elems = seed || multipleContexts(selector || "*", context.nodeType ? [context] : context, []),

					// Prefilter to get matcher input, preserving a map for seed-results synchronization
					matcherIn = preFilter && (seed || !selector) ?
						condense(elems, preMap, preFilter, context, xml) :
						elems,

					matcherOut = matcher ?
						// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
						postFinder || (seed ? preFilter : preexisting || postFilter) ?

							// ...intermediate processing is necessary
							[] :

							// ...otherwise use results directly
					results :
						matcherIn;

				// Find primary matches
				if (matcher) {
					matcher(matcherIn, matcherOut, context, xml);
				}

				// Apply postFilter
				if (postFilter) {
					temp = condense(matcherOut, postMap);
					postFilter(temp, [], context, xml);

					// Un-match failing elements by moving them back to matcherIn
					i = temp.length;
					while (i--) {
						if ((elem = temp[i])) {
							matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
						}
					}
				}

				if (seed) {
					if (postFinder || preFilter) {
						if (postFinder) {
							// Get the final matcherOut by condensing this intermediate into postFinder contexts
							temp = [];
							i = matcherOut.length;
							while (i--) {
								if ((elem = matcherOut[i])) {
									// Restore matcherIn since elem is not yet a final match
									temp.push((matcherIn[i] = elem));
								}
							}
							postFinder(null, (matcherOut = []), temp, xml);
						}

						// Move matched elements from seed to results to keep them synchronized
						i = matcherOut.length;
						while (i--) {
							if ((elem = matcherOut[i]) &&
								(temp = postFinder ? indexOf(seed, elem) : preMap[i]) > -1) {

								seed[temp] = !(results[temp] = elem);
							}
						}
					}

					// Add elements to results, through postFinder if defined
				} else {
					matcherOut = condense(
						matcherOut === results ?
							matcherOut.splice(preexisting, matcherOut.length) :
							matcherOut
					);
					if (postFinder) {
						postFinder(null, results, matcherOut, xml);
					} else {
						push.apply(results, matcherOut);
					}
				}
			});
		}

		function matcherFromTokens(tokens) {
			var checkContext, matcher, j,
				len = tokens.length,
				leadingRelative = Expr.relative[tokens[0].type],
				implicitRelative = leadingRelative || Expr.relative[" "],
				i = leadingRelative ? 1 : 0,

				// The foundational matcher ensures that elements are reachable from top-level context(s)
				matchContext = addCombinator(function (elem) {
					return elem === checkContext;
				}, implicitRelative, true),
				matchAnyContext = addCombinator(function (elem) {
					return indexOf(checkContext, elem) > -1;
				}, implicitRelative, true),
				matchers = [function (elem, context, xml) {
					var ret = (!leadingRelative && (xml || context !== outermostContext)) || (
						(checkContext = context).nodeType ?
							matchContext(elem, context, xml) :
							matchAnyContext(elem, context, xml));
					// Avoid hanging onto element (issue #299)
					checkContext = null;
					return ret;
				}];

			for (; i < len; i++) {
				if ((matcher = Expr.relative[tokens[i].type])) {
					matchers = [addCombinator(elementMatcher(matchers), matcher)];
				} else {
					matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

					// Return special upon seeing a positional matcher
					if (matcher[expando]) {
						// Find the next relative operator (if any) for proper handling
						j = ++i;
						for (; j < len; j++) {
							if (Expr.relative[tokens[j].type]) {
								break;
							}
						}
						return setMatcher(
							i > 1 && elementMatcher(matchers),
							i > 1 && toSelector(
								// If the preceding token was a descendant combinator, insert an implicit any-element `*`
								tokens.slice(0, i - 1).concat({ value: tokens[i - 2].type === " " ? "*" : "" })
							).replace(rtrim, "$1"),
							matcher,
							i < j && matcherFromTokens(tokens.slice(i, j)),
							j < len && matcherFromTokens((tokens = tokens.slice(j))),
							j < len && toSelector(tokens)
						);
					}
					matchers.push(matcher);
				}
			}

			return elementMatcher(matchers);
		}

		function matcherFromGroupMatchers(elementMatchers, setMatchers) {
			var bySet = setMatchers.length > 0,
				byElement = elementMatchers.length > 0,
				superMatcher = function (seed, context, xml, results, outermost) {
					var elem, j, matcher,
						matchedCount = 0,
						i = "0",
						unmatched = seed && [],
						setMatched = [],
						contextBackup = outermostContext,
						// We must always have either seed elements or outermost context
						elems = seed || byElement && Expr.find["TAG"]("*", outermost),
						// Use integer dirruns iff this is the outermost matcher
						dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
						len = elems.length;

					if (outermost) {
						outermostContext = context === document || context || outermost;
					}

					// Add elements passing elementMatchers directly to results
					// Support: IE<9, Safari
					// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
					for (; i !== len && (elem = elems[i]) != null; i++) {
						if (byElement && elem) {
							j = 0;
							if (!context && elem.ownerDocument !== document) {
								setDocument(elem);
								xml = !documentIsHTML;
							}
							while ((matcher = elementMatchers[j++])) {
								if (matcher(elem, context || document, xml)) {
									results.push(elem);
									break;
								}
							}
							if (outermost) {
								dirruns = dirrunsUnique;
							}
						}

						// Track unmatched elements for set filters
						if (bySet) {
							// They will have gone through all possible matchers
							if ((elem = !matcher && elem)) {
								matchedCount--;
							}

							// Lengthen the array for every element, matched or not
							if (seed) {
								unmatched.push(elem);
							}
						}
					}

					// `i` is now the count of elements visited above, and adding it to `matchedCount`
					// makes the latter nonnegative.
					matchedCount += i;

					// Apply set filters to unmatched elements
					// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
					// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
					// no element matchers and no seed.
					// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
					// case, which will result in a "00" `matchedCount` that differs from `i` but is also
					// numerically zero.
					if (bySet && i !== matchedCount) {
						j = 0;
						while ((matcher = setMatchers[j++])) {
							matcher(unmatched, setMatched, context, xml);
						}

						if (seed) {
							// Reintegrate element matches to eliminate the need for sorting
							if (matchedCount > 0) {
								while (i--) {
									if (!(unmatched[i] || setMatched[i])) {
										setMatched[i] = pop.call(results);
									}
								}
							}

							// Discard index placeholder values to get only actual matches
							setMatched = condense(setMatched);
						}

						// Add matches to results
						push.apply(results, setMatched);

						// Seedless set matches succeeding multiple successful matchers stipulate sorting
						if (outermost && !seed && setMatched.length > 0 &&
							(matchedCount + setMatchers.length) > 1) {

							Sizzle.uniqueSort(results);
						}
					}

					// Override manipulation of globals by nested matchers
					if (outermost) {
						dirruns = dirrunsUnique;
						outermostContext = contextBackup;
					}

					return unmatched;
				};

			return bySet ?
				markFunction(superMatcher) :
				superMatcher;
		}

		compile = Sizzle.compile = function (selector, match /* Internal Use Only */) {
			var i,
				setMatchers = [],
				elementMatchers = [],
				cached = compilerCache[selector + " "];

			if (!cached) {
				// Generate a function of recursive functions that can be used to check each element
				if (!match) {
					match = tokenize(selector);
				}
				i = match.length;
				while (i--) {
					cached = matcherFromTokens(match[i]);
					if (cached[expando]) {
						setMatchers.push(cached);
					} else {
						elementMatchers.push(cached);
					}
				}

				// Cache the compiled function
				cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));

				// Save selector and tokenization
				cached.selector = selector;
			}
			return cached;
		};

		/**
		 * A low-level selection function that works with Sizzle's compiled
		 *  selector functions
		 * @param {String|Function} selector A selector or a pre-compiled
		 *  selector function built with Sizzle.compile
		 * @param {Element} context
		 * @param {Array} [results]
		 * @param {Array} [seed] A set of elements to match against
		 */
		select = Sizzle.select = function (selector, context, results, seed) {
			var i, tokens, token, type, find,
				compiled = typeof selector === "function" && selector,
				match = !seed && tokenize((selector = compiled.selector || selector));

			results = results || [];

			// Try to minimize operations if there is only one selector in the list and no seed
			// (the latter of which guarantees us context)
			if (match.length === 1) {

				// Reduce context if the leading compound selector is an ID
				tokens = match[0] = match[0].slice(0);
				if (tokens.length > 2 && (token = tokens[0]).type === "ID" &&
						support.getById && context.nodeType === 9 && documentIsHTML &&
						Expr.relative[tokens[1].type]) {

					context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
					if (!context) {
						return results;

						// Precompiled matchers will still verify ancestry, so step up a level
					} else if (compiled) {
						context = context.parentNode;
					}

					selector = selector.slice(tokens.shift().value.length);
				}

				// Fetch a seed set for right-to-left matching
				i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
				while (i--) {
					token = tokens[i];

					// Abort if we hit a combinator
					if (Expr.relative[(type = token.type)]) {
						break;
					}
					if ((find = Expr.find[type])) {
						// Search, expanding context for leading sibling combinators
						if ((seed = find(
							token.matches[0].replace(runescape, funescape),
							rsibling.test(tokens[0].type) && testContext(context.parentNode) || context
						))) {

							// If seed is empty or no tokens remain, we can return early
							tokens.splice(i, 1);
							selector = seed.length && toSelector(tokens);
							if (!selector) {
								push.apply(results, seed);
								return results;
							}

							break;
						}
					}
				}
			}

			// Compile and execute a filtering function if one is not provided
			// Provide `match` to avoid retokenization if we modified the selector above
			(compiled || compile(selector, match))(
				seed,
				context,
				!documentIsHTML,
				results,
				!context || rsibling.test(selector) && testContext(context.parentNode) || context
			);
			return results;
		};

		// One-time assignments

		// Sort stability
		support.sortStable = expando.split("").sort(sortOrder).join("") === expando;

		// Support: Chrome 14-35+
		// Always assume duplicates if they aren't passed to the comparison function
		support.detectDuplicates = !!hasDuplicate;

		// Initialize against the default document
		setDocument();

		// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
		// Detached nodes confoundingly follow *each other*
		support.sortDetached = assert(function (div1) {
			// Should return 1, but returns 4 (following)
			return div1.compareDocumentPosition(document.createElement("div")) & 1;
		});

		// Support: IE<8
		// Prevent attribute/property "interpolation"
		// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
		if (!assert(function (div) {
			div.innerHTML = "<a href='#'></a>";
			return div.firstChild.getAttribute("href") === "#";
		})) {
			addHandle("type|href|height|width", function (elem, name, isXML) {
				if (!isXML) {
					return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
				}
			});
		}

		// Support: IE<9
		// Use defaultValue in place of getAttribute("value")
		if (!support.attributes || !assert(function (div) {
			div.innerHTML = "<input/>";
			div.firstChild.setAttribute("value", "");
			return div.firstChild.getAttribute("value") === "";
		})) {
			addHandle("value", function (elem, name, isXML) {
				if (!isXML && elem.nodeName.toLowerCase() === "input") {
					return elem.defaultValue;
				}
			});
		}

		// Support: IE<9
		// Use getAttributeNode to fetch booleans when getAttribute lies
		if (!assert(function (div) {
			return div.getAttribute("disabled") == null;
		})) {
			addHandle(booleans, function (elem, name, isXML) {
				var val;
				if (!isXML) {
					return elem[name] === true ? name.toLowerCase() :
							(val = elem.getAttributeNode(name)) && val.specified ?
							val.value :
						null;
				}
			});
		}

		return Sizzle;

	})(window);



	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;



	var dir = function (elem, dir, until) {
		var matched = [],
			truncate = until !== undefined;

		while ((elem = elem[dir]) && elem.nodeType !== 9) {
			if (elem.nodeType === 1) {
				if (truncate && jQuery(elem).is(until)) {
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	};


	var siblings = function (n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) {
				matched.push(n);
			}
		}

		return matched;
	};


	var rneedsContext = jQuery.expr.match.needsContext;

	var rsingleTag = (/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/);



	var risSimple = /^.[^:#\[\.,]*$/;

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, not) {
		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function (elem, i) {
				/* jshint -W018 */
				return !!qualifier.call(elem, i, elem) !== not;
			});

		}

		if (qualifier.nodeType) {
			return jQuery.grep(elements, function (elem) {
				return (elem === qualifier) !== not;
			});

		}

		if (typeof qualifier === "string") {
			if (risSimple.test(qualifier)) {
				return jQuery.filter(qualifier, elements, not);
			}

			qualifier = jQuery.filter(qualifier, elements);
		}

		return jQuery.grep(elements, function (elem) {
			return (indexOf.call(qualifier, elem) > -1) !== not;
		});
	}

	jQuery.filter = function (expr, elems, not) {
		var elem = elems[0];

		if (not) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
			jQuery.find.matches(expr, jQuery.grep(elems, function (elem) {
				return elem.nodeType === 1;
			}));
	};

	jQuery.fn.extend({
		find: function (selector) {
			var i,
				len = this.length,
				ret = [],
				self = this;

			if (typeof selector !== "string") {
				return this.pushStack(jQuery(selector).filter(function () {
					for (i = 0; i < len; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				}));
			}

			for (i = 0; i < len; i++) {
				jQuery.find(selector, self[i], ret);
			}

			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function (selector) {
			return this.pushStack(winnow(this, selector || [], false));
		},
		not: function (selector) {
			return this.pushStack(winnow(this, selector || [], true));
		},
		is: function (selector) {
			return !!winnow(
				this,

				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test(selector) ?
					jQuery(selector) :
					selector || [],
				false
			).length;
		}
	});


	// Initialize a jQuery object


	// A central reference to the root jQuery(document)
	var rootjQuery,

		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		init = jQuery.fn.init = function (selector, context, root) {
			var match, elem;

			// HANDLE: $(""), $(null), $(undefined), $(false)
			if (!selector) {
				return this;
			}

			// Method init() accepts an alternate rootjQuery
			// so migrate can support jQuery.sub (gh-2101)
			root = root || rootjQuery;

			// Handle HTML strings
			if (typeof selector === "string") {
				if (selector[0] === "<" &&
					selector[selector.length - 1] === ">" &&
					selector.length >= 3) {

					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [null, selector, null];

				} else {
					match = rquickExpr.exec(selector);
				}

				// Match html or make sure no context is specified for #id
				if (match && (match[1] || !context)) {

					// HANDLE: $(html) -> $(array)
					if (match[1]) {
						context = context instanceof jQuery ? context[0] : context;

						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge(this, jQuery.parseHTML(
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						));

						// HANDLE: $(html, props)
						if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
							for (match in context) {

								// Properties of context are called as methods if possible
								if (jQuery.isFunction(this[match])) {
									this[match](context[match]);

									// ...and otherwise set as attributes
								} else {
									this.attr(match, context[match]);
								}
							}
						}

						return this;

						// HANDLE: $(#id)
					} else {
						elem = document.getElementById(match[2]);

						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if (elem && elem.parentNode) {

							// Inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}

						this.context = document;
						this.selector = selector;
						return this;
					}

					// HANDLE: $(expr, $(...))
				} else if (!context || context.jquery) {
					return (context || root).find(selector);

					// HANDLE: $(expr, context)
					// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor(context).find(selector);
				}

				// HANDLE: $(DOMElement)
			} else if (selector.nodeType) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;

				// HANDLE: $(function)
				// Shortcut for document ready
			} else if (jQuery.isFunction(selector)) {
				return root.ready !== undefined ?
					root.ready(selector) :

					// Execute immediately if ready is not present
					selector(jQuery);
			}

			if (selector.selector !== undefined) {
				this.selector = selector.selector;
				this.context = selector.context;
			}

			return jQuery.makeArray(selector, this);
		};

	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;

	// Initialize central reference
	rootjQuery = jQuery(document);


	var rparentsprev = /^(?:parents|prev(?:Until|All))/,

		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};

	jQuery.fn.extend({
		has: function (target) {
			var targets = jQuery(target, this),
				l = targets.length;

			return this.filter(function () {
				var i = 0;
				for (; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		closest: function (selectors, context) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test(selectors) || typeof selectors !== "string" ?
					jQuery(selectors, context || this.context) :
					0;

			for (; i < l; i++) {
				for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

					// Always skip document fragments
					if (cur.nodeType < 11 && (pos ?
						pos.index(cur) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector(cur, selectors))) {

						matched.push(cur);
						break;
					}
				}
			}

			return this.pushStack(matched.length > 1 ? jQuery.uniqueSort(matched) : matched);
		},

		// Determine the position of an element within the set
		index: function (elem) {

			// No argument, return index in parent
			if (!elem) {
				return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
			}

			// Index in selector
			if (typeof elem === "string") {
				return indexOf.call(jQuery(elem), this[0]);
			}

			// Locate the position of the desired element
			return indexOf.call(this,

				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[0] : elem
			);
		},

		add: function (selector, context) {
			return this.pushStack(
				jQuery.uniqueSort(
					jQuery.merge(this.get(), jQuery(selector, context))
				)
			);
		},

		addBack: function (selector) {
			return this.add(selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		}
	});

	function sibling(cur, dir) {
		while ((cur = cur[dir]) && cur.nodeType !== 1) { }
		return cur;
	}

	jQuery.each({
		parent: function (elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function (elem) {
			return dir(elem, "parentNode");
		},
		parentsUntil: function (elem, i, until) {
			return dir(elem, "parentNode", until);
		},
		next: function (elem) {
			return sibling(elem, "nextSibling");
		},
		prev: function (elem) {
			return sibling(elem, "previousSibling");
		},
		nextAll: function (elem) {
			return dir(elem, "nextSibling");
		},
		prevAll: function (elem) {
			return dir(elem, "previousSibling");
		},
		nextUntil: function (elem, i, until) {
			return dir(elem, "nextSibling", until);
		},
		prevUntil: function (elem, i, until) {
			return dir(elem, "previousSibling", until);
		},
		siblings: function (elem) {
			return siblings((elem.parentNode || {}).firstChild, elem);
		},
		children: function (elem) {
			return siblings(elem.firstChild);
		},
		contents: function (elem) {
			return elem.contentDocument || jQuery.merge([], elem.childNodes);
		}
	}, function (name, fn) {
		jQuery.fn[name] = function (until, selector) {
			var matched = jQuery.map(this, fn, until);

			if (name.slice(-5) !== "Until") {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				matched = jQuery.filter(selector, matched);
			}

			if (this.length > 1) {

				// Remove duplicates
				if (!guaranteedUnique[name]) {
					jQuery.uniqueSort(matched);
				}

				// Reverse order for parents* and prev-derivatives
				if (rparentsprev.test(name)) {
					matched.reverse();
				}
			}

			return this.pushStack(matched);
		};
	});
	var rnotwhite = (/\S+/g);



	// Convert String-formatted options into Object-formatted ones
	function createOptions(options) {
		var object = {};
		jQuery.each(options.match(rnotwhite) || [], function (_, flag) {
			object[flag] = true;
		});
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function (options) {

		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			createOptions(options) :
			jQuery.extend({}, options);

		var // Flag to know if list is currently firing
			firing,

			// Last fire value for non-forgettable lists
			memory,

			// Flag to know if list was already fired
			fired,

			// Flag to prevent firing
			locked,

			// Actual callback list
			list = [],

			// Queue of execution data for repeatable lists
			queue = [],

			// Index of currently firing callback (modified by add/remove as needed)
			firingIndex = -1,

			// Fire callbacks
			fire = function () {

				// Enforce single-firing
				locked = options.once;

				// Execute callbacks for all pending executions,
				// respecting firingIndex overrides and runtime changes
				fired = firing = true;
				for (; queue.length; firingIndex = -1) {
					memory = queue.shift();
					while (++firingIndex < list.length) {

						// Run callback and check for early termination
						if (list[firingIndex].apply(memory[0], memory[1]) === false &&
							options.stopOnFalse) {

							// Jump to end and forget the data so .add doesn't re-fire
							firingIndex = list.length;
							memory = false;
					}
				}
						}

				// Forget the data if we're done with it
				if (!options.memory) {
					memory = false;
				}

				firing = false;

				// Clean up if we're done firing for good
				if (locked) {

					// Keep an empty list if we have data for future add calls
					if (memory) {
						list = [];

						// Otherwise, this object is spent
					} else {
						list = "";
					}
				}
			},

			// Actual Callbacks object
			self = {

				// Add a callback or a collection of callbacks to the list
				add: function () {
					if (list) {

						// If we have memory from a past run, we should fire after adding
						if (memory && !firing) {
							firingIndex = list.length - 1;
							queue.push(memory);
						}

						(function add(args) {
							jQuery.each(args, function (_, arg) {
								if (jQuery.isFunction(arg)) {
									if (!options.unique || !self.has(arg)) {
										list.push(arg);
									}
								} else if (arg && arg.length && jQuery.type(arg) !== "string") {

									// Inspect recursively
									add(arg);
								}
							});
						})(arguments);

						if (memory && !firing) {
							fire();
						}
					}
					return this;
				},

				// Remove a callback from the list
				remove: function () {
						jQuery.each(arguments, function (_, arg) {
							var index;
							while ((index = jQuery.inArray(arg, list, index)) > -1) {
								list.splice(index, 1);

								// Handle firing indexes
									if (index <= firingIndex) {
										firingIndex--;
									}
								}
						});
					return this;
				},

				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function (fn) {
					return fn ?
						jQuery.inArray(fn, list) > -1 :
						list.length > 0;
				},

				// Remove all callbacks from the list
				empty: function () {
					if (list) {
					list = [];
					}
					return this;
				},

				// Disable .fire and .add
				// Abort any current/pending executions
				// Clear all callbacks and values
				disable: function () {
					locked = queue = [];
					list = memory = "";
					return this;
				},
				disabled: function () {
					return !list;
				},

				// Disable .fire
				// Also disable .add unless we have memory (since it would have no effect)
				// Abort any pending executions
				lock: function () {
					locked = queue = [];
					if (!memory) {
						list = memory = "";
					}
					return this;
				},
				locked: function () {
					return !!locked;
				},

				// Call all callbacks with the given context and arguments
				fireWith: function (context, args) {
					if (!locked) {
						args = args || [];
						args = [context, args.slice ? args.slice() : args];
						queue.push(args);
						if (!firing) {
							fire();
						}
					}
					return this;
				},

				// Call all the callbacks with the given arguments
				fire: function () {
					self.fireWith(this, arguments);
					return this;
				},

				// To know if the callbacks have already been called at least once
				fired: function () {
					return !!fired;
				}
			};

		return self;
	};


	jQuery.extend({

		Deferred: function (func) {
			var tuples = [

					// action, add listener, listener list, final state
					["resolve", "done", jQuery.Callbacks("once memory"), "resolved"],
					["reject", "fail", jQuery.Callbacks("once memory"), "rejected"],
					["notify", "progress", jQuery.Callbacks("memory")]
			],
				state = "pending",
				promise = {
					state: function () {
						return state;
					},
					always: function () {
						deferred.done(arguments).fail(arguments);
						return this;
					},
					then: function ( /* fnDone, fnFail, fnProgress */) {
						var fns = arguments;
						return jQuery.Deferred(function (newDefer) {
							jQuery.each(tuples, function (i, tuple) {
								var fn = jQuery.isFunction(fns[i]) && fns[i];

								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[tuple[1]](function () {
									var returned = fn && fn.apply(this, arguments);
									if (returned && jQuery.isFunction(returned.promise)) {
										returned.promise()
											.progress(newDefer.notify)
											.done(newDefer.resolve)
											.fail(newDefer.reject);
									} else {
										newDefer[tuple[0] + "With"](
											this === promise ? newDefer.promise() : this,
											fn ? [returned] : arguments
										);
									}
								});
							});
							fns = null;
						}).promise();
					},

					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function (obj) {
						return obj != null ? jQuery.extend(obj, promise) : promise;
					}
				},
				deferred = {};

			// Keep pipe for back-compat
			promise.pipe = promise.then;

			// Add list-specific methods
			jQuery.each(tuples, function (i, tuple) {
				var list = tuple[2],
					stateString = tuple[3];

				// promise[ done | fail | progress ] = list.add
				promise[tuple[1]] = list.add;

				// Handle state
				if (stateString) {
					list.add(function () {

						// state = [ resolved | rejected ]
						state = stateString;

						// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
				}

				// deferred[ resolve | reject | notify ]
				deferred[tuple[0]] = function () {
					deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
					return this;
				};
				deferred[tuple[0] + "With"] = list.fireWith;
			});

			// Make the deferred a promise
			promise.promise(deferred);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when: function (subordinate /* , ..., subordinateN */) {
			var i = 0,
				resolveValues = slice.call(arguments),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 ||
					(subordinate && jQuery.isFunction(subordinate.promise)) ? length : 0,

				// the master Deferred.
				// If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function (i, contexts, values) {
					return function (value) {
						contexts[i] = this;
						values[i] = arguments.length > 1 ? slice.call(arguments) : value;
						if (values === progressValues) {
							deferred.notifyWith(contexts, values);
						} else if (!(--remaining)) {
							deferred.resolveWith(contexts, values);
						}
					};
				},

				progressValues, progressContexts, resolveContexts;

			// Add listeners to Deferred subordinates; treat others as resolved
			if (length > 1) {
				progressValues = new Array(length);
				progressContexts = new Array(length);
				resolveContexts = new Array(length);
				for (; i < length; i++) {
					if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
						resolveValues[i].promise()
							.progress(updateFunc(i, progressContexts, progressValues))
							.done(updateFunc(i, resolveContexts, resolveValues))
							.fail(deferred.reject);
					} else {
						--remaining;
					}
				}
			}

			// If we're not waiting on anything, resolve the master
			if (!remaining) {
				deferred.resolveWith(resolveContexts, resolveValues);
			}

			return deferred.promise();
		}
	});


	// The deferred used on DOM ready
	var readyList;

	jQuery.fn.ready = function (fn) {

		// Add the callback
		jQuery.ready.promise().done(fn);

		return this;
	};

	jQuery.extend({

		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function (hold) {
			if (hold) {
				jQuery.readyWait++;
			} else {
				jQuery.ready(true);
			}
		},

		// Handle when the DOM is ready
		ready: function (wait) {

			// Abort if there are pending holds or we're already ready
			if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
				return;
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if (wait !== true && --jQuery.readyWait > 0) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [jQuery]);

			// Trigger any bound ready events
			if (jQuery.fn.triggerHandler) {
				jQuery(document).triggerHandler("ready");
				jQuery(document).off("ready");
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener("DOMContentLoaded", completed);
		window.removeEventListener("load", completed);
		jQuery.ready();
	}

	jQuery.ready.promise = function (obj) {
		if (!readyList) {

			readyList = jQuery.Deferred();

			// Catch cases where $(document).ready() is called
			// after the browser event has already occurred.
			// Support: IE9-10 only
			// Older IE sometimes signals "interactive" too soon
			if (document.readyState === "complete" ||
				(document.readyState !== "loading" && !document.documentElement.doScroll)) {

				// Handle it asynchronously to allow scripts the opportunity to delay ready
				window.setTimeout(jQuery.ready);

			} else {

				// Use the handy event callback
				document.addEventListener("DOMContentLoaded", completed);

				// A fallback to window.onload, that will always work
				window.addEventListener("load", completed);
			}
		}
		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();




	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
			len = elems.length,
			bulk = key == null;

		// Sets many values
		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;
			}

			if (bulk) {

				// Bulk operations run against the entire set
				if (raw) {
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {
					bulk = fn;
					fn = function (elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < len; i++) {
					fn(
						elems[i], key, raw ?
						value :
						value.call(elems[i], i, fn(elems[i], key))
					);
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call(elems) :
				len ? fn(elems[0], key) : emptyGet;
	};
	var acceptData = function (owner) {

		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !(+owner.nodeType);
	};




	function Data() {
		this.expando = jQuery.expando + Data.uid++;
	}

	Data.uid = 1;

	Data.prototype = {

		register: function (owner, initial) {
			var value = initial || {};

			// If it is a node unlikely to be stringify-ed or looped over
			// use plain assignment
			if (owner.nodeType) {
				owner[this.expando] = value;

				// Otherwise secure it in a non-enumerable, non-writable property
				// configurability must be true to allow the property to be
				// deleted with the delete operator
			} else {
				Object.defineProperty(owner, this.expando, {
					value: value,
					writable: true,
					configurable: true
				});
			}
			return owner[this.expando];
		},
		cache: function (owner) {

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if (!acceptData(owner)) {
				return {};
			}

			// Check if the owner object already has a cache
			var value = owner[this.expando];

			// If not, create one
			if (!value) {
				value = {};

				// We can accept data for non-element nodes in modern browsers,
				// but we should not, see #8335.
				// Always return an empty object.
				if (acceptData(owner)) {

					// If it is a node unlikely to be stringify-ed or looped over
					// use plain assignment
					if (owner.nodeType) {
						owner[this.expando] = value;

						// Otherwise secure it in a non-enumerable property
						// configurable must be true to allow the property to be
						// deleted when data is removed
					} else {
						Object.defineProperty(owner, this.expando, {
							value: value,
							configurable: true
						});
				}
			}
			}

			return value;
		},
		set: function (owner, data, value) {
			var prop,
				cache = this.cache(owner);

			// Handle: [ owner, key, value ] args
			if (typeof data === "string") {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {

				// Copy the properties one-by-one to the cache object
					for (prop in data) {
						cache[prop] = data[prop];
					}
				}
			return cache;
		},
		get: function (owner, key) {
			return key === undefined ?
				this.cache(owner) :
				owner[this.expando] && owner[this.expando][key];
		},
		access: function (owner, key, value) {
			var stored;

			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined ||
					((key && typeof key === "string") && value === undefined)) {

				stored = this.get(owner, key);

				return stored !== undefined ?
					stored : this.get(owner, jQuery.camelCase(key));
			}

			// When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function (owner, key) {
			var i, name, camel,
				cache = owner[this.expando];

			if (cache === undefined) {
				return;
			}

			if (key === undefined) {
				this.register(owner);

			} else {

				// Support array or space separated string of keys
				if (jQuery.isArray(key)) {

					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(jQuery.camelCase));
				} else {
					camel = jQuery.camelCase(key);

					// Try the string as a key before any manipulation
					if (key in cache) {
						name = [key, camel];
					} else {

						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[name] : (name.match(rnotwhite) || []);
					}
				}

				i = name.length;

				while (i--) {
					delete cache[name[i]];
				}
			}

			// Remove the expando if there's no more data
			if (key === undefined || jQuery.isEmptyObject(cache)) {

				// Support: Chrome <= 35-45+
				// Webkit & Blink performance suffers when deleting properties
				// from DOM nodes, so set to undefined instead
				// https://code.google.com/p/chromium/issues/detail?id=378607
				if (owner.nodeType) {
					owner[this.expando] = undefined;
				} else {
					delete owner[this.expando];
				}
			}
		},
		hasData: function (owner) {
			var cache = owner[this.expando];
			return cache !== undefined && !jQuery.isEmptyObject(cache);
		}
	};
	var dataPriv = new Data();

	var dataUser = new Data();



	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /[A-Z]/g;

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$&").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :

						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test(data) ? jQuery.parseJSON(data) :
						data;
				} catch (e) { }

				// Make sure we set the data so it isn't changed later
				dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	jQuery.extend({
		hasData: function (elem) {
			return dataUser.hasData(elem) || dataPriv.hasData(elem);
		},

		data: function (elem, name, data) {
			return dataUser.access(elem, name, data);
		},

		removeData: function (elem, name) {
			dataUser.remove(elem, name);
		},

		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPriv methods, these can be deprecated.
		_data: function (elem, name, data) {
			return dataPriv.access(elem, name, data);
		},

		_removeData: function (elem, name) {
			dataPriv.remove(elem, name);
		}
	});

	jQuery.fn.extend({
		data: function (key, value) {
			var i, name, data,
				elem = this[0],
				attrs = elem && elem.attributes;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = dataUser.get(elem);

					if (elem.nodeType === 1 && !dataPriv.get(elem, "hasDataAttrs")) {
						i = attrs.length;
						while (i--) {

							// Support: IE11+
							// The attrs elements can be null (#14894)
							if (attrs[i]) {
								name = attrs[i].name;
								if (name.indexOf("data-") === 0) {
									name = jQuery.camelCase(name.slice(5));
									dataAttr(elem, name, data[name]);
								}
							}
						}
						dataPriv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if (typeof key === "object") {
				return this.each(function () {
					dataUser.set(this, key);
				});
			}

			return access(this, function (value) {
				var data, camelKey;

				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {

					// Attempt to get data from the cache
					// with the key as-is
					data = dataUser.get(elem, key) ||

						// Try to find dashed key if it exists (gh-2779)
						// This is for 2.2.x only
						dataUser.get(elem, key.replace(rmultiDash, "-$&").toLowerCase());

					if (data !== undefined) {
						return data;
					}

					camelKey = jQuery.camelCase(key);

					// Attempt to get data from the cache
					// with the key camelized
					data = dataUser.get(elem, camelKey);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, camelKey, undefined);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				camelKey = jQuery.camelCase(key);
				this.each(function () {

					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = dataUser.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					dataUser.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf("-") > -1 && data !== undefined) {
						dataUser.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},

		removeData: function (key) {
			return this.each(function () {
				dataUser.remove(this, key);
			});
		}
	});


	jQuery.extend({
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || "fx") + "queue";
				queue = dataPriv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || jQuery.isArray(data)) {
						queue = dataPriv.access(elem, type, jQuery.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks(elem, type),
				next = function () {
					jQuery.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function (elem, type) {
			var key = type + "queueHooks";
			return dataPriv.get(elem, key) || dataPriv.access(elem, key, {
				empty: jQuery.Callbacks("once memory").add(function () {
					dataPriv.remove(elem, [type + "queue", key]);
				})
			});
		}
	});

	jQuery.fn.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== "string") {
				data = type;
				type = "fx";
				setter--;
			}

			if (arguments.length < setter) {
				return jQuery.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = jQuery.queue(this, type, data);

					// Ensure a hooks for this queue
					jQuery._queueHooks(this, type);

					if (type === "fx" && queue[0] !== "inprogress") {
						jQuery.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				jQuery.dequeue(this, type);
			});
		},
		clearQueue: function (type) {
			return this.queue(type || "fx", []);
		},

		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function () {
					if (!(--count)) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== "string") {
				obj = type;
				type = undefined;
			}
			type = type || "fx";

			while (i--) {
				tmp = dataPriv.get(elements[i], type + "queueHooks");
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

	var rcssNum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i");


	var cssExpand = ["Top", "Right", "Bottom", "Left"];

	var isHidden = function (elem, el) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css(elem, "display") === "none" ||
			!jQuery.contains(elem.ownerDocument, elem);
	};



	function adjustCSS(elem, prop, valueParts, tween) {
		var adjusted,
			scale = 1,
			maxIterations = 20,
			currentValue = tween ?
				function () { return tween.cur(); } :
				function () { return jQuery.css(elem, prop, ""); },
			initial = currentValue(),
			unit = valueParts && valueParts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

			// Starting value computation is required for potential unit mismatches
			initialInUnit = (jQuery.cssNumber[prop] || unit !== "px" && +initial) &&
				rcssNum.exec(jQuery.css(elem, prop));

		if (initialInUnit && initialInUnit[3] !== unit) {

			// Trust units reported by jQuery.css
			unit = unit || initialInUnit[3];

			// Make sure we update the tween properties later on
			valueParts = valueParts || [];

			// Iteratively approximate from a nonzero starting point
			initialInUnit = +initial || 1;

			do {

				// If previous iteration zeroed out, double until we get *something*.
				// Use string for doubling so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				initialInUnit = initialInUnit / scale;
				jQuery.style(elem, prop, initialInUnit + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// Break the loop if scale is unchanged or perfect, or if we've just had enough.
			} while (
				scale !== (scale = currentValue() / initial) && scale !== 1 && --maxIterations
			);
		}

		if (valueParts) {
			initialInUnit = +initialInUnit || +initial || 0;

			// Apply relative offset (+=/-=) if specified
			adjusted = valueParts[1] ?
				initialInUnit + (valueParts[1] + 1) * valueParts[2] :
				+valueParts[2];
			if (tween) {
				tween.unit = unit;
				tween.start = initialInUnit;
				tween.end = adjusted;
			}
		}
		return adjusted;
	}
	var rcheckableType = (/^(?:checkbox|radio)$/i);

	var rtagName = (/<([\w:-]+)/);

	var rscriptType = (/^$|\/(?:java|ecma)script/i);



	// We have to close these tags to support XHTML (#13200)
	var wrapMap = {

		// Support: IE9
		option: [1, "<select multiple='multiple'>", "</select>"],

		// XHTML parsers do not magically insert elements in the
		// same way that tag soup parsers do. So we cannot shorten
		// this by omitting <tbody> or other required elements.
		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

	// Support: IE9
	wrapMap.optgroup = wrapMap.option;

	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;


	function getAll(context, tag) {

		// Support: IE9-11+
		// Use typeof to avoid zero-argument method invocation on host objects (#15151)
		var ret = typeof context.getElementsByTagName !== "undefined" ?
				context.getElementsByTagName(tag || "*") :
				typeof context.querySelectorAll !== "undefined" ?
					context.querySelectorAll(tag || "*") :
				[];

		return tag === undefined || tag && jQuery.nodeName(context, tag) ?
			jQuery.merge([context], ret) :
			ret;
	}


	// Mark scripts as having already been evaluated
	function setGlobalEval(elems, refElements) {
		var i = 0,
			l = elems.length;

		for (; i < l; i++) {
			dataPriv.set(
				elems[i],
				"globalEval",
				!refElements || dataPriv.get(refElements[i], "globalEval")
			);
		}
	}


	var rhtml = /<|&#?\w+;/;

	function buildFragment(elems, context, scripts, selection, ignored) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for (; i < l; i++) {
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") {

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) {
					nodes.push(context.createTextNode(elem));

					// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div"));

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default;
					tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while (j--) {
						tmp = tmp.lastChild;
					}

					// Support: Android<4.1, PhantomJS<2
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ((elem = nodes[i++])) {

			// Skip elements already in the context collection (trac-4087)
			if (selection && jQuery.inArray(elem, selection) > -1) {
				if (ignored) {
					ignored.push(elem);
				}
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) {
				j = 0;
				while ((elem = tmp[j++])) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	}


	(function () {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild(document.createElement("div")),
			input = document.createElement("input");

		// Support: Android 4.0-4.3, Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute("type", "radio");
		input.setAttribute("checked", "checked");
		input.setAttribute("name", "t");

		div.appendChild(input);

		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;

		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
	})();


	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	// Support: IE9
	// See #13393 for more info
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch (err) { }
	}

	function on(elem, types, selector, data, fn, one) {
		var origFn, type;

		// Types can be a map of types/handlers
		if (typeof types === "object") {

			// ( types-Object, selector, data )
			if (typeof selector !== "string") {

				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for (type in types) {
				on(elem, type, selector, data, types[type], one);
			}
			return elem;
		}

		if (data == null && fn == null) {

			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if (fn == null) {
			if (typeof selector === "string") {

				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {

				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if (fn === false) {
			fn = returnFalse;
		} else if (!fn) {
			return elem;
		}

		if (one === 1) {
			origFn = fn;
			fn = function (event) {

				// Can use an empty set, since event contains the info
				jQuery().off(event);
				return origFn.apply(this, arguments);
			};

			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
		}
		return elem.each(function () {
			jQuery.event.add(this, types, fn, data, selector);
		});
	}

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		global: {},

		add: function (elem, types, handler, data, selector) {

			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.get(elem);

			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if (!elemData) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			if (!(events = elemData.events)) {
				events = elemData.events = {};
			}
			if (!(eventHandle = elemData.handle)) {
				eventHandle = elemData.handle = function (e) {

					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply(elem, arguments) : undefined;
				};
			}

			// Handle multiple events separated by a space
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// There *must* be a type, no attaching namespace-only handlers
				if (!type) {
					continue;
				}

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = (selector ? special.delegateType : special.bindType) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test(selector),
					namespace: namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				if (!(handlers = events[type])) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener if the special events handler returns false
					if (!special.setup ||
						special.setup.call(elem, data, namespaces, eventHandle) === false) {

						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}

		},

		// Detach an event or set of events from an element
		remove: function (elem, types, handler, selector, mappedTypes) {

			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = dataPriv.hasData(elem) && dataPriv.get(elem);

			if (!elemData || !(events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = (types || "").match(rnotwhite) || [""];
			t = types.length;
			while (t--) {
				tmp = rtypenamespace.exec(types[t]) || [];
				type = origType = tmp[1];
				namespaces = (tmp[2] || "").split(".").sort();

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = (selector ? special.delegateType : special.bindType) || type;
				handlers = events[type] || [];
				tmp = tmp[2] &&
					new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");

				// Remove matching events
				origCount = j = handlers.length;
				while (j--) {
					handleObj = handlers[j];

					if ((mappedTypes || origType === handleObj.origType) &&
						(!handler || handler.guid === handleObj.guid) &&
						(!tmp || tmp.test(handleObj.namespace)) &&
						(!selector || selector === handleObj.selector ||
							selector === "**" && handleObj.selector)) {
						handlers.splice(j, 1);

						if (handleObj.selector) {
							handlers.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (origCount && !handlers.length) {
					if (!special.teardown ||
						special.teardown.call(elem, namespaces, elemData.handle) === false) {

						jQuery.removeEvent(elem, type, elemData.handle);
					}

					delete events[type];
				}
			}

			// Remove data and the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				dataPriv.remove(elem, "handle events");
			}
		},

		dispatch: function (event) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix(event);

			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call(arguments),
				handlers = (dataPriv.get(this, "events") || {})[event.type] || [],
				special = jQuery.event.special[event.type] || {};

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if (special.preDispatch && special.preDispatch.call(this, event) === false) {
				return;
			}

			// Determine handlers
			handlerQueue = jQuery.event.handlers.call(this, event, handlers);

			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
				event.currentTarget = matched.elem;

				j = 0;
				while ((handleObj = matched.handlers[j++]) &&
					!event.isImmediatePropagationStopped()) {

					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if (!event.rnamespace || event.rnamespace.test(handleObj.namespace)) {

						event.handleObj = handleObj;
						event.data = handleObj.data;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle ||
							handleObj.handler).apply(matched.elem, args);

						if (ret !== undefined) {
							if ((event.result = ret) === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			// Call the postDispatch hook for the mapped type
			if (special.postDispatch) {
				special.postDispatch.call(this, event);
			}

			return event.result;
		},

		handlers: function (event, handlers) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;

			// Support (at least): Chrome, IE9
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			//
			// Support: Firefox<=42+
			// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
			if (delegateCount && cur.nodeType &&
				(event.type !== "click" || isNaN(event.button) || event.button < 1)) {

				for (; cur !== this; cur = cur.parentNode || this) {

					// Don't check non-elements (#13208)
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
						matches = [];
						for (i = 0; i < delegateCount; i++) {
							handleObj = handlers[i];

							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";

							if (matches[sel] === undefined) {
								matches[sel] = handleObj.needsContext ?
									jQuery(sel, this).index(cur) > -1 :
									jQuery.find(sel, this, null, [cur]).length;
							}
							if (matches[sel]) {
								matches.push(handleObj);
							}
						}
						if (matches.length) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if (delegateCount < handlers.length) {
				handlerQueue.push({ elem: this, handlers: handlers.slice(delegateCount) });
			}

			return handlerQueue;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		props: ("altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
			"metaKey relatedTarget shiftKey target timeStamp view which").split(" "),

		fixHooks: {},

		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function (event, original) {

				// Add which for key events
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks: {
			props: ("button buttons clientX clientY offsetX offsetY pageX pageY " +
				"screenX screenY toElement").split(" "),
			filter: function (event, original) {
				var eventDoc, doc, body,
					button = original.button;

				// Calculate pageX/Y if missing and clientX/Y available
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX +
						(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
						(doc && doc.clientLeft || body && body.clientLeft || 0);
					event.pageY = original.clientY +
						(doc && doc.scrollTop || body && body.scrollTop || 0) -
						(doc && doc.clientTop || body && body.clientTop || 0);
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if (!event.which && button !== undefined) {
					event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
				}

				return event;
			}
		},

		fix: function (event) {
			if (event[jQuery.expando]) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[type];

			if (!fixHook) {
				this.fixHooks[type] = fixHook =
					rmouseEvent.test(type) ? this.mouseHooks :
					rkeyEvent.test(type) ? this.keyHooks :
				{};
			}
			copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = new jQuery.Event(originalEvent);

			i = copy.length;
			while (i--) {
				prop = copy[i];
				event[prop] = originalEvent[prop];
			}

			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if (!event.target) {
				event.target = document;
			}

			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special: {
			load: {

				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {

				// Fire native event if possible so blur/focus sequence is correct
				trigger: function () {
					if (this !== safeActiveElement() && this.focus) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function () {
					if (this === safeActiveElement() && this.blur) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {

				// For checkbox, fire native event so checked state will be right
				trigger: function () {
					if (this.type === "checkbox" && this.click && jQuery.nodeName(this, "input")) {
						this.click();
						return false;
					}
				},

				// For cross-browser consistency, don't fire native .click() on links
				_default: function (event) {
					return jQuery.nodeName(event.target, "a");
				}
			},

			beforeunload: {
				postDispatch: function (event) {

					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if (event.result !== undefined && event.originalEvent) {
						event.originalEvent.returnValue = event.result;
					}
			}
			}
		}
	};

	jQuery.removeEvent = function (elem, type, handle) {

		// This "if" is needed for plain objects
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle);
		}
	};

	jQuery.Event = function (src, props) {

		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&

					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		constructor: jQuery.Event,
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,

		preventDefault: function () {
			var e = this.originalEvent;

			this.isDefaultPrevented = returnTrue;

			if (e) {
				e.preventDefault();
			}
		},
		stopPropagation: function () {
			var e = this.originalEvent;

			this.isPropagationStopped = returnTrue;

			if (e) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function () {
			var e = this.originalEvent;

			this.isImmediatePropagationStopped = returnTrue;

			if (e) {
				e.stopImmediatePropagation();
			}

			this.stopPropagation();
		}
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	// so that event delegation works in jQuery.
	// Do the same for pointerenter/pointerleave and pointerover/pointerout
	//
	// Support: Safari 7 only
	// Safari sends mouseenter too often; see:
	// https://code.google.com/p/chromium/issues/detail?id=470258
	// for the description of the bug (it existed in older Chrome versions as well).
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (orig, fix) {
		jQuery.event.special[orig] = {
			delegateType: fix,
			bindType: fix,

			handle: function (event) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;

				// For mouseenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || (related !== target && !jQuery.contains(target, related))) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	jQuery.fn.extend({
		on: function (types, selector, data, fn) {
			return on(this, types, selector, data, fn);
		},
		one: function (types, selector, data, fn) {
			return on(this, types, selector, data, fn, 1);
		},
		off: function (types, selector, fn) {
			var handleObj, type;
			if (types && types.preventDefault && types.handleObj) {

				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(
					handleObj.namespace ?
						handleObj.origType + "." + handleObj.namespace :
						handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if (typeof types === "object") {

				// ( types-object [, selector] )
				for (type in types) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {

				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function () {
				jQuery.event.remove(this, types, fn, selector);
			});
		}
	});


	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

		// Support: IE 10-11, Edge 10240+
		// In IE/Edge using regex groups here causes severe slowdowns.
		// See https://connect.microsoft.com/IE/feedback/details/1736512/
		rnoInnerhtml = /<script|<style|<link/i,

		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

	// Manipulating tables requires a tbody
	function manipulationTarget(elem, content) {
		return jQuery.nodeName(elem, "table") &&
			jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ?

			elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody")) :
			elem;
	}

	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript(elem) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript(elem) {
		var match = rscriptTypeMasked.exec(elem.type);

		if (match) {
			elem.type = match[1];
		} else {
			elem.removeAttribute("type");
		}

		return elem;
	}

	function cloneCopyEvent(src, dest) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

		if (dest.nodeType !== 1) {
			return;
		}

		// 1. Copy private data: events, handlers, etc.
		if (dataPriv.hasData(src)) {
			pdataOld = dataPriv.access(src);
			pdataCur = dataPriv.set(dest, pdataOld);
			events = pdataOld.events;

			if (events) {
				delete pdataCur.handle;
				pdataCur.events = {};

				for (type in events) {
					for (i = 0, l = events[type].length; i < l; i++) {
						jQuery.event.add(dest, type, events[type][i]);
					}
				}
			}
		}

		// 2. Copy user data
		if (dataUser.hasData(src)) {
			udataOld = dataUser.access(src);
			udataCur = jQuery.extend({}, udataOld);

			dataUser.set(dest, udataCur);
	}
	}

	// Fix IE bugs, see support tests
	function fixInput(src, dest) {
		var nodeName = dest.nodeName.toLowerCase();

		// Fails to persist the checked state of a cloned checkbox or radio button.
		if (nodeName === "input" && rcheckableType.test(src.type)) {
			dest.checked = src.checked;

			// Fails to return the selected option to the default selected state when cloning options
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}
	}

	function domManip(collection, args, callback, ignored) {

		// Flatten any nested arrays
		args = concat.apply([], args);

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = collection.length,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value);

		// We can't cloneNode fragments that contain checked, in WebKit
		if (isFunction ||
				(l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test(value))) {
			return collection.each(function (index) {
				var self = collection.eq(index);
				if (isFunction) {
					args[0] = value.call(this, index, self.html());
				}
				domManip(self, args, callback, ignored);
			});
		}

		if (l) {
			fragment = buildFragment(args, collection[0].ownerDocument, false, collection, ignored);
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			// Require either new content or an interest in ignored elements to invoke the callback
			if (first || ignored) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript);
				hasScripts = scripts.length;

				// Use the original fragment for the last item
				// instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true);

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {

							// Support: Android<4.1, PhantomJS<2
							// push.apply(_, arraylike) throws on ancient WebKit
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(collection[i], node, i);
	}

				if (hasScripts) {
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") &&
							!dataPriv.access(node, "globalEval") &&
							jQuery.contains(doc, node)) {

							if (node.src) {

								// Optional AJAX dependency, but won't run scripts if not present
								if (jQuery._evalUrl) {
									jQuery._evalUrl(node.src);
								}
							} else {
								jQuery.globalEval(node.textContent.replace(rcleanScript, ""));
							}
						}
					}
				}
			}
		}

		return collection;
	}

	function remove(elem, selector, keepData) {
		var node,
			nodes = selector ? jQuery.filter(selector, elem) : elem,
			i = 0;

		for (; (node = nodes[i]) != null; i++) {
			if (!keepData && node.nodeType === 1) {
				jQuery.cleanData(getAll(node));
			}

			if (node.parentNode) {
				if (keepData && jQuery.contains(node.ownerDocument, node)) {
					setGlobalEval(getAll(node, "script"));
				}
				node.parentNode.removeChild(node);
			}
		}

		return elem;
	}

	jQuery.extend({
		htmlPrefilter: function (html) {
			return html.replace(rxhtmlTag, "<$1></$2>");
		},

		clone: function (elem, dataAndEvents, deepDataAndEvents) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode(true),
				inPage = jQuery.contains(elem.ownerDocument, elem);

			// Fix IE cloning issues
			if (!support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) &&
					!jQuery.isXMLDoc(elem)) {

				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll(clone);
				srcElements = getAll(elem);

				for (i = 0, l = srcElements.length; i < l; i++) {
					fixInput(srcElements[i], destElements[i]);
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				if (deepDataAndEvents) {
					srcElements = srcElements || getAll(elem);
					destElements = destElements || getAll(clone);

					for (i = 0, l = srcElements.length; i < l; i++) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				} else {
					cloneCopyEvent(elem, clone);
				}
			}

			// Preserve script evaluation history
			destElements = getAll(clone, "script");
			if (destElements.length > 0) {
				setGlobalEval(destElements, !inPage && getAll(elem, "script"));
			}

			// Return the cloned set
			return clone;
		},

		cleanData: function (elems) {
			var data, elem, type,
				special = jQuery.event.special,
				i = 0;

			for (; (elem = elems[i]) !== undefined; i++) {
				if (acceptData(elem)) {
					if ((data = elem[dataPriv.expando])) {
						if (data.events) {
							for (type in data.events) {
								if (special[type]) {
									jQuery.event.remove(elem, type);

									// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent(elem, type, data.handle);
								}
							}
						}

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataPriv.expando] = undefined;
						}
					if (elem[dataUser.expando]) {

						// Support: Chrome <= 35-45+
						// Assign undefined instead of using delete, see Data#remove
						elem[dataUser.expando] = undefined;
					}
				}
			}
		}
	});

	jQuery.fn.extend({

		// Keep domManip exposed until 3.0 (gh-2225)
		domManip: domManip,

		detach: function (selector) {
			return remove(this, selector, true);
		},

		remove: function (selector) {
			return remove(this, selector);
		},

		text: function (value) {
			return access(this, function (value) {
				return value === undefined ?
					jQuery.text(this) :
					this.empty().each(function () {
						if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length);
		},

		append: function () {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.appendChild(elem);
				}
			});
		},

		prepend: function () {
			return domManip(this, arguments, function (elem) {
				if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
					var target = manipulationTarget(this, elem);
					target.insertBefore(elem, target.firstChild);
				}
			});
		},

		before: function () {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this);
				}
			});
		},

		after: function () {
			return domManip(this, arguments, function (elem) {
				if (this.parentNode) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				}
			});
		},

		empty: function () {
			var elem,
				i = 0;

			for (; (elem = this[i]) != null; i++) {
				if (elem.nodeType === 1) {

					// Prevent memory leaks
					jQuery.cleanData(getAll(elem, false));

					// Remove any remaining nodes
					elem.textContent = "";
				}
			}

			return this;
		},

		clone: function (dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function () {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html: function (value) {
			return access(this, function (value) {
				var elem = this[0] || {},
					i = 0,
					l = this.length;

				if (value === undefined && elem.nodeType === 1) {
					return elem.innerHTML;
				}

				// See if we can take a shortcut and just use innerHTML
				if (typeof value === "string" && !rnoInnerhtml.test(value) &&
					!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

					value = jQuery.htmlPrefilter(value);

					try {
						for (; i < l; i++) {
							elem = this[i] || {};

							// Remove element nodes and prevent memory leaks
							if (elem.nodeType === 1) {
								jQuery.cleanData(getAll(elem, false));
								elem.innerHTML = value;
							}
						}

						elem = 0;

						// If using innerHTML throws an exception, use the fallback method
					} catch (e) { }
				}

				if (elem) {
					this.empty().append(value);
				}
			}, null, value, arguments.length);
		},

		replaceWith: function () {
			var ignored = [];

			// Make the changes, replacing each non-ignored context element with the new content
			return domManip(this, arguments, function (elem) {
				var parent = this.parentNode;

				if (jQuery.inArray(this, ignored) < 0) {
				jQuery.cleanData(getAll(this));
					if (parent) {
						parent.replaceChild(elem, this);
				}
					}

				// Force callback invocation
			}, ignored);
				}
	});

	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (name, original) {
		jQuery.fn[name] = function (selector) {
			var elems,
				ret = [],
				insert = jQuery(selector),
				last = insert.length - 1,
				i = 0;

			for (; i <= last; i++) {
				elems = i === last ? this : this.clone(true);
				jQuery(insert[i])[original](elems);

				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply(ret, elems.get());
			}

			return this.pushStack(ret);
		};
	});


	var iframe,
		elemdisplay = {

			// Support: Firefox
			// We have to pre-define these values for FF (#10227)
			HTML: "block",
			BODY: "block"
		};

	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */

	// Called only from within defaultDisplay
	function actualDisplay(name, doc) {
		var elem = jQuery(doc.createElement(name)).appendTo(doc.body),

			display = jQuery.css(elem[0], "display");

		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();

		return display;
	}

	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay(nodeName) {
		var doc = document,
			display = elemdisplay[nodeName];

		if (!display) {
			display = actualDisplay(nodeName, doc);

			// If the simple way fails, read from inside an iframe
			if (display === "none" || !display) {

				// Use the already-created iframe if possible
				iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>"))
					.appendTo(doc.documentElement);

				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[0].contentDocument;

				// Support: IE
				doc.write();
				doc.close();

				display = actualDisplay(nodeName, doc);
				iframe.detach();
			}

			// Store the correct default display
			elemdisplay[nodeName] = display;
		}

		return display;
	}
	var rmargin = (/^margin/);

	var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");

	var getStyles = function (elem) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if (!view || !view.opener) {
			view = window;
		}

		return view.getComputedStyle(elem);
	};

	var swap = function (elem, options, callback, args) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
			}

		return ret;
	};


	var documentElement = document.documentElement;



	(function () {
		var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
			container = document.createElement("div"),
			div = document.createElement("div");

		// Finish early in limited (non-browser) environments
		if (!div.style) {
			return;
		}

		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode(true).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";

		container.style.cssText = "border:0;width:8px;height:0;top:0;left:-9999px;" +
			"padding:0;margin-top:1px;position:absolute";
		container.appendChild(div);

		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computeStyleTests() {
			div.style.cssText =

				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;" +
				"position:relative;display:block;" +
				"margin:auto;border:1px;padding:1px;" +
				"top:1%;width:50%";
			div.innerHTML = "";
			documentElement.appendChild(container);

			var divStyle = window.getComputedStyle(div);
			pixelPositionVal = divStyle.top !== "1%";
			reliableMarginLeftVal = divStyle.marginLeft === "2px";
			boxSizingReliableVal = divStyle.width === "4px";

			// Support: Android 4.0 - 4.3 only
			// Some styles come back with percentage values, even though they shouldn't
			div.style.marginRight = "50%";
			pixelMarginRightVal = divStyle.marginRight === "4px";

			documentElement.removeChild(container);
		}

			jQuery.extend(support, {
				pixelPosition: function () {

					// This test is executed only once but we still do memoizing
					// since we can use the boxSizingReliable pre-computing.
					// No need to check if the test was already performed, though.
				computeStyleTests();
					return pixelPositionVal;
				},
				boxSizingReliable: function () {
					if (boxSizingReliableVal == null) {
					computeStyleTests();
					}
					return boxSizingReliableVal;
				},
			pixelMarginRight: function () {

				// Support: Android 4.0-4.3
				// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
				// since that compresses better and they're computed together anyway.
				if (boxSizingReliableVal == null) {
					computeStyleTests();
				}
				return pixelMarginRightVal;
			},
			reliableMarginLeft: function () {

				// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
				if (boxSizingReliableVal == null) {
					computeStyleTests();
				}
				return reliableMarginLeftVal;
			},
				reliableMarginRight: function () {

					// Support: Android 2.3
					// Check if div with explicit width and no margin-right incorrectly
					// gets computed margin-right based on width of container. (#3333)
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// This support function is only executed once so no memoizing is needed.
					var ret,
						marginDiv = div.appendChild(document.createElement("div"));

					// Reset CSS: box-sizing; display; margin; border; padding
					marginDiv.style.cssText = div.style.cssText =

					// Support: Android 2.3
						// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;box-sizing:content-box;" +
					"display:block;margin:0;border:0;padding:0";
					marginDiv.style.marginRight = marginDiv.style.width = "0";
					div.style.width = "1px";
				documentElement.appendChild(container);

				ret = !parseFloat(window.getComputedStyle(marginDiv).marginRight);

				documentElement.removeChild(container);
					div.removeChild(marginDiv);

					return ret;
				}
			});
	})();


	function curCSS(elem, name, computed) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;

		computed = computed || getStyles(elem);
		ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;

		// Support: Opera 12.1x only
		// Fall back to style even without computed
		// computed is undefined for elems on document fragments
		if ((ret === "" || ret === undefined) && !jQuery.contains(elem.ownerDocument, elem)) {
			ret = jQuery.style(elem, name);
		}

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if (computed) {

			// A tribute to the "awesome hack by Dean Edwards"
			// Android Browser returns percentage for some values,
			// but width seems to be reliably pixels.
			// This is against the CSSOM draft spec:
			// http://dev.w3.org/csswg/cssom/#resolved-values
			if (!support.pixelMarginRight() && rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
		}
		}

		return ret !== undefined ?

			// Support: IE9-11+
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}


	function addGetHookIf(conditionFn, hookFn) {

		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function () {
				if (conditionFn()) {

					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}

				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply(this, arguments);
			}
	};
	}


	var

		// Swappable if display is none or starts with table
		// except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,

		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},

		cssPrefixes = ["Webkit", "O", "Moz", "ms"],
		emptyStyle = document.createElement("div").style;

	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName(name) {

		// Shortcut for names that are not vendor prefixed
		if (name in emptyStyle) {
			return name;
		}

		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
			i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in emptyStyle) {
				return name;
			}
		}
	}

	function setPositiveNumber(elem, value, subtract) {

		// Any relative (+/-) values have already been
		// normalized at this point
		var matches = rcssNum.exec(value);
		return matches ?

			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max(0, matches[2] - (subtract || 0)) + (matches[3] || "px") :
			value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? "border" : "content") ?

			// If we already have the right measurement, avoid augmentation
			4 :

			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,

			val = 0;

		for (; i < 4; i += 2) {

			// Both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += jQuery.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {

				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// At this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {

				// At this point, extra isn't content, so add padding
				val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

				// At this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {

		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles(elem),
			isBorderBox = jQuery.css(elem, "boxSizing", false, styles) === "border-box";

		// Support: IE11 only
		// In IE 11 fullscreen elements inside of an iframe have
		// 100x too small dimensions (gh-1764).
		if (document.msFullscreenElement && window.top !== window) {

			// Support: IE11 only
			// Running getBoundingClientRect on a disconnected node
			// in IE throws an error.
			if (elem.getClientRects().length) {
				val = Math.round(elem.getBoundingClientRect()[name] * 100);
			}
		}

		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if (val <= 0 || val == null) {

			// Fall back to computed then uncomputed css if necessary
			val = curCSS(elem, name, styles);
			if (val < 0 || val == null) {
				val = elem.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if (rnumnonpx.test(val)) {
				return val;
			}

			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				(support.boxSizingReliable() || val === elem.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// Use the active box-sizing model to add/subtract irrelevant styles
		return (val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || (isBorderBox ? "border" : "content"),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function showHide(elements, show) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;

		for (; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}

			values[index] = dataPriv.get(elem, "olddisplay");
			display = elem.style.display;
			if (show) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if (!values[index] && display === "none") {
					elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if (elem.style.display === "" && isHidden(elem)) {
					values[index] = dataPriv.access(
						elem,
						"olddisplay",
						defaultDisplay(elem.nodeName)
					);
				}
			} else {
				hidden = isHidden(elem);

				if (display !== "none" || !hidden) {
					dataPriv.set(
						elem,
						"olddisplay",
						hidden ? display : jQuery.css(elem, "display")
					);
				}
			}
		}

		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for (index = 0; index < length; index++) {
			elem = elements[index];
			if (!elem.style) {
				continue;
			}
			if (!show || elem.style.display === "none" || elem.style.display === "") {
				elem.style.display = show ? values[index] || "" : "none";
			}
		}

		return elements;
	}

	jQuery.extend({

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function (elem, computed) {
					if (computed) {

						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"animationIterationCount": true,
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},

		// Get and set the style property on a DOM Node
		style: function (elem, name, value, extra) {

			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase(name),
				style = elem.style;

			name = jQuery.cssProps[origName] ||
				(jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value;

				// Convert "+=" or "-=" to relative numbers (#7345)
				if (type === "string" && (ret = rcssNum.exec(value)) && ret[1]) {
					value = adjustCSS(elem, name, ret);

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that null and NaN values aren't set (#7116)
				if (value == null || value !== value) {
					return;
				}

				// If a number was passed in, add the unit (except for certain CSS properties)
				if (type === "number") {
					value += ret && ret[3] || (jQuery.cssNumber[origName] ? "" : "px");
				}

				// Support: IE9-11+
				// background-* props affect original clone's values
				if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) ||
					(value = hooks.set(elem, value, extra)) !== undefined) {

					style[name] = value;
				}

			} else {

				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks &&
					(ret = hooks.get(elem, false, extra)) !== undefined) {

					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css: function (elem, name, extra, styles) {
			var val, num, hooks,
				origName = jQuery.camelCase(name);

			// Make sure that we're working with the right name
			name = jQuery.cssProps[origName] ||
				(jQuery.cssProps[origName] = vendorPropName(origName) || origName);

			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			// Convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Make numeric if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || isFinite(num) ? num || 0 : val;
			}
			return val;
		}
	});

	jQuery.each(["height", "width"], function (i, name) {
		jQuery.cssHooks[name] = {
			get: function (elem, computed, extra) {
				if (computed) {

					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test(jQuery.css(elem, "display")) &&
						elem.offsetWidth === 0 ?
							swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) :
						getWidthOrHeight(elem, name, extra);
				}
			},

			set: function (elem, value, extra) {
				var matches,
					styles = extra && getStyles(elem),
					subtract = extra && augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css(elem, "boxSizing", false, styles) === "border-box",
						styles
				);

				// Convert to pixels if value adjustment is needed
				if (subtract && (matches = rcssNum.exec(value)) &&
					(matches[3] || "px") !== "px") {

					elem.style[name] = value;
					value = jQuery.css(elem, name);
			}

				return setPositiveNumber(elem, value, subtract);
			}
		};
	});

	jQuery.cssHooks.marginLeft = addGetHookIf(support.reliableMarginLeft,
		function (elem, computed) {
			if (computed) {
				return (parseFloat(curCSS(elem, "marginLeft")) ||
					elem.getBoundingClientRect().left -
						swap(elem, { marginLeft: 0 }, function () {
							return elem.getBoundingClientRect().left;
						})
					) + "px";
			}
		}
	);

	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight,
		function (elem, computed) {
			if (computed) {
				return swap(elem, { "display": "inline-block" },
					curCSS, [elem, "marginRight"]);
			}
		}
	);

	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (prefix, suffix) {
		jQuery.cssHooks[prefix + suffix] = {
			expand: function (value) {
				var i = 0,
					expanded = {},

					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [value];

				for (; i < 4; i++) {
					expanded[prefix + cssExpand[i] + suffix] =
						parts[i] || parts[i - 2] || parts[0];
				}

				return expanded;
			}
		};

		if (!rmargin.test(prefix)) {
			jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
		}
	});

	jQuery.fn.extend({
		css: function (name, value) {
			return access(this, function (elem, name, value) {
				var styles, len,
					map = {},
					i = 0;

				if (jQuery.isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = jQuery.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ?
					jQuery.style(elem, name, value) :
					jQuery.css(elem, name);
			}, name, value, arguments.length > 1);
		},
		show: function () {
			return showHide(this, true);
		},
		hide: function () {
			return showHide(this);
		},
		toggle: function (state) {
			if (typeof state === "boolean") {
				return state ? this.show() : this.hide();
			}

			return this.each(function () {
				if (isHidden(this)) {
					jQuery(this).show();
				} else {
					jQuery(this).hide();
				}
			});
		}
	});


	function Tween(elem, options, prop, end, easing) {
		return new Tween.prototype.init(elem, options, prop, end, easing);
	}
	jQuery.Tween = Tween;

	Tween.prototype = {
		constructor: Tween,
		init: function (elem, options, prop, end, easing, unit) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || jQuery.easing._default;
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
		},
		cur: function () {
			var hooks = Tween.propHooks[this.prop];

			return hooks && hooks.get ?
				hooks.get(this) :
				Tween.propHooks._default.get(this);
		},
		run: function (percent) {
			var eased,
				hooks = Tween.propHooks[this.prop];

			if (this.options.duration) {
				this.pos = eased = jQuery.easing[this.easing](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = (this.end - this.start) * eased + this.start;

			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			if (hooks && hooks.set) {
				hooks.set(this);
			} else {
				Tween.propHooks._default.set(this);
			}
			return this;
		}
	};

	Tween.prototype.init.prototype = Tween.prototype;

	Tween.propHooks = {
		_default: {
			get: function (tween) {
				var result;

				// Use a property on the element directly when it is not a DOM element,
				// or when there is no matching style property that exists.
				if (tween.elem.nodeType !== 1 ||
					tween.elem[tween.prop] != null && tween.elem.style[tween.prop] == null) {
					return tween.elem[tween.prop];
				}

				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css(tween.elem, tween.prop, "");

				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function (tween) {

				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if (jQuery.fx.step[tween.prop]) {
					jQuery.fx.step[tween.prop](tween);
				} else if (tween.elem.nodeType === 1 &&
					(tween.elem.style[jQuery.cssProps[tween.prop]] != null ||
						jQuery.cssHooks[tween.prop])) {
					jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
				} else {
					tween.elem[tween.prop] = tween.now;
				}
			}
		}
	};

	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function (tween) {
			if (tween.elem.nodeType && tween.elem.parentNode) {
				tween.elem[tween.prop] = tween.now;
			}
		}
	};

	jQuery.easing = {
		linear: function (p) {
			return p;
		},
		swing: function (p) {
			return 0.5 - Math.cos(p * Math.PI) / 2;
		},
		_default: "swing"
	};

	jQuery.fx = Tween.prototype.init;

	// Back Compat <1.8 extension point
	jQuery.fx.step = {};




	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rrun = /queueHooks$/;

	// Animations created synchronously will run synchronously
	function createFxNow() {
		window.setTimeout(function () {
			fxNow = undefined;
		});
		return (fxNow = jQuery.now());
	}

	// Generate parameters to create a standard animation
	function genFx(type, includeWidth) {
		var which,
			i = 0,
			attrs = { height: type };

		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for (; i < 4 ; i += 2 - includeWidth) {
			which = cssExpand[i];
			attrs["margin" + which] = attrs["padding" + which] = type;
		}

		if (includeWidth) {
			attrs.opacity = attrs.width = type;
		}

		return attrs;
	}

	function createTween(value, prop, animation) {
		var tween,
			collection = (Animation.tweeners[prop] || []).concat(Animation.tweeners["*"]),
			index = 0,
			length = collection.length;
		for (; index < length; index++) {
			if ((tween = collection[index].call(animation, prop, value))) {

				// We're done with this property
				return tween;
			}
		}
	}

	function defaultPrefilter(elem, props, opts) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden(elem),
			dataShow = dataPriv.get(elem, "fxshow");

		// Handle queue: false promises
		if (!opts.queue) {
			hooks = jQuery._queueHooks(elem, "fx");
			if (hooks.unqueued == null) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function () {
					if (!hooks.unqueued) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;

			anim.always(function () {

				// Ensure the complete handler is called before this completes
				anim.always(function () {
					hooks.unqueued--;
					if (!jQuery.queue(elem, "fx").length) {
						hooks.empty.fire();
					}
				});
			});
		}

		// Height/width overflow pass
		if (elem.nodeType === 1 && ("height" in props || "width" in props)) {

			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [style.overflow, style.overflowX, style.overflowY];

			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css(elem, "display");

			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				dataPriv.get(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;

			if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
				style.display = "inline-block";
			}
		}

		if (opts.overflow) {
			style.overflow = "hidden";
			anim.always(function () {
				style.overflow = opts.overflow[0];
				style.overflowX = opts.overflow[1];
				style.overflowY = opts.overflow[2];
			});
		}

		// show/hide pass
		for (prop in props) {
			value = props[prop];
			if (rfxtypes.exec(value)) {
				delete props[prop];
				toggle = toggle || value === "toggle";
				if (value === (hidden ? "hide" : "show")) {

					// If there is dataShow left over from a stopped hide or show
					// and we are going to proceed with show, we should pretend to be hidden
					if (value === "show" && dataShow && dataShow[prop] !== undefined) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);

				// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}

		if (!jQuery.isEmptyObject(orig)) {
			if (dataShow) {
				if ("hidden" in dataShow) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access(elem, "fxshow", {});
			}

			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if (toggle) {
				dataShow.hidden = !hidden;
			}
			if (hidden) {
				jQuery(elem).show();
			} else {
				anim.done(function () {
					jQuery(elem).hide();
				});
			}
			anim.done(function () {
				var prop;

				dataPriv.remove(elem, "fxshow");
				for (prop in orig) {
					jQuery.style(elem, prop, orig[prop]);
				}
			});
			for (prop in orig) {
				tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

				if (!(prop in dataShow)) {
					dataShow[prop] = tween.start;
					if (hidden) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}

			// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
			style.display = display;
		}
	}

	function propFilter(props, specialEasing) {
		var index, name, easing, value, hooks;

		// camelCase, specialEasing and expand cssHook pass
		for (index in props) {
			name = jQuery.camelCase(index);
			easing = specialEasing[name];
			value = props[index];
			if (jQuery.isArray(value)) {
				easing = value[1];
				value = props[index] = value[0];
			}

			if (index !== name) {
				props[name] = value;
				delete props[index];
			}

			hooks = jQuery.cssHooks[name];
			if (hooks && "expand" in hooks) {
				value = hooks.expand(value);
				delete props[name];

				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for (index in value) {
					if (!(index in props)) {
						props[index] = value[index];
						specialEasing[index] = easing;
					}
				}
			} else {
				specialEasing[name] = easing;
			}
		}
	}

	function Animation(elem, properties, options) {
		var result,
			stopped,
			index = 0,
			length = Animation.prefilters.length,
			deferred = jQuery.Deferred().always(function () {

				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			tick = function () {
				if (stopped) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max(0, animation.startTime + animation.duration - currentTime),

					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;

				for (; index < length ; index++) {
					animation.tweens[index].run(percent);
				}

				deferred.notifyWith(elem, [animation, percent, remaining]);

				if (percent < 1 && length) {
					return remaining;
				} else {
					deferred.resolveWith(elem, [animation]);
					return false;
				}
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend({}, properties),
				opts: jQuery.extend(true, {
					specialEasing: {},
					easing: jQuery.easing._default
				}, options),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function (prop, end) {
					var tween = jQuery.Tween(elem, animation.opts, prop, end,
							animation.opts.specialEasing[prop] || animation.opts.easing);
					animation.tweens.push(tween);
					return tween;
				},
				stop: function (gotoEnd) {
					var index = 0,

						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if (stopped) {
						return this;
					}
					stopped = true;
					for (; index < length ; index++) {
						animation.tweens[index].run(1);
					}

					// Resolve when we played the last frame; otherwise, reject
					if (gotoEnd) {
						deferred.notifyWith(elem, [animation, 1, 0]);
						deferred.resolveWith(elem, [animation, gotoEnd]);
					} else {
						deferred.rejectWith(elem, [animation, gotoEnd]);
					}
					return this;
				}
			}),
			props = animation.props;

		propFilter(props, animation.opts.specialEasing);

		for (; index < length ; index++) {
			result = Animation.prefilters[index].call(animation, elem, props, animation.opts);
			if (result) {
				if (jQuery.isFunction(result.stop)) {
					jQuery._queueHooks(animation.elem, animation.opts.queue).stop =
						jQuery.proxy(result.stop, result);
				}
				return result;
			}
		}

		jQuery.map(props, createTween, animation);

		if (jQuery.isFunction(animation.opts.start)) {
			animation.opts.start.call(elem, animation);
		}

		jQuery.fx.timer(
			jQuery.extend(tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);

		// attach callbacks from options
		return animation.progress(animation.opts.progress)
			.done(animation.opts.done, animation.opts.complete)
			.fail(animation.opts.fail)
			.always(animation.opts.always);
	}

	jQuery.Animation = jQuery.extend(Animation, {
		tweeners: {
			"*": [function (prop, value) {
				var tween = this.createTween(prop, value);
				adjustCSS(tween.elem, prop, rcssNum.exec(value), tween);
				return tween;
			}]
		},

		tweener: function (props, callback) {
			if (jQuery.isFunction(props)) {
				callback = props;
				props = ["*"];
			} else {
				props = props.match(rnotwhite);
			}

			var prop,
				index = 0,
				length = props.length;

			for (; index < length ; index++) {
				prop = props[index];
				Animation.tweeners[prop] = Animation.tweeners[prop] || [];
				Animation.tweeners[prop].unshift(callback);
			}
		},

		prefilters: [defaultPrefilter],

		prefilter: function (callback, prepend) {
			if (prepend) {
				Animation.prefilters.unshift(callback);
			} else {
				Animation.prefilters.push(callback);
			}
		}
	});

	jQuery.speed = function (speed, easing, fn) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction(speed) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
			opt.duration : opt.duration in jQuery.fx.speeds ?
				jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Normalize opt.queue - true/undefined/null -> "fx"
		if (opt.queue == null || opt.queue === true) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function () {
			if (jQuery.isFunction(opt.old)) {
				opt.old.call(this);
			}

			if (opt.queue) {
				jQuery.dequeue(this, opt.queue);
			}
		};

		return opt;
	};

	jQuery.fn.extend({
		fadeTo: function (speed, to, easing, callback) {

			// Show any hidden elements after setting opacity to 0
			return this.filter(isHidden).css("opacity", 0).show()

				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback);
		},
		animate: function (prop, speed, easing, callback) {
			var empty = jQuery.isEmptyObject(prop),
				optall = jQuery.speed(speed, easing, callback),
				doAnimation = function () {

					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation(this, jQuery.extend({}, prop), optall);

					// Empty animations, or finishing resolves immediately
					if (empty || dataPriv.get(this, "finish")) {
						anim.stop(true);
					}
				};
			doAnimation.finish = doAnimation;

			return empty || optall.queue === false ?
				this.each(doAnimation) :
				this.queue(optall.queue, doAnimation);
		},
		stop: function (type, clearQueue, gotoEnd) {
			var stopQueue = function (hooks) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop(gotoEnd);
			};

			if (typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function () {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = dataPriv.get(this);

				if (index) {
					if (data[index] && data[index].stop) {
						stopQueue(data[index]);
					}
				} else {
					for (index in data) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}

				for (index = timers.length; index--;) {
					if (timers[index].elem === this &&
						(type == null || timers[index].queue === type)) {

						timers[index].anim.stop(gotoEnd);
						dequeue = false;
						timers.splice(index, 1);
					}
				}

				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if (dequeue || !gotoEnd) {
					jQuery.dequeue(this, type);
				}
			});
		},
		finish: function (type) {
			if (type !== false) {
				type = type || "fx";
			}
			return this.each(function () {
				var index,
					data = dataPriv.get(this),
					queue = data[type + "queue"],
					hooks = data[type + "queueHooks"],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;

				// Enable finishing flag on private data
				data.finish = true;

				// Empty the queue first
				jQuery.queue(this, type, []);

				if (hooks && hooks.stop) {
					hooks.stop.call(this, true);
				}

				// Look for any active animations, and finish them
				for (index = timers.length; index--;) {
					if (timers[index].elem === this && timers[index].queue === type) {
						timers[index].anim.stop(true);
						timers.splice(index, 1);
					}
				}

				// Look for any animations in the old queue and finish them
				for (index = 0; index < length; index++) {
					if (queue[index] && queue[index].finish) {
						queue[index].finish.call(this);
					}
				}

				// Turn off finishing flag
				delete data.finish;
			});
		}
	});

	jQuery.each(["toggle", "show", "hide"], function (i, name) {
		var cssFn = jQuery.fn[name];
		jQuery.fn[name] = function (speed, easing, callback) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply(this, arguments) :
				this.animate(genFx(name, true), speed, easing, callback);
		};
	});

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function (name, props) {
		jQuery.fn[name] = function (speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.timers = [];
	jQuery.fx.tick = function () {
		var timer,
			i = 0,
			timers = jQuery.timers;

		fxNow = jQuery.now();

		for (; i < timers.length; i++) {
			timer = timers[i];

			// Checks the timer has not already been removed
			if (!timer() && timers[i] === timer) {
				timers.splice(i--, 1);
			}
		}

		if (!timers.length) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};

	jQuery.fx.timer = function (timer) {
		jQuery.timers.push(timer);
		if (timer()) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};

	jQuery.fx.interval = 13;
	jQuery.fx.start = function () {
		if (!timerId) {
			timerId = window.setInterval(jQuery.fx.tick, jQuery.fx.interval);
		}
	};

	jQuery.fx.stop = function () {
		window.clearInterval(timerId);

		timerId = null;
	};

	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,

		// Default speed
		_default: 400
	};


	// Based off of the plugin by Clint Helfers, with permission.
	// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function (time, type) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue(type, function (next, hooks) {
			var timeout = window.setTimeout(next, time);
			hooks.stop = function () {
				window.clearTimeout(timeout);
			};
		});
	};


	(function () {
		var input = document.createElement("input"),
			select = document.createElement("select"),
			opt = select.appendChild(document.createElement("option"));

		input.type = "checkbox";

		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";

		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;

		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement("input");
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();


	var boolHook,
		attrHandle = jQuery.expr.attrHandle;

	jQuery.fn.extend({
		attr: function (name, value) {
			return access(this, jQuery.attr, name, value, arguments.length > 1);
		},

		removeAttr: function (name) {
			return this.each(function () {
				jQuery.removeAttr(this, name);
			});
		}
	});

	jQuery.extend({
		attr: function (elem, name, value) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set attributes on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			// Fallback to prop when attributes are not supported
			if (typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[name] ||
					(jQuery.expr.match.bool.test(name) ? boolHook : undefined);
			}

			if (value !== undefined) {
				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;
				}

				if (hooks && "set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

					elem.setAttribute(name, value + "");
					return value;
				}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

				ret = jQuery.find.attr(elem, name);

				// Non-existent attributes return null, we normalize to undefined
			return ret == null ? undefined : ret;
		},

		attrHooks: {
			type: {
				set: function (elem, value) {
					if (!support.radioValue && value === "radio" &&
						jQuery.nodeName(elem, "input")) {
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
			}
						return value;
					}
				}
			}
		},

		removeAttr: function (elem, value) {
			var name, propName,
				i = 0,
				attrNames = value && value.match(rnotwhite);

			if (attrNames && elem.nodeType === 1) {
				while ((name = attrNames[i++])) {
					propName = jQuery.propFix[name] || name;

					// Boolean attributes get special treatment (#10870)
					if (jQuery.expr.match.bool.test(name)) {

						// Set corresponding property to false
						elem[propName] = false;
					}

					elem.removeAttribute(name);
				}
			}
		}
	});

	// Hooks for boolean attributes
	boolHook = {
		set: function (elem, value, name) {
			if (value === false) {

				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				elem.setAttribute(name, name);
			}
			return name;
		}
	};
	jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function (i, name) {
		var getter = attrHandle[name] || jQuery.find.attr;

		attrHandle[name] = function (elem, name, isXML) {
			var ret, handle;
			if (!isXML) {

				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[name];
				attrHandle[name] = ret;
				ret = getter(elem, name, isXML) != null ?
					name.toLowerCase() :
					null;
				attrHandle[name] = handle;
			}
			return ret;
		};
	});




	var rfocusable = /^(?:input|select|textarea|button)$/i,
		rclickable = /^(?:a|area)$/i;

	jQuery.fn.extend({
		prop: function (name, value) {
			return access(this, jQuery.prop, name, value, arguments.length > 1);
		},

		removeProp: function (name) {
			return this.each(function () {
				delete this[jQuery.propFix[name] || name];
			});
		}
	});

	jQuery.extend({
		prop: function (elem, name, value) {
			var ret, hooks,
				nType = elem.nodeType;

			// Don't get/set properties on text, comment and attribute nodes
			if (nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (nType !== 1 || !jQuery.isXMLDoc(elem)) {

				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks &&
					(ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;
				}

				return (elem[name] = value);
			}

			if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
				return ret;
			}

			return elem[name];
		},

		propHooks: {
			tabIndex: {
				get: function (elem) {

					// elem.tabIndex doesn't always return the
					// correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					// Use proper attribute retrieval(#12072)
					var tabindex = jQuery.find.attr(elem, "tabindex");

					return tabindex ?
						parseInt(tabindex, 10) :
						rfocusable.test(elem.nodeName) ||
							rclickable.test(elem.nodeName) && elem.href ?
								0 :
						-1;
				}
			}
		},

		propFix: {
			"for": "htmlFor",
			"class": "className"
		}
	});

	// Support: IE <=11 only
	// Accessing the selectedIndex property
	// forces the browser to respect setting selected
	// on the option
	// The getter ensures a default option is selected
	// when in an optgroup
	if (!support.optSelected) {
		jQuery.propHooks.selected = {
			get: function (elem) {
				var parent = elem.parentNode;
				if (parent && parent.parentNode) {
					parent.parentNode.selectedIndex;
				}
				return null;
			},
			set: function (elem) {
				var parent = elem.parentNode;
				if (parent) {
					parent.selectedIndex;

					if (parent.parentNode) {
						parent.parentNode.selectedIndex;
					}
				}
			}
		};
	}

	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function () {
		jQuery.propFix[this.toLowerCase()] = this;
	});




	var rclass = /[\t\r\n\f]/g;

	function getClass(elem) {
		return elem.getAttribute && elem.getAttribute("class") || "";
	}

	jQuery.fn.extend({
		addClass: function (value) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).addClass(value.call(this, j, getClass(this)));
				});
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);
					cur = elem.nodeType === 1 &&
						(" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {
							if (cur.indexOf(" " + clazz + " ") < 0) {
								cur += clazz + " ";
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		removeClass: function (value) {
			var classes, elem, cur, curValue, clazz, j, finalValue,
				i = 0;

			if (jQuery.isFunction(value)) {
				return this.each(function (j) {
					jQuery(this).removeClass(value.call(this, j, getClass(this)));
				});
			}

			if (!arguments.length) {
				return this.attr("class", "");
			}

			if (typeof value === "string" && value) {
				classes = value.match(rnotwhite) || [];

				while ((elem = this[i++])) {
					curValue = getClass(elem);

					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 &&
						(" " + curValue + " ").replace(rclass, " ");

					if (cur) {
						j = 0;
						while ((clazz = classes[j++])) {

							// Remove *all* instances
							while (cur.indexOf(" " + clazz + " ") > -1) {
								cur = cur.replace(" " + clazz + " ", " ");
							}
						}

						// Only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim(cur);
						if (curValue !== finalValue) {
							elem.setAttribute("class", finalValue);
						}
					}
				}
			}

			return this;
		},

		toggleClass: function (value, stateVal) {
			var type = typeof value;

			if (typeof stateVal === "boolean" && type === "string") {
				return stateVal ? this.addClass(value) : this.removeClass(value);
			}

			if (jQuery.isFunction(value)) {
				return this.each(function (i) {
					jQuery(this).toggleClass(
						value.call(this, i, getClass(this), stateVal),
						stateVal
					);
				});
			}

			return this.each(function () {
				var className, i, self, classNames;

				if (type === "string") {

					// Toggle individual class names
					i = 0;
					self = jQuery(this);
						classNames = value.match(rnotwhite) || [];

					while ((className = classNames[i++])) {

						// Check each className given, space separated list
						if (self.hasClass(className)) {
							self.removeClass(className);
						} else {
							self.addClass(className);
						}
					}

					// Toggle whole class name
				} else if (value === undefined || type === "boolean") {
					className = getClass(this);
					if (className) {

						// Store className if set
						dataPriv.set(this, "__className__", className);
					}

					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					if (this.setAttribute) {
						this.setAttribute("class",
							className || value === false ?
							"" :
							dataPriv.get(this, "__className__") || ""
						);
					}
				}
			});
		},

		hasClass: function (selector) {
			var className, elem,
				i = 0;

			className = " " + selector + " ";
			while ((elem = this[i++])) {
				if (elem.nodeType === 1 &&
					(" " + getClass(elem) + " ").replace(rclass, " ")
						.indexOf(className) > -1
				) {
					return true;
				}
			}

			return false;
		}
	});




	var rreturn = /\r/g,
		rspaces = /[\x20\t\r\n\f]+/g;

	jQuery.fn.extend({
		val: function (value) {
			var hooks, ret, isFunction,
				elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[elem.type] ||
						jQuery.valHooks[elem.nodeName.toLowerCase()];

					if (hooks &&
						"get" in hooks &&
						(ret = hooks.get(elem, "value")) !== undefined
					) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?

						// Handle most common string cases
						ret.replace(rreturn, "") :

						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function (i) {
				var val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, jQuery(this).val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";

				} else if (typeof val === "number") {
					val += "";

				} else if (jQuery.isArray(val)) {
					val = jQuery.map(val, function (value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks: {
			option: {
				get: function (elem) {

					var val = jQuery.find.attr(elem, "value");
					return val != null ?
						val :

						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						// Strip and collapse whitespace
						// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
						jQuery.trim(jQuery.text(elem)).replace(rspaces, " ");
				}
			},
			select: {
				get: function (elem) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
						max :
							one ? index : 0;

					// Loop through all the selected options
					for (; i < max; i++) {
						option = options[i];

						// IE8-9 doesn't update selected after form reset (#2551)
						if ((option.selected || i === index) &&

							// Don't return options that are disabled or in a disabled optgroup
								(support.optDisabled ?
									!option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled ||
									!jQuery.nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					return values;
				},

				set: function (elem, value) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray(value),
						i = options.length;

					while (i--) {
						option = options[i];
						if (option.selected =
							jQuery.inArray(jQuery.valHooks.option.get(option), values) > -1
						) {
							optionSet = true;
						}
					}

					// Force browsers to behave consistently when non-matching value is set
					if (!optionSet) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});

	// Radios and checkboxes getter/setter
	jQuery.each(["radio", "checkbox"], function () {
		jQuery.valHooks[this] = {
			set: function (elem, value) {
				if (jQuery.isArray(value)) {
					return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) > -1);
				}
			}
		};
		if (!support.checkOn) {
			jQuery.valHooks[this].get = function (elem) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});




	// Return jQuery for attributes-only inclusion


	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	jQuery.extend(jQuery.event, {

		trigger: function (event, data, elem, onlyHandlers) {

			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [elem || document],
				type = hasOwn.call(event, "type") ? event.type : event,
				namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];

			cur = tmp = elem = elem || document;

			// Don't do events on text and comment nodes
			if (elem.nodeType === 3 || elem.nodeType === 8) {
				return;
			}

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf(".") > -1) {

				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;

			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[jQuery.expando] ?
				event :
				new jQuery.Event(type, typeof event === "object" && event);

			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.rnamespace = event.namespace ?
				new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") :
				null;

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[event] :
				jQuery.makeArray(data, [event]);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				if (!rfocusMorph.test(bubbleType + type)) {
					cur = cur.parentNode;
				}
				for (; cur; cur = cur.parentNode) {
					eventPath.push(cur);
					tmp = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (tmp === (elem.ownerDocument || document)) {
					eventPath.push(tmp.defaultView || tmp.parentWindow || window);
				}
			}

			// Fire handlers on the event path
			i = 0;
			while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;

				// jQuery handler
				handle = (dataPriv.get(cur, "events") || {})[event.type] &&
					dataPriv.get(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}

				// Native handler
				handle = ontype && cur[ontype];
				if (handle && handle.apply && acceptData(cur)) {
					event.result = handle.apply(cur, data);
					if (event.result === false) {
						event.preventDefault();
					}
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default ||
					special._default.apply(eventPath.pop(), data) === false) &&
					acceptData(elem)) {

					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ontype];

						if (tmp) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[type]();
						jQuery.event.triggered = undefined;

						if (tmp) {
							elem[ontype] = tmp;
						}
					}
				}
			}

			return event.result;
		},

		// Piggyback on a donor event to simulate a different one
		simulate: function (type, elem, event) {
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true

					// Previously, `originalEvent: {}` was set here, so stopPropagation call
					// would not be triggered on donor event, since in our own
					// jQuery.event.stopPropagation function we had a check for existence of
					// originalEvent.stopPropagation method, so, consequently it would be a noop.
					//
					// But now, this "simulate" function is used only for events
					// for which stopPropagation() is noop, so there is no need for that anymore.
					//
					// For the 1.x branch though, guard for "click" and "submit"
					// events is still used, but was moved to jQuery.event.stopPropagation function
					// because `originalEvent` should point to the original event for the constancy
					// with other events and for more focused logic
				}
			);

			jQuery.event.trigger(e, null, elem);

			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}

	});

	jQuery.fn.extend({

		trigger: function (type, data) {
			return this.each(function () {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler: function (type, data) {
			var elem = this[0];
			if (elem) {
				return jQuery.event.trigger(type, data, elem, true);
			}
		}
	});


	jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "),
		function (i, name) {

			// Handle event binding
			jQuery.fn[name] = function (data, fn) {
				return arguments.length > 0 ?
					this.on(name, null, data, fn) :
					this.trigger(name);
			};
		});

	jQuery.fn.extend({
		hover: function (fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});




	support.focusin = "onfocusin" in window;


	// Support: Firefox
	// Firefox doesn't have focus(in | out) events
	// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
	//
	// Support: Chrome, Safari
	// focus(in | out) events fire after focus & blur events,
	// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
	// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
	if (!support.focusin) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function (orig, fix) {

			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function (event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event));
			};

			jQuery.event.special[fix] = {
				setup: function () {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix);

					if (!attaches) {
						doc.addEventListener(orig, handler, true);
					}
					dataPriv.access(doc, fix, (attaches || 0) + 1);
		},
				teardown: function () {
					var doc = this.ownerDocument || this,
						attaches = dataPriv.access(doc, fix) - 1;

					if (!attaches) {
						doc.removeEventListener(orig, handler, true);
						dataPriv.remove(doc, fix);

					} else {
						dataPriv.access(doc, fix, attaches);
					}
		}
			};
	});
	}
	var location = window.location;

	var nonce = jQuery.now();

	var rquery = (/\?/);



	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function (data) {
		return JSON.parse(data + "");
	};


	// Cross-browser xml parsing
	jQuery.parseXML = function (data) {
		var xml;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE9
		try {
			xml = (new window.DOMParser()).parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}

		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	};


	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,

		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},

		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},

		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat("*"),

		// Anchor tag for parsing the document origin
		originAnchor = document.createElement("a");
	originAnchor.href = location.href;

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function (dataTypeExpression, func) {

			if (typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];

			if (jQuery.isFunction(func)) {

				// For each dataType in the dataTypeExpression
				while ((dataType = dataTypes[i++])) {

					// Prepend if requested
					if (dataType[0] === "+") {
						dataType = dataType.slice(1) || "*";
						(structure[dataType] = structure[dataType] || []).unshift(func);

						// Otherwise append
					} else {
						(structure[dataType] = structure[dataType] || []).push(func);
					}
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {

		var inspected = {},
			seekingTransport = (structure === transports);

		function inspect(dataType) {
			var selected;
			inspected[dataType] = true;
			jQuery.each(structure[dataType] || [], function (_, prefilterOrFactory) {
				var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
				if (typeof dataTypeOrTransport === "string" &&
					!seekingTransport && !inspected[dataTypeOrTransport]) {

					options.dataTypes.unshift(dataTypeOrTransport);
					inspect(dataTypeOrTransport);
					return false;
				} else if (seekingTransport) {
					return !(selected = dataTypeOrTransport);
				}
			});
			return selected;
		}

		return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};

		for (key in src) {
			if (src[key] !== undefined) {
				(flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}

		return target;
	}

	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {

			// Try convertible dataTypes
			for (type in responses) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}

			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert(s, response, jqXHR, isSuccess) {
		var conv2, current, conv, tmp, prev,
			converters = {},

			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();

		// Create converters map with lowercased keys
		if (dataTypes[1]) {
			for (conv in s.converters) {
				converters[conv.toLowerCase()] = s.converters[conv];
			}
		}

		current = dataTypes.shift();

		// Convert to each sequential dataType
		while (current) {

			if (s.responseFields[current]) {
				jqXHR[s.responseFields[current]] = response;
			}

			// Apply the dataFilter if provided
			if (!prev && isSuccess && s.dataFilter) {
				response = s.dataFilter(response, s.dataType);
			}

			prev = current;
			current = dataTypes.shift();

			if (current) {

				// There's only work to do if current dataType is non-auto
				if (current === "*") {

					current = prev;

					// Convert response if prev dataType is non-auto and differs from current
				} else if (prev !== "*" && prev !== current) {

					// Seek a direct converter
					conv = converters[prev + " " + current] || converters["* " + current];

					// If none found, seek a pair
					if (!conv) {
						for (conv2 in converters) {

							// If conv2 outputs current
							tmp = conv2.split(" ");
							if (tmp[1] === current) {

								// If prev can be converted to accepted input
								conv = converters[prev + " " + tmp[0]] ||
									converters["* " + tmp[0]];
								if (conv) {

									// Condense equivalence converters
									if (conv === true) {
										conv = converters[conv2];

										// Otherwise, insert the intermediate dataType
									} else if (converters[conv2] !== true) {
										current = tmp[0];
										dataTypes.unshift(tmp[1]);
									}
									break;
								}
							}
						}
					}

					// Apply converter (if not an equivalence)
					if (conv !== true) {

						// Unless errors are allowed to bubble, catch and return them
						if (conv && s.throws) {
							response = conv(response);
						} else {
							try {
								response = conv(response);
							} catch (e) {
								return {
									state: "parsererror",
									error: conv ? e : "No conversion from " + prev + " to " + current
								};
							}
						}
					}
				}
			}
		}

		return { state: "success", data: response };
	}

	jQuery.extend({

		// Counter for holding the number of active queries
		active: 0,

		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},

		ajaxSettings: {
			url: location.href,
			type: "GET",
			isLocal: rlocalProtocol.test(location.protocol),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/

			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},

			contents: {
				xml: /\bxml\b/,
				html: /\bhtml/,
				json: /\bjson\b/
			},

			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},

			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {

				// Convert anything to text
				"* text": String,

				// Text to html (true = no transformation)
				"text html": true,

				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,

				// Parse text as xml
				"text xml": jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function (target, settings) {
			return settings ?

				// Building a settings object
				ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

				// Extending ajaxSettings
				ajaxExtend(jQuery.ajaxSettings, target);
		},

		ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
		ajaxTransport: addToPrefiltersOrTransports(transports),

		// Main method
		ajax: function (url, options) {

			// If url is an object, simulate pre-1.5 signature
			if (typeof url === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var transport,

				// URL without anti-cache param
				cacheURL,

				// Response headers
				responseHeadersString,
				responseHeaders,

				// timeout handle
				timeoutTimer,

				// Url cleanup var
				urlAnchor,

				// To know if global events are to be dispatched
				fireGlobals,

				// Loop variable
				i,

				// Create the final options object
				s = jQuery.ajaxSetup({}, options),

				// Callbacks context
				callbackContext = s.context || s,

				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context &&
					(callbackContext.nodeType || callbackContext.jquery) ?
					jQuery(callbackContext) :
					jQuery.event,

				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),

				// Status-dependent callbacks
				statusCode = s.statusCode || {},

				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},

				// The jqXHR state
				state = 0,

				// Default abort message
				strAbort = "canceled",

				// Fake xhr
				jqXHR = {
					readyState: 0,

					// Builds headers hashtable if needed
					getResponseHeader: function (key) {
						var match;
						if (state === 2) {
							if (!responseHeaders) {
								responseHeaders = {};
								while ((match = rheaders.exec(responseHeadersString))) {
									responseHeaders[match[1].toLowerCase()] = match[2];
								}
							}
							match = responseHeaders[key.toLowerCase()];
						}
						return match == null ? null : match;
					},

					// Raw string
					getAllResponseHeaders: function () {
						return state === 2 ? responseHeadersString : null;
					},

					// Caches the header
					setRequestHeader: function (name, value) {
						var lname = name.toLowerCase();
						if (!state) {
							name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
							requestHeaders[name] = value;
						}
						return this;
					},

					// Overrides response content-type header
					overrideMimeType: function (type) {
						if (!state) {
							s.mimeType = type;
						}
						return this;
					},

					// Status-dependent callbacks
					statusCode: function (map) {
						var code;
						if (map) {
							if (state < 2) {
								for (code in map) {

									// Lazy-add the new callback in a way that preserves old ones
									statusCode[code] = [statusCode[code], map[code]];
								}
							} else {

								// Execute the appropriate callbacks
								jqXHR.always(map[jqXHR.status]);
							}
						}
						return this;
					},

					// Cancel the request
					abort: function (statusText) {
						var finalText = statusText || strAbort;
						if (transport) {
							transport.abort(finalText);
						}
						done(0, finalText);
						return this;
					}
				};

			// Attach deferreds
			deferred.promise(jqXHR).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ((url || s.url || location.href) + "").replace(rhash, "")
				.replace(rprotocol, location.protocol + "//");

			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;

			// Extract dataTypes list
			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [""];

			// A cross-domain request is in order when the origin doesn't match the current origin.
			if (s.crossDomain == null) {
				urlAnchor = document.createElement("a");

				// Support: IE8-11+
				// IE throws exception if url is malformed, e.g. http://example.com:80x/
				try {
					urlAnchor.href = s.url;

					// Support: IE8-11+
					// Anchor's host property isn't correctly set when s.url is relative
					urlAnchor.href = urlAnchor.href;
					s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
						urlAnchor.protocol + "//" + urlAnchor.host;
				} catch (e) {

					// If there is an error parsing the URL, assume it is crossDomain,
					// it can be rejected by the transport if it is invalid
					s.crossDomain = true;
				}
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefilter, stop there
			if (state === 2) {
				return jqXHR;
			}

			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;

			// More options handling for requests with no content
			if (!s.hasContent) {

				// If data is available, append data to url
				if (s.data) {
					cacheURL = (s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data);

					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Add anti-cache in url if needed
				if (s.cache === false) {
					s.url = rts.test(cacheURL) ?

						// If there is already a '_' parameter, set its value
						cacheURL.replace(rts, "$1_=" + nonce++) :

						// Otherwise add one to the end
						cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
				}
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				if (jQuery.lastModified[cacheURL]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
				}
				if (jQuery.etag[cacheURL]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
					s.accepts[s.dataTypes[0]] +
						(s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") :
					s.accepts["*"]
			);

			// Check for headers option
			for (i in s.headers) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend &&
				(s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {

				// Abort if not done already and return
				return jqXHR.abort();
			}

			// Aborting is no longer a cancellation
			strAbort = "abort";

			// Install callbacks on deferreds
			for (i in { success: 1, error: 1, complete: 1 }) {
				jqXHR[i](s[i]);
			}

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;

				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}

				// If request was aborted inside ajaxSend, stop there
				if (state === 2) {
					return jqXHR;
				}

				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = window.setTimeout(function () {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch (e) {

					// Propagate exception as error if not done
					if (state < 2) {
						done(-1, e);

						// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			// Callback for when everything is done
			function done(status, nativeStatusText, responses, headers) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;

				// Called once
				if (state === 2) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if (timeoutTimer) {
					window.clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;

				// Get response data
				if (responses) {
					response = ajaxHandleResponses(s, jqXHR, responses);
				}

				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert(s, response, jqXHR, isSuccess);

				// If successful, handle type chaining
				if (isSuccess) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if (modified) {
							jQuery.lastModified[cacheURL] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if (modified) {
							jQuery.etag[cacheURL] = modified;
						}
					}

					// if no content
					if (status === 204 || s.type === "HEAD") {
						statusText = "nocontent";

						// if not modified
					} else if (status === 304) {
						statusText = "notmodified";

						// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {

					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if (status || !statusText) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = (nativeStatusText || statusText) + "";

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(statusCode);
				statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError",
						[jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);

					// Handle the global AJAX counter
					if (!(--jQuery.active)) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			return jqXHR;
		},

		getJSON: function (url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		getScript: function (url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		}
	});

	jQuery.each(["get", "post"], function (i, method) {
		jQuery[method] = function (url, data, callback, type) {

			// Shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			// The url can be an options object (which then must have .url)
			return jQuery.ajax(jQuery.extend({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			}, jQuery.isPlainObject(url) && url));
		};
	});


	jQuery._evalUrl = function (url) {
		return jQuery.ajax({
			url: url,

			// Make this explicit, since user can override this through ajaxSetup (#11264)
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};


	jQuery.fn.extend({
		wrapAll: function (html) {
			var wrap;

			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if (this[0]) {

				// The elements to wrap the target around
				wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function () {
					var elem = this;

					while (elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner: function (html) {
			if (jQuery.isFunction(html)) {
				return this.each(function (i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function () {
				var self = jQuery(this),
					contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);

				} else {
					self.append(html);
				}
			});
		},

		wrap: function (html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function (i) {
				jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
			});
		},

		unwrap: function () {
			return this.parent().each(function () {
				if (!jQuery.nodeName(this, "body")) {
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		}
	});


	jQuery.expr.filters.hidden = function (elem) {
		return !jQuery.expr.filters.visible(elem);
	};
	jQuery.expr.filters.visible = function (elem) {

		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		// Use OR instead of AND as the element is not visible if either is true
		// See tickets #10406 and #13132
		return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	};




	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;

	function buildParams(prefix, obj, traditional, add) {
		var name;

		if (jQuery.isArray(obj)) {

			// Serialize array item.
			jQuery.each(obj, function (i, v) {
				if (traditional || rbracket.test(prefix)) {

					// Treat each array item as a scalar.
					add(prefix, v);

				} else {

					// Item is non-scalar (array or object), encode its numeric index.
					buildParams(
						prefix + "[" + (typeof v === "object" && v != null ? i : "") + "]",
						v,
						traditional,
						add
					);
				}
			});

		} else if (!traditional && jQuery.type(obj) === "object") {

			// Serialize object item.
			for (name in obj) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}

		} else {

			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function (a, traditional) {
		var prefix,
			s = [],
			add = function (key, value) {

				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
				s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if (traditional === undefined) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {

			// Serialize the form elements
			jQuery.each(a, function () {
				add(this.name, this.value);
			});

		} else {

			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for (prefix in a) {
				buildParams(prefix, a[prefix], traditional, add);
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	};

	jQuery.fn.extend({
		serialize: function () {
			return jQuery.param(this.serializeArray());
		},
		serializeArray: function () {
			return this.map(function () {

				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop(this, "elements");
				return elements ? jQuery.makeArray(elements) : this;
			})
			.filter(function () {
				var type = this.type;

				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery(this).is(":disabled") &&
					rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
					(this.checked || !rcheckableType.test(type));
			})
			.map(function (i, elem) {
				var val = jQuery(this).val();

				return val == null ?
					null :
					jQuery.isArray(val) ?
						jQuery.map(val, function (val) {
							return { name: elem.name, value: val.replace(rCRLF, "\r\n") };
						}) :
					{ name: elem.name, value: val.replace(rCRLF, "\r\n") };
			}).get();
		}
	});


	jQuery.ajaxSettings.xhr = function () {
		try {
			return new window.XMLHttpRequest();
		} catch (e) { }
	};

	var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
			0: 200,

			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();

	support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
	support.ajax = xhrSupported = !!xhrSupported;

	jQuery.ajaxTransport(function (options) {
		var callback, errorCallback;

		// Cross domain only allowed if supported through XMLHttpRequest
		if (support.cors || xhrSupported && !options.crossDomain) {
			return {
				send: function (headers, complete) {
					var i,
						xhr = options.xhr();

					xhr.open(
						options.type,
						options.url,
						options.async,
						options.username,
						options.password
					);

					// Apply custom fields if provided
					if (options.xhrFields) {
						for (i in options.xhrFields) {
							xhr[i] = options.xhrFields[i];
						}
					}

					// Override mime type if needed
					if (options.mimeType && xhr.overrideMimeType) {
						xhr.overrideMimeType(options.mimeType);
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if (!options.crossDomain && !headers["X-Requested-With"]) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Set headers
					for (i in headers) {
						xhr.setRequestHeader(i, headers[i]);
					}

					// Callback
					callback = function (type) {
						return function () {
							if (callback) {
								callback = errorCallback = xhr.onload =
									xhr.onerror = xhr.onabort = xhr.onreadystatechange = null;

								if (type === "abort") {
									xhr.abort();
								} else if (type === "error") {

									// Support: IE9
									// On a manual native abort, IE9 throws
									// errors on any property access that is not readyState
									if (typeof xhr.status !== "number") {
										complete(0, "error");
									} else {
									complete(

											// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
									}
								} else {
									complete(
										xhrSuccessStatus[xhr.status] || xhr.status,
										xhr.statusText,

										// Support: IE9 only
										// IE9 has no XHR2 but throws on binary (trac-11426)
										// For XHR2 non-text, let the caller handle it (gh-2498)
										(xhr.responseType || "text") !== "text" ||
										typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};

					// Listen to events
					xhr.onload = callback();
					errorCallback = xhr.onerror = callback("error");

					// Support: IE9
					// Use onreadystatechange to replace onabort
					// to handle uncaught aborts
					if (xhr.onabort !== undefined) {
						xhr.onabort = errorCallback;
					} else {
						xhr.onreadystatechange = function () {

							// Check readyState before timeout as it changes
							if (xhr.readyState === 4) {

								// Allow onerror to be called first,
								// but that will not handle a native abort
								// Also, save errorCallback to a variable
								// as xhr.onerror cannot be accessed
								window.setTimeout(function () {
									if (callback) {
										errorCallback();
									}
								});
							}
						};
					}

					// Create the abort callback
					callback = callback("abort");

					try {

						// Do send the request (this may raise an exception)
						xhr.send(options.hasContent && options.data || null);
					} catch (e) {

						// #14683: Only rethrow if this hasn't been notified as an error yet
						if (callback) {
							throw e;
						}
					}
				},

				abort: function () {
					if (callback) {
						callback();
					}
				}
			};
		}
	});




	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, " +
				"application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /\b(?:java|ecma)script\b/
		},
		converters: {
			"text script": function (text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter("script", function (s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function (s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {
			var script, callback;
			return {
				send: function (_, complete) {
					script = jQuery("<script>").prop({
						charset: s.scriptCharset,
						src: s.url
					}).on(
						"load error",
						callback = function (evt) {
							script.remove();
							callback = null;
							if (evt) {
								complete(evt.type === "error" ? 404 : 200, evt.type);
							}
						}
					);

					// Use native DOM manipulation to avoid our domManip AJAX trickery
					document.head.appendChild(script[0]);
				},
				abort: function () {
					if (callback) {
						callback();
					}
				}
			};
		}
	});




	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function () {
			var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (nonce++));
			this[callback] = true;
			return callback;
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function (s, originalSettings, jqXHR) {

		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
				"url" :
				typeof s.data === "string" &&
					(s.contentType || "")
						.indexOf("application/x-www-form-urlencoded") === 0 &&
					rjsonp.test(s.data) && "data"
			);

		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if (jsonProp || s.dataTypes[0] === "jsonp") {

			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
				s.jsonpCallback() :
				s.jsonpCallback;

			// Insert callback into url or form data
			if (jsonProp) {
				s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
			} else if (s.jsonp !== false) {
				s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
			}

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function () {
				if (!responseContainer) {
					jQuery.error(callbackName + " was not called");
				}
				return responseContainer[0];
			};

			// Force json dataType
			s.dataTypes[0] = "json";

			// Install callback
			overwritten = window[callbackName];
			window[callbackName] = function () {
				responseContainer = arguments;
			};

			// Clean-up function (fires after converters)
			jqXHR.always(function () {

				// If previous value didn't exist - remove it
				if (overwritten === undefined) {
					jQuery(window).removeProp(callbackName);

					// Otherwise restore preexisting value
				} else {
				window[callbackName] = overwritten;
				}

				// Save back as free
				if (s[callbackName]) {

					// Make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;

					// Save the callback name for future use
					oldCallbacks.push(callbackName);
				}

				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(overwritten)) {
					overwritten(responseContainer[0]);
				}

				responseContainer = overwritten = undefined;
			});

			// Delegate to script
			return "script";
		}
	});




	// Argument "data" should be string of html
	// context (optional): If specified, the fragment will be created in this context,
	// defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function (data, context, keepScripts) {
		if (!data || typeof data !== "string") {
			return null;
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec(data),
			scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])];
		}

		parsed = buildFragment([data], context, scripts);

		if (scripts && scripts.length) {
			jQuery(scripts).remove();
		}

		return jQuery.merge([], parsed.childNodes);
	};


	// Keep a copy of the old load method
	var _load = jQuery.fn.load;

	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function (url, params, callback) {
		if (typeof url !== "string" && _load) {
			return _load.apply(this, arguments);
		}

		var selector, type, response,
			self = this,
			off = url.indexOf(" ");

		if (off > -1) {
			selector = jQuery.trim(url.slice(off));
			url = url.slice(0, off);
		}

		// If it's a function
		if (jQuery.isFunction(params)) {

			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && typeof params === "object") {
			type = "POST";
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			jQuery.ajax({
				url: url,

				// If "type" variable is undefined, then "GET" method will be used.
				// Make value of this field explicit since
				// user can override it through ajaxSetup method
				type: type || "GET",
				dataType: "html",
				data: params
			}).done(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?

					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) :

					// Otherwise use the full result
					responseText);

				// If the request succeeds, this function gets "data", "status", "jqXHR"
				// but they are ignored because response was set above.
				// If it fails, this function gets "jqXHR", "status", "error"
			}).always(callback && function (jqXHR, status) {
				self.each(function () {
					callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
				});
			});
		}

		return this;
	};




	// Attach a bunch of functions for handling common AJAX events
	jQuery.each([
		"ajaxStart",
		"ajaxStop",
		"ajaxComplete",
		"ajaxError",
		"ajaxSuccess",
		"ajaxSend"
	], function (i, type) {
		jQuery.fn[type] = function (fn) {
			return this.on(type, fn);
		};
	});




	jQuery.expr.filters.animated = function (elem) {
		return jQuery.grep(jQuery.timers, function (fn) {
			return elem === fn.elem;
		}).length;
	};




	/**
	 * Gets a window from an element
	 */
	function getWindow(elem) {
		return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	jQuery.offset = {
		setOffset: function (elem, options, i) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css(elem, "position"),
				curElem = jQuery(elem),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = jQuery.css(elem, "top");
			curCSSLeft = jQuery.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") &&
				(curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {

				// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
				options = options.call(elem, i, jQuery.extend({}, curOffset));
			}

			if (options.top != null) {
				props.top = (options.top - curOffset.top) + curTop;
			}
			if (options.left != null) {
				props.left = (options.left - curOffset.left) + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);

			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({
		offset: function (options) {
			if (arguments.length) {
				return options === undefined ?
					this :
					this.each(function (i) {
						jQuery.offset.setOffset(this, options, i);
					});
			}

			var docElem, win,
				elem = this[0],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;

			if (!doc) {
				return;
			}

			docElem = doc.documentElement;

			// Make sure it's not a disconnected DOM node
			if (!jQuery.contains(docElem, elem)) {
				return box;
			}

				box = elem.getBoundingClientRect();
			win = getWindow(doc);
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},

		position: function () {
			if (!this[0]) {
				return;
			}

			var offsetParent, offset,
				elem = this[0],
				parentOffset = { top: 0, left: 0 };

			// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
			// because it is its only offset parent
			if (jQuery.css(elem, "position") === "fixed") {

				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();

			} else {

				// Get *real* offsetParent
				offsetParent = this.offsetParent();

				// Get correct offsets
				offset = this.offset();
				if (!jQuery.nodeName(offsetParent[0], "html")) {
					parentOffset = offsetParent.offset();
				}

				// Add offsetParent borders
				parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
				parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
			}

			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
				left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
			};
		},

		// This method will return documentElement in the following cases:
		// 1) For the element inside the iframe without offsetParent, this method will return
		//    documentElement of the parent window
		// 2) For the hidden or detached element
		// 3) For body or html element, i.e. in case of the html node - it will return itself
		//
		// but those exceptions were never presented as a real life use-cases
		// and might be considered as more preferable results.
		//
		// This logic, however, is not guaranteed and can change at any point in the future
		offsetParent: function () {
			return this.map(function () {
				var offsetParent = this.offsetParent;

				while (offsetParent && jQuery.css(offsetParent, "position") === "static") {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || documentElement;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each({ scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function (method, prop) {
		var top = "pageYOffset" === prop;

		jQuery.fn[method] = function (val) {
			return access(this, function (elem, method, val) {
				var win = getWindow(elem);

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(
						!top ? val : win.pageXOffset,
						top ? val : win.pageYOffset
					);

				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length);
		};
	});

	// Support: Safari<7-8+, Chrome<37-44+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each(["top", "left"], function (i, prop) {
		jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition,
			function (elem, computed) {
				if (computed) {
					computed = curCSS(elem, prop);

					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test(computed) ?
						jQuery(elem).position()[prop] + "px" :
						computed;
				}
			}
		);
	});


	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each({ Height: "height", Width: "width" }, function (name, type) {
		jQuery.each({ padding: "inner" + name, content: type, "": "outer" + name },
			function (defaultExtra, funcName) {

			// Margin is only for outerHeight, outerWidth
			jQuery.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"),
					extra = defaultExtra || (margin === true || value === true ? "margin" : "border");

				return access(this, function (elem, type, value) {
					var doc;

					if (jQuery.isWindow(elem)) {

						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement["client" + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body["scroll" + name], doc["scroll" + name],
							elem.body["offset" + name], doc["offset" + name],
							doc["client" + name]
						);
					}

					return value === undefined ?

						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css(elem, type, extra) :

						// Set width or height on the element
						jQuery.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});


	jQuery.fn.extend({

		bind: function (types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind: function (types, fn) {
			return this.off(types, null, fn);
		},

		delegate: function (selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate: function (selector, types, fn) {

			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ?
				this.off(selector, "**") :
				this.off(types, selector || "**", fn);
		},
		size: function () {
		return this.length;
		}
	});

	jQuery.fn.andSelf = jQuery.fn.addBack;




	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.

	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

	if (typeof define === "function" && define.amd) {
		define("jquery", [], function () {
			return jQuery;
		});
	}



	var

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$;

	jQuery.noConflict = function (deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	};

	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if (!noGlobal) {
		window.jQuery = window.$ = jQuery;
	}

	return jQuery;
}));


///////////////////////////////// VZRF CODE BELOW /////////////////////////////////////////
// Immediately call noConflict and make $vf jQuery Alias for VZRF.
var $vf = jQuery.noConflict();




// Temporary accessibility helper for buttons. Disables accessibilty cues when using mouse.

//	$vf('a.button, .button').on('keyup', function (e) {
//		if (e.keyCode == 9) { // 'tab'
//			$vf(this).removeClass('no-focus-effect');
//		}
//	});

//	$vf('a.button, .button').on('blur', function () {
//		$vf(this).removeClass('no-focus-effect');
//	});
//});
function a11yInit(context) {
	var $context = getContext(context);

	$vf(document).trigger('beforeA11yInit')
	/*
	** This JS file contains scripts that will append accessibility attributes to components and pages
	**
	*/
	
	$context.off('touchstart mousedown');
	$context.on('touchstart mousedown', function () {
		focusRingHide();
	});

	$context.off('keydown');
	$context.on('keydown', function (e) {
		// if navigation type of key is pressed (tab, esc, left, up, right, down)
		var code = e.which;
		if (code === 9 || code === 27 || (code >= 37 && code <= 40)) {
			focusRingShow();
		} 
	});
	
		
	$vf('a', $context).each(function() {
		var $this = $vf(this);
		// IF target is _blank and does not already have a title, add a title attribute.
		if ($this.is('[target=_blank]') && !$this.is('title')) {
			$this.attr('title', 'Opens New Window');
		}
	});


	/*
	** appending accessibility attributes to html semantic elements
	** 
	*/
	$vf('main', $context).attr('role', 'main');
	$vf('header', $context).attr('role', 'banner');
	$vf('nav', $context).attr('role', 'navigation');
	$vf('article', $context).attr('role', 'article');
	$vf('section', $context).attr('role', 'region');
	$vf('aside', $context).attr('role', 'complementary');
	$vf('footer', $context).attr('role', 'contentinfo');

	/*
	**  appending accessibility attributes to buttons
	**  
	*/
	$vf('.button', $context).each(function () {
		var $this = $vf(this);

		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		$this.attr('role', 'button');
	});

	//$vf('.button', $context).attr({'role': 'button','tabindex':'0'});

	/*
	** appending accessibility attributes to loading indicators
	**
	*/
	$vf('.loader', $context).attr({ 'role': 'alertdialog', 'aria-busy': 'true' });

	/*
	** appending accessibility attributes to loading Top Bar
	**
	*/
	$vf('.w_top-bar', $context).attr({ 'role': 'menubar' });

	/*
	** assigning tabindex to anchor tags
	**
	*/
	$vf('a', $context).attr({ 'tabindex': 0 });

	/*
	**assigning aria tags to vzicons
	**
	*/
	$vf('.vzicon', $context).attr({ 'aria-hidden': 'true' });

	$vf(document).trigger('afterA11yInit');
} // end accessibilityInit();

/*
**  Global function for detecting space and enter keys and mouse click
**
*/
function keyClick(e){ 
var code = e.charCode || e.keyCode;      
	if (e.type === 'click'){
	    return true;
	}
	else if (e.type === 'keydown') {
		if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40) ) { // '38' is 'up' key and '40' is down key
		    return true;
		} else if (code === 32){		// '32' is spacebar
			// Do not scroll page when spacebar is hit while currentTarget is the actual target, 
			// but do allow default spacebar action otherwise.
			if (e.currentTarget === e.target) {
				e.preventDefault();
			}
	        return true;
	    }
	    else if (code === 13) { // '13' is 'enter' key
	        return true;
	    }
	}
	else if (e.type === 'keypress'){
	    if (code === 32){		// '32' is spacebar
			// Do not scroll page when spacebar is hit while currentTarget is the actual target, 
			// but do allow default spacebar action otherwise.
			if (e.currentTarget === e.target) {
				e.preventDefault();
			}
	        return true;
	    }
	    else if (code === 13) { // '13' is 'enter' key
	        return true;
	    }
	}
	else {
	    return false;
	}
}	


/*
 * Global set of functions for keeping track of a last focused element
 * when we move that focus inside of some screen-controling widget such 
 * as a Modal. When the widget use is complete, give focus back to the 
 * original element.
 */
var $vfFocus = $vf(document.activeElement);
function saveFocus() {
	$vfFocus = $vf(document.activeElement)
	return $vfFocus;
}

function resetFocus() {
	$vfFocus.focus();
	return $vfFocus;
}


/*
 * Focus Ring funtions.
 * Show the focus ring when navigating using the keyboard, but hide the 
 * focus ring when using mouse/touch events
 */

function focusRingHide() {
	// if the #FocusRingStyles does not exist, create it.
	if ($vf('#HideFocusRing').length === 0) {
		var styleHtml = '<style id="HideFocusRing">*:focus { outline:none; }</style>';
		$vf('head').append(styleHtml);
	} 
	
}

function focusRingShow() {
	if ($vf('#HideFocusRing').length) {
		$vf('#HideFocusRing').remove();
	} 	
}

/*! jQuery UI - v1.11.4 - 2016-05-22
* http://jqueryui.com
* Includes: core.js, datepicker.js
* Copyright jQuery Foundation and other contributors; Licensed MIT */

(function (factory) {
	if (typeof define === "function" && define.amd) {

		// AMD. Register as an anonymous module.
		define(["jquery"], factory);
	} else {

		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	/*!
	 * jQuery UI Core 1.11.4
	 * http://jqueryui.com
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/category/ui-core/
	 */


	// $.ui might exist from components with no dependencies, e.g., $.ui.position
	$.ui = $.ui || {};

	$.extend($.ui, {
		version: "1.11.4",

		keyCode: {
			BACKSPACE: 8,
			COMMA: 188,
			DELETE: 46,
			DOWN: 40,
			END: 35,
			ENTER: 13,
			ESCAPE: 27,
			HOME: 36,
			LEFT: 37,
			PAGE_DOWN: 34,
			PAGE_UP: 33,
			PERIOD: 190,
			RIGHT: 39,
			SPACE: 32,
			TAB: 9,
			UP: 38
		}
	});

	// plugins
	$.fn.extend({
		scrollParent: function (includeHidden) {
			var position = this.css("position"),
				excludeStaticParent = position === "absolute",
				overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
				scrollParent = this.parents().filter(function () {
					var parent = $(this);
					if (excludeStaticParent && parent.css("position") === "static") {
						return false;
					}
					return overflowRegex.test(parent.css("overflow") + parent.css("overflow-y") + parent.css("overflow-x"));
				}).eq(0);

			return position === "fixed" || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
		},

		uniqueId: (function () {
			var uuid = 0;

			return function () {
				return this.each(function () {
					if (!this.id) {
						this.id = "ui-id-" + (++uuid);
					}
				});
			};
		})(),

		removeUniqueId: function () {
			return this.each(function () {
				if (/^ui-id-\d+$/.test(this.id)) {
					$(this).removeAttr("id");
				}
			});
		}
	});

	// selectors
	function focusable(element, isTabIndexNotNaN) {
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase();
		if ("area" === nodeName) {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
				return false;
			}
			img = $("img[usemap='#" + mapName + "']")[0];
			return !!img && visible(img);
		}
		return (/^(input|select|textarea|button|object)$/.test(nodeName) ?
			!element.disabled :
			"a" === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);
	}

	function visible(element) {
		return $.expr.filters.visible(element) &&
			!$(element).parents().addBack().filter(function () {
				return $.css(this, "visibility") === "hidden";
			}).length;
	}

	$.extend($.expr[":"], {
		data: $.expr.createPseudo ?
			$.expr.createPseudo(function (dataName) {
				return function (elem) {
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8
			function (elem, i, match) {
				return !!$.data(elem, match[3]);
			},

		focusable: function (element) {
			return focusable(element, !isNaN($.attr(element, "tabindex")));
		},

		tabbable: function (element) {
			var tabIndex = $.attr(element, "tabindex"),
				isTabIndexNaN = isNaN(tabIndex);
			return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
		}
	});

	// support: jQuery <1.8
	if (!$("<a>").outerWidth(1).jquery) {
		$.each(["Width", "Height"], function (i, name) {
			var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
				type = name.toLowerCase(),
				orig = {
					innerWidth: $.fn.innerWidth,
					innerHeight: $.fn.innerHeight,
					outerWidth: $.fn.outerWidth,
					outerHeight: $.fn.outerHeight
				};

			function reduce(elem, size, border, margin) {
				$.each(side, function () {
					size -= parseFloat($.css(elem, "padding" + this)) || 0;
					if (border) {
						size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
					}
					if (margin) {
						size -= parseFloat($.css(elem, "margin" + this)) || 0;
					}
				});
				return size;
			}

			$.fn["inner" + name] = function (size) {
				if (size === undefined) {
					return orig["inner" + name].call(this);
				}

				return this.each(function () {
					$(this).css(type, reduce(this, size) + "px");
				});
			};

			$.fn["outer" + name] = function (size, margin) {
				if (typeof size !== "number") {
					return orig["outer" + name].call(this, size);
				}

				return this.each(function () {
					$(this).css(type, reduce(this, size, true, margin) + "px");
				});
			};
		});
	}

	// support: jQuery <1.8
	if (!$.fn.addBack) {
		$.fn.addBack = function (selector) {
			return this.add(selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		};
	}

	// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
	if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
		$.fn.removeData = (function (removeData) {
			return function (key) {
				if (arguments.length) {
					return removeData.call(this, $.camelCase(key));
				} else {
					return removeData.call(this);
				}
			};
		})($.fn.removeData);
	}

	// deprecated
	$.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());

	$.fn.extend({
		focus: (function (orig) {
			return function (delay, fn) {
				return typeof delay === "number" ?
					this.each(function () {
						var elem = this;
						setTimeout(function () {
							$(elem).focus();
							if (fn) {
								fn.call(elem);
							}
						}, delay);
					}) :
					orig.apply(this, arguments);
			};
		})($.fn.focus),

		disableSelection: (function () {
			var eventType = "onselectstart" in document.createElement("div") ?
				"selectstart" :
				"mousedown";

			return function () {
				return this.bind(eventType + ".ui-disableSelection", function (event) {
					event.preventDefault();
				});
			};
		})(),

		enableSelection: function () {
			return this.unbind(".ui-disableSelection");
		},

		zIndex: function (zIndex) {
			if (zIndex !== undefined) {
				return this.css("zIndex", zIndex);
			}

			if (this.length) {
				var elem = $(this[0]), position, value;
				while (elem.length && elem[0] !== document) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css("position");
					if (position === "absolute" || position === "relative" || position === "fixed") {
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt(elem.css("zIndex"), 10);
						if (!isNaN(value) && value !== 0) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}

			return 0;
		}
	});

	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	$.ui.plugin = {
		add: function (module, option, set) {
			var i,
				proto = $.ui[module].prototype;
			for (i in set) {
				proto.plugins[i] = proto.plugins[i] || [];
				proto.plugins[i].push([option, set[i]]);
			}
		},
		call: function (instance, name, args, allowDisconnected) {
			var i,
				set = instance.plugins[name];

			if (!set) {
				return;
			}

			if (!allowDisconnected && (!instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11)) {
				return;
			}

			for (i = 0; i < set.length; i++) {
				if (instance.options[set[i][0]]) {
					set[i][1].apply(instance.element, args);
				}
			}
		}
	};


	/*!
	 * jQuery UI Datepicker 1.11.4
	 * http://jqueryui.com
	 *
	 * Copyright jQuery Foundation and other contributors
	 * Released under the MIT license.
	 * http://jquery.org/license
	 *
	 * http://api.jqueryui.com/datepicker/
	 */


	$.extend($.ui, { datepicker: { version: "1.11.4" } });

	var datepicker_instActive;

	function datepicker_getZindex(elem) {
		var position, value;
		while (elem.length && elem[0] !== document) {
			// Ignore z-index if position is set to a value where z-index is ignored by the browser
			// This makes behavior of this function consistent across browsers
			// WebKit always returns auto if the element is positioned
			position = elem.css("position");
			if (position === "absolute" || position === "relative" || position === "fixed") {
				// IE returns 0 when zIndex is not specified
				// other browsers return a string
				// we ignore the case of nested elements with an explicit value of 0
				// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
				value = parseInt(elem.css("zIndex"), 10);
				if (!isNaN(value) && value !== 0) {
					return value;
				}
			}
			elem = elem.parent();
		}

		return 0;
	}
	/* Date picker manager.
	   Use the singleton instance of this class, $.datepicker, to interact with the date picker.
	   Settings for (groups of) date pickers are maintained in an instance object,
	   allowing multiple different settings on the same page. */

	function Datepicker() {
		this._curInst = null; // The current instance in use
		this._keyEvent = false; // If the last event was a key event
		this._disabledInputs = []; // List of date picker inputs that have been disabled
		this._datepickerShowing = false; // True if the popup picker is showing , false if not
		this._inDialog = false; // True if showing within a "dialog", false if not
		this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
		this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
		this._appendClass = "ui-datepicker-append"; // The name of the append marker class
		this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
		this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
		this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
		this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
		this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
		this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
		this.regional = []; // Available regional settings, indexed by language code
		this.regional[""] = { // Default regional settings
			closeText: "Done", // Display text for close link
			prevText: "Prev", // Display text for previous month link
			nextText: "Next", // Display text for next month link
			currentText: "Today", // Display text for current month link
			monthNames: ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"], // Names of months for drop-down and formatting
			monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
			dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
			dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
			dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
			weekHeader: "Wk", // Column header for week of the year
			dateFormat: "mm/dd/yy", // See format options on parseDate
			firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
			isRTL: false, // True if right-to-left language, false if left-to-right
			showMonthAfterYear: false, // True if the year select precedes month, false for month then year
			yearSuffix: "" // Additional text to append to the year in the month headers
		};
		this._defaults = { // Global defaults for all the date picker instances
			showOn: "focus", // "focus" for popup on focus,
			// "button" for trigger button, or "both" for either
			showAnim: "fadeIn", // Name of jQuery animation for popup
			showOptions: {}, // Options for enhanced animations
			defaultDate: null, // Used when field is blank: actual date,
			// +/-number for offset from today, null for today
			appendText: "", // Display text following the input box, e.g. showing the format
			buttonText: "...", // Text for trigger button
			buttonImage: "", // URL for trigger button image
			buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
			hideIfNoPrevNext: false, // True to hide next/previous month links
			// if not applicable, false to just disable them
			navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
			gotoCurrent: false, // True if today link goes back to current selection instead
			changeMonth: false, // True if month can be selected directly, false if only prev/next
			changeYear: false, // True if year can be selected directly, false if only prev/next
			yearRange: "c-10:c+10", // Range of years to display in drop-down,
			// either relative to today's year (-nn:+nn), relative to currently displayed year
			// (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
			showOtherMonths: false, // True to show dates in other months, false to leave blank
			selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
			showWeek: false, // True to show week of the year, false to not show it
			calculateWeek: this.iso8601Week, // How to calculate the week of the year,
			// takes a Date and returns the number of the week for it
			shortYearCutoff: "+10", // Short year values < this are in the current century,
			// > this are in the previous century,
			// string value starting with "+" for current year + value
			minDate: null, // The earliest selectable date, or null for no limit
			maxDate: null, // The latest selectable date, or null for no limit
			duration: "fast", // Duration of display/closure
			beforeShowDay: null, // Function that takes a date and returns an array with
			// [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
			// [2] = cell title (optional), e.g. $.datepicker.noWeekends
			beforeShow: null, // Function that takes an input field and
			// returns a set of custom settings for the date picker
			onSelect: null, // Define a callback function when a date is selected
			onChangeMonthYear: null, // Define a callback function when the month or year is changed
			onClose: null, // Define a callback function when the datepicker is closed
			numberOfMonths: 1, // Number of months to show at a time
			showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
			stepMonths: 1, // Number of months to step back/forward
			stepBigMonths: 12, // Number of months to step back/forward for the big links
			altField: "", // Selector for an alternate field to store selected dates into
			altFormat: "", // The date format to use for the alternate field
			constrainInput: true, // The input is constrained by the current date format
			showButtonPanel: false, // True to show button panel, false to not show it
			autoSize: false, // True to size the input for the date format, false to leave as is
			disabled: false // The initial disabled state
		};
		$.extend(this._defaults, this.regional[""]);
		this.regional.en = $.extend(true, {}, this.regional[""]);
		this.regional["en-US"] = $.extend(true, {}, this.regional.en);
		this.dpDiv = datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
	}

	$.extend(Datepicker.prototype, {
		/* Class name added to elements to indicate already configured with a date picker. */
		markerClassName: "hasDatepicker",

		//Keep track of the maximum number of rows displayed (see #7043)
		maxRows: 4,

		// TODO rename to "widget" when switching to widget factory
		_widgetDatepicker: function () {
			return this.dpDiv;
		},

		/* Override the default settings for all instances of the date picker.
		 * @param  settings  object - the new settings to use as defaults (anonymous object)
		 * @return the manager object
		 */
		setDefaults: function (settings) {
			datepicker_extendRemove(this._defaults, settings || {});
			return this;
		},

		/* Attach the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 * @param  settings  object - the new settings to use for this date picker instance (anonymous)
		 */
		_attachDatepicker: function (target, settings) {
			var nodeName, inline, inst;
			nodeName = target.nodeName.toLowerCase();
			inline = (nodeName === "div" || nodeName === "span");
			if (!target.id) {
				this.uuid += 1;
				target.id = "dp" + this.uuid;
			}
			inst = this._newInst($(target), inline);
			inst.settings = $.extend({}, settings || {});
			if (nodeName === "input") {
				this._connectDatepicker(target, inst);
			} else if (inline) {
				this._inlineDatepicker(target, inst);
			}
		},

		/* Create a new instance object. */
		_newInst: function (target, inline) {
			var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
			return {
				id: id, input: target, // associated target
				selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
				drawMonth: 0, drawYear: 0, // month being drawn
				inline: inline, // is datepicker inline or not
				dpDiv: (!inline ? this.dpDiv : // presentation div
				datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")))
			};
		},

		/* Attach the date picker to an input field. */
		_connectDatepicker: function (target, inst) {
			var input = $(target);
			inst.append = $([]);
			inst.trigger = $([]);
			if (input.hasClass(this.markerClassName)) {
				return;
			}
			this._attachments(input, inst);
			input.addClass(this.markerClassName).keydown(this._doKeyDown).
				keypress(this._doKeyPress).keyup(this._doKeyUp);
			this._autoSize(inst);
			$.data(target, "datepicker", inst);
			//If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
			if (inst.settings.disabled) {
				this._disableDatepicker(target);
			}
		},

		/* Make attachments based on settings. */
		_attachments: function (input, inst) {
			var showOn, buttonText, buttonImage,
				appendText = this._get(inst, "appendText"),
				isRTL = this._get(inst, "isRTL");

			if (inst.append) {
				inst.append.remove();
			}
			if (appendText) {
				inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
				input[isRTL ? "before" : "after"](inst.append);
			}

			input.unbind("focus", this._showDatepicker);

			if (inst.trigger) {
				inst.trigger.remove();
			}

			showOn = this._get(inst, "showOn");
			if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
				input.focus(this._showDatepicker);
			}
			if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
				buttonText = this._get(inst, "buttonText");
				buttonImage = this._get(inst, "buttonImage");
				inst.trigger = $(this._get(inst, "buttonImageOnly") ?
					$("<img/>").addClass(this._triggerClass).
						attr({ src: buttonImage, alt: buttonText, title: buttonText }) :
					$("<button type='button'></button>").addClass(this._triggerClass).
						html(!buttonImage ? buttonText : $("<img/>").attr(
						{ src: buttonImage, alt: buttonText, title: buttonText })));
				input[isRTL ? "before" : "after"](inst.trigger);
				inst.trigger.click(function () {
					if ($.datepicker._datepickerShowing && $.datepicker._lastInput === input[0]) {
						$.datepicker._hideDatepicker();
					} else if ($.datepicker._datepickerShowing && $.datepicker._lastInput !== input[0]) {
						$.datepicker._hideDatepicker();
						$.datepicker._showDatepicker(input[0]);
					} else {
						$.datepicker._showDatepicker(input[0]);
					}
					return false;
				});
			}
		},

		/* Apply the maximum length for the date format. */
		_autoSize: function (inst) {
			if (this._get(inst, "autoSize") && !inst.inline) {
				var findMax, max, maxI, i,
					date = new Date(2009, 12 - 1, 20), // Ensure double digits
					dateFormat = this._get(inst, "dateFormat");

				if (dateFormat.match(/[DM]/)) {
					findMax = function (names) {
						max = 0;
						maxI = 0;
						for (i = 0; i < names.length; i++) {
							if (names[i].length > max) {
								max = names[i].length;
								maxI = i;
							}
						}
						return maxI;
					};
					date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
						"monthNames" : "monthNamesShort"))));
					date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
						"dayNames" : "dayNamesShort"))) + 20 - date.getDay());
				}
				inst.input.attr("size", this._formatDate(inst, date).length);
			}
		},

		/* Attach an inline date picker to a div. */
		_inlineDatepicker: function (target, inst) {
			var divSpan = $(target);
			if (divSpan.hasClass(this.markerClassName)) {
				return;
			}
			divSpan.addClass(this.markerClassName).append(inst.dpDiv);
			$.data(target, "datepicker", inst);
			this._setDate(inst, this._getDefaultDate(inst), true);
			this._updateDatepicker(inst);
			this._updateAlternate(inst);
			//If disabled option is true, disable the datepicker before showing it (see ticket #5665)
			if (inst.settings.disabled) {
				this._disableDatepicker(target);
			}
			// Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
			// http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
			inst.dpDiv.css("display", "block");
		},

		/* Pop-up the date picker in a "dialog" box.
		 * @param  input element - ignored
		 * @param  date	string or Date - the initial date to display
		 * @param  onSelect  function - the function to call when a date is selected
		 * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
		 * @param  pos int[2] - coordinates for the dialog's position within the screen or
		 *					event - with x/y coordinates or
		 *					leave empty for default (screen centre)
		 * @return the manager object
		 */
		_dialogDatepicker: function (input, date, onSelect, settings, pos) {
			var id, browserWidth, browserHeight, scrollX, scrollY,
				inst = this._dialogInst; // internal instance

			if (!inst) {
				this.uuid += 1;
				id = "dp" + this.uuid;
				this._dialogInput = $("<input type='text' id='" + id +
					"' style='position: absolute; top: -100px; width: 0px;'/>");
				this._dialogInput.keydown(this._doKeyDown);
				$("body").append(this._dialogInput);
				inst = this._dialogInst = this._newInst(this._dialogInput, false);
				inst.settings = {};
				$.data(this._dialogInput[0], "datepicker", inst);
			}
			datepicker_extendRemove(inst.settings, settings || {});
			date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
			this._dialogInput.val(date);

			this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
			if (!this._pos) {
				browserWidth = document.documentElement.clientWidth;
				browserHeight = document.documentElement.clientHeight;
				scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				this._pos = // should use actual width/height below
					[(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
			}

			// move input on screen for focus, but hidden behind dialog
			this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
			inst.settings.onSelect = onSelect;
			this._inDialog = true;
			this.dpDiv.addClass(this._dialogClass);
			this._showDatepicker(this._dialogInput[0]);
			if ($.blockUI) {
				$.blockUI(this.dpDiv);
			}
			$.data(this._dialogInput[0], "datepicker", inst);
			return this;
		},

		/* Detach a datepicker from its control.
		 * @param  target	element - the target input field or division or span
		 */
		_destroyDatepicker: function (target) {
			var nodeName,
				$target = $(target),
				inst = $.data(target, "datepicker");

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			$.removeData(target, "datepicker");
			if (nodeName === "input") {
				inst.append.remove();
				inst.trigger.remove();
				$target.removeClass(this.markerClassName).
					unbind("focus", this._showDatepicker).
					unbind("keydown", this._doKeyDown).
					unbind("keypress", this._doKeyPress).
					unbind("keyup", this._doKeyUp);
			} else if (nodeName === "div" || nodeName === "span") {
				$target.removeClass(this.markerClassName).empty();
			}

			if (datepicker_instActive === inst) {
				datepicker_instActive = null;
			}
		},

		/* Enable the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 */
		_enableDatepicker: function (target) {
			var nodeName, inline,
				$target = $(target),
				inst = $.data(target, "datepicker");

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			if (nodeName === "input") {
				target.disabled = false;
				inst.trigger.filter("button").
					each(function () { this.disabled = false; }).end().
					filter("img").css({ opacity: "1.0", cursor: "" });
			} else if (nodeName === "div" || nodeName === "span") {
				inline = $target.children("." + this._inlineClass);
				inline.children().removeClass("ui-state-disabled");
				inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
					prop("disabled", false);
			}
			this._disabledInputs = $.map(this._disabledInputs,
				function (value) { return (value === target ? null : value); }); // delete entry
		},

		/* Disable the date picker to a jQuery selection.
		 * @param  target	element - the target input field or division or span
		 */
		_disableDatepicker: function (target) {
			var nodeName, inline,
				$target = $(target),
				inst = $.data(target, "datepicker");

			if (!$target.hasClass(this.markerClassName)) {
				return;
			}

			nodeName = target.nodeName.toLowerCase();
			if (nodeName === "input") {
				target.disabled = true;
				inst.trigger.filter("button").
					each(function () { this.disabled = true; }).end().
					filter("img").css({ opacity: "0.5", cursor: "default" });
			} else if (nodeName === "div" || nodeName === "span") {
				inline = $target.children("." + this._inlineClass);
				inline.children().addClass("ui-state-disabled");
				inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
					prop("disabled", true);
			}
			this._disabledInputs = $.map(this._disabledInputs,
				function (value) { return (value === target ? null : value); }); // delete entry
			this._disabledInputs[this._disabledInputs.length] = target;
		},

		/* Is the first field in a jQuery collection disabled as a datepicker?
		 * @param  target	element - the target input field or division or span
		 * @return boolean - true if disabled, false if enabled
		 */
		_isDisabledDatepicker: function (target) {
			if (!target) {
				return false;
			}
			for (var i = 0; i < this._disabledInputs.length; i++) {
				if (this._disabledInputs[i] === target) {
					return true;
				}
			}
			return false;
		},

		/* Retrieve the instance data for the target control.
		 * @param  target  element - the target input field or division or span
		 * @return  object - the associated instance data
		 * @throws  error if a jQuery problem getting data
		 */
		_getInst: function (target) {
			try {
				return $.data(target, "datepicker");
			}
			catch (err) {
				throw "Missing instance data for this datepicker";
			}
		},

		/* Update or retrieve the settings for a date picker attached to an input field or division.
		 * @param  target  element - the target input field or division or span
		 * @param  name	object - the new settings to update or
		 *				string - the name of the setting to change or retrieve,
		 *				when retrieving also "all" for all instance settings or
		 *				"defaults" for all global defaults
		 * @param  value   any - the new value for the setting
		 *				(omit if above is an object or to retrieve a value)
		 */
		_optionDatepicker: function (target, name, value) {
			var settings, date, minDate, maxDate,
				inst = this._getInst(target);

			if (arguments.length === 2 && typeof name === "string") {
				return (name === "defaults" ? $.extend({}, $.datepicker._defaults) :
					(inst ? (name === "all" ? $.extend({}, inst.settings) :
					this._get(inst, name)) : null));
			}

			settings = name || {};
			if (typeof name === "string") {
				settings = {};
				settings[name] = value;
			}

			if (inst) {
				if (this._curInst === inst) {
					this._hideDatepicker();
				}

				date = this._getDateDatepicker(target, true);
				minDate = this._getMinMaxDate(inst, "min");
				maxDate = this._getMinMaxDate(inst, "max");
				datepicker_extendRemove(inst.settings, settings);
				// reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
				if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
					inst.settings.minDate = this._formatDate(inst, minDate);
				}
				if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
					inst.settings.maxDate = this._formatDate(inst, maxDate);
				}
				if ("disabled" in settings) {
					if (settings.disabled) {
						this._disableDatepicker(target);
					} else {
						this._enableDatepicker(target);
					}
				}
				this._attachments($(target), inst);
				this._autoSize(inst);
				this._setDate(inst, date);
				this._updateAlternate(inst);
				this._updateDatepicker(inst);
			}
		},

		// change method deprecated
		_changeDatepicker: function (target, name, value) {
			this._optionDatepicker(target, name, value);
		},

		/* Redraw the date picker attached to an input field or division.
		 * @param  target  element - the target input field or division or span
		 */
		_refreshDatepicker: function (target) {
			var inst = this._getInst(target);
			if (inst) {
				this._updateDatepicker(inst);
			}
		},

		/* Set the dates for a jQuery selection.
		 * @param  target element - the target input field or division or span
		 * @param  date	Date - the new date
		 */
		_setDateDatepicker: function (target, date) {
			var inst = this._getInst(target);
			if (inst) {
				this._setDate(inst, date);
				this._updateDatepicker(inst);
				this._updateAlternate(inst);
			}
		},

		/* Get the date(s) for the first entry in a jQuery selection.
		 * @param  target element - the target input field or division or span
		 * @param  noDefault boolean - true if no default date is to be used
		 * @return Date - the current date
		 */
		_getDateDatepicker: function (target, noDefault) {
			var inst = this._getInst(target);
			if (inst && !inst.inline) {
				this._setDateFromField(inst, noDefault);
			}
			return (inst ? this._getDate(inst) : null);
		},

		/* Handle keystrokes. */
		_doKeyDown: function (event) {
			var onSelect, dateStr, sel,
				inst = $.datepicker._getInst(event.target),
				handled = true,
				isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

			inst._keyEvent = true;
			if ($.datepicker._datepickerShowing) {
				switch (event.keyCode) {
					case 9: $.datepicker._hideDatepicker();
						handled = false;
						break; // hide on tab out
					case 13: sel = $("td." + $.datepicker._dayOverClass + ":not(." +
										$.datepicker._currentClass + ")", inst.dpDiv);
						if (sel[0]) {
							$.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
						}

						onSelect = $.datepicker._get(inst, "onSelect");
						if (onSelect) {
							dateStr = $.datepicker._formatDate(inst);

							// trigger custom callback
							onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
						} else {
							$.datepicker._hideDatepicker();
						}

						return false; // don't submit the form
					case 27: $.datepicker._hideDatepicker();
						break; // hide on escape
					case 33: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						break; // previous month/year on page up/+ ctrl
					case 34: $.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						break; // next month/year on page down/+ ctrl
					case 35: if (event.ctrlKey || event.metaKey) {
						$.datepicker._clearDate(event.target);
					}
						handled = event.ctrlKey || event.metaKey;
						break; // clear on ctrl or command +end
					case 36: if (event.ctrlKey || event.metaKey) {
						$.datepicker._gotoToday(event.target);
					}
						handled = event.ctrlKey || event.metaKey;
						break; // current on ctrl or command +home
					case 37: if (event.ctrlKey || event.metaKey) {
						$.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
					}
						handled = event.ctrlKey || event.metaKey;
						// -1 day on ctrl or command +left
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								-$.datepicker._get(inst, "stepBigMonths") :
								-$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +left on Mac
						break;
					case 38: if (event.ctrlKey || event.metaKey) {
						$.datepicker._adjustDate(event.target, -7, "D");
					}
						handled = event.ctrlKey || event.metaKey;
						break; // -1 week on ctrl or command +up
					case 39: if (event.ctrlKey || event.metaKey) {
						$.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
					}
						handled = event.ctrlKey || event.metaKey;
						// +1 day on ctrl or command +right
						if (event.originalEvent.altKey) {
							$.datepicker._adjustDate(event.target, (event.ctrlKey ?
								+$.datepicker._get(inst, "stepBigMonths") :
								+$.datepicker._get(inst, "stepMonths")), "M");
						}
						// next month/year on alt +right
						break;
					case 40: if (event.ctrlKey || event.metaKey) {
						$.datepicker._adjustDate(event.target, +7, "D");
					}
						handled = event.ctrlKey || event.metaKey;
						break; // +1 week on ctrl or command +down
					default: handled = false;
				}
			} else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
				$.datepicker._showDatepicker(this);
			} else {
				handled = false;
			}

			if (handled) {
				event.preventDefault();
				event.stopPropagation();
			}
		},

		/* Filter entered characters - based on date format. */
		_doKeyPress: function (event) {
			var chars, chr,
				inst = $.datepicker._getInst(event.target);

			if ($.datepicker._get(inst, "constrainInput")) {
				chars = $.datepicker._possibleChars($.datepicker._get(inst, "dateFormat"));
				chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
				return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
			}
		},

		/* Synchronise manual entry and field/alternate field. */
		_doKeyUp: function (event) {
			var date,
				inst = $.datepicker._getInst(event.target);

			if (inst.input.val() !== inst.lastVal) {
				try {
					date = $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
						(inst.input ? inst.input.val() : null),
						$.datepicker._getFormatConfig(inst));

					if (date) { // only if valid
						$.datepicker._setDateFromField(inst);
						$.datepicker._updateAlternate(inst);
						$.datepicker._updateDatepicker(inst);
					}
				}
				catch (err) {
				}
			}
			return true;
		},

		/* Pop-up the date picker for a given input field.
		 * If false returned from beforeShow event handler do not show.
		 * @param  input  element - the input field attached to the date picker or
		 *					event - if triggered by focus
		 */
		_showDatepicker: function (input) {
			input = input.target || input;
			if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
				input = $("input", input.parentNode)[0];
			}

			if ($.datepicker._isDisabledDatepicker(input) || $.datepicker._lastInput === input) { // already here
				return;
			}

			var inst, beforeShow, beforeShowSettings, isFixed,
				offset, showAnim, duration;

			inst = $.datepicker._getInst(input);
			if ($.datepicker._curInst && $.datepicker._curInst !== inst) {
				$.datepicker._curInst.dpDiv.stop(true, true);
				if (inst && $.datepicker._datepickerShowing) {
					$.datepicker._hideDatepicker($.datepicker._curInst.input[0]);
				}
			}

			beforeShow = $.datepicker._get(inst, "beforeShow");
			beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
			if (beforeShowSettings === false) {
				return;
			}
			datepicker_extendRemove(inst.settings, beforeShowSettings);

			inst.lastVal = null;
			$.datepicker._lastInput = input;
			$.datepicker._setDateFromField(inst);

			if ($.datepicker._inDialog) { // hide cursor
				input.value = "";
			}
			if (!$.datepicker._pos) { // position below input
				$.datepicker._pos = $.datepicker._findPos(input);
				$.datepicker._pos[1] += input.offsetHeight; // add the height
			}

			isFixed = false;
			$(input).parents().each(function () {
				isFixed |= $(this).css("position") === "fixed";
				return !isFixed;
			});

			offset = { left: $.datepicker._pos[0], top: $.datepicker._pos[1] };
			$.datepicker._pos = null;
			//to avoid flashes on Firefox
			inst.dpDiv.empty();
			// determine sizing offscreen
			inst.dpDiv.css({ position: "absolute", display: "block", top: "-1000px" });
			$.datepicker._updateDatepicker(inst);
			// fix width for dynamic number of date pickers
			// and adjust position before showing
			offset = $.datepicker._checkOffset(inst, offset, isFixed);
			inst.dpDiv.css({
				position: ($.datepicker._inDialog && $.blockUI ?
					"static" : (isFixed ? "fixed" : "absolute")), display: "none",
				left: offset.left + "px", top: offset.top + "px"
			});

			if (!inst.inline) {
				showAnim = $.datepicker._get(inst, "showAnim");
				duration = $.datepicker._get(inst, "duration");
				inst.dpDiv.css("z-index", datepicker_getZindex($(input)) + 1);
				$.datepicker._datepickerShowing = true;

				if ($.effects && $.effects.effect[showAnim]) {
					inst.dpDiv.show(showAnim, $.datepicker._get(inst, "showOptions"), duration);
				} else {
					inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
				}

				if ($.datepicker._shouldFocusInput(inst)) {
					inst.input.focus();
				}

				$.datepicker._curInst = inst;
			}
		},

		/* Generate the date picker content. */
		_updateDatepicker: function (inst) {
			this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
			datepicker_instActive = inst; // for delegate hover events
			inst.dpDiv.empty().append(this._generateHTML(inst));
			this._attachHandlers(inst);

			var origyearshtml,
				numMonths = this._getNumberOfMonths(inst),
				cols = numMonths[1],
				width = 17,
				activeCell = inst.dpDiv.find("." + this._dayOverClass + " a");

			if (activeCell.length > 0) {
				datepicker_handleMouseover.apply(activeCell.get(0));
			}

			inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");
			if (cols > 1) {
				inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", (width * cols) + "em");
			}
			inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
				"Class"]("ui-datepicker-multi");
			inst.dpDiv[(this._get(inst, "isRTL") ? "add" : "remove") +
				"Class"]("ui-datepicker-rtl");

			if (inst === $.datepicker._curInst && $.datepicker._datepickerShowing && $.datepicker._shouldFocusInput(inst)) {
				inst.input.focus();
			}

			// deffered render of the years select (to avoid flashes on Firefox)
			if (inst.yearshtml) {
				origyearshtml = inst.yearshtml;
				setTimeout(function () {
					//assure that inst.yearshtml didn't change.
					if (origyearshtml === inst.yearshtml && inst.yearshtml) {
						inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
					}
					origyearshtml = inst.yearshtml = null;
				}, 0);
			}
		},

		// #6694 - don't focus the input if it's already focused
		// this breaks the change event in IE
		// Support: IE and jQuery <1.9
		_shouldFocusInput: function (inst) {
			return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
		},

		/* Check positioning to remain on screen. */
		_checkOffset: function (inst, offset, isFixed) {
			var dpWidth = inst.dpDiv.outerWidth(),
				dpHeight = inst.dpDiv.outerHeight(),
				inputWidth = inst.input ? inst.input.outerWidth() : 0,
				inputHeight = inst.input ? inst.input.outerHeight() : 0,
				viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
				viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());

			offset.left -= (this._get(inst, "isRTL") ? (dpWidth - inputWidth) : 0);
			offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
			offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;

			// now check if datepicker is showing outside window viewport - move to a better place if so.
			offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
				Math.abs(offset.left + dpWidth - viewWidth) : 0);
			offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
				Math.abs(dpHeight + inputHeight) : 0);

			return offset;
		},

		/* Find an object's position on the screen. */
		_findPos: function (obj) {
			var position,
				inst = this._getInst(obj),
				isRTL = this._get(inst, "isRTL");

			while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
				obj = obj[isRTL ? "previousSibling" : "nextSibling"];
			}

			position = $(obj).offset();
			return [position.left, position.top];
		},

		/* Hide the date picker from view.
		 * @param  input  element - the input field attached to the date picker
		 */
		_hideDatepicker: function (input) {
			var showAnim, duration, postProcess, onClose,
				inst = this._curInst;

			if (!inst || (input && inst !== $.data(input, "datepicker"))) {
				return;
			}

			if (this._datepickerShowing) {
				showAnim = this._get(inst, "showAnim");
				duration = this._get(inst, "duration");
				postProcess = function () {
					$.datepicker._tidyDialog(inst);
				};

				// DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
				if ($.effects && ($.effects.effect[showAnim] || $.effects[showAnim])) {
					inst.dpDiv.hide(showAnim, $.datepicker._get(inst, "showOptions"), duration, postProcess);
				} else {
					inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
						(showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
				}

				if (!showAnim) {
					postProcess();
				}
				this._datepickerShowing = false;

				onClose = this._get(inst, "onClose");
				if (onClose) {
					onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
				}

				this._lastInput = null;
				if (this._inDialog) {
					this._dialogInput.css({ position: "absolute", left: "0", top: "-100px" });
					if ($.blockUI) {
						$.unblockUI();
						$("body").append(this.dpDiv);
					}
				}
				this._inDialog = false;
			}
		},

		/* Tidy up after a dialog display. */
		_tidyDialog: function (inst) {
			inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
		},

		/* Close date picker if clicked elsewhere. */
		_checkExternalClick: function (event) {
			if (!$.datepicker._curInst) {
				return;
			}

			var $target = $(event.target),
				inst = $.datepicker._getInst($target[0]);

			if ((($target[0].id !== $.datepicker._mainDivId &&
					$target.parents("#" + $.datepicker._mainDivId).length === 0 &&
					!$target.hasClass($.datepicker.markerClassName) &&
					!$target.closest("." + $.datepicker._triggerClass).length &&
					$.datepicker._datepickerShowing && !($.datepicker._inDialog && $.blockUI))) ||
				($target.hasClass($.datepicker.markerClassName) && $.datepicker._curInst !== inst)) {
				$.datepicker._hideDatepicker();
			}
		},

		/* Adjust one of the date sub-fields. */
		_adjustDate: function (id, offset, period) {
			var target = $(id),
				inst = this._getInst(target[0]);

			if (this._isDisabledDatepicker(target[0])) {
				return;
			}
			this._adjustInstDate(inst, offset +
				(period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
				period);
			this._updateDatepicker(inst);
		},

		/* Action for current link. */
		_gotoToday: function (id) {
			var date,
				target = $(id),
				inst = this._getInst(target[0]);

			if (this._get(inst, "gotoCurrent") && inst.currentDay) {
				inst.selectedDay = inst.currentDay;
				inst.drawMonth = inst.selectedMonth = inst.currentMonth;
				inst.drawYear = inst.selectedYear = inst.currentYear;
			} else {
				date = new Date();
				inst.selectedDay = date.getDate();
				inst.drawMonth = inst.selectedMonth = date.getMonth();
				inst.drawYear = inst.selectedYear = date.getFullYear();
			}
			this._notifyChange(inst);
			this._adjustDate(target);
		},

		/* Action for selecting a new month/year. */
		_selectMonthYear: function (id, select, period) {
			var target = $(id),
				inst = this._getInst(target[0]);

			inst["selected" + (period === "M" ? "Month" : "Year")] =
			inst["draw" + (period === "M" ? "Month" : "Year")] =
				parseInt(select.options[select.selectedIndex].value, 10);

			this._notifyChange(inst);
			this._adjustDate(target);
		},

		/* Action for selecting a day. */
		_selectDay: function (id, month, year, td) {
			var inst,
				target = $(id);

			if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
				return;
			}

			inst = this._getInst(target[0]);
			inst.selectedDay = inst.currentDay = $("a", td).html();
			inst.selectedMonth = inst.currentMonth = month;
			inst.selectedYear = inst.currentYear = year;
			this._selectDate(id, this._formatDate(inst,
				inst.currentDay, inst.currentMonth, inst.currentYear));
		},

		/* Erase the input field and hide the date picker. */
		_clearDate: function (id) {
			var target = $(id);
			this._selectDate(target, "");
		},

		/* Update the input field with the selected date. */
		_selectDate: function (id, dateStr) {
			var onSelect,
				target = $(id),
				inst = this._getInst(target[0]);

			dateStr = (dateStr != null ? dateStr : this._formatDate(inst));
			if (inst.input) {
				inst.input.val(dateStr);
			}
			this._updateAlternate(inst);

			onSelect = this._get(inst, "onSelect");
			if (onSelect) {
				onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
			} else if (inst.input) {
				inst.input.trigger("change"); // fire the change event
			}

			if (inst.inline) {
				this._updateDatepicker(inst);
			} else {
				this._hideDatepicker();
				this._lastInput = inst.input[0];
				if (typeof (inst.input[0]) !== "object") {
					inst.input.focus(); // restore focus
				}
				this._lastInput = null;
			}
		},

		/* Update any alternate field to synchronise with the main field. */
		_updateAlternate: function (inst) {
			var altFormat, date, dateStr,
				altField = this._get(inst, "altField");

			if (altField) { // update alternate field too
				altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
				date = this._getDate(inst);
				dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
				$(altField).each(function () { $(this).val(dateStr); });
			}
		},

		/* Set as beforeShowDay function to prevent selection of weekends.
		 * @param  date  Date - the date to customise
		 * @return [boolean, string] - is this date selectable?, what is its CSS class?
		 */
		noWeekends: function (date) {
			var day = date.getDay();
			return [(day > 0 && day < 6), ""];
		},

		/* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
		 * @param  date  Date - the date to get the week for
		 * @return  number - the number of the week within the year that contains this date
		 */
		iso8601Week: function (date) {
			var time,
				checkDate = new Date(date.getTime());

			// Find Thursday of this week starting on Monday
			checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

			time = checkDate.getTime();
			checkDate.setMonth(0); // Compare with Jan 1
			checkDate.setDate(1);
			return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
		},

		/* Parse a string value into a date object.
		 * See formatDate below for the possible formats.
		 *
		 * @param  format string - the expected format of the date
		 * @param  value string - the date in the above format
		 * @param  settings Object - attributes include:
		 *					shortYearCutoff  number - the cutoff year for determining the century (optional)
		 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
		 *					dayNames		string[7] - names of the days from Sunday (optional)
		 *					monthNamesShort string[12] - abbreviated names of the months (optional)
		 *					monthNames		string[12] - names of the months (optional)
		 * @return  Date - the extracted date value or null if value is blank
		 */
		parseDate: function (format, value, settings) {
			if (format == null || value == null) {
				throw "Invalid arguments";
			}

			value = (typeof value === "object" ? value.toString() : value + "");
			if (value === "") {
				return null;
			}

			var iFormat, dim, extra,
				iValue = 0,
				shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
				shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
					new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
				dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
				year = -1,
				month = -1,
				day = -1,
				doy = -1,
				literal = false,
				date,
				// Check whether a format character is doubled
				lookAhead = function (match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				// Extract a number from the string value
				getNumber = function (match) {
					var isDoubled = lookAhead(match),
						size = (match === "@" ? 14 : (match === "!" ? 20 :
						(match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
						minSize = (match === "y" ? size : 1),
						digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
						num = value.substring(iValue).match(digits);
					if (!num) {
						throw "Missing number at position " + iValue;
					}
					iValue += num[0].length;
					return parseInt(num[0], 10);
				},
				// Extract a name from the string value and convert to an index
				getName = function (match, shortNames, longNames) {
					var index = -1,
						names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
							return [[k, v]];
						}).sort(function (a, b) {
							return -(a[1].length - b[1].length);
						});

					$.each(names, function (i, pair) {
						var name = pair[1];
						if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
							index = pair[0];
							iValue += name.length;
							return false;
						}
					});
					if (index !== -1) {
						return index + 1;
					} else {
						throw "Unknown name at position " + iValue;
					}
				},
				// Confirm that a literal character matches the string value
				checkLiteral = function () {
					if (value.charAt(iValue) !== format.charAt(iFormat)) {
						throw "Unexpected literal at position " + iValue;
					}
					iValue++;
				};

			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						checkLiteral();
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d":
							day = getNumber("d");
							break;
						case "D":
							getName("D", dayNamesShort, dayNames);
							break;
						case "o":
							doy = getNumber("o");
							break;
						case "m":
							month = getNumber("m");
							break;
						case "M":
							month = getName("M", monthNamesShort, monthNames);
							break;
						case "y":
							year = getNumber("y");
							break;
						case "@":
							date = new Date(getNumber("@"));
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "!":
							date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
							year = date.getFullYear();
							month = date.getMonth() + 1;
							day = date.getDate();
							break;
						case "'":
							if (lookAhead("'")) {
								checkLiteral();
							} else {
								literal = true;
							}
							break;
						default:
							checkLiteral();
					}
				}
			}

			if (iValue < value.length) {
				extra = value.substr(iValue);
				if (!/^\s+/.test(extra)) {
					throw "Extra/unparsed characters found in date: " + extra;
				}
			}

			if (year === -1) {
				year = new Date().getFullYear();
			} else if (year < 100) {
				year += new Date().getFullYear() - new Date().getFullYear() % 100 +
					(year <= shortYearCutoff ? 0 : -100);
			}

			if (doy > -1) {
				month = 1;
				day = doy;
				do {
					dim = this._getDaysInMonth(year, month - 1);
					if (day <= dim) {
						break;
					}
					month++;
					day -= dim;
				} while (true);
			}

			date = this._daylightSavingAdjust(new Date(year, month - 1, day));
			if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
				throw "Invalid date"; // E.g. 31/02/00
			}
			return date;
		},

		/* Standard date formats. */
		ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
		COOKIE: "D, dd M yy",
		ISO_8601: "yy-mm-dd",
		RFC_822: "D, d M y",
		RFC_850: "DD, dd-M-y",
		RFC_1036: "D, d M y",
		RFC_1123: "D, d M yy",
		RFC_2822: "D, d M yy",
		RSS: "D, d M y", // RFC 822
		TICKS: "!",
		TIMESTAMP: "@",
		W3C: "yy-mm-dd", // ISO 8601

		_ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
			Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

		/* Format a date object into a string value.
		 * The format can be combinations of the following:
		 * d  - day of month (no leading zero)
		 * dd - day of month (two digit)
		 * o  - day of year (no leading zeros)
		 * oo - day of year (three digit)
		 * D  - day name short
		 * DD - day name long
		 * m  - month of year (no leading zero)
		 * mm - month of year (two digit)
		 * M  - month name short
		 * MM - month name long
		 * y  - year (two digit)
		 * yy - year (four digit)
		 * @ - Unix timestamp (ms since 01/01/1970)
		 * ! - Windows ticks (100ns since 01/01/0001)
		 * "..." - literal text
		 * '' - single quote
		 *
		 * @param  format string - the desired format of the date
		 * @param  date Date - the date value to format
		 * @param  settings Object - attributes include:
		 *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
		 *					dayNames		string[7] - names of the days from Sunday (optional)
		 *					monthNamesShort string[12] - abbreviated names of the months (optional)
		 *					monthNames		string[12] - names of the months (optional)
		 * @return  string - the date in the above format
		 */
		formatDate: function (format, date, settings) {
			if (!date) {
				return "";
			}

			var iFormat,
				dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
				dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
				monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
				monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
				// Check whether a format character is doubled
				lookAhead = function (match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				},
				// Format a number, with leading zero if necessary
				formatNumber = function (match, value, len) {
					var num = "" + value;
					if (lookAhead(match)) {
						while (num.length < len) {
							num = "0" + num;
						}
					}
					return num;
				},
				// Format a name, short or long as requested
				formatName = function (match, value, shortNames, longNames) {
					return (lookAhead(match) ? longNames[value] : shortNames[value]);
				},
				output = "",
				literal = false;

			if (date) {
				for (iFormat = 0; iFormat < format.length; iFormat++) {
					if (literal) {
						if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
							literal = false;
						} else {
							output += format.charAt(iFormat);
						}
					} else {
						switch (format.charAt(iFormat)) {
							case "d":
								output += formatNumber("d", date.getDate(), 2);
								break;
							case "D":
								output += formatName("D", date.getDay(), dayNamesShort, dayNames);
								break;
							case "o":
								output += formatNumber("o",
									Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
								break;
							case "m":
								output += formatNumber("m", date.getMonth() + 1, 2);
								break;
							case "M":
								output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
								break;
							case "y":
								output += (lookAhead("y") ? date.getFullYear() :
									(date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
								break;
							case "@":
								output += date.getTime();
								break;
							case "!":
								output += date.getTime() * 10000 + this._ticksTo1970;
								break;
							case "'":
								if (lookAhead("'")) {
									output += "'";
								} else {
									literal = true;
								}
								break;
							default:
								output += format.charAt(iFormat);
						}
					}
				}
			}
			return output;
		},

		/* Extract all possible characters from the date format. */
		_possibleChars: function (format) {
			var iFormat,
				chars = "",
				literal = false,
				// Check whether a format character is doubled
				lookAhead = function (match) {
					var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
					if (matches) {
						iFormat++;
					}
					return matches;
				};

			for (iFormat = 0; iFormat < format.length; iFormat++) {
				if (literal) {
					if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
						literal = false;
					} else {
						chars += format.charAt(iFormat);
					}
				} else {
					switch (format.charAt(iFormat)) {
						case "d": case "m": case "y": case "@":
							chars += "0123456789";
							break;
						case "D": case "M":
							return null; // Accept anything
						case "'":
							if (lookAhead("'")) {
								chars += "'";
							} else {
								literal = true;
							}
							break;
						default:
							chars += format.charAt(iFormat);
					}
				}
			}
			return chars;
		},

		/* Get a setting value, defaulting if necessary. */
		_get: function (inst, name) {
			return inst.settings[name] !== undefined ?
				inst.settings[name] : this._defaults[name];
		},

		/* Parse existing date and initialise date picker. */
		_setDateFromField: function (inst, noDefault) {
			if (inst.input.val() === inst.lastVal) {
				return;
			}

			var dateFormat = this._get(inst, "dateFormat"),
				dates = inst.lastVal = inst.input ? inst.input.val() : null,
				defaultDate = this._getDefaultDate(inst),
				date = defaultDate,
				settings = this._getFormatConfig(inst);

			try {
				date = this.parseDate(dateFormat, dates, settings) || defaultDate;
			} catch (event) {
				dates = (noDefault ? "" : dates);
			}
			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			inst.currentDay = (dates ? date.getDate() : 0);
			inst.currentMonth = (dates ? date.getMonth() : 0);
			inst.currentYear = (dates ? date.getFullYear() : 0);
			this._adjustInstDate(inst);
		},

		/* Retrieve the default date shown on opening. */
		_getDefaultDate: function (inst) {
			return this._restrictMinMax(inst,
				this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
		},

		/* A date may be specified as an exact value or a relative one. */
		_determineDate: function (inst, date, defaultDate) {
			var offsetNumeric = function (offset) {
				var date = new Date();
				date.setDate(date.getDate() + offset);
				return date;
			},
				offsetString = function (offset) {
					try {
						return $.datepicker.parseDate($.datepicker._get(inst, "dateFormat"),
							offset, $.datepicker._getFormatConfig(inst));
					}
					catch (e) {
						// Ignore
					}

					var date = (offset.toLowerCase().match(/^c/) ?
						$.datepicker._getDate(inst) : null) || new Date(),
						year = date.getFullYear(),
						month = date.getMonth(),
						day = date.getDate(),
						pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
						matches = pattern.exec(offset);

					while (matches) {
						switch (matches[2] || "d") {
							case "d": case "D":
								day += parseInt(matches[1], 10); break;
							case "w": case "W":
								day += parseInt(matches[1], 10) * 7; break;
							case "m": case "M":
								month += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
							case "y": case "Y":
								year += parseInt(matches[1], 10);
								day = Math.min(day, $.datepicker._getDaysInMonth(year, month));
								break;
						}
						matches = pattern.exec(offset);
					}
					return new Date(year, month, day);
				},
				newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
					(typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

			newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
			if (newDate) {
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
			}
			return this._daylightSavingAdjust(newDate);
		},

		/* Handle switch to/from daylight saving.
		 * Hours may be non-zero on daylight saving cut-over:
		 * > 12 when midnight changeover, but then cannot generate
		 * midnight datetime, so jump to 1AM, otherwise reset.
		 * @param  date  (Date) the date to check
		 * @return  (Date) the corrected date
		 */
		_daylightSavingAdjust: function (date) {
			if (!date) {
				return null;
			}
			date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
			return date;
		},

		/* Set the date(s) directly. */
		_setDate: function (inst, date, noChange) {
			var clear = !date,
				origMonth = inst.selectedMonth,
				origYear = inst.selectedYear,
				newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

			inst.selectedDay = inst.currentDay = newDate.getDate();
			inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
			inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
			if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
				this._notifyChange(inst);
			}
			this._adjustInstDate(inst);
			if (inst.input) {
				inst.input.val(clear ? "" : this._formatDate(inst));
			}
		},

		/* Retrieve the date(s) directly. */
		_getDate: function (inst) {
			var startDate = (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
				this._daylightSavingAdjust(new Date(
				inst.currentYear, inst.currentMonth, inst.currentDay)));
			return startDate;
		},

		/* Attach the onxxx handlers.  These are declared statically so
		 * they work with static code transformers like Caja.
		 */
		_attachHandlers: function (inst) {
			var stepMonths = this._get(inst, "stepMonths"),
				id = "#" + inst.id.replace(/\\\\/g, "\\");
			inst.dpDiv.find("[data-handler]").map(function () {
				var handler = {
					prev: function () {
						$.datepicker._adjustDate(id, -stepMonths, "M");
					},
					next: function () {
						$.datepicker._adjustDate(id, +stepMonths, "M");
					},
					hide: function () {
						$.datepicker._hideDatepicker();
					},
					today: function () {
						$.datepicker._gotoToday(id);
					},
					selectDay: function () {
						$.datepicker._selectDay(id, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this);
						return false;
					},
					selectMonth: function () {
						$.datepicker._selectMonthYear(id, this, "M");
						return false;
					},
					selectYear: function () {
						$.datepicker._selectMonthYear(id, this, "Y");
						return false;
					}
				};
				$(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
			});
		},

		/* Generate the HTML for the current state of the date picker. */
		_generateHTML: function (inst) {
			var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
				controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
				monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
				selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
				cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
				printDate, dRow, tbody, daySettings, otherMonth, unselectable,
				tempDate = new Date(),
				today = this._daylightSavingAdjust(
					new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
				isRTL = this._get(inst, "isRTL"),
				showButtonPanel = this._get(inst, "showButtonPanel"),
				hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
				navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
				numMonths = this._getNumberOfMonths(inst),
				showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
				stepMonths = this._get(inst, "stepMonths"),
				isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
				currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
					new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
				minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				drawMonth = inst.drawMonth - showCurrentAtPos,
				drawYear = inst.drawYear;

			if (drawMonth < 0) {
				drawMonth += 12;
				drawYear--;
			}
			if (maxDate) {
				maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
					maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
				maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
				while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
					drawMonth--;
					if (drawMonth < 0) {
						drawMonth = 11;
						drawYear--;
					}
				}
			}
			inst.drawMonth = drawMonth;
			inst.drawYear = drawYear;

			prevText = this._get(inst, "prevText");
			prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
				this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
				this._getFormatConfig(inst)));

			prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
				"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
				" title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>" :
				(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "e" : "w") + "'>" + prevText + "</span></a>"));

			nextText = this._get(inst, "nextText");
			nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
				this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
				this._getFormatConfig(inst)));

			next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
				"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
				" title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>" :
				(hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + (isRTL ? "w" : "e") + "'>" + nextText + "</span></a>"));

			currentText = this._get(inst, "currentText");
			gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
			currentText = (!navigationAsDateFormat ? currentText :
				this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));

			controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>" +
				this._get(inst, "closeText") + "</button>" : "");

			buttonPanel = (showButtonPanel) ? "<div class='ui-datepicker-buttonpane ui-widget-content'>" + (isRTL ? controls : "") +
				(this._isInRange(inst, gotoDate) ? "<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'" +
				">" + currentText + "</button>" : "") + (isRTL ? "" : controls) + "</div>" : "";

			firstDay = parseInt(this._get(inst, "firstDay"), 10);
			firstDay = (isNaN(firstDay) ? 0 : firstDay);

			showWeek = this._get(inst, "showWeek");
			dayNames = this._get(inst, "dayNames");
			dayNamesMin = this._get(inst, "dayNamesMin");
			monthNames = this._get(inst, "monthNames");
			monthNamesShort = this._get(inst, "monthNamesShort");
			beforeShowDay = this._get(inst, "beforeShowDay");
			showOtherMonths = this._get(inst, "showOtherMonths");
			selectOtherMonths = this._get(inst, "selectOtherMonths");
			defaultDate = this._getDefaultDate(inst);
			html = "";
			dow;
			for (row = 0; row < numMonths[0]; row++) {
				group = "";
				this.maxRows = 4;
				for (col = 0; col < numMonths[1]; col++) {
					selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
					cornerClass = " ui-corner-all";
					calender = "";
					if (isMultiMonth) {
						calender += "<div class='ui-datepicker-group";
						if (numMonths[1] > 1) {
							switch (col) {
								case 0: calender += " ui-datepicker-group-first";
									cornerClass = " ui-corner-" + (isRTL ? "right" : "left"); break;
								case numMonths[1] - 1: calender += " ui-datepicker-group-last";
									cornerClass = " ui-corner-" + (isRTL ? "left" : "right"); break;
								default: calender += " ui-datepicker-group-middle"; cornerClass = ""; break;
							}
						}
						calender += "'>";
					}
					calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
						(/all|left/.test(cornerClass) && row === 0 ? (isRTL ? next : prev) : "") +
						(/all|right/.test(cornerClass) && row === 0 ? (isRTL ? prev : next) : "") +
						this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
						row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
						"</div><table class='ui-datepicker-calendar'><thead>" +
						"<tr>";
					thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
					for (dow = 0; dow < 7; dow++) { // days of the week
						day = (dow + firstDay) % 7;
						thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
							"<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
					}
					calender += thead + "</tr></thead><tbody>";
					daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
					if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
						inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
					}
					leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
					curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
					numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
					this.maxRows = numRows;
					printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
					for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
						calender += "<tr>";
						tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
							this._get(inst, "calculateWeek")(printDate) + "</td>");
						for (dow = 0; dow < 7; dow++) { // create date picker days
							daySettings = (beforeShowDay ?
								beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
							otherMonth = (printDate.getMonth() !== drawMonth);
							unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
								(minDate && printDate < minDate) || (maxDate && printDate > maxDate);
							tbody += "<td class='" +
								((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
								(otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
								((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
								(defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
								// or defaultDate is current printedDate and defaultDate is selectedDate
								" " + this._dayOverClass : "") + // highlight selected day
								(unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") +  // highlight unselectable days
								(otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
								(printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
								(printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
								((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
								(unselectable ? "" : " data-handler='selectDay' data-event='click' data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" + // actions
								(otherMonth && !showOtherMonths ? "&#xa0;" : // display for other months
								(unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
								(printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
								(printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
								(otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
								"' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
							printDate.setDate(printDate.getDate() + 1);
							printDate = this._daylightSavingAdjust(printDate);
						}
						calender += tbody + "</tr>";
					}
					drawMonth++;
					if (drawMonth > 11) {
						drawMonth = 0;
						drawYear++;
					}
					calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
								((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
					group += calender;
				}
				html += group;
			}
			html += buttonPanel;
			inst._keyEvent = false;
			return html;
		},

		/* Generate the month and year header. */
		_generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
				secondary, monthNames, monthNamesShort) {

			var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
				changeMonth = this._get(inst, "changeMonth"),
				changeYear = this._get(inst, "changeYear"),
				showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
				html = "<div class='ui-datepicker-title'>",
				monthHtml = "";

			// month selection
			if (secondary || !changeMonth) {
				monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
			} else {
				inMinYear = (minDate && minDate.getFullYear() === drawYear);
				inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
				monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
				for (month = 0; month < 12; month++) {
					if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
						monthHtml += "<option value='" + month + "'" +
							(month === drawMonth ? " selected='selected'" : "") +
							">" + monthNamesShort[month] + "</option>";
					}
				}
				monthHtml += "</select>";
			}

			if (!showMonthAfterYear) {
				html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
			}

			// year selection
			if (!inst.yearshtml) {
				inst.yearshtml = "";
				if (secondary || !changeYear) {
					html += "<span class='ui-datepicker-year'>" + drawYear + "</span>";
				} else {
					// determine range of years to display
					years = this._get(inst, "yearRange").split(":");
					thisYear = new Date().getFullYear();
					determineYear = function (value) {
						var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
							(value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
							parseInt(value, 10)));
						return (isNaN(year) ? thisYear : year);
					};
					year = determineYear(years[0]);
					endYear = Math.max(year, determineYear(years[1] || ""));
					year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
					endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
					inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
					for (; year <= endYear; year++) {
						inst.yearshtml += "<option value='" + year + "'" +
							(year === drawYear ? " selected='selected'" : "") +
							">" + year + "</option>";
					}
					inst.yearshtml += "</select>";

					html += inst.yearshtml;
					inst.yearshtml = null;
				}
			}

			html += this._get(inst, "yearSuffix");
			if (showMonthAfterYear) {
				html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
			}
			html += "</div>"; // Close datepicker_header
			return html;
		},

		/* Adjust one of the date sub-fields. */
		_adjustInstDate: function (inst, offset, period) {
			var year = inst.drawYear + (period === "Y" ? offset : 0),
				month = inst.drawMonth + (period === "M" ? offset : 0),
				day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
				date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));

			inst.selectedDay = date.getDate();
			inst.drawMonth = inst.selectedMonth = date.getMonth();
			inst.drawYear = inst.selectedYear = date.getFullYear();
			if (period === "M" || period === "Y") {
				this._notifyChange(inst);
			}
		},

		/* Ensure a date is within any min/max bounds. */
		_restrictMinMax: function (inst, date) {
			var minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				newDate = (minDate && date < minDate ? minDate : date);
			return (maxDate && newDate > maxDate ? maxDate : newDate);
		},

		/* Notify change of month/year. */
		_notifyChange: function (inst) {
			var onChange = this._get(inst, "onChangeMonthYear");
			if (onChange) {
				onChange.apply((inst.input ? inst.input[0] : null),
					[inst.selectedYear, inst.selectedMonth + 1, inst]);
			}
		},

		/* Determine the number of months to show. */
		_getNumberOfMonths: function (inst) {
			var numMonths = this._get(inst, "numberOfMonths");
			return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
		},

		/* Determine the current maximum date - ensure no time components are set. */
		_getMinMaxDate: function (inst, minMax) {
			return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
		},

		/* Find the number of days in a given month. */
		_getDaysInMonth: function (year, month) {
			return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
		},

		/* Find the day of the week of the first of a month. */
		_getFirstDayOfMonth: function (year, month) {
			return new Date(year, month, 1).getDay();
		},

		/* Determines if we should allow a "next/prev" month display change. */
		_canAdjustMonth: function (inst, offset, curYear, curMonth) {
			var numMonths = this._getNumberOfMonths(inst),
				date = this._daylightSavingAdjust(new Date(curYear,
				curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

			if (offset < 0) {
				date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
			}
			return this._isInRange(inst, date);
		},

		/* Is the given date in the accepted range? */
		_isInRange: function (inst, date) {
			var yearSplit, currentYear,
				minDate = this._getMinMaxDate(inst, "min"),
				maxDate = this._getMinMaxDate(inst, "max"),
				minYear = null,
				maxYear = null,
				years = this._get(inst, "yearRange");
			if (years) {
				yearSplit = years.split(":");
				currentYear = new Date().getFullYear();
				minYear = parseInt(yearSplit[0], 10);
				maxYear = parseInt(yearSplit[1], 10);
				if (yearSplit[0].match(/[+\-].*/)) {
					minYear += currentYear;
				}
				if (yearSplit[1].match(/[+\-].*/)) {
					maxYear += currentYear;
				}
			}

			return ((!minDate || date.getTime() >= minDate.getTime()) &&
				(!maxDate || date.getTime() <= maxDate.getTime()) &&
				(!minYear || date.getFullYear() >= minYear) &&
				(!maxYear || date.getFullYear() <= maxYear));
		},

		/* Provide the configuration settings for formatting/parsing. */
		_getFormatConfig: function (inst) {
			var shortYearCutoff = this._get(inst, "shortYearCutoff");
			shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
				new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
			return {
				shortYearCutoff: shortYearCutoff,
				dayNamesShort: this._get(inst, "dayNamesShort"), dayNames: this._get(inst, "dayNames"),
				monthNamesShort: this._get(inst, "monthNamesShort"), monthNames: this._get(inst, "monthNames")
			};
		},

		/* Format the given date for display. */
		_formatDate: function (inst, day, month, year) {
			if (!day) {
				inst.currentDay = inst.selectedDay;
				inst.currentMonth = inst.selectedMonth;
				inst.currentYear = inst.selectedYear;
			}
			var date = (day ? (typeof day === "object" ? day :
				this._daylightSavingAdjust(new Date(year, month, day))) :
				this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
			return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
		}
	});

	/*
	 * Bind hover events for datepicker elements.
	 * Done via delegate so the binding only occurs once in the lifetime of the parent div.
	 * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
	 */
	function datepicker_bindHover(dpDiv) {
		var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
		return dpDiv.delegate(selector, "mouseout", function () {
			$(this).removeClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).removeClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).removeClass("ui-datepicker-next-hover");
			}
		})
			.delegate(selector, "mouseover", datepicker_handleMouseover);
	}

	function datepicker_handleMouseover() {
		if (!$.datepicker._isDisabledDatepicker(datepicker_instActive.inline ? datepicker_instActive.dpDiv.parent()[0] : datepicker_instActive.input[0])) {
			$(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
			$(this).addClass("ui-state-hover");
			if (this.className.indexOf("ui-datepicker-prev") !== -1) {
				$(this).addClass("ui-datepicker-prev-hover");
			}
			if (this.className.indexOf("ui-datepicker-next") !== -1) {
				$(this).addClass("ui-datepicker-next-hover");
			}
		}
	}

	/* jQuery extend now ignores nulls! */
	function datepicker_extendRemove(target, props) {
		$.extend(target, props);
		for (var name in props) {
			if (props[name] == null) {
				target[name] = props[name];
			}
		}
		return target;
	}

	/* Invoke the datepicker functionality.
	   @param  options  string - a command, optionally followed by additional parameters or
						Object - settings for attaching new datepicker functionality
	   @return  jQuery object */
	$.fn.datepicker = function (options) {

		/* Verify an empty collection wasn't passed - Fixes #6976 */
		if (!this.length) {
			return this;
		}

		/* Initialise the date picker. */
		if (!$.datepicker.initialized) {
			$(document).mousedown($.datepicker._checkExternalClick);
			$.datepicker.initialized = true;
		}

		/* Append datepicker main container to body if not exist. */
		if ($("#" + $.datepicker._mainDivId).length === 0) {
			$("body").append($.datepicker.dpDiv);
		}

		var otherArgs = Array.prototype.slice.call(arguments, 1);
		if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
			return $.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this[0]].concat(otherArgs));
		}
		if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
			return $.datepicker["_" + options + "Datepicker"].
				apply($.datepicker, [this[0]].concat(otherArgs));
		}
		return this.each(function () {
			typeof options === "string" ?
				$.datepicker["_" + options + "Datepicker"].
					apply($.datepicker, [this].concat(otherArgs)) :
				$.datepicker._attachDatepicker(this, options);
		});
	};

	$.datepicker = new Datepicker(); // singleton instance
	$.datepicker.initialized = false;
	$.datepicker.uuid = new Date().getTime();
	$.datepicker.version = "1.11.4";

	var datepicker = $.datepicker;



}));
/**
 * Swiper 3.3.1
 * Most modern mobile touch slider and framework with hardware accelerated transitions
 * 
 * http://www.idangero.us/swiper/
 * 
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 * 
 * Licensed under MIT
 * 
 * Released on: February 7, 2016
 */
(function () {
    'use strict';
    var $;
    /*===========================
    Swiper
    ===========================*/
    var Swiper = function (container, params) {
        if (!(this instanceof Swiper)) return new Swiper(container, params);

        var defaults = {
            direction: 'horizontal',
            touchEventsTarget: 'container',
            initialSlide: 0,
            speed: 300,
            // autoplay
            autoplay: false,
            autoplayDisableOnInteraction: true,
            autoplayStopOnLast: false,
            // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
            iOSEdgeSwipeDetection: false,
            iOSEdgeSwipeThreshold: 20,
            // Free mode
            freeMode: false,
            freeModeMomentum: true,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: true,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: false,
            freeModeMinimumVelocity: 0.02,
            // Autoheight
            autoHeight: false,
            // Set wrapper width
            setWrapperSize: false,
            // Virtual Translate
            virtualTranslate: false,
            // Effects
            effect: 'slide', // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows : true
            },
            flip: {
                slideShadows : true,
                limitRotation: true
            },
            cube: {
                slideShadows: true,
                shadow: true,
                shadowOffset: 20,
                shadowScale: 0.94
            },
            fade: {
                crossFade: false
            },
            // Parallax
            parallax: false,
            // Scrollbar
            scrollbar: null,
            scrollbarHide: true,
            scrollbarDraggable: false,
            scrollbarSnapOnRelease: false,
            // Keyboard Mousewheel
            keyboardControl: false,
            mousewheelControl: false,
            mousewheelReleaseOnEdges: false,
            mousewheelInvert: false,
            mousewheelForceToAxis: false,
            mousewheelSensitivity: 1,
            // Hash Navigation
            hashnav: false,
            // Breakpoints
            breakpoints: undefined,
            // Slides grid
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: 'column',
            slidesPerGroup: 1,
            centeredSlides: false,
            slidesOffsetBefore: 0, // in px
            slidesOffsetAfter: 0, // in px
            // Round length
            roundLengths: false,
            // Touches
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: true,
            shortSwipes: true,
            longSwipes: true,
            longSwipesRatio: 0.5,
            longSwipesMs: 300,
            followFinger: true,
            onlyExternal: false,
            threshold: 0,
            touchMoveStopPropagation: true,
            // Unique Navigation Elements
            uniqueNavElements: true,
            // Pagination
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            paginationBulletRender: null,
            paginationProgressRender: null,
            paginationFractionRender: null,
            paginationCustomRender: null,
            paginationType: 'bullets', // 'bullets' or 'progress' or 'fraction' or 'custom'
            // Resistance
            resistance: true,
            resistanceRatio: 0.85,
            // Next/prev buttons
            nextButton: null,
            prevButton: null,
            // Progress
            watchSlidesProgress: false,
            watchSlidesVisibility: false,
            // Cursor
            grabCursor: false,
            // Clicks
            preventClicks: true,
            preventClicksPropagation: true,
            slideToClickedSlide: false,
            // Lazy Loading
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingInPrevNextAmount: 1,
            lazyLoadingOnTransitionStart: false,
            // Images
            preloadImages: true,
            updateOnImagesReady: true,
            // loop
            loop: false,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            // Control
            control: undefined,
            controlInverse: false,
            controlBy: 'slide', //or 'container'
            // Swiping/no swiping
            allowSwipeToPrev: true,
            allowSwipeToNext: true,
            swipeHandler: null, //'.swipe-handler',
            noSwiping: true,
            noSwipingClass: 'swiper-no-swiping',
            // NS
            slideClass: 'swiper-slide',
            slideActiveClass: 'swiper-slide-active',
            slideVisibleClass: 'swiper-slide-visible',
            slideDuplicateClass: 'swiper-slide-duplicate',
            slideNextClass: 'swiper-slide-next',
            slidePrevClass: 'swiper-slide-prev',
            wrapperClass: 'swiper-wrapper',
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active',
            buttonDisabledClass: 'swiper-button-disabled',
            paginationCurrentClass: 'swiper-pagination-current',
            paginationTotalClass: 'swiper-pagination-total',
            paginationHiddenClass: 'swiper-pagination-hidden',
            paginationProgressbarClass: 'swiper-pagination-progressbar',
            // Observer
            observer: false,
            observeParents: false,
            // Accessibility
            a11y: false,
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
            paginationBulletMessage: 'Go to slide {{index}}',
            // Callbacks
            runCallbacksOnInit: true
            /*
            Callbacks:
            onInit: function (swiper)
            onDestroy: function (swiper)
            onClick: function (swiper, e)
            onTap: function (swiper, e)
            onDoubleTap: function (swiper, e)
            onSliderMove: function (swiper, e)
            onSlideChangeStart: function (swiper)
            onSlideChangeEnd: function (swiper)
            onTransitionStart: function (swiper)
            onTransitionEnd: function (swiper)
            onImagesReady: function (swiper)
            onProgress: function (swiper, progress)
            onTouchStart: function (swiper, e)
            onTouchMove: function (swiper, e)
            onTouchMoveOpposite: function (swiper, e)
            onTouchEnd: function (swiper, e)
            onReachBeginning: function (swiper)
            onReachEnd: function (swiper)
            onSetTransition: function (swiper, duration)
            onSetTranslate: function (swiper, translate)
            onAutoplayStart: function (swiper)
            onAutoplayStop: function (swiper),
            onLazyImageLoad: function (swiper, slide, image)
            onLazyImageReady: function (swiper, slide, image)
            */
        
        };
        var initialVirtualTranslate = params && params.virtualTranslate;
        
        params = params || {};
        var originalParams = {};
        for (var param in params) {
            if (typeof params[param] === 'object' && params[param] !== null && !(params[param].nodeType || params[param] === window || params[param] === document || (typeof Dom7 !== 'undefined' && params[param] instanceof Dom7) || (typeof jQuery !== 'undefined' && params[param] instanceof jQuery))) {
                originalParams[param] = {};
                for (var deepParam in params[param]) {
                    originalParams[param][deepParam] = params[param][deepParam];
                }
            }
            else {
                originalParams[param] = params[param];
            }
        }
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }
        
        // Swiper
        var s = this;
        
        // Params
        s.params = params;
        s.originalParams = originalParams;
        
        // Classname
        s.classNames = [];
        /*=========================
          Dom Library and plugins
          ===========================*/
        if (typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){
            $ = Dom7;
        }
        if (typeof $ === 'undefined') {
            if (typeof Dom7 === 'undefined') {
                $ = window.Dom7 || window.Zepto || window.jQuery;
            }
            else {
                $ = Dom7;
            }
            if (!$) return;
        }
        // Export it to Swiper instance
        s.$ = $;
        
        /*=========================
          Breakpoints
          ===========================*/
        s.currentBreakpoint = undefined;
        s.getActiveBreakpoint = function () {
            //Get breakpoint for window width
            if (!s.params.breakpoints) return false;
            var breakpoint = false;
            var points = [], point;
            for ( point in s.params.breakpoints ) {
                if (s.params.breakpoints.hasOwnProperty(point)) {
                    points.push(point);
                }
            }
            points.sort(function (a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                if (point >= window.innerWidth && !breakpoint) {
                    breakpoint = point;
                }
            }
            return breakpoint || 'max';
        };
        s.setBreakpoint = function () {
            //Set breakpoint for window width and update parameters
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                var needsReLoop = s.params.loop && (breakPointsParams.slidesPerView !== s.params.slidesPerView);
                for ( var param in breakPointsParams ) {
                    s.params[param] = breakPointsParams[param];
                }
                s.currentBreakpoint = breakpoint;
                if(needsReLoop && s.destroyLoop) {
                    s.reLoop(true);
                }
            }
        };
        // Set breakpoint on load
        if (s.params.breakpoints) {
            s.setBreakpoint();
        }
        
        /*=========================
          Preparation - Define Container, Wrapper and Pagination
          ===========================*/
        s.container = $(container);
        if (s.container.length === 0) return;
        if (s.container.length > 1) {
            var swipers = [];
            s.container.each(function () {
                var container = this;
                swipers.push(new Swiper(this, params));
            });
            return swipers;
        }
        
        // Save instance in container HTML Element and in data
        s.container[0].swiper = s;
        s.container.data('swiper', s);
        
        s.classNames.push('swiper-container-' + s.params.direction);
        
        if (s.params.freeMode) {
            s.classNames.push('swiper-container-free-mode');
        }
        if (!s.support.flexbox) {
            s.classNames.push('swiper-container-no-flexbox');
            s.params.slidesPerColumn = 1;
        }
        if (s.params.autoHeight) {
            s.classNames.push('swiper-container-autoheight');
        }
        // Enable slides progress when required
        if (s.params.parallax || s.params.watchSlidesVisibility) {
            s.params.watchSlidesProgress = true;
        }
        // Coverflow / 3D
        if (['cube', 'coverflow', 'flip'].indexOf(s.params.effect) >= 0) {
            if (s.support.transforms3d) {
                s.params.watchSlidesProgress = true;
                s.classNames.push('swiper-container-3d');
            }
            else {
                s.params.effect = 'slide';
            }
        }
        if (s.params.effect !== 'slide') {
            s.classNames.push('swiper-container-' + s.params.effect);
        }
        if (s.params.effect === 'cube') {
            s.params.resistanceRatio = 0;
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.centeredSlides = false;
            s.params.spaceBetween = 0;
            s.params.virtualTranslate = true;
            s.params.setWrapperSize = false;
        }
        if (s.params.effect === 'fade' || s.params.effect === 'flip') {
            s.params.slidesPerView = 1;
            s.params.slidesPerColumn = 1;
            s.params.slidesPerGroup = 1;
            s.params.watchSlidesProgress = true;
            s.params.spaceBetween = 0;
            s.params.setWrapperSize = false;
            if (typeof initialVirtualTranslate === 'undefined') {
                s.params.virtualTranslate = true;
            }
        }
        
        // Grab Cursor
        if (s.params.grabCursor && s.support.touch) {
            s.params.grabCursor = false;
        }
        
        // Wrapper
        s.wrapper = s.container.children('.' + s.params.wrapperClass);
        
        // Pagination
        if (s.params.pagination) {
            s.paginationContainer = $(s.params.pagination);
            if (s.params.uniqueNavElements && typeof s.params.pagination === 'string' && s.paginationContainer.length > 1 && s.container.find(s.params.pagination).length === 1) {
                s.paginationContainer = s.container.find(s.params.pagination);
            }
        
            if (s.params.paginationType === 'bullets' && s.params.paginationClickable) {
                s.paginationContainer.addClass('swiper-pagination-clickable');
            }
            else {
                s.params.paginationClickable = false;
            }
            s.paginationContainer.addClass('swiper-pagination-' + s.params.paginationType);
        }
        // Next/Prev Buttons
        if (s.params.nextButton || s.params.prevButton) {
            if (s.params.nextButton) {
                s.nextButton = $(s.params.nextButton);
                if (s.params.uniqueNavElements && typeof s.params.nextButton === 'string' && s.nextButton.length > 1 && s.container.find(s.params.nextButton).length === 1) {
                    s.nextButton = s.container.find(s.params.nextButton);
                }
            }
            if (s.params.prevButton) {
                s.prevButton = $(s.params.prevButton);
                if (s.params.uniqueNavElements && typeof s.params.prevButton === 'string' && s.prevButton.length > 1 && s.container.find(s.params.prevButton).length === 1) {
                    s.prevButton = s.container.find(s.params.prevButton);
                }
            }
        }
        
        // Is Horizontal
        s.isHorizontal = function () {
            return s.params.direction === 'horizontal';
        };
        // s.isH = isH;
        
        // RTL
        s.rtl = s.isHorizontal() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');
        if (s.rtl) {
            s.classNames.push('swiper-container-rtl');
        }
        
        // Wrong RTL support
        if (s.rtl) {
            s.wrongRTL = s.wrapper.css('display') === '-webkit-box';
        }
        
        // Columns
        if (s.params.slidesPerColumn > 1) {
            s.classNames.push('swiper-container-multirow');
        }
        
        // Check for Android
        if (s.device.android) {
            s.classNames.push('swiper-container-android');
        }
        
        // Add classes
        s.container.addClass(s.classNames.join(' '));
        
        // Translate
        s.translate = 0;
        
        // Progress
        s.progress = 0;
        
        // Velocity
        s.velocity = 0;
        
        /*=========================
          Locks, unlocks
          ===========================*/
        s.lockSwipeToNext = function () {
            s.params.allowSwipeToNext = false;
        };
        s.lockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = false;
        };
        s.lockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;
        };
        s.unlockSwipeToNext = function () {
            s.params.allowSwipeToNext = true;
        };
        s.unlockSwipeToPrev = function () {
            s.params.allowSwipeToPrev = true;
        };
        s.unlockSwipes = function () {
            s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;
        };
        
        /*=========================
          Round helper
          ===========================*/
        function round(a) {
            return Math.floor(a);
        }
        /*=========================
          Set grab cursor
          ===========================*/
        if (s.params.grabCursor) {
            s.container[0].style.cursor = 'move';
            s.container[0].style.cursor = '-webkit-grab';
            s.container[0].style.cursor = '-moz-grab';
            s.container[0].style.cursor = 'grab';
        }
        /*=========================
          Update on Images Ready
          ===========================*/
        s.imagesToLoad = [];
        s.imagesLoaded = 0;
        
        s.loadImage = function (imgElement, src, srcset, checkForComplete, callback) {
            var image;
            function onReady () {
                if (callback) callback();
            }
            if (!imgElement.complete || !checkForComplete) {
                if (src) {
                    image = new window.Image();
                    image.onload = onReady;
                    image.onerror = onReady;
                    if (srcset) {
                        image.srcset = srcset;
                    }
                    if (src) {
                        image.src = src;
                    }
                } else {
                    onReady();
                }
        
            } else {//image already loaded...
                onReady();
            }
        };
        s.preloadImages = function () {
            s.imagesToLoad = s.container.find('img');
            function _onReady() {
                if (typeof s === 'undefined' || s === null) return;
                if (s.imagesLoaded !== undefined) s.imagesLoaded++;
                if (s.imagesLoaded === s.imagesToLoad.length) {
                    if (s.params.updateOnImagesReady) s.update();
                    s.emit('onImagesReady', s);
                }
            }
            for (var i = 0; i < s.imagesToLoad.length; i++) {
                s.loadImage(s.imagesToLoad[i], (s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src')), (s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset')), true, _onReady);
            }
        };
        
        /*=========================
          Autoplay
          ===========================*/
        s.autoplayTimeoutId = undefined;
        s.autoplaying = false;
        s.autoplayPaused = false;
        function autoplay() {
            s.autoplayTimeoutId = setTimeout(function () {
                if (s.params.loop) {
                    s.fixLoop();
                    s._slideNext();
                    s.emit('onAutoplay', s);
                }
                else {
                    if (!s.isEnd) {
                        s._slideNext();
                        s.emit('onAutoplay', s);
                    }
                    else {
                        if (!params.autoplayStopOnLast) {
                            s._slideTo(0);
                            s.emit('onAutoplay', s);
                        }
                        else {
                            s.stopAutoplay();
                        }
                    }
                }
            }, s.params.autoplay);
        }
        s.startAutoplay = function () {
            if (typeof s.autoplayTimeoutId !== 'undefined') return false;
            if (!s.params.autoplay) return false;
            if (s.autoplaying) return false;
            s.autoplaying = true;
            s.emit('onAutoplayStart', s);
            autoplay();
        };
        s.stopAutoplay = function (internal) {
            if (!s.autoplayTimeoutId) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplaying = false;
            s.autoplayTimeoutId = undefined;
            s.emit('onAutoplayStop', s);
        };
        s.pauseAutoplay = function (speed) {
            if (s.autoplayPaused) return;
            if (s.autoplayTimeoutId) clearTimeout(s.autoplayTimeoutId);
            s.autoplayPaused = true;
            if (speed === 0) {
                s.autoplayPaused = false;
                autoplay();
            }
            else {
                s.wrapper.transitionEnd(function () {
                    if (!s) return;
                    s.autoplayPaused = false;
                    if (!s.autoplaying) {
                        s.stopAutoplay();
                    }
                    else {
                        autoplay();
                    }
                });
            }
        };
        /*=========================
          Min/Max Translate
          ===========================*/
        s.minTranslate = function () {
            return (-s.snapGrid[0]);
        };
        s.maxTranslate = function () {
            return (-s.snapGrid[s.snapGrid.length - 1]);
        };
        /*=========================
          Slider/slides sizes
          ===========================*/
        s.updateAutoHeight = function () {
            // Update Height
            var slide = s.slides.eq(s.activeIndex)[0];
            if (typeof slide !== 'undefined') {
                var newHeight = slide.offsetHeight;
                if (newHeight) s.wrapper.css('height', newHeight + 'px');
            }
        };
        s.updateContainerSize = function () {
            var width, height;
            if (typeof s.params.width !== 'undefined') {
                width = s.params.width;
            }
            else {
                width = s.container[0].clientWidth;
            }
            if (typeof s.params.height !== 'undefined') {
                height = s.params.height;
            }
            else {
                height = s.container[0].clientHeight;
            }
            if (width === 0 && s.isHorizontal() || height === 0 && !s.isHorizontal()) {
                return;
            }
        
            //Subtract paddings
            width = width - parseInt(s.container.css('padding-left'), 10) - parseInt(s.container.css('padding-right'), 10);
            height = height - parseInt(s.container.css('padding-top'), 10) - parseInt(s.container.css('padding-bottom'), 10);
        
            // Store values
            s.width = width;
            s.height = height;
            s.size = s.isHorizontal() ? s.width : s.height;
        };
        
        s.updateSlidesSize = function () {
            s.slides = s.wrapper.children('.' + s.params.slideClass);
            s.snapGrid = [];
            s.slidesGrid = [];
            s.slidesSizesGrid = [];
        
            var spaceBetween = s.params.spaceBetween,
                slidePosition = -s.params.slidesOffsetBefore,
                i,
                prevSlideSize = 0,
                index = 0;
            if (typeof s.size === 'undefined') return;
            if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
                spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * s.size;
            }
        
            s.virtualSize = -spaceBetween;
            // reset margins
            if (s.rtl) s.slides.css({marginLeft: '', marginTop: ''});
            else s.slides.css({marginRight: '', marginBottom: ''});
        
            var slidesNumberEvenToRows;
            if (s.params.slidesPerColumn > 1) {
                if (Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn) {
                    slidesNumberEvenToRows = s.slides.length;
                }
                else {
                    slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;
                }
                if (s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row') {
                    slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn);
                }
            }
        
            // Calc slides
            var slideSize;
            var slidesPerColumn = s.params.slidesPerColumn;
            var slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;
            var numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
            for (i = 0; i < s.slides.length; i++) {
                slideSize = 0;
                var slide = s.slides.eq(i);
                if (s.params.slidesPerColumn > 1) {
                    // Set slides order
                    var newSlideOrderIndex;
                    var column, row;
                    if (s.params.slidesPerColumnFill === 'column') {
                        column = Math.floor(i / slidesPerColumn);
                        row = i - column * slidesPerColumn;
                        if (column > numFullColumns || (column === numFullColumns && row === slidesPerColumn-1)) {
                            if (++row >= slidesPerColumn) {
                                row = 0;
                                column++;
                            }
                        }
                        newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;
                        slide
                            .css({
                                '-webkit-box-ordinal-group': newSlideOrderIndex,
                                '-moz-box-ordinal-group': newSlideOrderIndex,
                                '-ms-flex-order': newSlideOrderIndex,
                                '-webkit-order': newSlideOrderIndex,
                                'order': newSlideOrderIndex
                            });
                    }
                    else {
                        row = Math.floor(i / slidesPerRow);
                        column = i - row * slidesPerRow;
                    }
                    slide
                        .css({
                            'margin-top': (row !== 0 && s.params.spaceBetween) && (s.params.spaceBetween + 'px')
                        })
                        .attr('data-swiper-column', column)
                        .attr('data-swiper-row', row);
        
                }
                if (slide.css('display') === 'none') continue;
                if (s.params.slidesPerView === 'auto') {
                    slideSize = s.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
                    if (s.params.roundLengths) slideSize = round(slideSize);
                }
                else {
                    slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;
                    if (s.params.roundLengths) slideSize = round(slideSize);
        
                    if (s.isHorizontal()) {
                        s.slides[i].style.width = slideSize + 'px';
                    }
                    else {
                        s.slides[i].style.height = slideSize + 'px';
                    }
                }
                s.slides[i].swiperSlideSize = slideSize;
                s.slidesSizesGrid.push(slideSize);
        
        
                if (s.params.centeredSlides) {
                    slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
                    if (i === 0) slidePosition = slidePosition - s.size / 2 - spaceBetween;
                    if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                }
                else {
                    if ((index) % s.params.slidesPerGroup === 0) s.snapGrid.push(slidePosition);
                    s.slidesGrid.push(slidePosition);
                    slidePosition = slidePosition + slideSize + spaceBetween;
                }
        
                s.virtualSize += slideSize + spaceBetween;
        
                prevSlideSize = slideSize;
        
                index ++;
            }
            s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
            var newSlidesGrid;
        
            if (
                s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')) {
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
            }
            if (!s.support.flexbox || s.params.setWrapperSize) {
                if (s.isHorizontal()) s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                else s.wrapper.css({height: s.virtualSize + s.params.spaceBetween + 'px'});
            }
        
            if (s.params.slidesPerColumn > 1) {
                s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;
                s.wrapper.css({width: s.virtualSize + s.params.spaceBetween + 'px'});
                if (s.params.centeredSlides) {
                    newSlidesGrid = [];
                    for (i = 0; i < s.snapGrid.length; i++) {
                        if (s.snapGrid[i] < s.virtualSize + s.snapGrid[0]) newSlidesGrid.push(s.snapGrid[i]);
                    }
                    s.snapGrid = newSlidesGrid;
                }
            }
        
            // Remove last grid elements depending on width
            if (!s.params.centeredSlides) {
                newSlidesGrid = [];
                for (i = 0; i < s.snapGrid.length; i++) {
                    if (s.snapGrid[i] <= s.virtualSize - s.size) {
                        newSlidesGrid.push(s.snapGrid[i]);
                    }
                }
                s.snapGrid = newSlidesGrid;
                if (Math.floor(s.virtualSize - s.size) - Math.floor(s.snapGrid[s.snapGrid.length - 1]) > 1) {
                    s.snapGrid.push(s.virtualSize - s.size);
                }
            }
            if (s.snapGrid.length === 0) s.snapGrid = [0];
        
            if (s.params.spaceBetween !== 0) {
                if (s.isHorizontal()) {
                    if (s.rtl) s.slides.css({marginLeft: spaceBetween + 'px'});
                    else s.slides.css({marginRight: spaceBetween + 'px'});
                }
                else s.slides.css({marginBottom: spaceBetween + 'px'});
            }
            if (s.params.watchSlidesProgress) {
                s.updateSlidesOffset();
            }
        };
        s.updateSlidesOffset = function () {
            for (var i = 0; i < s.slides.length; i++) {
                s.slides[i].swiperSlideOffset = s.isHorizontal() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }
        };
        
        /*=========================
          Slider/slides progress
          ===========================*/
        s.updateSlidesProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            if (s.slides.length === 0) return;
            if (typeof s.slides[0].swiperSlideOffset === 'undefined') s.updateSlidesOffset();
        
            var offsetCenter = -translate;
            if (s.rtl) offsetCenter = translate;
        
            // Visible Slides
            s.slides.removeClass(s.params.slideVisibleClass);
            for (var i = 0; i < s.slides.length; i++) {
                var slide = s.slides[i];
                var slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                if (s.params.watchSlidesVisibility) {
                    var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                    var slideAfter = slideBefore + s.slidesSizesGrid[i];
                    var isVisible =
                        (slideBefore >= 0 && slideBefore < s.size) ||
                        (slideAfter > 0 && slideAfter <= s.size) ||
                        (slideBefore <= 0 && slideAfter >= s.size);
                    if (isVisible) {
                        s.slides.eq(i).addClass(s.params.slideVisibleClass);
                    }
                }
                slide.progress = s.rtl ? -slideProgress : slideProgress;
            }
        };
        s.updateProgress = function (translate) {
            if (typeof translate === 'undefined') {
                translate = s.translate || 0;
            }
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            var wasBeginning = s.isBeginning;
            var wasEnd = s.isEnd;
            if (translatesDiff === 0) {
                s.progress = 0;
                s.isBeginning = s.isEnd = true;
            }
            else {
                s.progress = (translate - s.minTranslate()) / (translatesDiff);
                s.isBeginning = s.progress <= 0;
                s.isEnd = s.progress >= 1;
            }
            if (s.isBeginning && !wasBeginning) s.emit('onReachBeginning', s);
            if (s.isEnd && !wasEnd) s.emit('onReachEnd', s);
        
            if (s.params.watchSlidesProgress) s.updateSlidesProgress(translate);
            s.emit('onProgress', s, s.progress);
        };
        s.updateActiveIndex = function () {
            var translate = s.rtl ? s.translate : -s.translate;
            var newActiveIndex, i, snapIndex;
            for (i = 0; i < s.slidesGrid.length; i ++) {
                if (typeof s.slidesGrid[i + 1] !== 'undefined') {
                    if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2) {
                        newActiveIndex = i;
                    }
                    else if (translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]) {
                        newActiveIndex = i + 1;
                    }
                }
                else {
                    if (translate >= s.slidesGrid[i]) {
                        newActiveIndex = i;
                    }
                }
            }
            // Normalize slideIndex
            if (newActiveIndex < 0 || typeof newActiveIndex === 'undefined') newActiveIndex = 0;
            // for (i = 0; i < s.slidesGrid.length; i++) {
                // if (- translate >= s.slidesGrid[i]) {
                    // newActiveIndex = i;
                // }
            // }
            snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);
            if (snapIndex >= s.snapGrid.length) snapIndex = s.snapGrid.length - 1;
        
            if (newActiveIndex === s.activeIndex) {
                return;
            }
            s.snapIndex = snapIndex;
            s.previousIndex = s.activeIndex;
            s.activeIndex = newActiveIndex;
            s.updateClasses();
        };
        
        /*=========================
          Classes
          ===========================*/
        s.updateClasses = function () {
            s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);
            var activeSlide = s.slides.eq(s.activeIndex);
            // Active classes
            activeSlide.addClass(s.params.slideActiveClass);
            // Next Slide
            var nextSlide = activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);
            if (s.params.loop && nextSlide.length === 0) {
                s.slides.eq(0).addClass(s.params.slideNextClass);
            }
            // Prev Slide
            var prevSlide = activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass);
            if (s.params.loop && prevSlide.length === 0) {
                s.slides.eq(-1).addClass(s.params.slidePrevClass);
            }
        
            // Pagination
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                // Current/Total
                var current,
                    total = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                if (s.params.loop) {
                    current = Math.ceil((s.activeIndex - s.loopedSlides)/s.params.slidesPerGroup);
                    if (current > s.slides.length - 1 - s.loopedSlides * 2) {
                        current = current - (s.slides.length - s.loopedSlides * 2);
                    }
                    if (current > total - 1) current = current - total;
                    if (current < 0 && s.params.paginationType !== 'bullets') current = total + current;
                }
                else {
                    if (typeof s.snapIndex !== 'undefined') {
                        current = s.snapIndex;
                    }
                    else {
                        current = s.activeIndex || 0;
                    }
                }
                // Types
                if (s.params.paginationType === 'bullets' && s.bullets && s.bullets.length > 0) {
                    s.bullets.removeClass(s.params.bulletActiveClass);
                    if (s.paginationContainer.length > 1) {
                        s.bullets.each(function () {
                            if ($(this).index() === current) $(this).addClass(s.params.bulletActiveClass);
                        });
                    }
                    else {
                        s.bullets.eq(current).addClass(s.params.bulletActiveClass);
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    s.paginationContainer.find('.' + s.params.paginationCurrentClass).text(current + 1);
                    s.paginationContainer.find('.' + s.params.paginationTotalClass).text(total);
                }
                if (s.params.paginationType === 'progress') {
                    var scale = (current + 1) / total,
                        scaleX = scale,
                        scaleY = 1;
                    if (!s.isHorizontal()) {
                        scaleY = scale;
                        scaleX = 1;
                    }
                    s.paginationContainer.find('.' + s.params.paginationProgressbarClass).transform('translate3d(0,0,0) scaleX(' + scaleX + ') scaleY(' + scaleY + ')').transition(s.params.speed);
                }
                if (s.params.paginationType === 'custom' && s.params.paginationCustomRender) {
                    s.paginationContainer.html(s.params.paginationCustomRender(s, current + 1, total));
                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
                }
            }
        
            // Next/active buttons
            if (!s.params.loop) {
                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                    if (s.isBeginning) {
                        s.prevButton.addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable(s.prevButton);
                    }
                    else {
                        s.prevButton.removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable(s.prevButton);
                    }
                }
                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                    if (s.isEnd) {
                        s.nextButton.addClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.disable(s.nextButton);
                    }
                    else {
                        s.nextButton.removeClass(s.params.buttonDisabledClass);
                        if (s.params.a11y && s.a11y) s.a11y.enable(s.nextButton);
                    }
                }
            }
        };
        
        /*=========================
          Pagination
          ===========================*/
        s.updatePagination = function () {
            if (!s.params.pagination) return;
            if (s.paginationContainer && s.paginationContainer.length > 0) {
                var paginationHTML = '';
                if (s.params.paginationType === 'bullets') {
                    var numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup) : s.snapGrid.length;
                    for (var i = 0; i < numberOfBullets; i++) {
                        if (s.params.paginationBulletRender) {
                            paginationHTML += s.params.paginationBulletRender(i, s.params.bulletClass);
                        }
                        else {
                            paginationHTML += '<' + s.params.paginationElement+' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';
                        }
                    }
                    s.paginationContainer.html(paginationHTML);
                    s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);
                    if (s.params.paginationClickable && s.params.a11y && s.a11y) {
                        s.a11y.initPagination();
                    }
                }
                if (s.params.paginationType === 'fraction') {
                    if (s.params.paginationFractionRender) {
                        paginationHTML = s.params.paginationFractionRender(s, s.params.paginationCurrentClass, s.params.paginationTotalClass);
                    }
                    else {
                        paginationHTML =
                            '<span class="' + s.params.paginationCurrentClass + '"></span>' +
                            ' / ' +
                            '<span class="' + s.params.paginationTotalClass+'"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
                if (s.params.paginationType === 'progress') {
                    if (s.params.paginationProgressRender) {
                        paginationHTML = s.params.paginationProgressRender(s, s.params.paginationProgressbarClass);
                    }
                    else {
                        paginationHTML = '<span class="' + s.params.paginationProgressbarClass + '"></span>';
                    }
                    s.paginationContainer.html(paginationHTML);
                }
                if (s.params.paginationType !== 'custom') {
                    s.emit('onPaginationRendered', s, s.paginationContainer[0]);
                }
            }
        };
        /*=========================
          Common update method
          ===========================*/
        s.update = function (updateTranslate) {
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updateProgress();
            s.updatePagination();
            s.updateClasses();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            function forceSetTranslate() {
                newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
            }
            if (updateTranslate) {
                var translated, newTranslate;
                if (s.controller && s.controller.spline) {
                    s.controller.spline = undefined;
                }
                if (s.params.freeMode) {
                    forceSetTranslate();
                    if (s.params.autoHeight) {
                        s.updateAutoHeight();
                    }
                }
                else {
                    if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                        translated = s.slideTo(s.slides.length - 1, 0, false, true);
                    }
                    else {
                        translated = s.slideTo(s.activeIndex, 0, false, true);
                    }
                    if (!translated) {
                        forceSetTranslate();
                    }
                }
            }
            else if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
        };
        
        /*=========================
          Resize Handler
          ===========================*/
        s.onResize = function (forceUpdatePagination) {
            //Breakpoints
            if (s.params.breakpoints) {
                s.setBreakpoint();
            }
        
            // Disable locks on resize
            var allowSwipeToPrev = s.params.allowSwipeToPrev;
            var allowSwipeToNext = s.params.allowSwipeToNext;
            s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;
        
            s.updateContainerSize();
            s.updateSlidesSize();
            if (s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination) s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
            }
            if (s.controller && s.controller.spline) {
                s.controller.spline = undefined;
            }
            var slideChangedBySlideTo = false;
            if (s.params.freeMode) {
                var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                s.setWrapperTranslate(newTranslate);
                s.updateActiveIndex();
                s.updateClasses();
        
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
            }
            else {
                s.updateClasses();
                if ((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides) {
                    slideChangedBySlideTo = s.slideTo(s.slides.length - 1, 0, false, true);
                }
                else {
                    slideChangedBySlideTo = s.slideTo(s.activeIndex, 0, false, true);
                }
            }
            if (s.params.lazyLoading && !slideChangedBySlideTo && s.lazy) {
                s.lazy.load();
            }
            // Return locks after resize
            s.params.allowSwipeToPrev = allowSwipeToPrev;
            s.params.allowSwipeToNext = allowSwipeToNext;
        };
        
        /*=========================
          Events
          ===========================*/
        
        //Define Touch Events
        var desktopEvents = ['mousedown', 'mousemove', 'mouseup'];
        if (window.navigator.pointerEnabled) desktopEvents = ['pointerdown', 'pointermove', 'pointerup'];
        else if (window.navigator.msPointerEnabled) desktopEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp'];
        s.touchEvents = {
            start : s.support.touch || !s.params.simulateTouch  ? 'touchstart' : desktopEvents[0],
            move : s.support.touch || !s.params.simulateTouch ? 'touchmove' : desktopEvents[1],
            end : s.support.touch || !s.params.simulateTouch ? 'touchend' : desktopEvents[2]
        };
        
        
        // WP8 Touch Events Fix
        if (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) {
            (s.params.touchEventsTarget === 'container' ? s.container : s.wrapper).addClass('swiper-wp8-' + s.params.direction);
        }
        
        // Attach/detach events
        s.initEvents = function (detach) {
            var actionDom = detach ? 'off' : 'on';
            var action = detach ? 'removeEventListener' : 'addEventListener';
            var touchEventsTarget = s.params.touchEventsTarget === 'container' ? s.container[0] : s.wrapper[0];
            var target = s.support.touch ? touchEventsTarget : document;
        
            var moveCapture = s.params.nested ? true : false;
        
            //Touch Events
            if (s.browser.ie) {
                touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                target[action](s.touchEvents.end, s.onTouchEnd, false);
            }
            else {
                if (s.support.touch) {
                    touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, false);
                    touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture);
                    touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, false);
                }
                if (params.simulateTouch && !s.device.ios && !s.device.android) {
                    touchEventsTarget[action]('mousedown', s.onTouchStart, false);
                    document[action]('mousemove', s.onTouchMove, moveCapture);
                    document[action]('mouseup', s.onTouchEnd, false);
                }
            }
            window[action]('resize', s.onResize);
        
            // Next, Prev, Index
            if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                s.nextButton[actionDom]('click', s.onClickNext);
                if (s.params.a11y && s.a11y) s.nextButton[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                s.prevButton[actionDom]('click', s.onClickPrev);
                if (s.params.a11y && s.a11y) s.prevButton[actionDom]('keydown', s.a11y.onEnterKey);
            }
            if (s.params.pagination && s.params.paginationClickable) {
                s.paginationContainer[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
                if (s.params.a11y && s.a11y) s.paginationContainer[actionDom]('keydown', '.' + s.params.bulletClass, s.a11y.onEnterKey);
            }
        
            // Prevent Links Clicks
            if (s.params.preventClicks || s.params.preventClicksPropagation) touchEventsTarget[action]('click', s.preventClicks, true);
        };
        s.attachEvents = function () {
            s.initEvents();
        };
        s.detachEvents = function () {
            s.initEvents(true);
        };
        
        /*=========================
          Handle Clicks
          ===========================*/
        // Prevent Clicks
        s.allowClick = true;
        s.preventClicks = function (e) {
            if (!s.allowClick) {
                if (s.params.preventClicks) e.preventDefault();
                if (s.params.preventClicksPropagation && s.animating) {
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                }
            }
        };
        // Clicks
        s.onClickNext = function (e) {
            e.preventDefault();
            if (s.isEnd && !s.params.loop) return;
            s.slideNext();
        };
        s.onClickPrev = function (e) {
            e.preventDefault();
            if (s.isBeginning && !s.params.loop) return;
            s.slidePrev();
        };
        s.onClickIndex = function (e) {
            e.preventDefault();
            var index = $(this).index() * s.params.slidesPerGroup;
            if (s.params.loop) index = index + s.loopedSlides;
            s.slideTo(index);
        };
        
        /*=========================
          Handle Touches
          ===========================*/
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) {
                if (typeof selector === 'string') {
                    el = el.parents(selector);
                }
                else if (selector.nodeType) {
                    var found;
                    el.parents().each(function (index, _el) {
                        if (_el === selector) found = selector;
                    });
                    if (!found) return undefined;
                    else return selector;
                }
            }
            if (el.length === 0) {
                return undefined;
            }
            return el[0];
        }
        s.updateClickedSlide = function (e) {
            var slide = findElementInEvent(e, '.' + s.params.slideClass);
            var slideFound = false;
            if (slide) {
                for (var i = 0; i < s.slides.length; i++) {
                    if (s.slides[i] === slide) slideFound = true;
                }
            }
        
            if (slide && slideFound) {
                s.clickedSlide = slide;
                s.clickedIndex = $(slide).index();
            }
            else {
                s.clickedSlide = undefined;
                s.clickedIndex = undefined;
                return;
            }
            if (s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex) {
                var slideToIndex = s.clickedIndex,
                    realIndex,
                    duplicatedSlides;
                if (s.params.loop) {
                    if (s.animating) return;
                    realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');
                    if (s.params.centeredSlides) {
                        if ((slideToIndex < s.loopedSlides - s.params.slidesPerView/2) || (slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView/2)) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                    else {
                        if (slideToIndex > s.slides.length - s.params.slidesPerView) {
                            s.fixLoop();
                            slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();
                            setTimeout(function () {
                                s.slideTo(slideToIndex);
                            }, 0);
                        }
                        else {
                            s.slideTo(slideToIndex);
                        }
                    }
                }
                else {
                    s.slideTo(slideToIndex);
                }
            }
        };
        
        var isTouched,
            isMoved,
            allowTouchCallbacks,
            touchStartTime,
            isScrolling,
            currentTranslate,
            startTranslate,
            allowThresholdMove,
            // Form elements to match
            formElements = 'input, select, textarea, button',
            // Last click time
            lastClickTime = Date.now(), clickTimeout,
            //Velocities
            velocities = [],
            allowMomentumBounce;
        
        // Animating Flag
        s.animating = false;
        
        // Touches information
        s.touches = {
            startX: 0,
            startY: 0,
            currentX: 0,
            currentY: 0,
            diff: 0
        };
        
        // Touch handlers
        var isTouchEvent, startMoving;
        s.onTouchStart = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            isTouchEvent = e.type === 'touchstart';
            if (!isTouchEvent && 'which' in e && e.which === 3) return;
            if (s.params.noSwiping && findElementInEvent(e, '.' + s.params.noSwipingClass)) {
                s.allowClick = true;
                return;
            }
            if (s.params.swipeHandler) {
                if (!findElementInEvent(e, s.params.swipeHandler)) return;
            }
        
            var startX = s.touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            var startY = s.touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        
            // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
            if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold) {
                return;
            }
        
            isTouched = true;
            isMoved = false;
            allowTouchCallbacks = true;
            isScrolling = undefined;
            startMoving = undefined;
            s.touches.startX = startX;
            s.touches.startY = startY;
            touchStartTime = Date.now();
            s.allowClick = true;
            s.updateContainerSize();
            s.swipeDirection = undefined;
            if (s.params.threshold > 0) allowThresholdMove = false;
            if (e.type !== 'touchstart') {
                var preventDefault = true;
                if ($(e.target).is(formElements)) preventDefault = false;
                if (document.activeElement && $(document.activeElement).is(formElements)) {
                    document.activeElement.blur();
                }
                if (preventDefault) {
                    e.preventDefault();
                }
            }
            s.emit('onTouchStart', s, e);
        };
        
        s.onTouchMove = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (isTouchEvent && e.type === 'mousemove') return;
            if (e.preventedByNestedSwiper) {
                s.touches.startX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                s.touches.startY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                return;
            }
            if (s.params.onlyExternal) {
                // isMoved = true;
                s.allowClick = false;
                if (isTouched) {
                    s.touches.startX = s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                    s.touches.startY = s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                    touchStartTime = Date.now();
                }
                return;
            }
            if (isTouchEvent && document.activeElement) {
                if (e.target === document.activeElement && $(e.target).is(formElements)) {
                    isMoved = true;
                    s.allowClick = false;
                    return;
                }
            }
            if (allowTouchCallbacks) {
                s.emit('onTouchMove', s, e);
            }
            if (e.targetTouches && e.targetTouches.length > 1) return;
        
            s.touches.currentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            s.touches.currentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        
            if (typeof isScrolling === 'undefined') {
                var touchAngle = Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;
                isScrolling = s.isHorizontal() ? touchAngle > s.params.touchAngle : (90 - touchAngle > s.params.touchAngle);
            }
            if (isScrolling) {
                s.emit('onTouchMoveOpposite', s, e);
            }
            if (typeof startMoving === 'undefined' && s.browser.ieTouch) {
                if (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) {
                    startMoving = true;
                }
            }
            if (!isTouched) return;
            if (isScrolling)  {
                isTouched = false;
                return;
            }
            if (!startMoving && s.browser.ieTouch) {
                return;
            }
            s.allowClick = false;
            s.emit('onSliderMove', s, e);
            e.preventDefault();
            if (s.params.touchMoveStopPropagation && !s.params.nested) {
                e.stopPropagation();
            }
        
            if (!isMoved) {
                if (params.loop) {
                    s.fixLoop();
                }
                startTranslate = s.getWrapperTranslate();
                s.setWrapperTransition(0);
                if (s.animating) {
                    s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');
                }
                if (s.params.autoplay && s.autoplaying) {
                    if (s.params.autoplayDisableOnInteraction) {
                        s.stopAutoplay();
                    }
                    else {
                        s.pauseAutoplay();
                    }
                }
                allowMomentumBounce = false;
                //Grab Cursor
                if (s.params.grabCursor) {
                    s.container[0].style.cursor = 'move';
                    s.container[0].style.cursor = '-webkit-grabbing';
                    s.container[0].style.cursor = '-moz-grabbin';
                    s.container[0].style.cursor = 'grabbing';
                }
            }
            isMoved = true;
        
            var diff = s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
        
            diff = diff * s.params.touchRatio;
            if (s.rtl) diff = -diff;
        
            s.swipeDirection = diff > 0 ? 'prev' : 'next';
            currentTranslate = diff + startTranslate;
        
            var disableParentSwiper = true;
            if ((diff > 0 && currentTranslate > s.minTranslate())) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio);
            }
            else if (diff < 0 && currentTranslate < s.maxTranslate()) {
                disableParentSwiper = false;
                if (s.params.resistance) currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio);
            }
        
            if (disableParentSwiper) {
                e.preventedByNestedSwiper = true;
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate) {
                currentTranslate = startTranslate;
            }
            if (!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate) {
                currentTranslate = startTranslate;
            }
        
            if (!s.params.followFinger) return;
        
            // Threshold
            if (s.params.threshold > 0) {
                if (Math.abs(diff) > s.params.threshold || allowThresholdMove) {
                    if (!allowThresholdMove) {
                        allowThresholdMove = true;
                        s.touches.startX = s.touches.currentX;
                        s.touches.startY = s.touches.currentY;
                        currentTranslate = startTranslate;
                        s.touches.diff = s.isHorizontal() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                        return;
                    }
                }
                else {
                    currentTranslate = startTranslate;
                    return;
                }
            }
            // Update active index in free mode
            if (s.params.freeMode || s.params.watchSlidesProgress) {
                s.updateActiveIndex();
            }
            if (s.params.freeMode) {
                //Velocity
                if (velocities.length === 0) {
                    velocities.push({
                        position: s.touches[s.isHorizontal() ? 'startX' : 'startY'],
                        time: touchStartTime
                    });
                }
                velocities.push({
                    position: s.touches[s.isHorizontal() ? 'currentX' : 'currentY'],
                    time: (new window.Date()).getTime()
                });
            }
            // Update progress
            s.updateProgress(currentTranslate);
            // Update translate
            s.setWrapperTranslate(currentTranslate);
        };
        s.onTouchEnd = function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (allowTouchCallbacks) {
                s.emit('onTouchEnd', s, e);
            }
            allowTouchCallbacks = false;
            if (!isTouched) return;
            //Return Grab Cursor
            if (s.params.grabCursor && isMoved && isTouched) {
                s.container[0].style.cursor = 'move';
                s.container[0].style.cursor = '-webkit-grab';
                s.container[0].style.cursor = '-moz-grab';
                s.container[0].style.cursor = 'grab';
            }
        
            // Time diff
            var touchEndTime = Date.now();
            var timeDiff = touchEndTime - touchStartTime;
        
            // Tap, doubleTap, Click
            if (s.allowClick) {
                s.updateClickedSlide(e);
                s.emit('onTap', s, e);
                if (timeDiff < 300 && (touchEndTime - lastClickTime) > 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    clickTimeout = setTimeout(function () {
                        if (!s) return;
                        if (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)) {
                            s.paginationContainer.toggleClass(s.params.paginationHiddenClass);
                        }
                        s.emit('onClick', s, e);
                    }, 300);
        
                }
                if (timeDiff < 300 && (touchEndTime - lastClickTime) < 300) {
                    if (clickTimeout) clearTimeout(clickTimeout);
                    s.emit('onDoubleTap', s, e);
                }
            }
        
            lastClickTime = Date.now();
            setTimeout(function () {
                if (s) s.allowClick = true;
            }, 0);
        
            if (!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
        
            var currentPos;
            if (s.params.followFinger) {
                currentPos = s.rtl ? s.translate : -s.translate;
            }
            else {
                currentPos = -currentTranslate;
            }
            if (s.params.freeMode) {
                if (currentPos < -s.minTranslate()) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                else if (currentPos > -s.maxTranslate()) {
                    if (s.slides.length < s.snapGrid.length) {
                        s.slideTo(s.snapGrid.length - 1);
                    }
                    else {
                        s.slideTo(s.slides.length - 1);
                    }
                    return;
                }
        
                if (s.params.freeModeMomentum) {
                    if (velocities.length > 1) {
                        var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop();
        
                        var distance = lastMoveEvent.position - velocityEvent.position;
                        var time = lastMoveEvent.time - velocityEvent.time;
                        s.velocity = distance / time;
                        s.velocity = s.velocity / 2;
                        if (Math.abs(s.velocity) < s.params.freeModeMinimumVelocity) {
                            s.velocity = 0;
                        }
                        // this implies that the user stopped moving a finger then released.
                        // There would be no events with distance zero, so the last event is stale.
                        if (time > 150 || (new window.Date().getTime() - lastMoveEvent.time) > 300) {
                            s.velocity = 0;
                        }
                    } else {
                        s.velocity = 0;
                    }
        
                    velocities.length = 0;
                    var momentumDuration = 1000 * s.params.freeModeMomentumRatio;
                    var momentumDistance = s.velocity * momentumDuration;
        
                    var newPosition = s.translate + momentumDistance;
                    if (s.rtl) newPosition = - newPosition;
                    var doBounce = false;
                    var afterBouncePosition;
                    var bounceAmount = Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;
                    if (newPosition < s.maxTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition + s.maxTranslate() < -bounceAmount) {
                                newPosition = s.maxTranslate() - bounceAmount;
                            }
                            afterBouncePosition = s.maxTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.maxTranslate();
                        }
                    }
                    else if (newPosition > s.minTranslate()) {
                        if (s.params.freeModeMomentumBounce) {
                            if (newPosition - s.minTranslate() > bounceAmount) {
                                newPosition = s.minTranslate() + bounceAmount;
                            }
                            afterBouncePosition = s.minTranslate();
                            doBounce = true;
                            allowMomentumBounce = true;
                        }
                        else {
                            newPosition = s.minTranslate();
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        var j = 0,
                            nextSlide;
                        for (j = 0; j < s.snapGrid.length; j += 1) {
                            if (s.snapGrid[j] > -newPosition) {
                                nextSlide = j;
                                break;
                            }
        
                        }
                        if (Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next') {
                            newPosition = s.snapGrid[nextSlide];
                        } else {
                            newPosition = s.snapGrid[nextSlide - 1];
                        }
                        if (!s.rtl) newPosition = - newPosition;
                    }
                    //Fix duration
                    if (s.velocity !== 0) {
                        if (s.rtl) {
                            momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);
                        }
                        else {
                            momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);
                        }
                    }
                    else if (s.params.freeModeSticky) {
                        s.slideReset();
                        return;
                    }
        
                    if (s.params.freeModeMomentumBounce && doBounce) {
                        s.updateProgress(afterBouncePosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        s.animating = true;
                        s.wrapper.transitionEnd(function () {
                            if (!s || !allowMomentumBounce) return;
                            s.emit('onMomentumBounce', s);
        
                            s.setWrapperTransition(s.params.speed);
                            s.setWrapperTranslate(afterBouncePosition);
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        });
                    } else if (s.velocity) {
                        s.updateProgress(newPosition);
                        s.setWrapperTransition(momentumDuration);
                        s.setWrapperTranslate(newPosition);
                        s.onTransitionStart();
                        if (!s.animating) {
                            s.animating = true;
                            s.wrapper.transitionEnd(function () {
                                if (!s) return;
                                s.onTransitionEnd();
                            });
                        }
        
                    } else {
                        s.updateProgress(newPosition);
                    }
        
                    s.updateActiveIndex();
                }
                if (!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) {
                    s.updateProgress();
                    s.updateActiveIndex();
                }
                return;
            }
        
            // Find current slide
            var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
            for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) {
                if (typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined') {
                    if (currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];
                    }
                }
                else {
                    if (currentPos >= s.slidesGrid[i]) {
                        stopIndex = i;
                        groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];
                    }
                }
            }
        
            // Find current slide size
            var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
        
            if (timeDiff > s.params.longSwipesMs) {
                // Long touches
                if (!s.params.longSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    if (ratio >= s.params.longSwipesRatio) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
        
                }
                if (s.swipeDirection === 'prev') {
                    if (ratio > (1 - s.params.longSwipesRatio)) s.slideTo(stopIndex + s.params.slidesPerGroup);
                    else s.slideTo(stopIndex);
                }
            }
            else {
                // Short swipes
                if (!s.params.shortSwipes) {
                    s.slideTo(s.activeIndex);
                    return;
                }
                if (s.swipeDirection === 'next') {
                    s.slideTo(stopIndex + s.params.slidesPerGroup);
        
                }
                if (s.swipeDirection === 'prev') {
                    s.slideTo(stopIndex);
                }
            }
        };
        /*=========================
          Transitions
          ===========================*/
        s._slideTo = function (slideIndex, speed) {
            return s.slideTo(slideIndex, speed, true, true);
        };
        s.slideTo = function (slideIndex, speed, runCallbacks, internal) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (typeof slideIndex === 'undefined') slideIndex = 0;
            if (slideIndex < 0) slideIndex = 0;
            s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);
            if (s.snapIndex >= s.snapGrid.length) s.snapIndex = s.snapGrid.length - 1;
        
            var translate = - s.snapGrid[s.snapIndex];
            // Stop autoplay
            if (s.params.autoplay && s.autoplaying) {
                if (internal || !s.params.autoplayDisableOnInteraction) {
                    s.pauseAutoplay(speed);
                }
                else {
                    s.stopAutoplay();
                }
            }
            // Update progress
            s.updateProgress(translate);
        
            // Normalize slideIndex
            for (var i = 0; i < s.slidesGrid.length; i++) {
                if (- Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)) {
                    slideIndex = i;
                }
            }
        
            // Directions locks
            if (!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()) {
                if ((s.activeIndex || 0) !== slideIndex ) return false;
            }
        
            // Update Index
            if (typeof speed === 'undefined') speed = s.params.speed;
            s.previousIndex = s.activeIndex || 0;
            s.activeIndex = slideIndex;
        
            if ((s.rtl && -translate === s.translate) || (!s.rtl && translate === s.translate)) {
                // Update Height
                if (s.params.autoHeight) {
                    s.updateAutoHeight();
                }
                s.updateClasses();
                if (s.params.effect !== 'slide') {
                    s.setWrapperTranslate(translate);
                }
                return false;
            }
            s.updateClasses();
            s.onTransitionStart(runCallbacks);
        
            if (speed === 0) {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(0);
                s.onTransitionEnd(runCallbacks);
            }
            else {
                s.setWrapperTranslate(translate);
                s.setWrapperTransition(speed);
                if (!s.animating) {
                    s.animating = true;
                    s.wrapper.transitionEnd(function () {
                        if (!s) return;
                        s.onTransitionEnd(runCallbacks);
                    });
                }
        
            }
        
            return true;
        };
        
        s.onTransitionStart = function (runCallbacks) {
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.params.autoHeight) {
                s.updateAutoHeight();
            }
            if (s.lazy) s.lazy.onTransitionStart();
            if (runCallbacks) {
                s.emit('onTransitionStart', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeStart', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextStart', s);
                    }
                    else {
                        s.emit('onSlidePrevStart', s);
                    }
                }
        
            }
        };
        s.onTransitionEnd = function (runCallbacks) {
            s.animating = false;
            s.setWrapperTransition(0);
            if (typeof runCallbacks === 'undefined') runCallbacks = true;
            if (s.lazy) s.lazy.onTransitionEnd();
            if (runCallbacks) {
                s.emit('onTransitionEnd', s);
                if (s.activeIndex !== s.previousIndex) {
                    s.emit('onSlideChangeEnd', s);
                    if (s.activeIndex > s.previousIndex) {
                        s.emit('onSlideNextEnd', s);
                    }
                    else {
                        s.emit('onSlidePrevEnd', s);
                    }
                }
            }
            if (s.params.hashnav && s.hashnav) {
                s.hashnav.setHash();
            }
        
        };
        s.slideNext = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
        };
        s._slideNext = function (speed) {
            return s.slideNext(true, speed, true);
        };
        s.slidePrev = function (runCallbacks, speed, internal) {
            if (s.params.loop) {
                if (s.animating) return false;
                s.fixLoop();
                var clientLeft = s.container[0].clientLeft;
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }
            else return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
        };
        s._slidePrev = function (speed) {
            return s.slidePrev(true, speed, true);
        };
        s.slideReset = function (runCallbacks, speed, internal) {
            return s.slideTo(s.activeIndex, speed, runCallbacks);

        };
        
        /*=========================
          Translate/transition helpers
          ===========================*/
        s.setWrapperTransition = function (duration, byController) {
            s.wrapper.transition(duration);
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTransition(duration);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTransition(duration);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTransition(duration);
            }
            if (s.params.control && s.controller) {
                s.controller.setTransition(duration, byController);
            }
            s.emit('onSetTransition', s, duration);
        };
        s.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (s.isHorizontal()) {
                x = s.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
        
            if (s.params.roundLengths) {
                x = round(x);
                y = round(y);
            }
        
            if (!s.params.virtualTranslate) {
                if (s.support.transforms3d) s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
                else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
            }
        
            s.translate = s.isHorizontal() ? x : y;
        
            // Check if we need to update progress
            var progress;
            var translatesDiff = s.maxTranslate() - s.minTranslate();
            if (translatesDiff === 0) {
                progress = 0;
            }
            else {
                progress = (translate - s.minTranslate()) / (translatesDiff);
            }
            if (progress !== s.progress) {
                s.updateProgress(translate);
            }
        
            if (updateActiveIndex) s.updateActiveIndex();
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                s.effects[s.params.effect].setTranslate(s.translate);
            }
            if (s.params.parallax && s.parallax) {
                s.parallax.setTranslate(s.translate);
            }
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.setTranslate(s.translate);
            }
            if (s.params.control && s.controller) {
                s.controller.setTranslate(s.translate, byController);
            }
            s.emit('onSetTranslate', s, s.translate);
        };
        
        s.getTranslate = function (el, axis) {
            var matrix, curTransform, curStyle, transformMatrix;
        
            // automatic axis detection
            if (typeof axis === 'undefined') {
                axis = 'x';
            }
        
            if (s.params.virtualTranslate) {
                return s.rtl ? -s.translate : s.translate;
            }
        
            curStyle = window.getComputedStyle(el, null);
            if (window.WebKitCSSMatrix) {
                curTransform = curStyle.transform || curStyle.webkitTransform;
                if (curTransform.split(',').length > 6) {
                    curTransform = curTransform.split(', ').map(function(a){
                        return a.replace(',','.');
                    }).join(', ');
                }
                // Some old versions of Webkit choke when 'none' is passed; pass
                // empty string instead in this case
                transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
            }
            else {
                transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
                matrix = transformMatrix.toString().split(',');
            }
        
            if (axis === 'x') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m41;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[12]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[4]);
            }
            if (axis === 'y') {
                //Latest Chrome and webkits Fix
                if (window.WebKitCSSMatrix)
                    curTransform = transformMatrix.m42;
                //Crazy IE10 Matrix
                else if (matrix.length === 16)
                    curTransform = parseFloat(matrix[13]);
                //Normal Browsers
                else
                    curTransform = parseFloat(matrix[5]);
            }
            if (s.rtl && curTransform) curTransform = -curTransform;
            return curTransform || 0;
        };
        s.getWrapperTranslate = function (axis) {
            if (typeof axis === 'undefined') {
                axis = s.isHorizontal() ? 'x' : 'y';
            }
            return s.getTranslate(s.wrapper[0], axis);
        };
        
        /*=========================
          Observer
          ===========================*/
        s.observers = [];
        function initObserver(target, options) {
            options = options || {};
            // create an observer instance
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
            var observer = new ObserverFunc(function (mutations) {
                mutations.forEach(function (mutation) {
                    s.onResize(true);
                    s.emit('onObserverUpdate', s, mutation);
                });
            });
        
            observer.observe(target, {
                attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
                childList: typeof options.childList === 'undefined' ? true : options.childList,
                characterData: typeof options.characterData === 'undefined' ? true : options.characterData
            });
        
            s.observers.push(observer);
        }
        s.initObservers = function () {
            if (s.params.observeParents) {
                var containerParents = s.container.parents();
                for (var i = 0; i < containerParents.length; i++) {
                    initObserver(containerParents[i]);
                }
            }
        
            // Observe container
            initObserver(s.container[0], {childList: false});
        
            // Observe wrapper
            initObserver(s.wrapper[0], {attributes: false});
        };
        s.disconnectObservers = function () {
            for (var i = 0; i < s.observers.length; i++) {
                s.observers[i].disconnect();
            }
            s.observers = [];
        };
        /*=========================
          Loop
          ===========================*/
        // Create looped slides
        s.createLoop = function () {
            // Remove duplicated slides
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
        
            var slides = s.wrapper.children('.' + s.params.slideClass);
        
            if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides) s.params.loopedSlides = slides.length;
        
            s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10);
            s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;
            if (s.loopedSlides > slides.length) {
                s.loopedSlides = slides.length;
            }
        
            var prependSlides = [], appendSlides = [], i;
            slides.each(function (index, el) {
                var slide = $(this);
                if (index < s.loopedSlides) appendSlides.push(el);
                if (index < slides.length && index >= slides.length - s.loopedSlides) prependSlides.push(el);
                slide.attr('data-swiper-slide-index', index);
            });
            for (i = 0; i < appendSlides.length; i++) {
                s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
            for (i = prependSlides.length - 1; i >= 0; i--) {
                s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));
            }
        };
        s.destroyLoop = function () {
            s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();
            s.slides.removeAttr('data-swiper-slide-index');
        };
        s.reLoop = function (updatePosition) {
            var oldIndex = s.activeIndex - s.loopedSlides;
            s.destroyLoop();
            s.createLoop();
            s.updateSlidesSize();
            if (updatePosition) {
                s.slideTo(oldIndex + s.loopedSlides, 0, false);
            }
        
        };
        s.fixLoop = function () {
            var newIndex;
            //Fix For Negative Oversliding
            if (s.activeIndex < s.loopedSlides) {
                newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
            //Fix For Positive Oversliding
            else if ((s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2) || (s.activeIndex > s.slides.length - s.params.slidesPerView * 2)) {
                newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;
                newIndex = newIndex + s.loopedSlides;
                s.slideTo(newIndex, 0, false, true);
            }
        };
        /*=========================
          Append/Prepend/Remove Slides
          ===========================*/
        s.appendSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.append(slides[i]);
                }
            }
            else {
                s.wrapper.append(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
        };
        s.prependSlide = function (slides) {
            if (s.params.loop) {
                s.destroyLoop();
            }
            var newActiveIndex = s.activeIndex + 1;
            if (typeof slides === 'object' && slides.length) {
                for (var i = 0; i < slides.length; i++) {
                    if (slides[i]) s.wrapper.prepend(slides[i]);
                }
                newActiveIndex = s.activeIndex + slides.length;
            }
            else {
                s.wrapper.prepend(slides);
            }
            if (s.params.loop) {
                s.createLoop();
            }
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            s.slideTo(newActiveIndex, 0, false);
        };
        s.removeSlide = function (slidesIndexes) {
            if (s.params.loop) {
                s.destroyLoop();
                s.slides = s.wrapper.children('.' + s.params.slideClass);
            }
            var newActiveIndex = s.activeIndex,
                indexToRemove;
            if (typeof slidesIndexes === 'object' && slidesIndexes.length) {
                for (var i = 0; i < slidesIndexes.length; i++) {
                    indexToRemove = slidesIndexes[i];
                    if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                    if (indexToRemove < newActiveIndex) newActiveIndex--;
                }
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
            else {
                indexToRemove = slidesIndexes;
                if (s.slides[indexToRemove]) s.slides.eq(indexToRemove).remove();
                if (indexToRemove < newActiveIndex) newActiveIndex--;
                newActiveIndex = Math.max(newActiveIndex, 0);
            }
        
            if (s.params.loop) {
                s.createLoop();
            }
        
            if (!(s.params.observer && s.support.observer)) {
                s.update(true);
            }
            if (s.params.loop) {
                s.slideTo(newActiveIndex + s.loopedSlides, 0, false);
            }
            else {
                s.slideTo(newActiveIndex, 0, false);
            }
        
        };
        s.removeAllSlides = function () {
            var slidesIndexes = [];
            for (var i = 0; i < s.slides.length; i++) {
                slidesIndexes.push(i);
            }
            s.removeSlide(slidesIndexes);
        };
        

        /*=========================
          Effects
          ===========================*/
        s.effects = {
            fade: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var offset = slide[0].swiperSlideOffset;
                        var tx = -offset;
                        if (!s.params.virtualTranslate) tx = tx - s.translate;
                        var ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
                        var slideOpacity = s.params.fade.crossFade ?
                                Math.max(1 - Math.abs(slide[0].progress), 0) :
                                1 + Math.min(Math.max(slide[0].progress, -1), 0);
                        slide
                            .css({
                                opacity: slideOpacity
                            })
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');
        
                    }
        
                },
                setTransition: function (duration) {
                    s.slides.transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            flip: {
                setTranslate: function () {
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var progress = slide[0].progress;
                        if (s.params.flip.limitRotation) {
                            progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        }
                        var offset = slide[0].swiperSlideOffset;
                        var rotate = -180 * progress,
                            rotateY = rotate,
                            rotateX = 0,
                            tx = -offset,
                            ty = 0;
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                            rotateX = -rotateY;
                            rotateY = 0;
                        }
                        else if (s.rtl) {
                            rotateY = -rotateY;
                        }
        
                        slide[0].style.zIndex = -Math.abs(Math.round(progress)) + s.slides.length;
        
                        if (s.params.flip.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
        
                        slide
                            .transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)');
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.virtualTranslate && duration !== 0) {
                        var eventTriggered = false;
                        s.slides.eq(s.activeIndex).transitionEnd(function () {
                            if (eventTriggered) return;
                            if (!s) return;
                            if (!$(this).hasClass(s.params.slideActiveClass)) return;
                            eventTriggered = true;
                            s.animating = false;
                            var triggerEvents = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'];
                            for (var i = 0; i < triggerEvents.length; i++) {
                                s.wrapper.trigger(triggerEvents[i]);
                            }
                        });
                    }
                }
            },
            cube: {
                setTranslate: function () {
                    var wrapperRotate = 0, cubeShadow;
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow = s.wrapper.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.wrapper.append(cubeShadow);
                            }
                            cubeShadow.css({height: s.width + 'px'});
                        }
                        else {
                            cubeShadow = s.container.find('.swiper-cube-shadow');
                            if (cubeShadow.length === 0) {
                                cubeShadow = $('<div class="swiper-cube-shadow"></div>');
                                s.container.append(cubeShadow);
                            }
                        }
                    }
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides.eq(i);
                        var slideAngle = i * 90;
                        var round = Math.floor(slideAngle / 360);
                        if (s.rtl) {
                            slideAngle = -slideAngle;
                            round = Math.floor(-slideAngle / 360);
                        }
                        var progress = Math.max(Math.min(slide[0].progress, 1), -1);
                        var tx = 0, ty = 0, tz = 0;
                        if (i % 4 === 0) {
                            tx = - round * 4 * s.size;
                            tz = 0;
                        }
                        else if ((i - 1) % 4 === 0) {
                            tx = 0;
                            tz = - round * 4 * s.size;
                        }
                        else if ((i - 2) % 4 === 0) {
                            tx = s.size + round * 4 * s.size;
                            tz = s.size;
                        }
                        else if ((i - 3) % 4 === 0) {
                            tx = - s.size;
                            tz = 3 * s.size + s.size * 4 * round;
                        }
                        if (s.rtl) {
                            tx = -tx;
                        }
        
                        if (!s.isHorizontal()) {
                            ty = tx;
                            tx = 0;
                        }
        
                        var transform = 'rotateX(' + (s.isHorizontal() ? 0 : -slideAngle) + 'deg) rotateY(' + (s.isHorizontal() ? slideAngle : 0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';
                        if (progress <= 1 && progress > -1) {
                            wrapperRotate = i * 90 + progress * 90;
                            if (s.rtl) wrapperRotate = -i * 90 - progress * 90;
                        }
                        slide.transform(transform);
                        if (s.params.cube.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = Math.max(-progress, 0);
                            if (shadowAfter.length) shadowAfter[0].style.opacity = Math.max(progress, 0);
                        }
                    }
                    s.wrapper.css({
                        '-webkit-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-moz-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        '-ms-transform-origin': '50% 50% -' + (s.size / 2) + 'px',
                        'transform-origin': '50% 50% -' + (s.size / 2) + 'px'
                    });
        
                    if (s.params.cube.shadow) {
                        if (s.isHorizontal()) {
                            cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + (-s.width / 2) + 'px) rotateX(90deg) rotateZ(0deg) scale(' + (s.params.cube.shadowScale) + ')');
                        }
                        else {
                            var shadowAngle = Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;
                            var multiplier = 1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);
                            var scale1 = s.params.cube.shadowScale,
                                scale2 = s.params.cube.shadowScale / multiplier,
                                offset = s.params.cube.shadowOffset;
                            cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + (-s.height / 2 / scale2) + 'px) rotateX(-90deg)');
                        }
                    }
                    var zFactor = (s.isSafari || s.isUiWebView) ? (-s.size / 2) : 0;
                    s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (s.isHorizontal() ? 0 : wrapperRotate) + 'deg) rotateY(' + (s.isHorizontal() ? -wrapperRotate : 0) + 'deg)');
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                    if (s.params.cube.shadow && !s.isHorizontal()) {
                        s.container.find('.swiper-cube-shadow').transition(duration);
                    }
                }
            },
            coverflow: {
                setTranslate: function () {
                    var transform = s.translate;
                    var center = s.isHorizontal() ? -transform + s.width / 2 : -transform + s.height / 2;
                    var rotate = s.isHorizontal() ? s.params.coverflow.rotate: -s.params.coverflow.rotate;
                    var translate = s.params.coverflow.depth;
                    //Each slide offset from center
                    for (var i = 0, length = s.slides.length; i < length; i++) {
                        var slide = s.slides.eq(i);
                        var slideSize = s.slidesSizesGrid[i];
                        var slideOffset = slide[0].swiperSlideOffset;
                        var offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;
        
                        var rotateY = s.isHorizontal() ? rotate * offsetMultiplier : 0;
                        var rotateX = s.isHorizontal() ? 0 : rotate * offsetMultiplier;
                        // var rotateZ = 0
                        var translateZ = -translate * Math.abs(offsetMultiplier);
        
                        var translateY = s.isHorizontal() ? 0 : s.params.coverflow.stretch * (offsetMultiplier);
                        var translateX = s.isHorizontal() ? s.params.coverflow.stretch * (offsetMultiplier) : 0;
        
                        //Fix for ultra small values
                        if (Math.abs(translateX) < 0.001) translateX = 0;
                        if (Math.abs(translateY) < 0.001) translateY = 0;
                        if (Math.abs(translateZ) < 0.001) translateZ = 0;
                        if (Math.abs(rotateY) < 0.001) rotateY = 0;
                        if (Math.abs(rotateX) < 0.001) rotateX = 0;
        
                        var slideTransform = 'translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
        
                        slide.transform(slideTransform);
                        slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
                        if (s.params.coverflow.slideShadows) {
                            //Set shadows
                            var shadowBefore = s.isHorizontal() ? slide.find('.swiper-slide-shadow-left') : slide.find('.swiper-slide-shadow-top');
                            var shadowAfter = s.isHorizontal() ? slide.find('.swiper-slide-shadow-right') : slide.find('.swiper-slide-shadow-bottom');
                            if (shadowBefore.length === 0) {
                                shadowBefore = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'left' : 'top') + '"></div>');
                                slide.append(shadowBefore);
                            }
                            if (shadowAfter.length === 0) {
                                shadowAfter = $('<div class="swiper-slide-shadow-' + (s.isHorizontal() ? 'right' : 'bottom') + '"></div>');
                                slide.append(shadowAfter);
                            }
                            if (shadowBefore.length) shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
                            if (shadowAfter.length) shadowAfter[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
                        }
                    }
        
                    //Set correct perspective for IE10
                    if (s.browser.ie) {
                        var ws = s.wrapper[0].style;
                        ws.perspectiveOrigin = center + 'px 50%';
                    }
                },
                setTransition: function (duration) {
                    s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);
                }
            }
        };

        /*=========================
          Images Lazy Loading
          ===========================*/
        s.lazy = {
            initialImageLoaded: false,
            loadImageInSlide: function (index, loadInDuplicate) {
                if (typeof index === 'undefined') return;
                if (typeof loadInDuplicate === 'undefined') loadInDuplicate = true;
                if (s.slides.length === 0) return;
        
                var slide = s.slides.eq(index);
                var img = slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');
                if (slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')) {
                    img = img.add(slide[0]);
                }
                if (img.length === 0) return;
        
                img.each(function () {
                    var _img = $(this);
                    _img.addClass('swiper-lazy-loading');
                    var background = _img.attr('data-background');
                    var src = _img.attr('data-src'),
                        srcset = _img.attr('data-srcset');
                    s.loadImage(_img[0], (src || background), srcset, false, function () {
                        if (background) {
                            _img.css('background-image', 'url("' + background + '")');
                            _img.removeAttr('data-background');
                        }
                        else {
                            if (srcset) {
                                _img.attr('srcset', srcset);
                                _img.removeAttr('data-srcset');
                            }
                            if (src) {
                                _img.attr('src', src);
                                _img.removeAttr('data-src');
                            }
        
                        }
        
                        _img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');
                        slide.find('.swiper-lazy-preloader, .preloader').remove();
                        if (s.params.loop && loadInDuplicate) {
                            var slideOriginalIndex = slide.attr('data-swiper-slide-index');
                            if (slide.hasClass(s.params.slideDuplicateClass)) {
                                var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');
                                s.lazy.loadImageInSlide(originalSlide.index(), false);
                            }
                            else {
                                var duplicatedSlide = s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                                s.lazy.loadImageInSlide(duplicatedSlide.index(), false);
                            }
                        }
                        s.emit('onLazyImageReady', s, slide[0], _img[0]);
                    });
        
                    s.emit('onLazyImageLoad', s, slide[0], _img[0]);
                });
        
            },
            load: function () {
                var i;
                if (s.params.watchSlidesVisibility) {
                    s.wrapper.children('.' + s.params.slideVisibleClass).each(function () {
                        s.lazy.loadImageInSlide($(this).index());
                    });
                }
                else {
                    if (s.params.slidesPerView > 1) {
                        for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        s.lazy.loadImageInSlide(s.activeIndex);
                    }
                }
                if (s.params.lazyLoadingInPrevNext) {
                    if (s.params.slidesPerView > 1 || (s.params.lazyLoadingInPrevNextAmount && s.params.lazyLoadingInPrevNextAmount > 1)) {
                        var amount = s.params.lazyLoadingInPrevNextAmount;
                        var spv = s.params.slidesPerView;
                        var maxIndex = Math.min(s.activeIndex + spv + Math.max(amount, spv), s.slides.length);
                        var minIndex = Math.max(s.activeIndex - Math.max(spv, amount), 0);
                        // Next Slides
                        for (i = s.activeIndex + s.params.slidesPerView; i < maxIndex; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                        // Prev Slides
                        for (i = minIndex; i < s.activeIndex ; i++) {
                            if (s.slides[i]) s.lazy.loadImageInSlide(i);
                        }
                    }
                    else {
                        var nextSlide = s.wrapper.children('.' + s.params.slideNextClass);
                        if (nextSlide.length > 0) s.lazy.loadImageInSlide(nextSlide.index());
        
                        var prevSlide = s.wrapper.children('.' + s.params.slidePrevClass);
                        if (prevSlide.length > 0) s.lazy.loadImageInSlide(prevSlide.index());
                    }
                }
            },
            onTransitionStart: function () {
                if (s.params.lazyLoading) {
                    if (s.params.lazyLoadingOnTransitionStart || (!s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded)) {
                        s.lazy.load();
                    }
                }
            },
            onTransitionEnd: function () {
                if (s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart) {
                    s.lazy.load();
                }
            }
        };
        

        /*=========================
          Scrollbar
          ===========================*/
        s.scrollbar = {
            isTouched: false,
            setDragPosition: function (e) {
                var sb = s.scrollbar;
                var x = 0, y = 0;
                var translate;
                var pointerPosition = s.isHorizontal() ?
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageX : e.pageX || e.clientX) :
                    ((e.type === 'touchstart' || e.type === 'touchmove') ? e.targetTouches[0].pageY : e.pageY || e.clientY) ;
                var position = (pointerPosition) - sb.track.offset()[s.isHorizontal() ? 'left' : 'top'] - sb.dragSize / 2;
                var positionMin = -s.minTranslate() * sb.moveDivider;
                var positionMax = -s.maxTranslate() * sb.moveDivider;
                if (position < positionMin) {
                    position = positionMin;
                }
                else if (position > positionMax) {
                    position = positionMax;
                }
                position = -position / sb.moveDivider;
                s.updateProgress(position);
                s.setWrapperTranslate(position, true);
            },
            dragStart: function (e) {
                var sb = s.scrollbar;
                sb.isTouched = true;
                e.preventDefault();
                e.stopPropagation();
        
                sb.setDragPosition(e);
                clearTimeout(sb.dragTimeout);
        
                sb.track.transition(0);
                if (s.params.scrollbarHide) {
                    sb.track.css('opacity', 1);
                }
                s.wrapper.transition(100);
                sb.drag.transition(100);
                s.emit('onScrollbarDragStart', s);
            },
            dragMove: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                if (e.preventDefault) e.preventDefault();
                else e.returnValue = false;
                sb.setDragPosition(e);
                s.wrapper.transition(0);
                sb.track.transition(0);
                sb.drag.transition(0);
                s.emit('onScrollbarDragMove', s);
            },
            dragEnd: function (e) {
                var sb = s.scrollbar;
                if (!sb.isTouched) return;
                sb.isTouched = false;
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.dragTimeout);
                    sb.dragTimeout = setTimeout(function () {
                        sb.track.css('opacity', 0);
                        sb.track.transition(400);
                    }, 1000);
        
                }
                s.emit('onScrollbarDragEnd', s);
                if (s.params.scrollbarSnapOnRelease) {
                    s.slideReset();
                }
            },
            enableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).on(s.touchEvents.start, sb.dragStart);
                $(target).on(s.touchEvents.move, sb.dragMove);
                $(target).on(s.touchEvents.end, sb.dragEnd);
            },
            disableDraggable: function () {
                var sb = s.scrollbar;
                var target = s.support.touch ? sb.track : document;
                $(sb.track).off(s.touchEvents.start, sb.dragStart);
                $(target).off(s.touchEvents.move, sb.dragMove);
                $(target).off(s.touchEvents.end, sb.dragEnd);
            },
            set: function () {
                if (!s.params.scrollbar) return;
                var sb = s.scrollbar;
                sb.track = $(s.params.scrollbar);
                if (s.params.uniqueNavElements && typeof s.params.scrollbar === 'string' && sb.track.length > 1 && s.container.find(s.params.scrollbar).length === 1) {
                    sb.track = s.container.find(s.params.scrollbar);
                }
                sb.drag = sb.track.find('.swiper-scrollbar-drag');
                if (sb.drag.length === 0) {
                    sb.drag = $('<div class="swiper-scrollbar-drag"></div>');
                    sb.track.append(sb.drag);
                }
                sb.drag[0].style.width = '';
                sb.drag[0].style.height = '';
                sb.trackSize = s.isHorizontal() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight;
        
                sb.divider = s.size / s.virtualSize;
                sb.moveDivider = sb.divider * (sb.trackSize / s.size);
                sb.dragSize = sb.trackSize * sb.divider;
        
                if (s.isHorizontal()) {
                    sb.drag[0].style.width = sb.dragSize + 'px';
                }
                else {
                    sb.drag[0].style.height = sb.dragSize + 'px';
                }
        
                if (sb.divider >= 1) {
                    sb.track[0].style.display = 'none';
                }
                else {
                    sb.track[0].style.display = '';
                }
                if (s.params.scrollbarHide) {
                    sb.track[0].style.opacity = 0;
                }
            },
            setTranslate: function () {
                if (!s.params.scrollbar) return;
                var diff;
                var sb = s.scrollbar;
                var translate = s.translate || 0;
                var newPos;
        
                var newSize = sb.dragSize;
                newPos = (sb.trackSize - sb.dragSize) * s.progress;
                if (s.rtl && s.isHorizontal()) {
                    newPos = -newPos;
                    if (newPos > 0) {
                        newSize = sb.dragSize - newPos;
                        newPos = 0;
                    }
                    else if (-newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize + newPos;
                    }
                }
                else {
                    if (newPos < 0) {
                        newSize = sb.dragSize + newPos;
                        newPos = 0;
                    }
                    else if (newPos + sb.dragSize > sb.trackSize) {
                        newSize = sb.trackSize - newPos;
                    }
                }
                if (s.isHorizontal()) {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(' + (newPos) + 'px, 0, 0)');
                    }
                    else {
                        sb.drag.transform('translateX(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.width = newSize + 'px';
                }
                else {
                    if (s.support.transforms3d) {
                        sb.drag.transform('translate3d(0px, ' + (newPos) + 'px, 0)');
                    }
                    else {
                        sb.drag.transform('translateY(' + (newPos) + 'px)');
                    }
                    sb.drag[0].style.height = newSize + 'px';
                }
                if (s.params.scrollbarHide) {
                    clearTimeout(sb.timeout);
                    sb.track[0].style.opacity = 1;
                    sb.timeout = setTimeout(function () {
                        sb.track[0].style.opacity = 0;
                        sb.track.transition(400);
                    }, 1000);
                }
            },
            setTransition: function (duration) {
                if (!s.params.scrollbar) return;
                s.scrollbar.drag.transition(duration);
            }
        };

        /*=========================
          Controller
          ===========================*/
        s.controller = {
            LinearSpline: function (x, y) {
                this.x = x;
                this.y = y;
                this.lastIndex = x.length - 1;
                // Given an x value (x2), return the expected y2 value:
                // (x1,y1) is the known point before given value,
                // (x3,y3) is the known point after given value.
                var i1, i3;
                var l = this.x.length;
        
                this.interpolate = function (x2) {
                    if (!x2) return 0;
        
                    // Get the indexes of x1 and x3 (the array indexes before and after given x2):
                    i3 = binarySearch(this.x, x2);
                    i1 = i3 - 1;
        
                    // We have our indexes i1 & i3, so we can calculate already:
                    // y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
                    return ((x2 - this.x[i1]) * (this.y[i3] - this.y[i1])) / (this.x[i3] - this.x[i1]) + this.y[i1];
                };
        
                var binarySearch = (function() {
                    var maxIndex, minIndex, guess;
                    return function(array, val) {
                        minIndex = -1;
                        maxIndex = array.length;
                        while (maxIndex - minIndex > 1)
                            if (array[guess = maxIndex + minIndex >> 1] <= val) {
                                minIndex = guess;
                            } else {
                                maxIndex = guess;
                            }
                        return maxIndex;
                    };
                })();
            },
            //xxx: for now i will just save one spline function to to
            getInterpolateFunction: function(c){
                if(!s.controller.spline) s.controller.spline = s.params.loop ?
                    new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) :
                    new s.controller.LinearSpline(s.snapGrid, c.snapGrid);
            },
            setTranslate: function (translate, byController) {
               var controlled = s.params.control;
               var multiplier, controlledTranslate;
               function setControlledTranslate(c) {
                    // this will create an Interpolate function based on the snapGrids
                    // x is the Grid of the scrolled scroller and y will be the controlled scroller
                    // it makes sense to create this only once and recall it for the interpolation
                    // the function does a lot of value caching for performance
                    translate = c.rtl && c.params.direction === 'horizontal' ? -s.translate : s.translate;
                    if (s.params.controlBy === 'slide') {
                        s.controller.getInterpolateFunction(c);
                        // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
                        // but it did not work out
                        controlledTranslate = -s.controller.spline.interpolate(-translate);
                    }
        
                    if(!controlledTranslate || s.params.controlBy === 'container'){
                        multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();
                    }
        
                    if (s.params.controlInverse) {
                        controlledTranslate = c.maxTranslate() - controlledTranslate;
                    }
                    c.updateProgress(controlledTranslate);
                    c.setWrapperTranslate(controlledTranslate, false, s);
                    c.updateActiveIndex();
               }
               if (s.isArray(controlled)) {
                   for (var i = 0; i < controlled.length; i++) {
                       if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                           setControlledTranslate(controlled[i]);
                       }
                   }
               }
               else if (controlled instanceof Swiper && byController !== controlled) {
        
                   setControlledTranslate(controlled);
               }
            },
            setTransition: function (duration, byController) {
                var controlled = s.params.control;
                var i;
                function setControlledTransition(c) {
                    c.setWrapperTransition(duration, s);
                    if (duration !== 0) {
                        c.onTransitionStart();
                        c.wrapper.transitionEnd(function(){
                            if (!controlled) return;
                            if (c.params.loop && s.params.controlBy === 'slide') {
                                c.fixLoop();
                            }
                            c.onTransitionEnd();
        
                        });
                    }
                }
                if (s.isArray(controlled)) {
                    for (i = 0; i < controlled.length; i++) {
                        if (controlled[i] !== byController && controlled[i] instanceof Swiper) {
                            setControlledTransition(controlled[i]);
                        }
                    }
                }
                else if (controlled instanceof Swiper && byController !== controlled) {
                    setControlledTransition(controlled);
                }
            }
        };

        /*=========================
          Hash Navigation
          ===========================*/
        s.hashnav = {
            init: function () {
                if (!s.params.hashnav) return;
                s.hashnav.initialized = true;
                var hash = document.location.hash.replace('#', '');
                if (!hash) return;
                var speed = 0;
                for (var i = 0, length = s.slides.length; i < length; i++) {
                    var slide = s.slides.eq(i);
                    var slideHash = slide.attr('data-hash');
                    if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                        var index = slide.index();
                        s.slideTo(index, speed, s.params.runCallbacksOnInit, true);
                    }
                }
            },
            setHash: function () {
                if (!s.hashnav.initialized || !s.params.hashnav) return;
                document.location.hash = s.slides.eq(s.activeIndex).attr('data-hash') || '';
            }
        };

        /*=========================
          Keyboard Control
          ===========================*/
        function handleKeyboard(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var kc = e.keyCode || e.charCode;
            // Directions locks
            if (!s.params.allowSwipeToNext && (s.isHorizontal() && kc === 39 || !s.isHorizontal() && kc === 40)) {
                return false;
            }
            if (!s.params.allowSwipeToPrev && (s.isHorizontal() && kc === 37 || !s.isHorizontal() && kc === 38)) {
                return false;
            }
            if (e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
                return;
            }
            if (document.activeElement && document.activeElement.nodeName && (document.activeElement.nodeName.toLowerCase() === 'input' || document.activeElement.nodeName.toLowerCase() === 'textarea')) {
                return;
            }
            if (kc === 37 || kc === 39 || kc === 38 || kc === 40) {
                var inView = false;
                //Check that swiper should be inside of visible area of window
                if (s.container.parents('.swiper-slide').length > 0 && s.container.parents('.swiper-slide-active').length === 0) {
                    return;
                }
                var windowScroll = {
                    left: window.pageXOffset,
                    top: window.pageYOffset
                };
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var swiperOffset = s.container.offset();
                if (s.rtl) swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft;
                var swiperCoord = [
                    [swiperOffset.left, swiperOffset.top],
                    [swiperOffset.left + s.width, swiperOffset.top],
                    [swiperOffset.left, swiperOffset.top + s.height],
                    [swiperOffset.left + s.width, swiperOffset.top + s.height]
                ];
                for (var i = 0; i < swiperCoord.length; i++) {
                    var point = swiperCoord[i];
                    if (
                        point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth &&
                        point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight
                    ) {
                        inView = true;
                    }
        
                }
                if (!inView) return;
            }
            if (s.isHorizontal()) {
                if (kc === 37 || kc === 39 || kc === 32) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if ((kc === 39 && !s.rtl) || (kc === 37 && s.rtl)) s.slideNext();
                if ((kc === 37 && !s.rtl) || (kc === 39 && s.rtl)) s.slidePrev();
            }
            else {
                if (kc === 38 || kc === 40) {
                    if (e.preventDefault) e.preventDefault();
                    else e.returnValue = false;
                }
                if (kc === 40) s.slideNext();
                if (kc === 38) s.slidePrev();
            }
        }
        s.disableKeyboardControl = function () {
            s.params.keyboardControl = false;
            $(document).off('keydown', handleKeyboard);
        };
        s.enableKeyboardControl = function () {
            s.params.keyboardControl = true;
            $(document).on('keydown', handleKeyboard);
        };
        

        /*=========================
          Mousewheel Control
          ===========================*/
        s.mousewheel = {
            event: false,
            lastScrollTime: (new window.Date()).getTime()
        };
        if (s.params.mousewheelControl) {
            try {
                new window.WheelEvent('wheel');
                s.mousewheel.event = 'wheel';
            } catch (e) {
                if (window.WheelEvent || (s.container[0] && 'wheel' in s.container[0])) {
                    s.mousewheel.event = 'wheel';
                }
            }
            if (!s.mousewheel.event && window.WheelEvent) {
        
            }
            if (!s.mousewheel.event && document.onmousewheel !== undefined) {
                s.mousewheel.event = 'mousewheel';
            }
            if (!s.mousewheel.event) {
                s.mousewheel.event = 'DOMMouseScroll';
            }
        }
        function handleMousewheel(e) {
            if (e.originalEvent) e = e.originalEvent; //jquery fix
            var we = s.mousewheel.event;
            var delta = 0;
            var rtlFactor = s.rtl ? -1 : 1;
        
            //WebKits
            if (we === 'mousewheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (s.isHorizontal()) {
                        if (Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY)) delta = e.wheelDeltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX)) delta = e.wheelDeltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? - e.wheelDeltaX * rtlFactor : - e.wheelDeltaY;
                }
            }
            //Old FireFox
            else if (we === 'DOMMouseScroll') delta = -e.detail;
            //New FireFox
            else if (we === 'wheel') {
                if (s.params.mousewheelForceToAxis) {
                    if (s.isHorizontal()) {
                        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) delta = -e.deltaX * rtlFactor;
                        else return;
                    }
                    else {
                        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) delta = -e.deltaY;
                        else return;
                    }
                }
                else {
                    delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? - e.deltaX * rtlFactor : - e.deltaY;
                }
            }
            if (delta === 0) return;
        
            if (s.params.mousewheelInvert) delta = -delta;
        
            if (!s.params.freeMode) {
                if ((new window.Date()).getTime() - s.mousewheel.lastScrollTime > 60) {
                    if (delta < 0) {
                        if ((!s.isEnd || s.params.loop) && !s.animating) s.slideNext();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                    else {
                        if ((!s.isBeginning || s.params.loop) && !s.animating) s.slidePrev();
                        else if (s.params.mousewheelReleaseOnEdges) return true;
                    }
                }
                s.mousewheel.lastScrollTime = (new window.Date()).getTime();
        
            }
            else {
                //Freemode or scrollContainer:
                var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity;
                var wasBeginning = s.isBeginning,
                    wasEnd = s.isEnd;
        
                if (position >= s.minTranslate()) position = s.minTranslate();
                if (position <= s.maxTranslate()) position = s.maxTranslate();
        
                s.setWrapperTransition(0);
                s.setWrapperTranslate(position);
                s.updateProgress();
                s.updateActiveIndex();
        
                if (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) {
                    s.updateClasses();
                }
        
                if (s.params.freeModeSticky) {
                    clearTimeout(s.mousewheel.timeout);
                    s.mousewheel.timeout = setTimeout(function () {
                        s.slideReset();
                    }, 300);
                }
                else {
                    if (s.params.lazyLoading && s.lazy) {
                        s.lazy.load();
                    }
                }
        
                // Return page scroll on edge positions
                if (position === 0 || position === s.maxTranslate()) return;
            }
            if (s.params.autoplay) s.stopAutoplay();
        
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = false;
            return false;
        }
        s.disableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.off(s.mousewheel.event, handleMousewheel);
            return true;
        };
        
        s.enableMousewheelControl = function () {
            if (!s.mousewheel.event) return false;
            s.container.on(s.mousewheel.event, handleMousewheel);
            return true;
        };
        

        /*=========================
          Parallax
          ===========================*/
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY;
            var rtlFactor = s.rtl ? -1 : 1;
        
            p = el.attr('data-swiper-parallax') || '0';
            pX = el.attr('data-swiper-parallax-x');
            pY = el.attr('data-swiper-parallax-y');
            if (pX || pY) {
                pX = pX || '0';
                pY = pY || '0';
            }
            else {
                if (s.isHorizontal()) {
                    pX = p;
                    pY = '0';
                }
                else {
                    pY = p;
                    pX = '0';
                }
            }
        
            if ((pX).indexOf('%') >= 0) {
                pX = parseInt(pX, 10) * progress * rtlFactor + '%';
            }
            else {
                pX = pX * progress * rtlFactor + 'px' ;
            }
            if ((pY).indexOf('%') >= 0) {
                pY = parseInt(pY, 10) * progress + '%';
            }
            else {
                pY = pY * progress + 'px' ;
            }
        
            el.transform('translate3d(' + pX + ', ' + pY + ',0px)');
        }
        s.parallax = {
            setTranslate: function () {
                s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    setParallaxTransform(this, s.progress);
        
                });
                s.slides.each(function () {
                    var slide = $(this);
                    slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function () {
                        var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                        setParallaxTransform(this, progress);
                    });
                });
            },
            setTransition: function (duration) {
                if (typeof duration === 'undefined') duration = s.params.speed;
                s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){
                    var el = $(this);
                    var parallaxDuration = parseInt(el.attr('data-swiper-parallax-duration'), 10) || duration;
                    if (duration === 0) parallaxDuration = 0;
                    el.transition(parallaxDuration);
                });
            }
        };
        

        /*=========================
          Plugins API. Collect all and init all plugins
          ===========================*/
        s._plugins = [];
        for (var plugin in s.plugins) {
            var p = s.plugins[plugin](s, s.params[plugin]);
            if (p) s._plugins.push(p);
        }
        // Method to call all plugins event/method
        s.callPlugins = function (eventName) {
            for (var i = 0; i < s._plugins.length; i++) {
                if (eventName in s._plugins[i]) {
                    s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
        };

        /*=========================
          Events/Callbacks/Plugins Emitter
          ===========================*/
        function normalizeEventName (eventName) {
            if (eventName.indexOf('on') !== 0) {
                if (eventName[0] !== eventName[0].toUpperCase()) {
                    eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);
                }
                else {
                    eventName = 'on' + eventName;
                }
            }
            return eventName;
        }
        s.emitterEventListeners = {
        
        };
        s.emit = function (eventName) {
            // Trigger callbacks
            if (s.params[eventName]) {
                s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }
            var i;
            // Trigger events
            if (s.emitterEventListeners[eventName]) {
                for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                    s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                }
            }
            // Trigger plugins
            if (s.callPlugins) s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        };
        s.on = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            if (!s.emitterEventListeners[eventName]) s.emitterEventListeners[eventName] = [];
            s.emitterEventListeners[eventName].push(handler);
            return s;
        };
        s.off = function (eventName, handler) {
            var i;
            eventName = normalizeEventName(eventName);
            if (typeof handler === 'undefined') {
                // Remove all handlers for such event
                s.emitterEventListeners[eventName] = [];
                return s;
            }
            if (!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0) return;
            for (i = 0; i < s.emitterEventListeners[eventName].length; i++) {
                if(s.emitterEventListeners[eventName][i] === handler) s.emitterEventListeners[eventName].splice(i, 1);
            }
            return s;
        };
        s.once = function (eventName, handler) {
            eventName = normalizeEventName(eventName);
            var _handler = function () {
                handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
                s.off(eventName, _handler);
            };
            s.on(eventName, _handler);
            return s;
        };

        // Accessibility tools
        s.a11y = {
            makeFocusable: function ($el) {
                $el.attr('tabIndex', '0');
                return $el;
            },
            addRole: function ($el, role) {
                $el.attr('role', role);
                return $el;
            },
        
            addLabel: function ($el, label) {
                $el.attr('aria-label', label);
                return $el;
            },
        
            disable: function ($el) {
                $el.attr('aria-disabled', true);
                return $el;
            },
        
            enable: function ($el) {
                $el.attr('aria-disabled', false);
                return $el;
            },
        
            onEnterKey: function (event) {
                if (event.keyCode !== 13) return;
                if ($(event.target).is(s.params.nextButton)) {
                    s.onClickNext(event);
                    if (s.isEnd) {
                        s.a11y.notify(s.params.lastSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.nextSlideMessage);
                    }
                }
                else if ($(event.target).is(s.params.prevButton)) {
                    s.onClickPrev(event);
                    if (s.isBeginning) {
                        s.a11y.notify(s.params.firstSlideMessage);
                    }
                    else {
                        s.a11y.notify(s.params.prevSlideMessage);
                    }
                }
                if ($(event.target).is('.' + s.params.bulletClass)) {
                    $(event.target)[0].click();
                }
            },
        
            liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
        
            notify: function (message) {
                var notification = s.a11y.liveRegion;
                if (notification.length === 0) return;
                notification.html('');
                notification.html(message);
            },
            init: function () {
                // Setup accessibility
                if (s.params.nextButton && s.nextButton && s.nextButton.length > 0) {
                    s.a11y.makeFocusable(s.nextButton);
                    s.a11y.addRole(s.nextButton, 'button');
                    s.a11y.addLabel(s.nextButton, s.params.nextSlideMessage);
                }
                if (s.params.prevButton && s.prevButton && s.prevButton.length > 0) {
                    s.a11y.makeFocusable(s.prevButton);
                    s.a11y.addRole(s.prevButton, 'button');
                    s.a11y.addLabel(s.prevButton, s.params.prevSlideMessage);
                }
        
                $(s.container).append(s.a11y.liveRegion);
            },
            initPagination: function () {
                if (s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length) {
                    s.bullets.each(function () {
                        var bullet = $(this);
                        s.a11y.makeFocusable(bullet);
                        s.a11y.addRole(bullet, 'button');
                        s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                    });
                }
            },
            destroy: function () {
                if (s.a11y.liveRegion && s.a11y.liveRegion.length > 0) s.a11y.liveRegion.remove();
            }
        };
        

        /*=========================
          Init/Destroy
          ===========================*/
        s.init = function () {
            if (s.params.loop) s.createLoop();
            s.updateContainerSize();
            s.updateSlidesSize();
            s.updatePagination();
            if (s.params.scrollbar && s.scrollbar) {
                s.scrollbar.set();
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.enableDraggable();
                }
            }
            if (s.params.effect !== 'slide' && s.effects[s.params.effect]) {
                if (!s.params.loop) s.updateProgress();
                s.effects[s.params.effect].setTranslate();
            }
            if (s.params.loop) {
                s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit);
            }
            else {
                s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit);
                if (s.params.initialSlide === 0) {
                    if (s.parallax && s.params.parallax) s.parallax.setTranslate();
                    if (s.lazy && s.params.lazyLoading) {
                        s.lazy.load();
                        s.lazy.initialImageLoaded = true;
                    }
                }
            }
            s.attachEvents();
            if (s.params.observer && s.support.observer) {
                s.initObservers();
            }
            if (s.params.preloadImages && !s.params.lazyLoading) {
                s.preloadImages();
            }
            if (s.params.autoplay) {
                s.startAutoplay();
            }
            if (s.params.keyboardControl) {
                if (s.enableKeyboardControl) s.enableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.enableMousewheelControl) s.enableMousewheelControl();
            }
            if (s.params.hashnav) {
                if (s.hashnav) s.hashnav.init();
            }
            if (s.params.a11y && s.a11y) s.a11y.init();
            s.emit('onInit', s);
        };
        
        // Cleanup dynamic styles
        s.cleanupStyles = function () {
            // Container
            s.container.removeClass(s.classNames.join(' ')).removeAttr('style');
        
            // Wrapper
            s.wrapper.removeAttr('style');
        
            // Slides
            if (s.slides && s.slides.length) {
                s.slides
                    .removeClass([
                      s.params.slideVisibleClass,
                      s.params.slideActiveClass,
                      s.params.slideNextClass,
                      s.params.slidePrevClass
                    ].join(' '))
                    .removeAttr('style')
                    .removeAttr('data-swiper-column')
                    .removeAttr('data-swiper-row');
            }
        
            // Pagination/Bullets
            if (s.paginationContainer && s.paginationContainer.length) {
                s.paginationContainer.removeClass(s.params.paginationHiddenClass);
            }
            if (s.bullets && s.bullets.length) {
                s.bullets.removeClass(s.params.bulletActiveClass);
            }
        
            // Buttons
            if (s.params.prevButton) $(s.params.prevButton).removeClass(s.params.buttonDisabledClass);
            if (s.params.nextButton) $(s.params.nextButton).removeClass(s.params.buttonDisabledClass);
        
            // Scrollbar
            if (s.params.scrollbar && s.scrollbar) {
                if (s.scrollbar.track && s.scrollbar.track.length) s.scrollbar.track.removeAttr('style');
                if (s.scrollbar.drag && s.scrollbar.drag.length) s.scrollbar.drag.removeAttr('style');
            }
        };
        
        // Destroy
        s.destroy = function (deleteInstance, cleanupStyles) {
            // Detach evebts
            s.detachEvents();
            // Stop autoplay
            s.stopAutoplay();
            // Disable draggable
            if (s.params.scrollbar && s.scrollbar) {
                if (s.params.scrollbarDraggable) {
                    s.scrollbar.disableDraggable();
                }
            }
            // Destroy loop
            if (s.params.loop) {
                s.destroyLoop();
            }
            // Cleanup styles
            if (cleanupStyles) {
                s.cleanupStyles();
            }
            // Disconnect observer
            s.disconnectObservers();
            // Disable keyboard/mousewheel
            if (s.params.keyboardControl) {
                if (s.disableKeyboardControl) s.disableKeyboardControl();
            }
            if (s.params.mousewheelControl) {
                if (s.disableMousewheelControl) s.disableMousewheelControl();
            }
            // Disable a11y
            if (s.params.a11y && s.a11y) s.a11y.destroy();
            // Destroy callback
            s.emit('onDestroy');
            // Delete instance
            if (deleteInstance !== false) s = null;
        };
        
        s.init();
        

    
        // Return swiper instance
        return s;
    };
    

    /*==================================================
        Prototype
    ====================================================*/
    Swiper.prototype = {
        isSafari: (function () {
            var ua = navigator.userAgent.toLowerCase();
            return (ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0);
        })(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function (arr) {
            return Object.prototype.toString.apply(arr) === '[object Array]';
        },
        /*==================================================
        Browser
        ====================================================*/
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1) || (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1)
        },
        /*==================================================
        Devices
        ====================================================*/
        device: (function () {
            var ua = navigator.userAgent;
            var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
            var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
            var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
            var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        })(),
        /*==================================================
        Feature Detection
        ====================================================*/
        support: {
            touch : (window.Modernizr && Modernizr.touch === true) || (function () {
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),
    
            transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),
    
            flexbox: (function () {
                var div = document.createElement('div').style;
                var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
                for (var i = 0; i < styles.length; i++) {
                    if (styles[i] in div) return true;
                }
            })(),
    
            observer: (function () {
                return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
            })()
        },
        /*==================================================
        Plugins
        ====================================================*/
        plugins: {}
    };
    

    /*===========================
     Get Dom libraries
     ===========================*/
    var swiperDomPlugins = ['jQuery', 'Zepto', 'Dom7'];
    for (var i = 0; i < swiperDomPlugins.length; i++) {
    	if (window[swiperDomPlugins[i]]) {
    		addLibraryPlugin(window[swiperDomPlugins[i]]);
    	}
    }
    // Required DOM Plugins
    var domLib;
    if (typeof Dom7 === 'undefined') {
    	domLib = window.Dom7 || window.Zepto || window.jQuery;
    }
    else {
    	domLib = Dom7;
    }

    /*===========================
    Add .swiper plugin from Dom libraries
    ===========================*/
    function addLibraryPlugin(lib) {
        lib.fn.swiper = function (params) {
            var firstInstance;
            lib(this).each(function () {
                var s = new Swiper(this, params);
                if (!firstInstance) firstInstance = s;
            });
            return firstInstance;
        };
    }
    
    if (domLib) {
        if (!('transitionEnd' in domLib.fn)) {
            domLib.fn.transitionEnd = function (callback) {
                var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
                    i, j, dom = this;
                function fireCallBack(e) {
                    /*jshint validthis:true */
                    if (e.target !== this) return;
                    callback.call(this, e);
                    for (i = 0; i < events.length; i++) {
                        dom.off(events[i], fireCallBack);
                    }
                }
                if (callback) {
                    for (i = 0; i < events.length; i++) {
                        dom.on(events[i], fireCallBack);
                    }
                }
                return this;
            };
        }
        if (!('transform' in domLib.fn)) {
            domLib.fn.transform = function (transform) {
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
                }
                return this;
            };
        }
        if (!('transition' in domLib.fn)) {
            domLib.fn.transition = function (duration) {
                if (typeof duration !== 'string') {
                    duration = duration + 'ms';
                }
                for (var i = 0; i < this.length; i++) {
                    var elStyle = this[i].style;
                    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
                }
                return this;
            };
        }
    }

    window.Swiper = Swiper;
})();
/*===========================
Swiper AMD Export
===========================*/
if (typeof(module) !== 'undefined')
{
    module.exports = window.Swiper;
}
else if (typeof define === 'function' && define.amd) {
    define([], function () {
        'use strict';
        return window.Swiper;
    });
}
//# sourceMappingURL=maps/swiper.jquery.js.map

// Generated by CoffeeScript 1.9.2

/**
@license Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
 */

(function () {
	var $, win;

	$ = this.jQuery || window.jQuery;

	win = $(window);

	$.fn.stick_in_parent = function (opts) {
		var doc, elm, enable_bottoming, fn, i, inner_scrolling, len, manual_spacer, offset_top, parent_selector, recalc_every, sticky_class;
		if (opts == null) {
			opts = {};
		}
		sticky_class = opts.sticky_class, inner_scrolling = opts.inner_scrolling, recalc_every = opts.recalc_every, parent_selector = opts.parent, offset_top = opts.offset_top, manual_spacer = opts.spacer, enable_bottoming = opts.bottoming;
		if (offset_top == null) {
			offset_top = 0;
		}
		if (parent_selector == null) {
			parent_selector = void 0;
		}
		if (inner_scrolling == null) {
			inner_scrolling = true;
		}
		if (sticky_class == null) {
			sticky_class = "is_stuck";
		}
		doc = $(document);
		if (enable_bottoming == null) {
			enable_bottoming = true;
		}
		fn = function (elm, padding_bottom, parent_top, parent_height, top, height, el_float, detached) {
			var bottomed, detach, fixed, last_pos, last_scroll_height, offset, parent, recalc, recalc_and_tick, recalc_counter, spacer, tick;
			if (elm.data("sticky_kit")) {
				return;
			}
			elm.data("sticky_kit", true);
			last_scroll_height = doc.height();
			parent = elm.parent();
			if (parent_selector != null) {
				parent = parent.closest(parent_selector);
			}
			if (!parent.length) {
				throw "failed to find stick parent";
			}
			fixed = false;
			bottomed = false;
			spacer = manual_spacer != null ? manual_spacer && elm.closest(manual_spacer) : $("<div />");
			if (spacer) {
				spacer.css('position', elm.css('position'));
			}
			recalc = function () {
				var border_top, padding_top, restore;
				if (detached) {
					return;
				}
				last_scroll_height = doc.height();
				border_top = parseInt(parent.css("border-top-width"), 10);
				padding_top = parseInt(parent.css("padding-top"), 10);
				padding_bottom = parseInt(parent.css("padding-bottom"), 10);
				parent_top = parent.offset().top + border_top + padding_top;
				parent_height = parent.height();
				if (fixed) {
					fixed = false;
					bottomed = false;
					if (manual_spacer == null) {
						elm.insertAfter(spacer);
						spacer.detach();
					}
					elm.css({
						position: "",
						top: "",
						width: "",
						bottom: ""
					}).removeClass(sticky_class);
					restore = true;
				}
				top = elm.offset().top - (parseInt(elm.css("margin-top"), 10) || 0) - offset_top;
				height = elm.outerHeight(true);
				el_float = elm.css("float");
				if (spacer) {
					spacer.css({
						width: elm.outerWidth(true),
						height: height,
						display: elm.css("display"),
						"vertical-align": elm.css("vertical-align"),
						"float": el_float
					});
				}
				if (restore) {
					return tick();
				}
			};
			recalc();
			if (height === parent_height) {
				return;
			}
			last_pos = void 0;
			offset = offset_top;
			recalc_counter = recalc_every;
			tick = function () {
				var css, delta, recalced, scroll, will_bottom, win_height;
				if (detached) {
					return;
				}
				recalced = false;
				if (recalc_counter != null) {
					recalc_counter -= 1;
					if (recalc_counter <= 0) {
						recalc_counter = recalc_every;
						recalc();
						recalced = true;
					}
				}
				if (!recalced && doc.height() !== last_scroll_height) {
					recalc();
					recalced = true;
				}
				scroll = win.scrollTop();
				if (last_pos != null) {
					delta = scroll - last_pos;
				}
				last_pos = scroll;
				if (fixed) {
					if (enable_bottoming) {
						will_bottom = scroll + height + offset > parent_height + parent_top;
						if (bottomed && !will_bottom) {
							bottomed = false;
							elm.css({
								position: "fixed",
								bottom: "",
								top: offset
							}).trigger("sticky_kit:unbottom");
						}
					}
					if (scroll < top) {
						fixed = false;
						offset = offset_top;
						if (manual_spacer == null) {
							if (el_float === "left" || el_float === "right") {
								elm.insertAfter(spacer);
							}
							spacer.detach();
						}
						css = {
							position: "",
							width: "",
							top: ""
						};
						elm.css(css).removeClass(sticky_class).trigger("sticky_kit:unstick");
					}
					if (inner_scrolling) {
						win_height = win.height();
						if (height + offset_top > win_height) {
							if (!bottomed) {
								offset -= delta;
								offset = Math.max(win_height - height, offset);
								offset = Math.min(offset_top, offset);
								if (fixed) {
									elm.css({
										top: offset + "px"
									});
								}
							}
						}
					}
				} else {
					if (scroll > top) {
						fixed = true;
						css = {
							position: "fixed",
							top: offset
						};
						css.width = elm.css("box-sizing") === "border-box" ? elm.outerWidth() + "px" : elm.width() + "px";
						elm.css(css).addClass(sticky_class);
						if (manual_spacer == null) {
							elm.after(spacer);
							if (el_float === "left" || el_float === "right") {
								spacer.append(elm);
							}
						}
						elm.trigger("sticky_kit:stick");
					}
				}
				if (fixed && enable_bottoming) {
					if (will_bottom == null) {
						will_bottom = scroll + height + offset > parent_height + parent_top;
					}
					if (!bottomed && will_bottom) {
						bottomed = true;
						if (parent.css("position") === "static") {
							parent.css({
								position: "relative"
							});
						}
						return elm.css({
							position: "absolute",
							bottom: padding_bottom,
							top: "auto"
						}).trigger("sticky_kit:bottom");
					}
				}
			};
			recalc_and_tick = function () {
				recalc();
				return tick();
			};
			detach = function () {
				detached = true;
				win.off("touchmove", tick);
				win.off("scroll", tick);
				win.off("resize", tick);
				$(document.body).off("sticky_kit:recalc", recalc_and_tick);
				elm.off("sticky_kit:detach", detach);
				elm.removeData("sticky_kit");
				elm.css({
					position: "",
					bottom: "",
					top: "",
					width: ""
				});
				parent.position("position", "");
				if (fixed) {
					if (manual_spacer == null) {
						if (el_float === "left" || el_float === "right") {
							elm.insertAfter(spacer);
						}
						spacer.remove();
					}
					return elm.removeClass(sticky_class);
				}
			};
			win.on("touchmove", tick);
			win.on("scroll", tick);
			win.on("resize", tick);
			$(document.body).on("sticky_kit:recalc", recalc_and_tick);
			elm.on("sticky_kit:detach", detach);
			return setTimeout(tick, 0);
		};
		for (i = 0, len = this.length; i < len; i++) {
			elm = this[i];
			fn($(elm));
		}
		return this;
	};

}).call(this);
// Global configuration for Parsley Configuration
var ParsleyConfig = {
	errorClass: 'error',
	successClass: 'success',
	errorsWrapper: '<div class="error-msg"></div>',
	errorTemplate: '<div></div>',
	excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden',
	validationThreshold: 0, // validationThreshold works with key events, setting number of characters must be entered before validation starts. Default is 3. Setting to 0 here to validate immediately on first character.
	classHandler: function (parsleyField) {
		var $field = parsleyField.$element;
		var $wrap = $field.closest('.validation-wrap');
		var $handler = $field.add($wrap);

		if ($field.is('textarea[maxlength]')) {
			$field.off('keyup');
			$field.on('keyup', function () {
				characterCountdown($vf(this));
			});
		}
		
		ParsleyConfig.a11y($field);

		return parsleyField;
	},
	errorsContainer: function (parsleyField) {
		var $msgContainer;
		var $wrap;
		// IF error on a field inside a .field-group, then generate
		// a div to hold the error message just after .field-group.
		if (parsleyField.$element.parent().is('.field-group')) {
			$wrap = parsleyField.$element.parent();
			$wrap.after('<div />');
			$msgContainer = $wrap.next();
		} 
		// ELSE look for a standard .error-msg-wrap location
		else {
			$wrap = parsleyField.$element.closest('.validation-wrap');

			if ($wrap.prev().is('.error-msg-wrap')) {
				$msgContainer = $wrap.prev('.error-msg-wrap');
			} else if ($wrap.find('.error-msg-wrap').length > 0) {
				$msgContainer = $wrap.find('.error-msg-wrap');
			} else if ($wrap.nextAll('.error-msg-wrap').length > 0) {
				$msgContainer = $wrap.nextAll('.error-msg-wrap').last();
			} else {
				$msgContainer = $wrap.next().find('.error-msg-wrap');
			}
		}
		return $msgContainer;

	},
	validators: {
		// basic credit card validation. Uses Luhn sum.
		creditcard: {
			fn: function (value) {
				value = value.replace(/[ -]/g, '');
				var digit, n, sum, _j, _len1, _ref2;
				sum = 0;
				_ref2 = value.split('').reverse();
				for (n = _j = 0, _len1 = _ref2.length; _j < _len1; n = ++_j) {
					digit = _ref2[n];
					digit = +digit;
					if (n % 2) {
						digit *= 2;
						if (digit < 10) {
							sum += digit;
						} else {
							sum += digit - 9;
						}
					} else {
						sum += digit;
					}
				}
				return sum % 10 === 0;
			},
			priority: 32
		}
	}, 
	a11y: function($field) {
		var parsleyId = $field.attr('data-parsley-id');
		//
		// Acessibility attributes and aria-invalid states
		//

		// IF Multiple (many inputs treated as one for validation)
		if ($field.is('[data-parsley-multiple]')) {
			var multipleId = 'parsley-id-multiple-' + $field.attr('data-parsley-multiple');
			// IF checkbox/radio, assign attributes to the visible label that doubles as the checkbox/radio
			if ($field.is('[type=checkbox], [type=radio]')) {
				$field.next('label').attr({
					'aria-describedby': multipleId,
					'aria-invalid': $field.is('.error') ? true : false // updates the radio buttons/checkboxes in a group so that they uniformly invalid or valid
				});
			} 
			// ELSE, not a checkbox/radio
			else {
				$field.attr('aria-describedby',multipleId);
			}
		} 
		// ELSE not multiple
		else {
			// IF checkbox/radio, assign attributes to the visible label that doubles as the checkbox/radio
			if ($field.is('[type=checkbox], [type=radio]')) {
				$field.next('label').attr('aria-describedby', 'parsley-id-' + parsleyId);
			} 
			// ELSE, not a checkbox/radio
			else {
				$field.attr('aria-describedby', 'parsley-id-' + parsleyId);
			}
		} // END IF multiple, ELSE


		// IF ERROR for non-multiple elements
		if ($field.is('.error')) {
			// IF checkbox/radio
			if ($field.is('[type=checkbox], [type=radio]')) {
				$field.next('label').attr({
					'aria-invalid': true
				});
			}
			// ELSE, not checkbox/radio
			else {
				$field.attr({
					'aria-invalid': true
				});
			}
		} 
		// ELSE, not an error
		else {
			// IF checkbox/radio
			if ($field.is('[type=checkbox], [type=radio]')) {
				$field.next('label').attr({
					'aria-invalid': false
				});
			}
			// ELSE, not checkbox/radio
			else {
				$field.attr({
					'aria-invalid': false
				});
			}
		} // End IF error for non-multiple elements, ELSE

		// IF the field is part of group, see if group's aria-describedby field has .filled class,
		// which means that the multiple group has an error.  If error, make aria-invalid equal true.
		if ($field.is('[data-parsley-multiple]')) {
			// get the descBy text from field's aria-describedby or from radio/checkbox's label aria-describedby
			var descBy = $field.attr('aria-describedby') ? $field.attr('aria-describedby') : $field.next('label').attr('aria-describedby');
			// IF error.  Class of .filled means is an error.
			if ($vf('#' + descBy).is('.filled')) {
				if ($field.is('[type=checkbox], [type=radio]')) {
					$field.next('label').attr('aria-invalid', true);
				} else {
					$field.attr('aria-invalid', true);
				}
			// ELSE IF no error
			} else {
				if ($field.is('[type=checkbox], [type=radio]')) {
					$field.next('label').attr('aria-invalid', false);
				} else {
					$field.attr('aria-invalid', false);
				}
			}
		}
	}
};


$vf(function () {
	// check forms for data-parsley-validate attribute. If exists, then extend the config
	// with the trigger:'change' option.
	$vf('[data-form]').each(function () {
		var $form = $vf(this);
		if ($form.is('[data-parsley-validate]')) {
			ParsleyConfig = $vf.extend(ParsleyConfig || {}, {
				trigger: 'change'
			});
		}
		$form.parsley();
	});

	// Validation listener for ajdusting height of certain other components/widgets
	$vf.listen('parsley:form:validated', $vf('[data-modal]'), function () {
		if (typeof modalHeightSetter == 'function') { modalHeightSetter(); }
	});

	// Validation listener for add/removal of .error class from .field-icon's
	$vf.listen('parsley:field:validated', $vf('[data-field-icon]'), function() {
		var $fieldIcons = $vf(this);
		$fieldIcons.each(function() {
			var $this = $vf(this);
			if($this.is('.error')) {
				$this.prev('.field-icon').addClass('error');
			} else if(! $this.is('.error')) {
				$this.prev('.field-icon').removeClass('error');
			}
		});
	});

	// Validation listener for add/removal of Accessibility attributes based on error or not
	$vf.listen('parsley:field:validated', $vf('input[required], textarea[required], select[required]'), function() {
		var $this = $vf(this);
		$this.each(function() {
			var $field = $vf(this);
			ParsleyConfig.a11y($field);
		});
	});

	$vf('input[required], textarea[required], select[required]').each(function() {
		var $this = $vf(this);
		$this.each(function() {
			var $field = $vf(this);
			ParsleyConfig.a11y($field);
		});
	});

});

$vf(document).off('click keypress', '[data-validate-form]');
$vf(document).on('click keypress', '[data-validate-form]', function (e) {
	if(keyClick(e) === true){
		// ParsleyConfig definition if not already set
		ParsleyConfig = ParsleyConfig || {};
		ParsleyConfig.i18n = ParsleyConfig.i18n || {};

		// Define Custom the messages
		ParsleyConfig.i18n.en = $vf.extend(ParsleyConfig.i18n.en || {}, {
			defaultMessage: "This field seems to be invalid",
			type: {
				email: "This field should be a valid email",
				url: "This field should be a valid URL",
				number: "This field should be a valid number",
				integer: "This field should be a valid integer",
				digits: "This field should be digits",
				alphanum: "This field should be alphanumeric"
			},
			notblank: "This field should not be blank",
			required: "This is a required field",
			pattern: "This field seems to be invalid",
			min: "Value must be greater than or equal to %s",
			max: "Value must be lower than or equal to %s",
			range: "Value must be between %s and %s",
			minlength: "This field requires %s characters or more",
			maxlength: "This field requires %s characters or less",
			length: "This field length is invalid. It should be between %s and %s characters long",
			mincheck: "You must select at least %s choices",
			maxcheck: "You must select %s choices or less",
			check: "You must select between %s and %s choices",
			equalto: "Must equal previous field's value"
		});

		$form = $vf(this).closest('[data-form]');
		$form.parsley().validate();

		// Add/remove error class to .validation-wrap on submit and 
		// on Parsley error/success events.
		// initial validate
		$vf('.validation-wrap', $form).each(function () {
			validationWrapErrors($vf(this));
		});
		// event listeners
		$vf.listen('parsley:field:validated', $form, function () {
			$vf('.validation-wrap', $form).each(function () {
				validationWrapErrors($vf(this));
			});
		});




		// add any .error-msg-wrap[data-error-classes] to the child .error-msg elements
		$vf('.error-msg-wrap[data-error-classes]', $form).each(function () {
			var $msgWrap = $vf(this);
			var classes = $msgWrap.attr('data-error-classes');
			$vf('.error-msg', $msgWrap).addClass(classes);
		});


		function validationWrapErrors($wrap) {
			// Move the parsley generated error message to be after .validation-wrap, 
			// unless it's inside an .error-msg-wrap
			if(!$vf('.error-msg-wrap', $wrap).find('.error-msg').length) {
				var $errorMsg = $vf('.error-msg', $wrap);
				$wrap.after($errorMsg);
			}

			// setTimeout helps make sure DOM classes are added/removed before running
			setTimeout(function () {
				var $errors = $wrap.find('.error');
				var $success = $wrap.find('.success');

				if ($errors.length > 0) {
					$wrap.addClass('error');
				} else {
					$wrap.removeClass('error');
				}
			}, 10);
		}

		// If validation passes do the normal anchor or input type="submit" action
		if (!$form.parsley().isValid()) {
			e.preventDefault();
		}
	}
});



// `window.ParsleyExtend`, like `ParsleyAbstract`, is inherited by `ParsleyField` and `ParsleyForm`
// That way, we could add new methods or redefine some for these both classes. In particular case
// We are adding async validation methods that returns promises, bind them properly to triggered
// Events like onkeyup when field is invalid or on form submit. These validation methods adds an
// Extra `remote` validator which could not be simply added like other `ParsleyExtra` validators
// Because returns promises instead of booleans.
window.ParsleyExtend = window.ParsleyExtend || {};
window.ParsleyExtend = $vf.extend(window.ParsleyExtend, {
	asyncSupport: true,

	asyncValidators: $vf.extend({
		'default': {
			fn: function (xhr) {
				return 'resolved' === xhr.state();
			},
			url: false
		},
		reverse: {
			fn: function (xhr) {
				// If reverse option is set, a failing ajax request is considered successful
				return 'rejected' === xhr.state();
			},
			url: false
		}
	}, window.ParsleyExtend.asyncValidators),

	addAsyncValidator: function (name, fn, url, options) {
		this.asyncValidators[name.toLowerCase()] = {
			fn: fn,
			url: url || false,
			options: options || {}
		};

		return this;
	},

	asyncValidate: function () {
		if ('ParsleyForm' === this.__class__)
			return this._asyncValidateForm.apply(this, arguments);

		return this._asyncValidateField.apply(this, arguments);
	},

	asyncIsValid: function () {
		if ('ParsleyField' === this.__class__)
			return this._asyncIsValidField.apply(this, arguments);

		return this._asyncIsValidForm.apply(this, arguments);
	},

	onSubmitValidate: function (event) {
		var that = this;

		// This is a Parsley generated submit event, do not validate, do not prevent, simply exit and keep normal behavior
		if (true === event.parsley)
			return;

		// Clone the event object
		this.submitEvent = $vf.extend(true, {}, event);

		// Prevent form submit and immediately stop its event propagation
		if (event instanceof $vf.Event) {
			event.stopImmediatePropagation();
			event.preventDefault();
		}

		return this._asyncValidateForm(undefined, event)
		  .done(function () {
		  	// If user do not have prevented the event, re-submit form
		  	if (!that.submitEvent.isDefaultPrevented())
		  		that.$element.trigger($vf.extend($vf.Event('submit'), { parsley: true }));
		  });
	},

	eventValidate: function (event) {
		// For keyup, keypress, keydown.. events that could be a little bit obstrusive
		// do not validate if val length < min threshold on first validation. Once field have been validated once and info
		// about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
		if (new RegExp('key').test(event.type))
			if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold)
				return;

		this._ui.validatedOnce = true;
		this.asyncValidate();
	},

	// Returns Promise
	_asyncValidateForm: function (group, event) {
		var
		  that = this,
		  promises = [];

		this._refreshFields();

		$vf.emit('parsley:form:validate', this);

		for (var i = 0; i < this.fields.length; i++) {

			// do not validate a field if not the same as given validation group
			if (group && group !== this.fields[i].options.group)
				continue;

			promises.push(this.fields[i]._asyncValidateField());
		}

		return $vf.when.apply($vf, promises)
		  .always(function () {
		  	$vf.emit('parsley:form:validated', that);
		  });
	},

	_asyncIsValidForm: function (group, force) {
		var promises = [];
		this._refreshFields();

		for (var i = 0; i < this.fields.length; i++) {

			// do not validate a field if not the same as given validation group
			if (group && group !== this.fields[i].options.group)
				continue;

			promises.push(this.fields[i]._asyncIsValidField(force));
		}

		return $vf.when.apply($vf, promises);
	},

	_asyncValidateField: function (force) {
		var that = this;

		$vf.emit('parsley:field:validate', this);

		return this._asyncIsValidField(force)
		  .done(function () {
		  	$vf.emit('parsley:field:success', that);
		  })
		  .fail(function () {
		  	$vf.emit('parsley:field:error', that);
		  })
		  .always(function () {
		  	$vf.emit('parsley:field:validated', that);
		  });
	},

	_asyncIsValidField: function (force, value) {
		var
		  deferred = $vf.Deferred(),
		  remoteConstraintIndex;

		// If regular isValid (matching regular constraints) returns `false`, no need to go further
		// Directly reject promise, do not run remote validator and save server load
		if (false === this.isValid(force, value))
			deferred.rejectWith(this);

			// If regular constraints are valid, and there is a remote validator registered, run it
		else if ('undefined' !== typeof this.constraintsByName.remote)
			this._remote(deferred);

			// Otherwise all is good, resolve promise
		else
			deferred.resolveWith(this);

		// Return promise
		return deferred.promise();
	},

	_remote: function (deferred) {
		var
		  that = this,
		  data = {},
		  ajaxOptions,
		  csr,
		  validator = this.options.remoteValidator || (true === this.options.remoteReverse ? 'reverse' : 'default');

		validator = validator.toLowerCase();

		if ('undefined' === typeof this.asyncValidators[validator])
			throw new Error('Calling an undefined async validator: `' + validator + '`');

		// Fill data with current value
		data[this.$element.attr('name') || this.$element.attr('id')] = this.getValue();

		// Merge options passed in from the function with the ones in the attribute
		this.options.remoteOptions = $vf.extend(true, this.options.remoteOptions || {}, this.asyncValidators[validator].options);

		// All `$vf.ajax(options)` could be overridden or extended directly from DOM in `data-parsley-remote-options`
		ajaxOptions = $vf.extend(true, {}, {
			url: this.asyncValidators[validator].url || this.options.remote,
			data: data,
			type: 'GET'
		}, this.options.remoteOptions || {});

		// Generate store key based on ajax options
		csr = $vf.param(ajaxOptions);

		// Initialise querry cache
		if ('undefined' === typeof this._remoteCache)
			this._remoteCache = {};

		// Try to retrieve stored xhr
		if (!this._remoteCache[csr]) {
			// Prevent multi burst xhr queries
			if (this._xhr && 'pending' === this._xhr.state())
				this._xhr.abort();

			// Make ajax call
			this._xhr = $vf.ajax(ajaxOptions)

			// Store remote call result to avoid next calls with exact same parameters
			this._remoteCache[csr] = this._xhr;
		}

		this._remoteCache[csr]
		  .done(function (data, textStatus, xhr) {
		  	that._handleRemoteResult(validator, xhr, deferred);
		  })
		  .fail(function (xhr, status, message) {
		  	// If we aborted the query, do not handle nothing for this value
		  	if ('abort' === status)
		  		return;

		  	that._handleRemoteResult(validator, xhr, deferred);
		  });
	},

	_handleRemoteResult: function (validator, xhr, deferred) {
		// If true, simply resolve and exit
		if ('function' === typeof this.asyncValidators[validator].fn && this.asyncValidators[validator].fn.call(this, xhr)) {
			deferred.resolveWith(this);

			return;
		}

		// Else, create a proper remote validation Violation to trigger right UI
		this.validationResult = [
		  new window.ParsleyValidator.Validator.Violation(
			this.constraintsByName.remote,
			this.getValue(),
			null
		  )
		];

		deferred.rejectWith(this);
	}
});

// Remote validator is just an always true sync validator with lowest (-1) priority possible
// It will be overloaded in `validateThroughValidator()` that will do the heavy async work
// This 'hack' is needed not to mess up too much with error messages and stuff in `ParsleyUI`
window.ParsleyConfig = window.ParsleyConfig || {};
window.ParsleyConfig.validators = window.ParsleyConfig.validators || {};
window.ParsleyConfig.validators.remote = {
	fn: function () {
		return true;
	},
	priority: -1
};

/*!
* Parsleyjs
* Guillaume Potier - <guillaume@wisembly.com>
* Version 2.0.6 - built Tue Dec 02 2014 17:12:12
* MIT Licensed
*
*/
!(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module depending on jQuery.
		define(['jquery'], factory);
	} else {
		// No AMD. Register plugin with global jQuery object.
		factory(jQuery);
	}
}(function ($vf) {
	// small hack for requirejs if jquery is loaded through map and not path
	// see http://requirejs.org/docs/jquery.html
	if ('undefined' === typeof $vf && 'undefined' !== typeof window.jQuery)
		$vf = window.jQuery;
	var ParsleyUtils = {
		// Parsley DOM-API
		// returns object from dom attributes and values
		// if attr is given, returns bool if attr present in DOM or not
		attr: function ($element, namespace, checkAttr) {
			var
			  attribute,
			  obj = {},
			  msie = this.msieversion(),
			  regex = new RegExp('^' + namespace, 'i');
			if ('undefined' === typeof $element || 'undefined' === typeof $element[0])
				return {};
			for (var i in $element[0].attributes) {
				attribute = $element[0].attributes[i];
				if ('undefined' !== typeof attribute && null !== attribute && (!msie || msie >= 8 || attribute.specified) && regex.test(attribute.name)) {
					if ('undefined' !== typeof checkAttr && new RegExp(checkAttr + '$', 'i').test(attribute.name))
						return true;
					obj[this.camelize(attribute.name.replace(namespace, ''))] = this.deserializeValue(attribute.value);
				}
			}
			return 'undefined' === typeof checkAttr ? obj : false;
		},
		setAttr: function ($element, namespace, attr, value) {
			$element[0].setAttribute(this.dasherize(namespace + attr), String(value));
		},
		// Recursive object / array getter
		get: function (obj, path) {
			var
			  i = 0,
			  paths = (path || '').split('.');
			while (this.isObject(obj) || this.isArray(obj)) {
				obj = obj[paths[i++]];
				if (i === paths.length)
					return obj;
			}
			return undefined;
		},
		hash: function (length) {
			return String(Math.random()).substring(2, length ? length + 2 : 9);
		},
		/** Third party functions **/
		// Underscore isArray
		isArray: function (mixed) {
			return Object.prototype.toString.call(mixed) === '[object Array]';
		},
		// Underscore isObject
		isObject: function (mixed) {
			return mixed === Object(mixed);
		},
		// Zepto deserialize function
		deserializeValue: function (value) {
			var num;
			try {
				return value ?
				  value == "true" ||
				  (value == "false" ? false :
				  value == "null" ? null :
				  !isNaN(num = Number(value)) ? num :
				  /^[\[\{]/.test(value) ? $vf.parseJSON(value) :
				  value)
				  : value;
			} catch (e) { return value; }
		},
		// Zepto camelize function
		camelize: function (str) {
			return str.replace(/-+(.)?/g, function (match, chr) {
				return chr ? chr.toUpperCase() : '';
			});
		},
		// Zepto dasherize function
		dasherize: function (str) {
			return str.replace(/::/g, '/')
			  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			  .replace(/([a-z\d])([A-Z])/g, '$1_$2')
			  .replace(/_/g, '-')
			  .toLowerCase();
		},
		// http://support.microsoft.com/kb/167820
		// http://stackoverflow.com/questions/19999388/jquery-check-if-user-is-using-ie
		msieversion: function () {
			var
			  ua = window.navigator.userAgent,
			  msie = ua.indexOf('MSIE ');
			if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			return 0;
		}
	};
	// All these options could be overriden and specified directly in DOM using
	// `data-parsley-` default DOM-API
	// eg: `inputs` can be set in DOM using `data-parsley-inputs="input, textarea"`
	// eg: `data-parsley-stop-on-first-failing-constraint="false"`
	var ParsleyDefaults = {
		// ### General
		// Default data-namespace for DOM API
		namespace: 'data-parsley-',
		// Supported inputs by default
		inputs: 'input, textarea, select',
		// Excluded inputs by default
		excluded: 'input[type=button], input[type=submit], input[type=reset], input[type=hidden]',
		// Stop validating field on highest priority failing constraint
		priorityEnabled: true,
		// ### UI
		// Enable\Disable error messages
		uiEnabled: true,
		// Key events threshold before validation
		validationThreshold: 3,
		// Focused field on form validation error. 'fist'|'last'|'none'
		focus: 'first',
		// `$vf.Event()` that will trigger validation. eg: `keyup`, `change`..
		trigger: false,
		// Class that would be added on every failing validation Parsley field
		errorClass: 'parsley-error',
		// Same for success validation
		successClass: 'parsley-success',
		// Return the `$element` that will receive these above success or error classes
		// Could also be (and given directly from DOM) a valid selector like `'#div'`
		classHandler: function (ParsleyField) { },
		// Return the `$element` where errors will be appended
		// Could also be (and given directly from DOM) a valid selector like `'#div'`
		errorsContainer: function (ParsleyField) { },
		// ul elem that would receive errors' list
		errorsWrapper: '<ul class="parsley-errors-list"></ul>',
		// li elem that would receive error message
		errorTemplate: '<li></li>'
	};

	var ParsleyAbstract = function () { };
	ParsleyAbstract.prototype = {
		asyncSupport: false,
		actualizeOptions: function () {
			this.options = this.OptionsFactory.get(this);
			return this;
		},
		// ParsleyValidator validate proxy function . Could be replaced by third party scripts
		validateThroughValidator: function (value, constraints, priority) {
			return window.ParsleyValidator.validate.apply(window.ParsleyValidator, [value, constraints, priority]);
		},
		// Subscribe an event and a handler for a specific field or a specific form
		// If on a ParsleyForm instance, it will be attached to form instance and also
		// To every field instance for this form
		subscribe: function (name, fn) {
			$vf.listenTo(this, name.toLowerCase(), fn);
			return this;
		},
		// Same as subscribe above. Unsubscribe an event for field, or form + its fields
		unsubscribe: function (name) {
			$vf.unsubscribeTo(this, name.toLowerCase());
			return this;
		},
		// Reset UI
		reset: function () {
			// Field case: just emit a reset event for UI
			if ('ParsleyForm' !== this.__class__)
				return $vf.emit('parsley:field:reset', this);
			// Form case: emit a reset event for each field
			for (var i = 0; i < this.fields.length; i++)
				$vf.emit('parsley:field:reset', this.fields[i]);
			$vf.emit('parsley:form:reset', this);
		},
		// Destroy Parsley instance (+ UI)
		destroy: function () {
			// Field case: emit destroy event to clean UI and then destroy stored instance
			if ('ParsleyForm' !== this.__class__) {
				this.$element.removeData('Parsley');
				this.$element.removeData('ParsleyFieldMultiple');
				$vf.emit('parsley:field:destroy', this);
				return;
			}
			// Form case: destroy all its fields and then destroy stored instance
			for (var i = 0; i < this.fields.length; i++)
				this.fields[i].destroy();
			this.$element.removeData('Parsley');
			$vf.emit('parsley:form:destroy', this);
		}
	};
	/*!
	* validator.js
	* Guillaume Potier - <guillaume@wisembly.com>
	* Version 1.0.0 - built Sun Aug 03 2014 17:42:31
	* MIT Licensed
	*
	*/
	var Validator = (function () {
		var exports = {};
		/**
		* Validator
		*/
		var Validator = function (options) {
			this.__class__ = 'Validator';
			this.__version__ = '1.0.0';
			this.options = options || {};
			this.bindingKey = this.options.bindingKey || '_validatorjsConstraint';
		};
		Validator.prototype = {
			constructor: Validator,
			/*
			* Validate string: validate( string, Assert, string ) || validate( string, [ Assert, Assert ], [ string, string ] )
			* Validate object: validate( object, Constraint, string ) || validate( object, Constraint, [ string, string ] )
			* Validate binded object: validate( object, string ) || validate( object, [ string, string ] )
			*/
			validate: function (objectOrString, AssertsOrConstraintOrGroup, group) {
				if ('string' !== typeof objectOrString && 'object' !== typeof objectOrString)
					throw new Error('You must validate an object or a string');
				// string / array validation
				if ('string' === typeof objectOrString || _isArray(objectOrString))
					return this._validateString(objectOrString, AssertsOrConstraintOrGroup, group);
				// binded object validation
				if (this.isBinded(objectOrString))
					return this._validateBindedObject(objectOrString, AssertsOrConstraintOrGroup);
				// regular object validation
				return this._validateObject(objectOrString, AssertsOrConstraintOrGroup, group);
			},
			bind: function (object, constraint) {
				if ('object' !== typeof object)
					throw new Error('Must bind a Constraint to an object');
				object[this.bindingKey] = new Constraint(constraint);
				return this;
			},
			unbind: function (object) {
				if ('undefined' === typeof object._validatorjsConstraint)
					return this;
				delete object[this.bindingKey];
				return this;
			},
			isBinded: function (object) {
				return 'undefined' !== typeof object[this.bindingKey];
			},
			getBinded: function (object) {
				return this.isBinded(object) ? object[this.bindingKey] : null;
			},
			_validateString: function (string, assert, group) {
				var result, failures = [];
				if (!_isArray(assert))
					assert = [assert];
				for (var i = 0; i < assert.length; i++) {
					if (!(assert[i] instanceof Assert))
						throw new Error('You must give an Assert or an Asserts array to validate a string');
					result = assert[i].check(string, group);
					if (result instanceof Violation)
						failures.push(result);
				}
				return failures.length ? failures : true;
			},
			_validateObject: function (object, constraint, group) {
				if ('object' !== typeof constraint)
					throw new Error('You must give a constraint to validate an object');
				if (constraint instanceof Constraint)
					return constraint.check(object, group);
				return new Constraint(constraint).check(object, group);
			},
			_validateBindedObject: function (object, group) {
				return object[this.bindingKey].check(object, group);
			}
		};
		Validator.errorCode = {
			must_be_a_string: 'must_be_a_string',
			must_be_an_array: 'must_be_an_array',
			must_be_a_number: 'must_be_a_number',
			must_be_a_string_or_array: 'must_be_a_string_or_array'
		};
		/**
		* Constraint
		*/
		var Constraint = function (data, options) {
			this.__class__ = 'Constraint';
			this.options = options || {};
			this.nodes = {};
			if (data) {
				try {
					this._bootstrap(data);
				} catch (err) {
					throw new Error('Should give a valid mapping object to Constraint', err, data);
				}
			}
		};
		Constraint.prototype = {
			constructor: Constraint,
			check: function (object, group) {
				var result, failures = {};
				// check all constraint nodes.
				for (var property in this.nodes) {
					var isRequired = false;
					var constraint = this.get(property);
					var constraints = _isArray(constraint) ? constraint : [constraint];
					for (var i = constraints.length - 1; i >= 0; i--) {
						if ('Required' === constraints[i].__class__) {
							isRequired = constraints[i].requiresValidation(group);
							continue;
						}
					}
					if (!this.has(property, object) && !this.options.strict && !isRequired) {
						continue;
					}
					try {
						if (!this.has(property, this.options.strict || isRequired ? object : undefined)) {
							// we trigger here a HaveProperty Assert violation to have uniform Violation object in the end
							new Assert().HaveProperty(property).validate(object);
						}
						result = this._check(property, object[property], group);
						// check returned an array of Violations or an object mapping Violations
						if ((_isArray(result) && result.length > 0) || (!_isArray(result) && !_isEmptyObject(result))) {
							failures[property] = result;
						}
					} catch (violation) {
						failures[property] = violation;
					}
				}
				return _isEmptyObject(failures) ? true : failures;
			},
			add: function (node, object) {
				if (object instanceof Assert || (_isArray(object) && object[0] instanceof Assert)) {
					this.nodes[node] = object;
					return this;
				}
				if ('object' === typeof object && !_isArray(object)) {
					this.nodes[node] = object instanceof Constraint ? object : new Constraint(object);
					return this;
				}
				throw new Error('Should give an Assert, an Asserts array, a Constraint', object);
			},
			has: function (node, nodes) {
				nodes = 'undefined' !== typeof nodes ? nodes : this.nodes;
				return 'undefined' !== typeof nodes[node];
			},
			get: function (node, placeholder) {
				return this.has(node) ? this.nodes[node] : placeholder || null;
			},
			remove: function (node) {
				var _nodes = [];
				for (var i in this.nodes)
					if (i !== node)
						_nodes[i] = this.nodes[i];
				this.nodes = _nodes;
				return this;
			},
			_bootstrap: function (data) {
				if (data instanceof Constraint)
					return this.nodes = data.nodes;
				for (var node in data)
					this.add(node, data[node]);
			},
			_check: function (node, value, group) {
				// Assert
				if (this.nodes[node] instanceof Assert)
					return this._checkAsserts(value, [this.nodes[node]], group);
				// Asserts
				if (_isArray(this.nodes[node]))
					return this._checkAsserts(value, this.nodes[node], group);
				// Constraint -> check api
				if (this.nodes[node] instanceof Constraint)
					return this.nodes[node].check(value, group);
				throw new Error('Invalid node', this.nodes[node]);
			},
			_checkAsserts: function (value, asserts, group) {
				var result, failures = [];
				for (var i = 0; i < asserts.length; i++) {
					result = asserts[i].check(value, group);
					if ('undefined' !== typeof result && true !== result)
						failures.push(result);
					// Some asserts (Collection for example) could return an object
					// if ( result && ! ( result instanceof Violation ) )
					//   return result;
					//
					// // Vast assert majority return Violation
					// if ( result instanceof Violation )
					//   failures.push( result );
				}
				return failures;
			}
		};
		/**
		* Violation
		*/
		var Violation = function (assert, value, violation) {
			this.__class__ = 'Violation';
			if (!(assert instanceof Assert))
				throw new Error('Should give an assertion implementing the Assert interface');
			this.assert = assert;
			this.value = value;
			if ('undefined' !== typeof violation)
				this.violation = violation;
		};
		Violation.prototype = {
			show: function () {
				var show = {
					assert: this.assert.__class__,
					value: this.value
				};
				if (this.violation)
					show.violation = this.violation;
				return show;
			},
			__toString: function () {
				if ('undefined' !== typeof this.violation)
					this.violation = '", ' + this.getViolation().constraint + ' expected was ' + this.getViolation().expected;
				return this.assert.__class__ + ' assert failed for "' + this.value + this.violation || '';
			},
			getViolation: function () {
				var constraint, expected;
				for (constraint in this.violation)
					expected = this.violation[constraint];
				return { constraint: constraint, expected: expected };
			}
		};
		/**
		* Assert
		*/
		var Assert = function (group) {
			this.__class__ = 'Assert';
			this.__parentClass__ = this.__class__;
			this.groups = [];
			if ('undefined' !== typeof group)
				this.addGroup(group);
		};
		Assert.prototype = {
			construct: Assert,
			requiresValidation: function (group) {
				if (group && !this.hasGroup(group))
					return false;
				if (!group && this.hasGroups())
					return false;
				return true;
			},
			check: function (value, group) {
				if (!this.requiresValidation(group))
					return;
				try {
					return this.validate(value, group);
				} catch (violation) {
					return violation;
				}
			},
			hasGroup: function (group) {
				if (_isArray(group))
					return this.hasOneOf(group);
				// All Asserts respond to "Any" group
				if ('Any' === group)
					return true;
				// Asserts with no group also respond to "Default" group. Else return false
				if (!this.hasGroups())
					return 'Default' === group;
				return -1 !== this.groups.indexOf(group);
			},
			hasOneOf: function (groups) {
				for (var i = 0; i < groups.length; i++)
					if (this.hasGroup(groups[i]))
						return true;
				return false;
			},
			hasGroups: function () {
				return this.groups.length > 0;
			},
			addGroup: function (group) {
				if (_isArray(group))
					return this.addGroups(group);
				if (!this.hasGroup(group))
					this.groups.push(group);
				return this;
			},
			removeGroup: function (group) {
				var _groups = [];
				for (var i = 0; i < this.groups.length; i++)
					if (group !== this.groups[i])
						_groups.push(this.groups[i]);
				this.groups = _groups;
				return this;
			},
			addGroups: function (groups) {
				for (var i = 0; i < groups.length; i++)
					this.addGroup(groups[i]);
				return this;
			},
			/**
			* Asserts definitions
			*/
			HaveProperty: function (node) {
				this.__class__ = 'HaveProperty';
				this.node = node;
				this.validate = function (object) {
					if ('undefined' === typeof object[this.node])
						throw new Violation(this, object, { value: this.node });
					return true;
				};
				return this;
			},
			Blank: function () {
				this.__class__ = 'Blank';
				this.validate = function (value) {
					if ('string' !== typeof value)
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
					if ('' !== value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
						throw new Violation(this, value);
					return true;
				};
				return this;
			},
			Callback: function (fn) {
				this.__class__ = 'Callback';
				this.arguments = Array.prototype.slice.call(arguments);
				if (1 === this.arguments.length)
					this.arguments = [];
				else
					this.arguments.splice(0, 1);
				if ('function' !== typeof fn)
					throw new Error('Callback must be instanciated with a function');
				this.fn = fn;
				this.validate = function (value) {
					var result = this.fn.apply(this, [value].concat(this.arguments));
					if (true !== result)
						throw new Violation(this, value, { result: result });
					return true;
				};
				return this;
			},
			Choice: function (list) {
				this.__class__ = 'Choice';
				if (!_isArray(list) && 'function' !== typeof list)
					throw new Error('Choice must be instanciated with an array or a function');
				this.list = list;
				this.validate = function (value) {
					var list = 'function' === typeof this.list ? this.list() : this.list;
					for (var i = 0; i < list.length; i++)
						if (value === list[i])
							return true;
					throw new Violation(this, value, { choices: list });
				};
				return this;
			},
			Collection: function (assertOrConstraint) {
				this.__class__ = 'Collection';
				this.constraint = 'undefined' !== typeof assertOrConstraint ? (assertOrConstraint instanceof Assert ? assertOrConstraint : new Constraint(assertOrConstraint)) : false;
				this.validate = function (collection, group) {
					var result, validator = new Validator(), count = 0, failures = {}, groups = this.groups.length ? this.groups : group;
					if (!_isArray(collection))
						throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
					for (var i = 0; i < collection.length; i++) {
						result = this.constraint ?
						  validator.validate(collection[i], this.constraint, groups) :
						  validator.validate(collection[i], groups);
						if (!_isEmptyObject(result))
							failures[count] = result;
						count++;
					}
					return !_isEmptyObject(failures) ? failures : true;
				};
				return this;
			},
			Count: function (count) {
				this.__class__ = 'Count';
				this.count = count;
				this.validate = function (array) {
					if (!_isArray(array))
						throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
					var count = 'function' === typeof this.count ? this.count(array) : this.count;
					if (isNaN(Number(count)))
						throw new Error('Count must be a valid interger', count);
					if (count !== array.length)
						throw new Violation(this, array, { count: count });
					return true;
				};
				return this;
			},
			Email: function () {
				this.__class__ = 'Email';
				this.validate = function (value) {
					var regExp = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
					if ('string' !== typeof value)
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
					if (!regExp.test(value))
						throw new Violation(this, value);
					return true;
				};
				return this;
			},
			EqualTo: function (reference) {
				this.__class__ = 'EqualTo';
				if ('undefined' === typeof reference)
					throw new Error('EqualTo must be instanciated with a value or a function');
				this.reference = reference;
				this.validate = function (value) {
					var reference = 'function' === typeof this.reference ? this.reference(value) : this.reference;
					if (reference !== value)
						throw new Violation(this, value, { value: reference });
					return true;
				};
				return this;
			},
			GreaterThan: function (threshold) {
				this.__class__ = 'GreaterThan';
				if ('undefined' === typeof threshold)
					throw new Error('Should give a threshold value');
				this.threshold = threshold;
				this.validate = function (value) {
					if ('' === value || isNaN(Number(value)))
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
					if (this.threshold >= value)
						throw new Violation(this, value, { threshold: this.threshold });
					return true;
				};
				return this;
			},
			GreaterThanOrEqual: function (threshold) {
				this.__class__ = 'GreaterThanOrEqual';
				if ('undefined' === typeof threshold)
					throw new Error('Should give a threshold value');
				this.threshold = threshold;
				this.validate = function (value) {
					if ('' === value || isNaN(Number(value)))
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
					if (this.threshold > value)
						throw new Violation(this, value, { threshold: this.threshold });
					return true;
				};
				return this;
			},
			InstanceOf: function (classRef) {
				this.__class__ = 'InstanceOf';
				if ('undefined' === typeof classRef)
					throw new Error('InstanceOf must be instanciated with a value');
				this.classRef = classRef;
				this.validate = function (value) {
					if (true !== (value instanceof this.classRef))
						throw new Violation(this, value, { classRef: this.classRef });
					return true;
				};
				return this;
			},
			Length: function (boundaries) {
				this.__class__ = 'Length';
				if (!boundaries.min && !boundaries.max)
					throw new Error('Lenth assert must be instanciated with a { min: x, max: y } object');
				this.min = boundaries.min;
				this.max = boundaries.max;
				this.validate = function (value) {
					if ('string' !== typeof value && !_isArray(value))
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string_or_array });
					if ('undefined' !== typeof this.min && this.min === this.max && value.length !== this.min)
						throw new Violation(this, value, { min: this.min, max: this.max });
					if ('undefined' !== typeof this.max && value.length > this.max)
						throw new Violation(this, value, { max: this.max });
					if ('undefined' !== typeof this.min && value.length < this.min)
						throw new Violation(this, value, { min: this.min });
					return true;
				};
				return this;
			},
			LessThan: function (threshold) {
				this.__class__ = 'LessThan';
				if ('undefined' === typeof threshold)
					throw new Error('Should give a threshold value');
				this.threshold = threshold;
				this.validate = function (value) {
					if ('' === value || isNaN(Number(value)))
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
					if (this.threshold <= value)
						throw new Violation(this, value, { threshold: this.threshold });
					return true;
				};
				return this;
			},
			LessThanOrEqual: function (threshold) {
				this.__class__ = 'LessThanOrEqual';
				if ('undefined' === typeof threshold)
					throw new Error('Should give a threshold value');
				this.threshold = threshold;
				this.validate = function (value) {
					if ('' === value || isNaN(Number(value)))
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_number });
					if (this.threshold < value)
						throw new Violation(this, value, { threshold: this.threshold });
					return true;
				};
				return this;
			},
			NotNull: function () {
				this.__class__ = 'NotNull';
				this.validate = function (value) {
					if (null === value || 'undefined' === typeof value)
						throw new Violation(this, value);
					return true;
				};
				return this;
			},
			NotBlank: function () {
				this.__class__ = 'NotBlank';
				this.validate = function (value) {
					if ('string' !== typeof value)
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
					if ('' === value.replace(/^\s+/g, '').replace(/\s+$/g, ''))
						throw new Violation(this, value);
					return true;
				};
				return this;
			},
			Null: function () {
				this.__class__ = 'Null';
				this.validate = function (value) {
					if (null !== value)
						throw new Violation(this, value);
					return true;
				};
				return this;
			},
			Range: function (min, max) {
				this.__class__ = 'Range';
				if ('undefined' === typeof min || 'undefined' === typeof max)
					throw new Error('Range assert expects min and max values');
				this.min = min;
				this.max = max;
				this.validate = function (value) {
					try {
						// validate strings and objects with their Length
						if (('string' === typeof value && isNaN(Number(value))) || _isArray(value))
							new Assert().Length({ min: this.min, max: this.max }).validate(value);
							// validate numbers with their value
						else
							new Assert().GreaterThanOrEqual(this.min).validate(value) && new Assert().LessThanOrEqual(this.max).validate(value);
						return true;
					} catch (violation) {
						throw new Violation(this, value, violation.violation);
					}
					return true;
				};
				return this;
			},
			Regexp: function (regexp, flag) {
				this.__class__ = 'Regexp';
				if ('undefined' === typeof regexp)
					throw new Error('You must give a regexp');
				this.regexp = regexp;
				this.flag = flag || '';
				this.validate = function (value) {
					if ('string' !== typeof value)
						throw new Violation(this, value, { value: Validator.errorCode.must_be_a_string });
					if (!new RegExp(this.regexp, this.flag).test(value))
						throw new Violation(this, value, { regexp: this.regexp, flag: this.flag });
					return true;
				};
				return this;
			},
			Required: function () {
				this.__class__ = 'Required';
				this.validate = function (value) {
					if ('undefined' === typeof value)
						throw new Violation(this, value);
					try {
						if ('string' === typeof value)
							new Assert().NotNull().validate(value) && new Assert().NotBlank().validate(value);
						else if (true === _isArray(value))
							new Assert().Length({ min: 1 }).validate(value);
					} catch (violation) {
						throw new Violation(this, value);
					}
					return true;
				};
				return this;
			},
			// Unique() or Unique ( { key: foo } )
			Unique: function (object) {
				this.__class__ = 'Unique';
				if ('object' === typeof object)
					this.key = object.key;
				this.validate = function (array) {
					var value, store = [];
					if (!_isArray(array))
						throw new Violation(this, array, { value: Validator.errorCode.must_be_an_array });
					for (var i = 0; i < array.length; i++) {
						value = 'object' === typeof array[i] ? array[i][this.key] : array[i];
						if ('undefined' === typeof value)
							continue;
						if (-1 !== store.indexOf(value))
							throw new Violation(this, array, { value: value });
						store.push(value);
					}
					return true;
				};
				return this;
			}
		};
		// expose to the world these awesome classes
		exports.Assert = Assert;
		exports.Validator = Validator;
		exports.Violation = Violation;
		exports.Constraint = Constraint;
		/**
		* Some useful object prototypes / functions here
		*/
		// IE8<= compatibility
		// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf
		if (!Array.prototype.indexOf)
			Array.prototype.indexOf = function (searchElement /*, fromIndex */) {

				if (this === null) {
					throw new TypeError();
				}
				var t = Object(this);
				var len = t.length >>> 0;
				if (len === 0) {
					return -1;
				}
				var n = 0;
				if (arguments.length > 1) {
					n = Number(arguments[1]);
					if (n != n) { // shortcut for verifying if it's NaN
						n = 0;
					} else if (n !== 0 && n != Infinity && n != -Infinity) {
						n = (n > 0 || -1) * Math.floor(Math.abs(n));
					}
				}
				if (n >= len) {
					return -1;
				}
				var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
				for (; k < len; k++) {
					if (k in t && t[k] === searchElement) {
						return k;
					}
				}
				return -1;
			};
		// Test if object is empty, useful for Constraint violations check
		var _isEmptyObject = function (obj) {
			for (var property in obj)
				return false;
			return true;
		};
		var _isArray = function (obj) {
			return Object.prototype.toString.call(obj) === '[object Array]';
		};
		// AMD export
		if (typeof define === 'function' && define.amd) {
			define('vendors/validator.js/dist/validator', [], function () {
				return exports;
			});
			// commonjs export
		} else if (typeof module !== 'undefined' && module.exports) {
			module.exports = exports;
			// browser
		} else {
			window['undefined' !== typeof validatorjs_ns ? validatorjs_ns : 'Validator'] = exports;
		}

		return exports;
	})();

	// This is needed for Browserify usage that requires Validator.js through module.exports
	Validator = 'undefined' !== typeof Validator ? Validator : ('undefined' !== typeof module ? module.exports : null);
	var ParsleyValidator = function (validators, catalog) {
		this.__class__ = 'ParsleyValidator';
		this.Validator = Validator;
		// Default Parsley locale is en
		this.locale = 'en';
		this.init(validators || {}, catalog || {});
	};
	ParsleyValidator.prototype = {
		init: function (validators, catalog) {
			this.catalog = catalog;
			for (var name in validators)
				this.addValidator(name, validators[name].fn, validators[name].priority, validators[name].requirementsTransformer);
			$vf.emit('parsley:validator:init');
		},
		// Set new messages locale if we have dictionary loaded in ParsleyConfig.i18n
		setLocale: function (locale) {
			if ('undefined' === typeof this.catalog[locale])
				throw new Error(locale + ' is not available in the catalog');
			this.locale = locale;
			return this;
		},
		// Add a new messages catalog for a given locale. Set locale for this catalog if set === `true`
		addCatalog: function (locale, messages, set) {
			if ('object' === typeof messages)
				this.catalog[locale] = messages;
			if (true === set)
				return this.setLocale(locale);
			return this;
		},
		// Add a specific message for a given constraint in a given locale
		addMessage: function (locale, name, message) {
			if ('undefined' === typeof this.catalog[locale])
				this.catalog[locale] = {};
			this.catalog[locale][name.toLowerCase()] = message;
			return this;
		},
		validate: function (value, constraints, priority) {
			return new this.Validator.Validator().validate.apply(new Validator.Validator(), arguments);
		},
		// Add a new validator
		addValidator: function (name, fn, priority, requirementsTransformer) {
			this.validators[name.toLowerCase()] = function (requirements) {
				return $vf.extend(new Validator.Assert().Callback(fn, requirements), {
					priority: priority,
					requirementsTransformer: requirementsTransformer
				});
			};
			return this;
		},
		updateValidator: function (name, fn, priority, requirementsTransformer) {
			return this.addValidator(name, fn, priority, requirementsTransformer);
		},
		removeValidator: function (name) {
			delete this.validators[name];
			return this;
		},
		getErrorMessage: function (constraint) {
			var message;
			// Type constraints are a bit different, we have to match their requirements too to find right error message
			if ('type' === constraint.name)
				message = this.catalog[this.locale][constraint.name][constraint.requirements];
			else
				message = this.formatMessage(this.catalog[this.locale][constraint.name], constraint.requirements);
			return '' !== message ? message : this.catalog[this.locale].defaultMessage;
		},
		// Kind of light `sprintf()` implementation
		formatMessage: function (string, parameters) {
			if ('object' === typeof parameters) {
				for (var i in parameters)
					string = this.formatMessage(string, parameters[i]);
				return string;
			}
			return 'string' === typeof string ? string.replace(new RegExp('%s', 'i'), parameters) : '';
		},
		// Here is the Parsley default validators list.
		// This is basically Validatorjs validators, with different API for some of them
		// and a Parsley priority set
		validators: {
			notblank: function () {
				return $vf.extend(new Validator.Assert().NotBlank(), { priority: 2 });
			},
			required: function () {
				return $vf.extend(new Validator.Assert().Required(), { priority: 512 });
			},
			type: function (type) {
				var assert;
				switch (type) {
					case 'email':
						assert = new Validator.Assert().Email();
						break;
						// range type just ensure we have a number here
					case 'range':
					case 'number':
						assert = new Validator.Assert().Regexp('^-?(?:\\d+|\\d{1,3}(?:,\\d{3})+)?(?:\\.\\d+)?$');
						break;
					case 'integer':
						assert = new Validator.Assert().Regexp('^-?\\d+$');
						break;
					case 'digits':
						assert = new Validator.Assert().Regexp('^\\d+$');
						break;
					case 'alphanum':
						assert = new Validator.Assert().Regexp('^\\w+$', 'i');
						break;
					case 'url':
						assert = new Validator.Assert().Regexp('(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)', 'i');
						break;
					default:
						throw new Error('validator type `' + type + '` is not supported');
				}
				return $vf.extend(assert, { priority: 256 });
			},
			pattern: function (regexp) {
				var flags = '';
				// Test if RegExp is literal, if not, nothing to be done, otherwise, we need to isolate flags and pattern
				if (!!(/^\/.*\/(?:[gimy]*)$/.test(regexp))) {
					// Replace the regexp literal string with the first match group: ([gimy]*)
					// If no flag is present, this will be a blank string
					flags = regexp.replace(/.*\/([gimy]*)$/, '$1');
					// Again, replace the regexp literal string with the first match group:
					// everything excluding the opening and closing slashes and the flags
					regexp = regexp.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
				}
				return $vf.extend(new Validator.Assert().Regexp(regexp, flags), { priority: 64 });
			},
			minlength: function (value) {
				return $vf.extend(new Validator.Assert().Length({ min: value }), {
					priority: 30,
					requirementsTransformer: function () {
						return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
					}
				});
			},
			maxlength: function (value) {
				return $vf.extend(new Validator.Assert().Length({ max: value }), {
					priority: 30,
					requirementsTransformer: function () {
						return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
					}
				});
			},
			length: function (array) {
				return $vf.extend(new Validator.Assert().Length({ min: array[0], max: array[1] }), { priority: 32 });
			},
			mincheck: function (length) {
				return this.minlength(length);
			},
			maxcheck: function (length) {
				return this.maxlength(length);
			},
			check: function (array) {
				return this.length(array);
			},
			min: function (value) {
				return $vf.extend(new Validator.Assert().GreaterThanOrEqual(value), {
					priority: 30,
					requirementsTransformer: function () {
						return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
					}
				});
			},
			max: function (value) {
				return $vf.extend(new Validator.Assert().LessThanOrEqual(value), {
					priority: 30,
					requirementsTransformer: function () {
						return 'string' === typeof value && !isNaN(value) ? parseInt(value, 10) : value;
					}
				});
			},
			range: function (array) {
				return $vf.extend(new Validator.Assert().Range(array[0], array[1]), {
					priority: 32,
					requirementsTransformer: function () {
						for (var i = 0; i < array.length; i++)
							array[i] = 'string' === typeof array[i] && !isNaN(array[i]) ? parseInt(array[i], 10) : array[i];
						return array;
					}
				});
			},
			equalto: function (value) {
				return $vf.extend(new Validator.Assert().EqualTo(value), {
					priority: 256,
					requirementsTransformer: function () {
						return $vf(value).length ? $vf(value).val() : value;
					}
				});
			}
		}
	};

	var ParsleyUI = function (options) {
		this.__class__ = 'ParsleyUI';
	};
	ParsleyUI.prototype = {
		listen: function () {
			$vf.listen('parsley:form:init', this, this.setupForm);
			$vf.listen('parsley:field:init', this, this.setupField);
			$vf.listen('parsley:field:validated', this, this.reflow);
			$vf.listen('parsley:form:validated', this, this.focus);
			$vf.listen('parsley:field:reset', this, this.reset);
			$vf.listen('parsley:form:destroy', this, this.destroy);
			$vf.listen('parsley:field:destroy', this, this.destroy);
			return this;
		},
		reflow: function (fieldInstance) {
			// If this field has not an active UI (case for multiples) don't bother doing something
			if ('undefined' === typeof fieldInstance._ui || false === fieldInstance._ui.active)
				return;
			// Diff between two validation results
			var diff = this._diff(fieldInstance.validationResult, fieldInstance._ui.lastValidationResult);
			// Then store current validation result for next reflow
			fieldInstance._ui.lastValidationResult = fieldInstance.validationResult;
			// Field have been validated at least once if here. Useful for binded key events..
			fieldInstance._ui.validatedOnce = true;
			// Handle valid / invalid / none field class
			this.manageStatusClass(fieldInstance);
			// Add, remove, updated errors messages
			this.manageErrorsMessages(fieldInstance, diff);
			// Triggers impl
			this.actualizeTriggers(fieldInstance);
			// If field is not valid for the first time, bind keyup trigger to ease UX and quickly inform user
			if ((diff.kept.length || diff.added.length) && 'undefined' === typeof fieldInstance._ui.failedOnce)
				this.manageFailingFieldTrigger(fieldInstance);
		},
		// Returns an array of field's error message(s)
		getErrorsMessages: function (fieldInstance) {
			// No error message, field is valid
			if (true === fieldInstance.validationResult)
				return [];
			var messages = [];
			for (var i = 0; i < fieldInstance.validationResult.length; i++)
				messages.push(this._getErrorMessage(fieldInstance, fieldInstance.validationResult[i].assert));
			return messages;
		},
		manageStatusClass: function (fieldInstance) {
			if (true === fieldInstance.validationResult)
				this._successClass(fieldInstance);
			else if (fieldInstance.validationResult.length > 0)
				this._errorClass(fieldInstance);
			else
				this._resetClass(fieldInstance);
		},
		manageErrorsMessages: function (fieldInstance, diff) {
			if ('undefined' !== typeof fieldInstance.options.errorsMessagesDisabled)
				return;
			// Case where we have errorMessage option that configure an unique field error message, regardless failing validators
			if ('undefined' !== typeof fieldInstance.options.errorMessage) {
				if ((diff.added.length || diff.kept.length)) {
					if (0 === fieldInstance._ui.$errorsWrapper.find('.parsley-custom-error-message').length)
						fieldInstance._ui.$errorsWrapper
						  .append($vf(fieldInstance.options.errorTemplate)
						  .addClass('parsley-custom-error-message'));
					return fieldInstance._ui.$errorsWrapper
					  .addClass('filled')
					  .find('.parsley-custom-error-message')
					  .html(fieldInstance.options.errorMessage);
				}
				return fieldInstance._ui.$errorsWrapper
				  .removeClass('filled')
				  .find('.parsley-custom-error-message')
				  .remove();
			}
			// Show, hide, update failing constraints messages
			for (var i = 0; i < diff.removed.length; i++)
				this.removeError(fieldInstance, diff.removed[i].assert.name, true);
			for (i = 0; i < diff.added.length; i++)
				this.addError(fieldInstance, diff.added[i].assert.name, undefined, diff.added[i].assert, true);
			for (i = 0; i < diff.kept.length; i++)
				this.updateError(fieldInstance, diff.kept[i].assert.name, undefined, diff.kept[i].assert, true);
		},
		// TODO: strange API here, intuitive for manual usage with addError(pslyInstance, 'foo', 'bar')
		// but a little bit complex for above internal usage, with forced undefined parametter..
		addError: function (fieldInstance, name, message, assert, doNotUpdateClass) {
			fieldInstance._ui.$errorsWrapper
			  .addClass('filled')
			  .append($vf(fieldInstance.options.errorTemplate)
			  .addClass('parsley-' + name)
			  .html(message || this._getErrorMessage(fieldInstance, assert)));
			if (true !== doNotUpdateClass)
				this._errorClass(fieldInstance);
		},
		// Same as above
		updateError: function (fieldInstance, name, message, assert, doNotUpdateClass) {
			fieldInstance._ui.$errorsWrapper
			  .addClass('filled')
			  .find('.parsley-' + name)
			  .html(message || this._getErrorMessage(fieldInstance, assert));
			if (true !== doNotUpdateClass)
				this._errorClass(fieldInstance);
		},
		// Same as above twice
		removeError: function (fieldInstance, name, doNotUpdateClass) {
			fieldInstance._ui.$errorsWrapper
			  .removeClass('filled')
			  .find('.parsley-' + name)
			  .remove();
			// edge case possible here: remove a standard Parsley error that is still failing in fieldInstance.validationResult
			// but highly improbable cuz' manually removing a well Parsley handled error makes no sense.
			if (true !== doNotUpdateClass)
				this.manageStatusClass(fieldInstance);
		},
		focus: function (formInstance) {
			if (true === formInstance.validationResult || 'none' === formInstance.options.focus)
				return formInstance._focusedField = null;
			formInstance._focusedField = null;
			for (var i = 0; i < formInstance.fields.length; i++)
				if (true !== formInstance.fields[i].validationResult && formInstance.fields[i].validationResult.length > 0 && 'undefined' === typeof formInstance.fields[i].options.noFocus) {
					if ('first' === formInstance.options.focus) {
						formInstance._focusedField = formInstance.fields[i].$element;
						return formInstance._focusedField.focus();
					}
					formInstance._focusedField = formInstance.fields[i].$element;
				}
			if (null === formInstance._focusedField)
				return null;
			return formInstance._focusedField.focus();
		},
		_getErrorMessage: function (fieldInstance, constraint) {
			var customConstraintErrorMessage = constraint.name + 'Message';
			if ('undefined' !== typeof fieldInstance.options[customConstraintErrorMessage])
				return window.ParsleyValidator.formatMessage(fieldInstance.options[customConstraintErrorMessage], constraint.requirements);
			return window.ParsleyValidator.getErrorMessage(constraint);
		},
		_diff: function (newResult, oldResult, deep) {
			var
			  added = [],
			  kept = [];
			for (var i = 0; i < newResult.length; i++) {
				var found = false;
				for (var j = 0; j < oldResult.length; j++)
					if (newResult[i].assert.name === oldResult[j].assert.name) {
						found = true;
						break;
					}
				if (found)
					kept.push(newResult[i]);
				else
					added.push(newResult[i]);
			}
			return {
				kept: kept,
				added: added,
				removed: !deep ? this._diff(oldResult, newResult, true).added : []
			};
		},
		setupForm: function (formInstance) {
			formInstance.$element.on('submit.Parsley', false, $vf.proxy(formInstance.onSubmitValidate, formInstance));
			// UI could be disabled
			if (false === formInstance.options.uiEnabled)
				return;
			formInstance.$element.attr('novalidate', '');
		},
		setupField: function (fieldInstance) {
			var _ui = { active: false };
			// UI could be disabled
			if (false === fieldInstance.options.uiEnabled)
				return;
			_ui.active = true;
			// Give field its Parsley id in DOM
			fieldInstance.$element.attr(fieldInstance.options.namespace + 'id', fieldInstance.__id__);
			/** Generate important UI elements and store them in fieldInstance **/
			// $errorClassHandler is the $element that woul have parsley-error and parsley-success classes
			_ui.$errorClassHandler = this._manageClassHandler(fieldInstance);
			// $errorsWrapper is a div that would contain the various field errors, it will be appended into $errorsContainer
			_ui.errorsWrapperId = 'parsley-id-' + ('undefined' !== typeof fieldInstance.options.multiple ? 'multiple-' + fieldInstance.options.multiple : fieldInstance.__id__);
			_ui.$errorsWrapper = $vf(fieldInstance.options.errorsWrapper).attr('id', _ui.errorsWrapperId);
			// ValidationResult UI storage to detect what have changed bwt two validations, and update DOM accordingly
			_ui.lastValidationResult = [];
			_ui.validatedOnce = false;
			_ui.validationInformationVisible = false;
			// Store it in fieldInstance for later
			fieldInstance._ui = _ui;
			// Stops excluded inputs from getting errorContainer added
			if (!fieldInstance.$element.is(fieldInstance.options.excluded)) {
				/** Mess with DOM now **/
				this._insertErrorWrapper(fieldInstance);
			}
			// Bind triggers first time
			this.actualizeTriggers(fieldInstance);
		},
		// Determine which element will have `parsley-error` and `parsley-success` classes
		_manageClassHandler: function (fieldInstance) {
			// An element selector could be passed through DOM with `data-parsley-class-handler=#foo`
			if ('string' === typeof fieldInstance.options.classHandler && $vf(fieldInstance.options.classHandler).length)
				return $vf(fieldInstance.options.classHandler);
			// Class handled could also be determined by function given in Parsley options
			var $handler = fieldInstance.options.classHandler(fieldInstance);
			// If this function returned a valid existing DOM element, go for it
			if ('undefined' !== typeof $handler && $handler.length)
				return $handler;
			// Otherwise, if simple element (input, texatrea, select..) it will perfectly host the classes
			if ('undefined' === typeof fieldInstance.options.multiple || fieldInstance.$element.is('select'))
				return fieldInstance.$element;
			// But if multiple element (radio, checkbox), that would be their parent
			return fieldInstance.$element.parent();
		},
		_insertErrorWrapper: function (fieldInstance) {
			var $errorsContainer;
			if ('string' === typeof fieldInstance.options.errorsContainer) {
				if ($vf(fieldInstance.options.errorsContainer).length)
					return $vf(fieldInstance.options.errorsContainer).append(fieldInstance._ui.$errorsWrapper);
				else if (window.console && window.console.warn)
					window.console.warn('The errors container `' + fieldInstance.options.errorsContainer + '` does not exist in DOM');
			}
			else if ('function' === typeof fieldInstance.options.errorsContainer)
				$errorsContainer = fieldInstance.options.errorsContainer(fieldInstance);
			if ('undefined' !== typeof $errorsContainer && $errorsContainer.length)
				return $errorsContainer.append(fieldInstance._ui.$errorsWrapper);
			return 'undefined' === typeof fieldInstance.options.multiple ? fieldInstance.$element.after(fieldInstance._ui.$errorsWrapper) : fieldInstance.$element.parent().after(fieldInstance._ui.$errorsWrapper);
		},
		actualizeTriggers: function (fieldInstance) {
			var that = this;
			// Remove Parsley events already binded on this field
			if (fieldInstance.options.multiple)
				$vf('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
					$vf(this).off('.Parsley');
				});
			else
				fieldInstance.$element.off('.Parsley');
			// If no trigger is set, all good
			if (false === fieldInstance.options.trigger)
				return;
			var triggers = fieldInstance.options.trigger.replace(/^\s+/g, '').replace(/\s+$/g, '');
			if ('' === triggers)
				return;
			// Bind fieldInstance.eventValidate if exists (for parsley.ajax for example), ParsleyUI.eventValidate otherwise
			if (fieldInstance.options.multiple)
				$vf('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
					$vf(this).on(
					  triggers.split(' ').join('.Parsley ') + '.Parsley',
					  false,
					  $vf.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : that.eventValidate, fieldInstance));
				});
			else
				fieldInstance.$element
				  .on(
					triggers.split(' ').join('.Parsley ') + '.Parsley',
					false,
					$vf.proxy('function' === typeof fieldInstance.eventValidate ? fieldInstance.eventValidate : this.eventValidate, fieldInstance));
		},
		// Called through $vf.proxy with fieldInstance. `this` context is ParsleyField
		eventValidate: function (event) {
			// For keyup, keypress, keydown.. events that could be a little bit obstrusive
			// do not validate if val length < min threshold on first validation. Once field have been validated once and info
			// about success or failure have been displayed, always validate with this trigger to reflect every yalidation change.
			if (new RegExp('key').test(event.type))
				if (!this._ui.validationInformationVisible && this.getValue().length <= this.options.validationThreshold)
					return;
			this._ui.validatedOnce = true;
			this.validate();
		},
		manageFailingFieldTrigger: function (fieldInstance) {
			fieldInstance._ui.failedOnce = true;
			// Radio and checkboxes fields must bind every field multiple
			if (fieldInstance.options.multiple)
				$vf('[' + fieldInstance.options.namespace + 'multiple="' + fieldInstance.options.multiple + '"]').each(function () {
					if (!new RegExp('change', 'i').test($vf(this).parsley().options.trigger || ''))
						return $vf(this).on('change.ParsleyFailedOnce', false, $vf.proxy(fieldInstance.validate, fieldInstance));
				});
			// Select case
			if (fieldInstance.$element.is('select'))
				if (!new RegExp('change', 'i').test(fieldInstance.options.trigger || ''))
					return fieldInstance.$element.on('change.ParsleyFailedOnce', false, $vf.proxy(fieldInstance.validate, fieldInstance));
			// All other inputs fields
			if (!new RegExp('keyup', 'i').test(fieldInstance.options.trigger || ''))
				return fieldInstance.$element.on('keyup.ParsleyFailedOnce', false, $vf.proxy(fieldInstance.validate, fieldInstance));
		},
		reset: function (parsleyInstance) {
			// Reset all event listeners
			parsleyInstance.$element.off('.Parsley');
			parsleyInstance.$element.off('.ParsleyFailedOnce');
			// Nothing to do if UI never initialized for this field
			if ('undefined' === typeof parsleyInstance._ui)
				return;
			if ('ParsleyForm' === parsleyInstance.__class__)
				return;
			// Reset all errors' li
			parsleyInstance._ui.$errorsWrapper
			  .removeClass('filled')
			  .children()
			  .remove();
			// Reset validation class
			this._resetClass(parsleyInstance);
			// Reset validation flags and last validation result
			parsleyInstance._ui.validatedOnce = false;
			parsleyInstance._ui.lastValidationResult = [];
			parsleyInstance._ui.validationInformationVisible = false;
		},
		destroy: function (parsleyInstance) {
			this.reset(parsleyInstance);
			if ('ParsleyForm' === parsleyInstance.__class__)
				return;
			if ('undefined' !== typeof parsleyInstance._ui)
				parsleyInstance._ui.$errorsWrapper.remove();
			delete parsleyInstance._ui;
		},
		_successClass: function (fieldInstance) {
			fieldInstance._ui.validationInformationVisible = true;
			fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.errorClass).addClass(fieldInstance.options.successClass);
		},
		_errorClass: function (fieldInstance) {
			fieldInstance._ui.validationInformationVisible = true;
			fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).addClass(fieldInstance.options.errorClass);
		},
		_resetClass: function (fieldInstance) {
			fieldInstance._ui.$errorClassHandler.removeClass(fieldInstance.options.successClass).removeClass(fieldInstance.options.errorClass);
		}
	};

	var ParsleyOptionsFactory = function (defaultOptions, globalOptions, userOptions, namespace) {
		this.__class__ = 'OptionsFactory';
		this.__id__ = ParsleyUtils.hash(4);
		this.formOptions = null;
		this.fieldOptions = null;
		this.staticOptions = $vf.extend(true, {}, defaultOptions, globalOptions, userOptions, { namespace: namespace });
	};
	ParsleyOptionsFactory.prototype = {
		get: function (parsleyInstance) {
			if ('undefined' === typeof parsleyInstance.__class__)
				throw new Error('Parsley Instance expected');
			switch (parsleyInstance.__class__) {
				case 'Parsley':
					return this.staticOptions;
				case 'ParsleyForm':
					return this.getFormOptions(parsleyInstance);
				case 'ParsleyField':
				case 'ParsleyFieldMultiple':
					return this.getFieldOptions(parsleyInstance);
				default:
					throw new Error('Instance ' + parsleyInstance.__class__ + ' is not supported');
			}
		},
		getFormOptions: function (formInstance) {
			this.formOptions = ParsleyUtils.attr(formInstance.$element, this.staticOptions.namespace);
			// not deep extend, since formOptions is a 1 level deep object
			return $vf.extend({}, this.staticOptions, this.formOptions);
		},
		getFieldOptions: function (fieldInstance) {
			this.fieldOptions = ParsleyUtils.attr(fieldInstance.$element, this.staticOptions.namespace);
			if (null === this.formOptions && 'undefined' !== typeof fieldInstance.parent)
				this.formOptions = this.getFormOptions(fieldInstance.parent);
			// not deep extend, since formOptions and fieldOptions is a 1 level deep object
			return $vf.extend({}, this.staticOptions, this.formOptions, this.fieldOptions);
		}
	};

	var ParsleyForm = function (element, OptionsFactory) {
		this.__class__ = 'ParsleyForm';
		this.__id__ = ParsleyUtils.hash(4);
		if ('OptionsFactory' !== ParsleyUtils.get(OptionsFactory, '__class__'))
			throw new Error('You must give an OptionsFactory instance');
		this.OptionsFactory = OptionsFactory;
		this.$element = $vf(element);
		this.validationResult = null;
		this.options = this.OptionsFactory.get(this);
	};
	ParsleyForm.prototype = {
		onSubmitValidate: function (event) {
			this.validate(undefined, undefined, event);
			// prevent form submission if validation fails
			if (false === this.validationResult && event instanceof $vf.Event) {
				event.stopImmediatePropagation();
				event.preventDefault();
			}
			return this;
		},
		// @returns boolean
		validate: function (group, force, event) {
			this.submitEvent = event;
			this.validationResult = true;
			var fieldValidationResult = [];
			// Refresh form DOM options and form's fields that could have changed
			this._refreshFields();
			$vf.emit('parsley:form:validate', this);
			// loop through fields to validate them one by one
			for (var i = 0; i < this.fields.length; i++) {
				// do not validate a field if not the same as given validation group
				if (group && !this._isFieldInGroup(this.fields[i], group))
					continue;
				fieldValidationResult = this.fields[i].validate(force);
				if (true !== fieldValidationResult && fieldValidationResult.length > 0 && this.validationResult)
					this.validationResult = false;
			}
			$vf.emit('parsley:form:validated', this);
			return this.validationResult;
		},
		// Iterate over refreshed fields, and stop on first failure
		isValid: function (group, force) {
			this._refreshFields();
			for (var i = 0; i < this.fields.length; i++) {
				// do not validate a field if not the same as given validation group
				if (group && !this._isFieldInGroup(this.fields[i], group))
					continue;
				if (false === this.fields[i].isValid(force))
					return false;
			}
			return true;
		},
		_isFieldInGroup: function (field, group) {
			if (ParsleyUtils.isArray(field.options.group))
				return -1 !== $vf.inArray(group, field.options.group);
			return field.options.group === group;
		},
		_refreshFields: function () {
			return this.actualizeOptions()._bindFields();
		},
		_bindFields: function () {
			var self = this;
			this.fields = [];
			this.fieldsMappedById = {};
			this.$element.find(this.options.inputs).each(function () {
				var fieldInstance = new window.Parsley(this, {}, self);
				// Only add valid and not excluded `ParsleyField` and `ParsleyFieldMultiple` children
				if (('ParsleyField' === fieldInstance.__class__ || 'ParsleyFieldMultiple' === fieldInstance.__class__) && !fieldInstance.$element.is(fieldInstance.options.excluded))
					if ('undefined' === typeof self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__]) {
						self.fieldsMappedById[fieldInstance.__class__ + '-' + fieldInstance.__id__] = fieldInstance;
						self.fields.push(fieldInstance);
					}
			});
			return this;
		}
	};

	var ConstraintFactory = function (parsleyField, name, requirements, priority, isDomConstraint) {
		if (!new RegExp('ParsleyField').test(ParsleyUtils.get(parsleyField, '__class__')))
			throw new Error('ParsleyField or ParsleyFieldMultiple instance expected');
		if ('function' !== typeof window.ParsleyValidator.validators[name] &&
		  'Assert' !== window.ParsleyValidator.validators[name](requirements).__parentClass__)
			throw new Error('Valid validator expected');
		var getPriority = function (parsleyField, name) {
			if ('undefined' !== typeof parsleyField.options[name + 'Priority'])
				return parsleyField.options[name + 'Priority'];
			return ParsleyUtils.get(window.ParsleyValidator.validators[name](requirements), 'priority') || 2;
		};
		priority = priority || getPriority(parsleyField, name);
		// If validator have a requirementsTransformer, execute it
		if ('function' === typeof window.ParsleyValidator.validators[name](requirements).requirementsTransformer)
			requirements = window.ParsleyValidator.validators[name](requirements).requirementsTransformer();
		return $vf.extend(window.ParsleyValidator.validators[name](requirements), {
			name: name,
			requirements: requirements,
			priority: priority,
			groups: [priority],
			isDomConstraint: isDomConstraint || ParsleyUtils.attr(parsleyField.$element, parsleyField.options.namespace, name)
		});
	};

	var ParsleyField = function (field, OptionsFactory, parsleyFormInstance) {
		this.__class__ = 'ParsleyField';
		this.__id__ = ParsleyUtils.hash(4);
		this.$element = $vf(field);
		// If we have a parent `ParsleyForm` instance given, use its `OptionsFactory`, and save parent
		if ('undefined' !== typeof parsleyFormInstance) {
			this.parent = parsleyFormInstance;
			this.OptionsFactory = this.parent.OptionsFactory;
			this.options = this.OptionsFactory.get(this);
			// Else, take the `Parsley` one
		} else {
			this.OptionsFactory = OptionsFactory;
			this.options = this.OptionsFactory.get(this);
		}
		// Initialize some properties
		this.constraints = [];
		this.constraintsByName = {};
		this.validationResult = [];
		// Bind constraints
		this._bindConstraints();
	};
	ParsleyField.prototype = {
		// # Public API
		// Validate field and $vf.emit some events for mainly `ParsleyUI`
		// @returns validationResult:
		//  - `true` if all constraint passes
		//  - `[]` if not required field and empty (not validated)
		//  - `[Violation, [Violation..]]` if there were validation errors
		validate: function (force) {
			this.value = this.getValue();
			// Field Validate event. `this.value` could be altered for custom needs
			$vf.emit('parsley:field:validate', this);
			$vf.emit('parsley:field:' + (this.isValid(force, this.value) ? 'success' : 'error'), this);
			// Field validated event. `this.validationResult` could be altered for custom needs too
			$vf.emit('parsley:field:validated', this);
			return this.validationResult;
		},
		// Just validate field. Do not trigger any event
		// Same @return as `validate()`
		isValid: function (force, value) {
			// Recompute options and rebind constraints to have latest changes
			this.refreshConstraints();
			// Sort priorities to validate more important first
			var priorities = this._getConstraintsSortedPriorities();
			if (0 === priorities.length)
				return this.validationResult = [];
			// Value could be passed as argument, needed to add more power to 'parsley:field:validate'
			value = value || this.getValue();
			// If a field is empty and not required, leave it alone, it's just fine
			// Except if `data-parsley-validate-if-empty` explicitely added, useful for some custom validators
			if (!value.length && !this._isRequired() && 'undefined' === typeof this.options.validateIfEmpty && true !== force)
				return this.validationResult = [];
			// If we want to validate field against all constraints, just call Validator and let it do the job
			if (false === this.options.priorityEnabled)
				return true === (this.validationResult = this.validateThroughValidator(value, this.constraints, 'Any'));
			// Else, iterate over priorities one by one, and validate related asserts one by one
			for (var i = 0; i < priorities.length; i++)
				if (true !== (this.validationResult = this.validateThroughValidator(value, this.constraints, priorities[i])))
					return false;
			return true;
		},
		// @returns Parsley field computed value that could be overrided or configured in DOM
		getValue: function () {
			var value;
			// Value could be overriden in DOM
			if ('undefined' !== typeof this.options.value)
				value = this.options.value;
			else
				value = this.$element.val();
			// Handle wrong DOM or configurations
			if ('undefined' === typeof value || null === value)
				return '';
			// Use `data-parsley-trim-value="true"` to auto trim inputs entry
			if (true === this.options.trimValue)
				return value.replace(/^\s+|\s+$/g, '');
			return value;
		},
		// Actualize options that could have change since previous validation
		// Re-bind accordingly constraints (could be some new, removed or updated)
		refreshConstraints: function () {
			return this.actualizeOptions()._bindConstraints();
		},
		/**
		* Add a new constraint to a field
		*
		* @method addConstraint
		* @param {String}   name
		* @param {Mixed}    requirements      optional
		* @param {Number}   priority          optional
		* @param {Boolean}  isDomConstraint   optional
		*/
		addConstraint: function (name, requirements, priority, isDomConstraint) {
			name = name.toLowerCase();
			if ('function' === typeof window.ParsleyValidator.validators[name]) {
				var constraint = new ConstraintFactory(this, name, requirements, priority, isDomConstraint);
				// if constraint already exist, delete it and push new version
				if ('undefined' !== this.constraintsByName[constraint.name])
					this.removeConstraint(constraint.name);
				this.constraints.push(constraint);
				this.constraintsByName[constraint.name] = constraint;
			}
			return this;
		},
		// Remove a constraint
		removeConstraint: function (name) {
			for (var i = 0; i < this.constraints.length; i++)
				if (name === this.constraints[i].name) {
					this.constraints.splice(i, 1);
					break;
				}
			delete this.constraintsByName[name];
			return this;
		},
		// Update a constraint (Remove + re-add)
		updateConstraint: function (name, parameters, priority) {
			return this.removeConstraint(name)
			  .addConstraint(name, parameters, priority);
		},
		// # Internals
		// Internal only.
		// Bind constraints from config + options + DOM
		_bindConstraints: function () {
			var constraints = [], constraintsByName = {};
			// clean all existing DOM constraints to only keep javascript user constraints
			for (var i = 0; i < this.constraints.length; i++)
				if (false === this.constraints[i].isDomConstraint) {
					constraints.push(this.constraints[i]);
					constraintsByName[this.constraints[i].name] = this.constraints[i];
				}
			this.constraints = constraints;
			this.constraintsByName = constraintsByName;
			// then re-add Parsley DOM-API constraints
			for (var name in this.options)
				this.addConstraint(name, this.options[name]);
			// finally, bind special HTML5 constraints
			return this._bindHtml5Constraints();
		},
		// Internal only.
		// Bind specific HTML5 constraints to be HTML5 compliant
		_bindHtml5Constraints: function () {
			// html5 required
			if (this.$element.hasClass('required') || this.$element.attr('required'))
				this.addConstraint('required', true, undefined, true);
			// html5 pattern
			if ('string' === typeof this.$element.attr('pattern'))
				this.addConstraint('pattern', this.$element.attr('pattern'), undefined, true);
			// range
			if ('undefined' !== typeof this.$element.attr('min') && 'undefined' !== typeof this.$element.attr('max'))
				this.addConstraint('range', [this.$element.attr('min'), this.$element.attr('max')], undefined, true);
				// HTML5 min
			else if ('undefined' !== typeof this.$element.attr('min'))
				this.addConstraint('min', this.$element.attr('min'), undefined, true);
				// HTML5 max
			else if ('undefined' !== typeof this.$element.attr('max'))
				this.addConstraint('max', this.$element.attr('max'), undefined, true);
			// html5 types
			var type = this.$element.attr('type');
			if ('undefined' === typeof type)
				return this;
			// Small special case here for HTML5 number: integer validator if step attribute is undefined or an integer value, number otherwise
			if ('number' === type) {
				if (('undefined' === typeof this.$element.attr('step')) || (0 === parseFloat(this.$element.attr('step')) % 1)) {
					return this.addConstraint('type', 'integer', undefined, true);
				} else {
					return this.addConstraint('type', 'number', undefined, true);
				}
				// Regular other HTML5 supported types
			} else if (new RegExp(type, 'i').test('email url range')) {
				return this.addConstraint('type', type, undefined, true);
			}
			return this;
		},
		// Internal only.
		// Field is required if have required constraint without `false` value
		_isRequired: function () {
			if ('undefined' === typeof this.constraintsByName.required)
				return false;
			return false !== this.constraintsByName.required.requirements;
		},
		// Internal only.
		// Sort constraints by priority DESC
		_getConstraintsSortedPriorities: function () {
			var priorities = [];
			// Create array unique of priorities
			for (var i = 0; i < this.constraints.length; i++)
				if (-1 === priorities.indexOf(this.constraints[i].priority))
					priorities.push(this.constraints[i].priority);
			// Sort them by priority DESC
			priorities.sort(function (a, b) { return b - a; });
			return priorities;
		}
	};

	var ParsleyMultiple = function () {
		this.__class__ = 'ParsleyFieldMultiple';
	};
	ParsleyMultiple.prototype = {
		// Add new `$element` sibling for multiple field
		addElement: function ($element) {
			this.$elements.push($element);
			return this;
		},
		// See `ParsleyField.refreshConstraints()`
		refreshConstraints: function () {
			var fieldConstraints;
			this.constraints = [];
			// Select multiple special treatment
			if (this.$element.is('select')) {
				this.actualizeOptions()._bindConstraints();
				return this;
			}
			// Gather all constraints for each input in the multiple group
			for (var i = 0; i < this.$elements.length; i++) {
				// Check if element have not been dynamically removed since last binding
				if (!$vf('html').has(this.$elements[i]).length) {
					this.$elements.splice(i, 1);
					continue;
				}
				fieldConstraints = this.$elements[i].data('ParsleyFieldMultiple').refreshConstraints().constraints;
				for (var j = 0; j < fieldConstraints.length; j++)
					this.addConstraint(fieldConstraints[j].name, fieldConstraints[j].requirements, fieldConstraints[j].priority, fieldConstraints[j].isDomConstraint);
			}
			return this;
		},
		// See `ParsleyField.getValue()`
		getValue: function () {
			// Value could be overriden in DOM
			if ('undefined' !== typeof this.options.value)
				return this.options.value;
			// Radio input case
			if (this.$element.is('input[type=radio]'))
				return $vf('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').val() || '';
			// checkbox input case
			if (this.$element.is('input[type=checkbox]')) {
				var values = [];
				$vf('[' + this.options.namespace + 'multiple="' + this.options.multiple + '"]:checked').each(function () {
					values.push($vf(this).val());
				});
				return values.length ? values : [];
			}
			// Select multiple case
			if (this.$element.is('select') && null === this.$element.val())
				return [];
			// Default case that should never happen
			return this.$element.val();
		},
		_init: function (multiple) {
			this.$elements = [this.$element];
			this.options.multiple = multiple;
			return this;
		}
	};

	var
	  o = $vf({}),
	  subscribed = {};
	// $vf.listen(name, callback);
	// $vf.listen(name, context, callback);
	$vf.listen = function (name) {
		if ('undefined' === typeof subscribed[name])
			subscribed[name] = [];
		if ('function' === typeof arguments[1])
			return subscribed[name].push({ fn: arguments[1] });
		if ('object' === typeof arguments[1] && 'function' === typeof arguments[2])
			return subscribed[name].push({ fn: arguments[2], ctxt: arguments[1] });
		throw new Error('Wrong parameters');
	};
	$vf.listenTo = function (instance, name, fn) {
		if ('undefined' === typeof subscribed[name])
			subscribed[name] = [];
		if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
			throw new Error('Must give Parsley instance');
		if ('string' !== typeof name || 'function' !== typeof fn)
			throw new Error('Wrong parameters');
		subscribed[name].push({ instance: instance, fn: fn });
	};
	$vf.unsubscribe = function (name, fn) {
		if ('undefined' === typeof subscribed[name])
			return;
		if ('string' !== typeof name || 'function' !== typeof fn)
			throw new Error('Wrong arguments');
		for (var i = 0; i < subscribed[name].length; i++)
			if (subscribed[name][i].fn === fn)
				return subscribed[name].splice(i, 1);
	};
	$vf.unsubscribeTo = function (instance, name) {
		if ('undefined' === typeof subscribed[name])
			return;
		if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
			throw new Error('Must give Parsley instance');
		for (var i = 0; i < subscribed[name].length; i++)
			if ('undefined' !== typeof subscribed[name][i].instance && subscribed[name][i].instance.__id__ === instance.__id__)
				return subscribed[name].splice(i, 1);
	};
	$vf.unsubscribeAll = function (name) {
		if ('undefined' === typeof subscribed[name])
			return;
		delete subscribed[name];
	};
	// $vf.emit(name [, arguments...]);
	// $vf.emit(name, instance [, arguments..]);
	$vf.emit = function (name, instance) {
		if ('undefined' === typeof subscribed[name])
			return;
		// loop through registered callbacks for this event
		for (var i = 0; i < subscribed[name].length; i++) {
			// if instance is not registered, simple emit
			if ('undefined' === typeof subscribed[name][i].instance) {
				subscribed[name][i].fn.apply('undefined' !== typeof subscribed[name][i].ctxt ? subscribed[name][i].ctxt : o, Array.prototype.slice.call(arguments, 1));
				continue;
			}
			// if instance registered but no instance given for the emit, continue
			if (!(instance instanceof ParsleyField) && !(instance instanceof ParsleyForm))
				continue;
			// if instance is registered and same id, emit
			if (subscribed[name][i].instance.__id__ === instance.__id__) {
				subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
				continue;
			}
			// if registered instance is a Form and fired one is a Field, loop over all its fields and emit if field found
			if (subscribed[name][i].instance instanceof ParsleyForm && instance instanceof ParsleyField)
				for (var j = 0; j < subscribed[name][i].instance.fields.length; j++)
					if (subscribed[name][i].instance.fields[j].__id__ === instance.__id__) {
						subscribed[name][i].fn.apply(o, Array.prototype.slice.call(arguments, 1));
						continue;
					}
		}
	};
	$vf.subscribed = function () { return subscribed; };

	// ParsleyConfig definition if not already set
	window.ParsleyConfig = window.ParsleyConfig || {};
	window.ParsleyConfig.i18n = window.ParsleyConfig.i18n || {};
	// Define then the messages
	window.ParsleyConfig.i18n.en = $vf.extend(window.ParsleyConfig.i18n.en || {}, {
		defaultMessage: "This value seems to be invalid.",
		type: {
			email: "This value should be a valid email.",
			url: "This value should be a valid url.",
			number: "This value should be a valid number.",
			integer: "This value should be a valid integer.",
			digits: "This value should be digits.",
			alphanum: "This value should be alphanumeric."
		},
		notblank: "This value should not be blank.",
		required: "This value is required.",
		pattern: "This value seems to be invalid.",
		min: "This value should be greater than or equal to %s.",
		max: "This value should be lower than or equal to %s.",
		range: "This value should be between %s and %s.",
		minlength: "This value is too short. It should have %s characters or more.",
		maxlength: "This value is too long. It should have %s characters or fewer.",
		length: "This value length is invalid. It should be between %s and %s characters long.",
		mincheck: "You must select at least %s choices.",
		maxcheck: "You must select %s choices or fewer.",
		check: "You must select between %s and %s choices.",
		equalto: "This value should be the same."
	});
	// If file is loaded after Parsley main file, auto-load locale
	if ('undefined' !== typeof window.ParsleyValidator)
		window.ParsleyValidator.addCatalog('en', window.ParsleyConfig.i18n.en, true);

	//     Parsley.js 2.0.6
	//     http://parsleyjs.org
	//     (c) 20012-2014 Guillaume Potier, Wisembly
	//     Parsley may be freely distributed under the MIT license.

	// ### Parsley factory
	var Parsley = function (element, options, parsleyFormInstance) {
		this.__class__ = 'Parsley';
		this.__version__ = '2.0.6';
		this.__id__ = ParsleyUtils.hash(4);
		// Parsley must be instanciated with a DOM element or jQuery $element
		if ('undefined' === typeof element)
			throw new Error('You must give an element');
		if ('undefined' !== typeof parsleyFormInstance && 'ParsleyForm' !== parsleyFormInstance.__class__)
			throw new Error('Parent instance must be a ParsleyForm instance');
		return this.init($vf(element), options, parsleyFormInstance);
	};
	Parsley.prototype = {
		init: function ($element, options, parsleyFormInstance) {
			if (!$element.length)
				throw new Error('You must bind Parsley on an existing element.');
			this.$element = $element;
			// If element have already been binded, returns its saved Parsley instance
			if (this.$element.data('Parsley')) {
				var savedparsleyFormInstance = this.$element.data('Parsley');
				// If saved instance have been binded without a ParsleyForm parent and there is one given in this call, add it
				if ('undefined' !== typeof parsleyFormInstance)
					savedparsleyFormInstance.parent = parsleyFormInstance;
				return savedparsleyFormInstance;
			}
			// Handle 'static' options
			this.OptionsFactory = new ParsleyOptionsFactory(ParsleyDefaults, ParsleyUtils.get(window, 'ParsleyConfig') || {}, options, this.getNamespace(options));
			this.options = this.OptionsFactory.get(this);
			// A ParsleyForm instance is obviously a `<form>` elem but also every node that is not an input and have `data-parsley-validate` attribute
			if (this.$element.is('form') || (ParsleyUtils.attr(this.$element, this.options.namespace, 'validate') && !this.$element.is(this.options.inputs)))
				return this.bind('parsleyForm');
				// Every other supported element and not excluded element is binded as a `ParsleyField` or `ParsleyFieldMultiple`
			else if (this.$element.is(this.options.inputs) && !this.$element.is(this.options.excluded))
				return this.isMultiple() ? this.handleMultiple(parsleyFormInstance) : this.bind('parsleyField', parsleyFormInstance);
			return this;
		},
		isMultiple: function () {
			return (this.$element.is('input[type=radio], input[type=checkbox]') && 'undefined' === typeof this.options.multiple) || (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple'));
		},
		// Multiples fields are a real nightmare :(
		// Maybe some refacto would be appreciated here..
		handleMultiple: function (parsleyFormInstance) {
			var
			  that = this,
			  name,
			  multiple,
			  parsleyMultipleInstance;
			// Get parsleyFormInstance options if exist, mixed with element attributes
			this.options = $vf.extend(this.options, parsleyFormInstance ? parsleyFormInstance.OptionsFactory.get(parsleyFormInstance) : {}, ParsleyUtils.attr(this.$element, this.options.namespace));
			// Handle multiple name
			if (this.options.multiple)
				multiple = this.options.multiple;
			else if ('undefined' !== typeof this.$element.attr('name') && this.$element.attr('name').length)
				multiple = name = this.$element.attr('name');
			else if ('undefined' !== typeof this.$element.attr('id') && this.$element.attr('id').length)
				multiple = this.$element.attr('id');
			// Special select multiple input
			if (this.$element.is('select') && 'undefined' !== typeof this.$element.attr('multiple')) {
				return this.bind('parsleyFieldMultiple', parsleyFormInstance, multiple || this.__id__);
				// Else for radio / checkboxes, we need a `name` or `data-parsley-multiple` to properly bind it
			} else if ('undefined' === typeof multiple) {
				if (window.console && window.console.warn)
					window.console.warn('To be binded by Parsley, a radio, a checkbox and a multiple select input must have either a name or a multiple option.', this.$element);
				return this;
			}
			// Remove special chars
			multiple = multiple.replace(/(:|\.|\[|\]|\{|\}|\$)/g, '');
			// Add proper `data-parsley-multiple` to siblings if we have a valid multiple name
			if ('undefined' !== typeof name) {
				$vf('input[name="' + name + '"]').each(function () {
					if ($vf(this).is('input[type=radio], input[type=checkbox]'))
						$vf(this).attr(that.options.namespace + 'multiple', multiple);
				});
			}
			// Check here if we don't already have a related multiple instance saved
			if ($vf('[' + this.options.namespace + 'multiple=' + multiple + ']').length) {
				for (var i = 0; i < $vf('[' + this.options.namespace + 'multiple=' + multiple + ']').length; i++) {
					if ('undefined' !== typeof $vf($vf('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley')) {
						parsleyMultipleInstance = $vf($vf('[' + this.options.namespace + 'multiple=' + multiple + ']').get(i)).data('Parsley');
						if (!this.$element.data('ParsleyFieldMultiple')) {
							parsleyMultipleInstance.addElement(this.$element);
							this.$element.attr(this.options.namespace + 'id', parsleyMultipleInstance.__id__);
						}
						break;
					}
				}
			}
			// Create a secret ParsleyField instance for every multiple field. It would be stored in `data('ParsleyFieldMultiple')`
			// And would be useful later to access classic `ParsleyField` stuff while being in a `ParsleyFieldMultiple` instance
			this.bind('parsleyField', parsleyFormInstance, multiple, true);
			return parsleyMultipleInstance || this.bind('parsleyFieldMultiple', parsleyFormInstance, multiple);
		},
		// Retrieve namespace used for DOM-API
		getNamespace: function (options) {
			// `data-parsley-namespace=<namespace>`
			if ('undefined' !== typeof this.$element.data('parsleyNamespace'))
				return this.$element.data('parsleyNamespace');
			if ('undefined' !== typeof ParsleyUtils.get(options, 'namespace'))
				return options.namespace;
			if ('undefined' !== typeof ParsleyUtils.get(window, 'ParsleyConfig.namespace'))
				return window.ParsleyConfig.namespace;
			return ParsleyDefaults.namespace;
		},
		// Return proper `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
		bind: function (type, parentParsleyFormInstance, multiple, doNotStore) {
			var parsleyInstance;
			switch (type) {
				case 'parsleyForm':
					parsleyInstance = $vf.extend(
					  new ParsleyForm(this.$element, this.OptionsFactory),
					  new ParsleyAbstract(),
					  window.ParsleyExtend
					)._bindFields();
					break;
				case 'parsleyField':
					parsleyInstance = $vf.extend(
					  new ParsleyField(this.$element, this.OptionsFactory, parentParsleyFormInstance),
					  new ParsleyAbstract(),
					  window.ParsleyExtend
					);
					break;
				case 'parsleyFieldMultiple':
					parsleyInstance = $vf.extend(
					  new ParsleyField(this.$element, this.OptionsFactory, parentParsleyFormInstance),
					  new ParsleyAbstract(),
					  new ParsleyMultiple(),
					  window.ParsleyExtend
					)._init(multiple);
					break;
				default:
					throw new Error(type + 'is not a supported Parsley type');
			}
			if ('undefined' !== typeof multiple)
				ParsleyUtils.setAttr(this.$element, this.options.namespace, 'multiple', multiple);
			if ('undefined' !== typeof doNotStore) {
				this.$element.data('ParsleyFieldMultiple', parsleyInstance);
				return parsleyInstance;
			}
			// Store instance if `ParsleyForm`, `ParsleyField` or `ParsleyFieldMultiple`
			if (new RegExp('ParsleyF', 'i').test(parsleyInstance.__class__)) {
				// Store for later access the freshly binded instance in DOM element itself using jQuery `data()`
				this.$element.data('Parsley', parsleyInstance);
				// Tell the world we got a new ParsleyForm or ParsleyField instance!
				$vf.emit('parsley:' + ('parsleyForm' === type ? 'form' : 'field') + ':init', parsleyInstance);
			}
			return parsleyInstance;
		}
	};
	// ### jQuery API
	// `$vf('.elem').parsley(options)` or `$vf('.elem').psly(options)`
	$vf.fn.parsley = $vf.fn.psly = function (options) {
		if (this.length > 1) {
			var instances = [];
			this.each(function () {
				instances.push($vf(this).parsley(options));
			});
			return instances;
		}
		// Return undefined if applied to non existing DOM element
		if (!$vf(this).length) {
			if (window.console && window.console.warn)
				window.console.warn('You must bind Parsley on an existing element.');
			return;
		}
		return new Parsley(this, options);
	};
	// ### ParsleyUI
	// UI is a class apart that only listen to some events and them modify DOM accordingly
	// Could be overriden by defining a `window.ParsleyConfig.ParsleyUI` appropriate class (with `listen()` method basically)
	window.ParsleyUI = 'function' === typeof ParsleyUtils.get(window, 'ParsleyConfig.ParsleyUI') ?
	  new window.ParsleyConfig.ParsleyUI().listen() : new ParsleyUI().listen();
	// ### ParsleyField and ParsleyForm extension
	// Ensure that defined if not already the case
	if ('undefined' === typeof window.ParsleyExtend)
		window.ParsleyExtend = {};
	// ### ParsleyConfig
	// Ensure that defined if not already the case
	if ('undefined' === typeof window.ParsleyConfig)
		window.ParsleyConfig = {};
	// ### Globals
	window.Parsley = window.psly = Parsley;
	window.ParsleyUtils = ParsleyUtils;
	window.ParsleyValidator = new ParsleyValidator(window.ParsleyConfig.validators, window.ParsleyConfig.i18n);
	// ### PARSLEY auto-binding
	// Prevent it by setting `ParsleyConfig.autoBind` to `false`
	if (false !== ParsleyUtils.get(window, 'ParsleyConfig.autoBind'))
		$vf(function () {
			// Works only on `data-parsley-validate`.
			if ($vf('[data-parsley-validate]').length)
				$vf('[data-parsley-validate]').parsley();
		});
}));

// 
// Adds the browser name and version number to the body tag
// for use in special cases for browser comparability issues.
//
// Makes use of the bowser object from bowser.min.js. (Note the Mario Brothers spelling of "bowser", not "browser")
//
var browserDetect = {};
$vf(function () {
	// native iOS web view fix
	if (bowser.version == undefined) {
		bowser.version = 999;
	}

	var browserName = JSON.stringify(bowser.name).replace(/"/g, '');
	var browserVersion = JSON.stringify(bowser.version).replace(/"/g, '');
	var simpleOsVersion = parseFloat(bowser.osversion);
	var ios = false;
	if (browserName == 'iPhone' || browserName == 'iPad' || browserName == 'iPod') {
		ios = true;
	}

	browserDetect = {
		browserName: browserName,
		browserVersion: browserVersion,
		simpleOsVersion: simpleOsVersion,
		ios: ios
	}

	//***********************************
	// io and device checks
	//***********************************
	if (ios) { $vf('html').addClass('device-ios'); }
	if (bowser.android) { $vf('html').addClass('device-android'); }
	if (bowser.windowsphone) { $vf('html').addClass('device-windowsphone'); }
	if (bowser.blackberry) { $vf('html').addClass('device-blackberry'); }
	if (bowser.firefoxos) { $vf('html').addClass('device-firefoxos'); }
	if (bowser.webos) { $vf('html').addClass('device-webos'); }
	if (bowser.tablet || bowser.mobile) {
		if (bowser.mobile) { $vf('html').addClass('device-mobile'); }
		if (bowser.tablet) { $vf('html').addClass('device-tablet'); }
	} else {
		$vf('html').addClass('device-desktop');
	}

	// console.log('simpleOsVersion == ' + simpleOsVersion + ' | browserName == ' + browserName + ' | browserVersion == ' + browserVersion + ' | ios = ' + ios);
	// alert('simpleOsVersion == ' + simpleOsVersion + ' | browserName == ' + browserName + ' | browserVersion == ' + browserVersion + ' | ios = ' + ios);
	
	$vf('html').addClass('browser-name-' + browserName.toLowerCase().replace(/\s+/g, "-") + ' browser-version-' + parseInt(browserVersion));

	//***********************************
	// Android 
	//***********************************
	if (browserName == "Android") {
		//$vf('html').addClass('no-top-fixed alt-off-canvas');
		$vf('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no');
	}

	//***********************************
	// iOS - adding ios specific string to the content attribute to fix iOS 9 bug.  https://developer.apple.com/library/ios/releasenotes/General/WhatsNewInSafari/Articles/Safari_9.html#//apple_ref/doc/uid/TP40014305-CH9-SW36
	//***********************************
	if (ios && browserVersion >= 9) {
		$vf('meta[name=viewport]').attr('content', $vf('meta[name=viewport]').attr('content') + ', shrink-to-fit=no');
	}

	//***********************************
	// Rotating Loader spinner doesn't work on pseudo elements in some browsers.
	//***********************************
	if (browserName == "Android" || (ios && browserVersion < 7) || browserName == "Internet Explorer" && browserVersion < 10) {
		$vf('html').addClass('gif-loader');
	}
	
	//***********************************
	// Put .old-ie class on the html tag for general ie9 specific styles.
	//***********************************
	if (browserName == "Internet Explorer" && browserVersion < 10) {
		$vf('html').addClass('old-ie');
	}

	//***********************************
	// Android 4.0 and 4.4 have problem with input type=number  not allowing decimal on the number keyboard. Fix it here by replacing with tel.
	//***********************************
	androidNumberToTel();

});

function androidNumberToTel() {
	if (bowser.android && browserDetect.simpleOsVersion <= 4.0 || browserDetect.simpleOsVersion == 4.1 || browserDetect.simpleOsVersion == 4.3 || browserDetect.simpleOsVersion == 4.4) {
		$vf('input[type="number"]').attr('type', 'tel');
	}
}
// Makes everything with the same [data-equal-width] attribute value have the 
// same height as the tallest object in the set.
function equalHeightsInit(context) {
	var $context = getContext(context);

	var setNames = [];
	$vf('[data-equal-height]', $context).each(function () {
		var setName = $vf(this).attr('data-equal-height');
		// if setName not yet in setNames array, add it.
		if ($vf.inArray(setName, setNames) === -1) {
			setNames.push(setName);
		}
	});

	if (setNames.length > 0) {
		equalHeights(setNames);
		
		// slow down the fireing of equalHeights() calls with this debounce function.
		$vf(function () {
			function debounce(func, wait, immediate) {
				var timeout;
				return function () {
					var context = this, args = arguments;
					var later = function () {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			};
			$vf(window).on('resize', debounce(function () {
				equalHeights(setNames);
			}, 100));
		});
	}
}

// Checks the height of all items in the setNames array and makes all items
// equal the height of the tallest of the group. 
// `setNames` can be string or array of strings representing all the 
// 		components to match Heights.  If left empty, will set heights of all [data-equal-height]
function equalHeights(setNames) {
	// if setNames is a string, turn it into a single item array.
	if (typeof setNames == 'string') {
		var string = setNames;
		var setNames = [];
		setNames.push(string);
	} else if (!setNames) {
		// This is like a duplicate of doing the same through equalHeightsInit() but without 
		// the specificity of $context
		$vf('[data-equal-height]').each(function () {
			var setName = $vf(this).attr('data-equal-height');
			setNames = [];
			// if setName not yet in setNames array, add it.
			if ($vf.inArray(setName, setNames) === -1) {
				setNames.push(setName);
			}
		});
	}

	$vf.each(setNames, function (index, value) {
		var tallestHeight;
		var $set = $vf('[data-equal-height="' + value + '"]');

		$set.each(function (index) {
			var $this = $vf(this);
			$this.trigger('beforeEqualHeights');

			// clear prviously set inline height
			$this[0].style.removeProperty('height');
			var height = this.scrollHeight;
			if (index === 0) {
				tallestHeight = height;
			} else if (height > tallestHeight) {
				tallestHeight = height;
			}

			$this.trigger('afterEqualHeights');
		});

		$set.css('height', tallestHeight);
	});
}

// Makes everything with the same [data-equal-width] attribute value have the 
// same width as the least wide object in the set. Mainly used for shrinking
// paired header/body tables to account for scroll bar widths added by browser.
function equalWidthsInit(context) {
	var $context = getContext(context);

	var setNames = [];
	$vf('[data-equal-width]', $context).each(function() {
		var setName = $vf(this).attr('data-equal-width');
		// if setName not yet in setNames array, add it.
		if($vf.inArray(setName, setNames) === -1) {
			setNames.push(setName);
		}
	});
	
	if (setNames.length > 0) {
		equalWidths(setNames);

		// slow down the fireing of equalWidths() calls with this debounce function.
		$vf(function () {
			function debounce(func, wait, immediate) {
				var timeout;
				return function () {
					var context = this, args = arguments;
					var later = function () {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			};
			$vf(window).on('resize', debounce(function () {
				equalWidths(setNames);
			}, 100));
		});
	}
}

// Checks the widths of all items in the setNames array and makes all items
// equal the width of the smallest/narrowest of the group.
// `setNames` can be string or array of strings representing all the 
// 		components to match widths. If left empty, will set heights of all [data-equal-height]
function equalWidths(setNames) {	
	// if setNames is a string, turn it into a single item array.
	if (typeof setNames == 'string') {
		var string = setNames;
		var setNames = [];
		setNames.push(string);
	} else if (!setNames) {
		// This is like a duplicate of doing the same through equalWidthsInit() but without 
		// the specificity of $context
		$vf('[data-equal-height]').each(function () {
			var setName = $vf(this).attr('data-equal-height');
			setNames = [];
			// if setName not yet in setNames array, add it.
			if ($vf.inArray(setName, setNames) === -1) {
				setNames.push(setName);
			}
		});
	}

	$vf.each(setNames, function (index, value) {
		var smallestWidth = 999999;
		var $set = $vf('[data-equal-width="' + value + '"]');

		$set.each(function (index) {
			var $this = $vf(this);
			$this.trigger('beforeEqualWidths');
			
			// clear previously set inline widths
			$this[0].style.removeProperty('width');

			var width = $this.outerWidth();
			if (width < smallestWidth) {
				smallestWidth = width;
			}
			$this.trigger('afterEqualWidths');
		});

		$set.css('width', smallestWidth);
	});
}
// get the height of the fixed bottom and then make an invisible element at
// the bottom of the page that is the same height so make an invisible bottom
// spacing. 
function fixedBottomInit(context) {
	var $context = getContext(context);

	var $activePage;

	// get the [data-fixed-bottom] element if exists in .page.active
	// or if not on a .page type flow, just see if it's in the DOM anywhere
	if ($vf('.page.active').length > 0) {
		$activePage = $vf('.page.active');
		var $bottomEl = $vf('.page.active [data-fixed-bottom]');
		// now put it as a direct child of the <body> so it can float properly
		$bottomEl.appendTo('body');

		// When new virtual page (.page element) is shown via a change in URL hash, 
		// put the $bottomEl back in its original .page element (i.e. $activePage)
		$vf(window).on('hashchange', function () {
			$bottomEl.appendTo($activePage);
		});
	} else {
		var $bottomEl = $vf('[data-fixed-bottom]');
	}

	var bottomFixedHeight = $bottomEl.outerHeight();

	// create #BottomSpacer div if not already existing
	if ($vf('#BottomSpacer').length < 1) {
		$vf('body').append('<div id="BottomSpacer"></div>');
	} 
	$vf(document).trigger('beforeFixedBottom');
	$vf('#BottomSpacer').css('height', bottomFixedHeight);
	$vf(document).trigger('afterFixedBottom');
}
// Blank inputs need one style and inputs with user entered values need another.
// This requires JS, any time a user burs an input with a value in it, 
// assign the .value class to it. 
function formsInit(context) {
	$vf(document).trigger('beforeFormsInit');
	var $context = getContext(context);

	/* INITIALIZATION STUFF */
	$vf('input, textarea', $context).each(function() {
		var $this = $vf(this);
		// see if .value should be added on load to inputs
		if ($this.val() && $this.val() != '' && $this.val() != undefined) {
			$this.addClass('value');
		}

		// Add accessibility attributes to form elements
		formsA11y($this);
	});

	// update accessibility attributes on form field change
	$context.on('change', 'input, textarea', function() {
		formsA11y($vf(this));
	});

	// iOS has bug where clicking label doesn't always fire a click.  
	// For whatever reason, this fixes that bug
	$vf('label').click(function () { });

	// Character Counter on load
	$vf('[maxlength]', $context).each(function() {
		characterCountdown($vf(this));
	});

	// IE9 placeholder attribute support (faking it)
	if (document.createElement("input").placeholder == undefined) {
		// Placeholder is not supported
		$vf('[placeholder]').focus(function() {
			var input = $vf(this);
			if (input.val() == input.attr('placeholder')) {
				input.val('');
				//input.removeClass('placeholder');
			}
		}).blur(function() {
			var input = $vf(this);
			if (input.val() == '' || input.val() == input.attr('placeholder')) {
				//input.addClass('placeholder');
				input.val(input.attr('placeholder'));
			}
		}).blur();
	}


	// See if .value should be added to selects on load.
	// Do so if the first or "selected" option is not "disabled".
	$vf('select', $context).each(function() {
		var $select = $vf(this);
		if ($select.val()) {
			$select.addClass('value');
		} else {
			$select.removeClass('value');
		}
	});

	// see if .value should
	$context.off('keyup change', 'textarea, select, input:not([type="radio"], [type="checkbox"])');
	$context.on('keyup change', 'textarea, select, input:not([type="radio"], [type="checkbox"])', function () {
		var $this = $vf(this);
		if($this.val()) { // should it be " .val().length > 0 "  ?? -Ben Williams
			$this.addClass('value');
		} else {
			$this.removeClass('value');
		}
	});

	// For add/remove of required mark from .required-mark elements. These elments
	// must be nested within the .validation-wrap to work properly. This little function
	// does a check to see if any item is ":checked". If so, add the .value class to the
	// wrapping .validation-wrap element.  
	$context.off('change', '.validation-wrap input[type="radio"], .validation-wrap input[type="checkbox"]');
	$context.on('change', '.validation-wrap input[type="radio"], .validation-wrap input[type="checkbox"]', function() {
		var $this = $vf(this);
		var $wrap = $this.closest('.validation-wrap');
		var groupName = $this.attr('name');
		if ($vf('[name='+ groupName +']', $wrap).is(':checked')) {
			$wrap.addClass('value');
		} else {
			$wrap.removeClass('value');
		}
	});


	// Flip the switch on click
	$context.off('click', '.switch-wrap:not(.disabled)');
	$context.on('click', '.switch-wrap:not(.disabled)', function (e) {
		var $checkbox = $vf('input[type=checkbox]', $vf(this));
		flipSwitch($checkbox);
	});

	// Flip the switch on spacebar when switch's input is focused
	$context.off('keydown', '.switch-wrap:not(.disabled)');
	$context.on('keydown', '.switch-wrap:not(.disabled)', function (e) {
		var $checkbox = $vf('input[type=checkbox]', $vf(this));
		if(e.keyCode == 32) { // keyCode 32 is spacebar
			flipSwitch($checkbox);
		}
	});

	// Flip the switch if you click on it's label
	$context.on('click', 'label[for]', function() {
		var switchId = $vf(this).attr('for');
		flipSwitch(switchId);
	});

	// When clicking a field that has a data-open-modal, don't put focus in the field 
	// because the soft keyboard will appear in mobile.
	$context.off('click', 'input[data-open-modal]');
	$context.on('click', 'input[data-open-modal]', function () {
		$vf(this).blur();
	});


	// Check for data-field-icon attribute on field. If present, run the generateFieldIcon() function
	$vf('[data-field-icon]', $context).each(function() {
		generateFieldIcon($vf(this));
	});
	/*** END INITIALIZATION STUFF ***/



	/* CHARACTER COUNTER
	Look for maxlength attribute and updat the corresponding data-character-count
	attribute if it exists in the adjacent .form-msg element.
	*/
	$context.off('keyup', 'textarea[maxlength], input[maxlength]');
	$context.on('keyup', 'textarea[maxlength], input[maxlength]', function () {
		characterCountdown($vf(this));
	});
	/* END CHARACTER COUNTER */


	/* ELEMENT TO FIELD (or other element) DATA RELATION 
	Clicking on an element with data-field-value attribute set will
	look for a data-field-id attribute containing the id of any
	input. It will first check itself, then its ancestors for the id.
	Once found, it will set the matching input's value to the the 
	data-field-value's attribute.
	*/
	$context.off('click', '[data-field-value]');
	$context.on('click', '[data-field-value]', function () {
		elementToField($vf(this));
	});
	/* END ELEMENT TO FIELD (or other element) RELATION */


	/* DISABLED LINKS 
	If a link has the .disabled class, change href to data-href to prevent hyperlinking and
	bind the custom 'enable' event for ability to enable. Triggering the enable event will
	change data-href back to href and remove the disabled class.
	*/
	$vf('a.disabled[href]', $context).each(function () {
		var $this = $vf(this);
		var href = $this.attr('href');
		$this.removeAttr('href');
		$this.attr('data-href', href);

		$this.off('enable');
		$this.on('enable', function () {
			var $this = $vf(this);
			var href = $this.attr('data-href');
			$this.removeAttr('data-href');
			$this.attr('href', href).removeClass('disabled');
		});
	});

	/* SYNC VALUES
	Looks at [data-sync-value] inputs and syncs matching-named fields' values
	*/
	$context.off('keyup blur', 'input[data-sync-value]');
	$context.on('keyup blur', 'input[data-sync-value]', function () {
		fieldSyncValues($vf(this));
	});


	/* FANCY SELECT DROPDOWN OPTIONS */
	$vf(document).off('mousedown keydown', '.device-desktop select:not([data-no-fancy])');
	$vf(document).on('mousedown keydown', '.device-desktop select:not([data-no-fancy])', function(e) {
		
		// If left mousedown or 'enter' key or 'spacebar' key
		// (note: Chrome is only Windows browser that uses space or enter to activate a select's dropdown,
		//	so adding it here to copy Chrome's behavior.  Firefox does show with spacebar or enter, but will with 
		//  this code.)
		if (e.type === 'mousedown' && e.which === 1 || e.type === 'keydown' && (e.which === 13 || e.which === 32 || (e.altKey && e.which === 38) || (e.altKey && e.which === 40))) {			
			var $select = $vf(this);
			e.preventDefault();
			if ($select.is('[data-fancy-open]')) {
				closeFancyOptions($select)
			} else {
				generateFancyOptions($select);
			}	
		}
	});

	/*
	** Accessibility attributes
	**
	 */
	$vf('[type=search]').attr('role', 'search');
	$vf('[disabled]').attr('aria-disabled', 'true');
	$vf('.disabled').attr('aria-disabled', 'true');
	$vf('.text-success').attr('aria-valid', 'true');
	// $vf('[type=checkbox]').attr('role', 'checkbox');
	// $vf('[type=radio]').attr('role', 'radio');
	$vf('[data-multi-select]').attr('aria-multiselectable', 'true');
	$vf('.switch-wrap').each(function() {
		switchA11y($vf(this));
	});


	$vf(document).trigger('afterFormsInit');
}



// Look for maxlength attribute and update the corresponding data-character-count
// attribute if it exists in the adjacent .form-msg element.
function characterCountdown($field) {
	$field.trigger('beforeCharacterCountdown');
	var max = $field.attr('maxlength');
	var count = $field.val().length;
	var $msg = $field.nextAll('.form-msg').last();
	var $counter = $vf('[data-character-count]', $msg);

	// iterate the character count in .form-msg
	$counter.text(count);

	// Change .form-msg color if max count reached
	if (count >= max) {
		$msg.addClass('text-alert')
	} else {
		$msg.removeClass('text-alert');
	}
	$field.trigger('afterCharacterCountdown');
}


function elementToField($el) {
	$el.trigger('beforeElementToField');
	// get the fieldId for which this value should be placed
	var fieldId;
	if ($el.is('[data-field-id]')) {
		fieldId = $el.data('field-id');
	} else {
		fieldId = $el.closest('[data-field-id]').data('field-id');
	}
	// and the value
	var fieldValue = $el.data('field-value');

	// now insert the value in the associated input/textarea field (or other element).
	if (fieldValue.length > 0 && $vf('#' + fieldId).is('input')) {
		$vf('#' + fieldId).val(fieldValue).addClass('value');
	} else if ($vf('#' + fieldId).is('input')) {
		$vf('#' + fieldId).val(fieldValue).removeClass('value');
	} else {
		$vf('#' + fieldId).text(fieldValue);
	}
	$el.trigger('afterElementToField');
}

function fieldSyncValues($field) {
	var id = $field.attr('data-sync-value');
	var value = $field.val();
	var $syncField = $vf('[data-sync-value="' + id + '"]');

	$field.trigger('beforeFieldSyncValues');
	$syncField.trigger('beforeFieldSyncValues');
	
	$syncField.val(value);
	if ($syncField.val().length > 0) {
		$syncField.addClass('value');
	} else {
		$syncField.removeClass('value');
	}
	if ($field.hasClass('error')) {
		$syncField.addClass('error')
	} else {
		$syncField.removeClass('error');
	}

	$field.trigger('afterFieldSyncValues');
	$syncField.trigger('afterFieldSyncValues');
}

// This function examines the [data-field-icon] of a form field, then generates an extra
// invisible label just before the actual field which contains a pseudo element positioned
// at the right side, inside the field.
// PARAMETER can be the field's ID or a jQuery object containing the field.
function generateFieldIcon(field) {
	var $field;
	if (field instanceof jQuery) {
		$field = field;
	} else if (field) {
		$field = $vf('#'+field);
	}

	$field.trigger('beforeGenerateFieldIcon');

	var id = $field.attr('id');
	var classes = $field.attr('data-field-icon');

	// IF a .field-icon already exists as sibling to the field, replace it. ELSE Create it. 
	if($field.prev('.field-icon').length) {
		$field.prev().attr('class', 'field-icon').addClass(classes);
	} else {
		var html = '<label for="'+ id +'" class="field-icon '+ classes +'"></label>';
		$field.before(html);
	}

	// add .select-box class if $field is <select>
	if ($field.is('select')) {
		$field.prev().addClass('select-box');
	}

	$field.trigger('afterGenerateFieldIcon');
}

// Code that handles flipping the switch element when stuff happens to its hidden input[type=checkbox]
// PARAMETER: must be jQuery object or id of hidden checkbox representing the switch.
function flipSwitch(checkbox) {
	var $checkbox;
	if (checkbox instanceof jQuery) {
		$checkbox = checkbox;
	} else if (checkbox) {
		$checkbox = $vf('#'+checkbox);
	}

	var $switch = $checkbox.closest('.switch-wrap');

	$checkbox.trigger('beforeFlipSwitch');

	if($checkbox.is('.switch-input')) {
		//e.preventDefault();
		if(!$checkbox.is('[disabled]')) {
			if($checkbox.prop('checked')) {
				$checkbox.prop('checked', false);
			} else {
				$checkbox.prop('checked', true);
			}
			$checkbox.focus();
			$checkbox.change();
		}
	}

	switchA11y($switch);

	$checkbox.trigger('afterFlipSwitch');
}

// updates accessibility on the $switch.  The $switch parameter should be a jQuery object representing a single .switch-wrap
function switchA11y($switch) {
	$switch.find('[type=checkbox]').trigger('beforeSwitchA11y');
	
	var checked = $vf('[type=checkbox]', $switch).prop('checked');
	var required = $vf('[type=checkbox]', $switch).is('[required]') ? true : false;
	var disabled = false;
	if ($vf('[type=checkbox]', $switch).is('[disabled], .disabled') || $switch.is('[disabled], .disabled')) {
		disabled = true;
	}
	$switch.attr({
		'role': 'checkbox',
		'aria-checked': checked,
		'aria-required': required,
		'aria-disabled': disabled
	});

	$switch.find('[type=checkbox]').trigger('afterSwitchA11y');
}


/**************************************************************************************
	START: FANCY SELECT DROPDOWN
**************************************************************************************/
// Stylized <select> effect.  Examines the actual <select> element and generates HTML 
// that look all nice and branded.
// PARAMETERS: 
// 		select: jQuery object that is the <select> or ID of the <select>
// 		e: (optional) The event that initiated the function 
function generateFancyOptions(select) {
	var $select;
	if (select instanceof jQuery) {
		$select = select;
	} else if (select) {
		$select = $vf('#'+select);
	}

	$select.trigger('beforeGenerateFancyOptions');

	var dropdownHtml = '';
	var selectId = $select.attr('id');
	var options= [];
	var keyCode = {
		left: 	37,
		up: 	38,
		right: 	39,
		down: 	40,
		tab: 	9,
		enter: 	13,
		shift: 	16, 
		esc: 	27
	}

	// mark select as being open
	$select.attr('data-fancy-open', '')

	/***********
	Create The Options Dropdown
	***********/
	// loop though options, defining its values for text, selected, and disabled.
	$vf('option', $select).each(function(i) {
		var $option = $vf(this);
		var obj = {
			index: i,
			tabIndex: (function() {
				if($select.prop('tabindex')) {
					return $select.prop('tabindex');
				} else {
					return 0;
				}
			})(),
			text: $option.text(),
			selected: (function() {
				if ($option.is(':selected')) {
					return 'selected';
				} else {
					return '';
				}
			})(),
			disabled: (function() {
				if ($option.is(':disabled')) {
					return 'disabled';
				} else {
					return '';
				}
			})()
		};
		options.push(obj);
	}); 

	// create an HTML dropdown
	$vf.each(options, function(i, option) {
		if (option.index === 0) {
			dropdownHtml += '<div class="w_fancy-options" data-select-id='+ selectId +' aria-hidden="false">' +
						'<ul class="fancy-options_list" role="listbox">';
		}
		
		// create the dropdown item
		dropdownHtml += '<li class="fancy-options_item '+ option.selected +'" title="'+ option.text +'" tabindex="-1" role="option" '+ option.disabled +'>' + option.text + '</li>';

		if (option.index === options.length - 1) {
			dropdownHtml += '</div>';
		}
	});
	$vf('body').append(dropdownHtml);	

	// close the dropdown if $select is clicked.
	/***********
	END: Create The Options Dropdown
	***********/

	/***********
	Position $dropdown it in relation to the $select
	***********/
	$dropdown = $vf('.w_fancy-options[data-select-id='+ selectId +']')
	
	var dropdownSpecs = {
		dsFlow: function() {
			
			// Determine if we should open the $dropdown flowing up or flowing down.
			// Default to flow down, but flow up if not enough room, unless there's even 
			// less room to flow up.
			var spacing = $select[0].getBoundingClientRect();
			var winHeight = $vf(window).height();
			var flow = 'down';

			// IF space above > space below and the space below won't fit the dropdown, flow up
			if (spacing.top > (winHeight - spacing.bottom) 
			  && parseInt($vf('.fancy-options_list', $dropdown)[0].scrollHeight) > (winHeight - spacing.bottom)) {
				flow = 'up';
			}
			var obj = {
				flow: flow,
				spacing: spacing,
				winHeight: winHeight
			}
			return obj;
		},
		dsTop: function() {
			var dsFlow = dropdownSpecs.dsFlow();
			var topPos;
			if (dsFlow.flow == 'down') {
				topPos = dsFlow.spacing.bottom;
			} else {
				topPos = dsFlow.spacing.top - dropdownSpecs.dsHeight();
			}

			return topPos;
		},
		dsLeft: function() {
			return dropdownSpecs.dsFlow().spacing.left;
		},
		dsHeight: function () { // the lesser of the scrollHeight or max height
			var scrollHeight = $dropdown[0].scrollHeight;
			var maxHeight = parseInt($dropdown.css('max-height'), 10);
			var dsFlow = dropdownSpecs.dsFlow();
			var availableSpace;
			if (dsFlow.flow == 'up') {
				availableSpace = dsFlow.spacing.top;
				$select.attr('data-fancy-open', 'flow-up');
				$vf('[data-select-id="' + selectId + '"]').addClass('m_flow-up');
			} else {
				availableSpace = dsFlow.winHeight - dsFlow.spacing.bottom;
				$select.attr('data-fancy-open', '')
				$vf('[data-select-id="' + selectId + '"]').removeClass('m_flow-up');
			}

			if (availableSpace < maxHeight || availableSpace < scrollHeight) {
				return availableSpace
			} else if (scrollHeight > maxHeight) {
				return maxHeight;
			} else {
				return scrollHeight;
			}
		},
		dsWidth: $select.outerWidth()
	}

	// set width and positions of $dropdown
	var setDropdownPosition = function() {
		$dropdown.trigger('beforeSetDropdownPosition');

		$dropdown.css({
			top: dropdownSpecs.dsTop(),
			left: dropdownSpecs.dsLeft(),
			'min-width': dropdownSpecs.dsWidth
		}).addClass('active');
		// Setting the height to auto before setting it again allows the list to grow in height as 
		// space becomes available when scrolling down the page. 
		$dropdown.find('.fancy-options_list').css('height', 'auto').css({
			width: dropdownSpecs.dsWidth,
			height: dropdownSpecs.dsHeight()
		});

		$dropdown.trigger('afterSetDropdownPosition')
	}
	setDropdownPosition();
	// Chrome has a display bug where the checkmark pseudo element won't show up unless you 
	// slap it around a bit to wake it up.
	$vf('.selected', $dropdown).hide().show().removeClass('selected').addClass('selected');

	/***********
	END: Position $dropdown it in relation to the $select
	***********/


	/************
	Set and control :focus state
	************/
	// put focus on the selected item of the list
	//console.log($vf('.selected', $dropdown));
	$vf('.selected', $dropdown).focus();
	// set focus on mouseenter event
	$dropdown.on('mousemove', '.fancy-options_item', function() {
		$vf(this).focus();
	});

	// on selection of any .fancy-options_item, change the $select's selected item
	$dropdown.on('mousedown keydown', '.fancy-options_item', function(e) {
		e.preventDefault();
		var $focused = $dropdown.find('.fancy-options_item:focus');
		var changeSelect = function (tab) {
			// get the index of this focused item
			var index = $focused.index();
			$select.prop('selectedIndex', index).addClass('value');
			$vf('.fancy-options_item.selected').removeClass('selected');
			$vf('.fancy-options_item:focus').addClass('selected');
			$select.change();
			closeFancyOptions($select);
			// console.log('closeFancyOptions() A ' + $select.attr('id'));
		}

		if (e.type == 'mousedown') {
			changeSelect();
		} else if (e.type == 'keydown') {
			if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40)) {
				closeFancyOptions($select);
			} else if(e.which == keyCode.enter || e.which ==  keyCode.tab) {
				if(!$focused.is('[disabled]')) {
					changeSelect();
					$select = $vf();
				} else {
					e.stopPropagation();
					return false;
				}
			} else if(e.which == keyCode.down || e.which == keyCode.right) {
				$focused.next().focus();
			} else if (e.which == keyCode.up || e.which == keyCode.left) {
				$focused.prev().focus();
			} else if (e.which == keyCode.esc) {
				closeFancyOptions($select);
			}
			
		}// END else if keydown
	});
	/************
	END: Set and control :focus state
	************/

	/***********
	On certain events, close the options dropdown
	************/
	$vf(window).off('scroll');
	$vf(window).on('scroll', function() {
		// delay to ensure a fading out dropdown gets done fading out first.
		if($dropdown.is('.active')) {
			setDropdownPosition();
		} 
	});

	$vf(window).off('resize orientationchange')
	$vf(window).one('resize orientationchange', function() { 
		if($dropdown.is(':visible')) {
			closeFancyOptions($select);
			$select = $vf();
			// console.log('closeFancyOptions() B ' + $select.attr('id'));
		}
	});
	
	$vf(document).one('mousedown', function(e) {
		var $target = $vf(e.target);
		if($target.is('.fancy-options_list') || $target.is('.fancy-options_item')) {
			e.preventDefault();
			e.stopPropagation();
		} else if ($target != $vf('.fancy-options_list')) {
			e.preventDefault();
			e.stopPropagation();
			closeFancyOptions($select, true);
			// console.log('closeFancyOptions() C ' + $select.attr('id'));
		}
		//$select = $vf();
	});
	/***********
	END: On certain events, close the options dropdown
	************/

	$select.trigger('afterGenerateFancyOptions');
	// console.log('generateFancyOptions() ' + $select.attr('id'));
} // END: generateFancyOptions()

// Close the fancy <select> options that were created in generateFancyOptions
// PARAMETERS: 
// 		select: jQuery object that is the <select> or ID of the <select> to which the options belong
//		preventFocus: optional boolean. If true, it means that the <select> will not receive focus after closing dropdown.
function closeFancyOptions(select, preventFocus) {
	var $select;
	if (select instanceof jQuery) {
		$select = select;
	} else if (select) {
		$select = $vf('#' + select);
	}

	$select.trigger('beforeCloseFancyOptions');

	var selectId = $select.attr('id');
	var $dropdown = $vf('.w_fancy-options[data-select-id='+ selectId +']');
	
	// remove .active to fade out via CSS animation
	$dropdown.removeClass('active');
	// console.log(preventFocus);
	$select.removeAttr('data-fancy-open');
	if(!preventFocus) {
		$select.focus();
	}
	$dropdown.remove();
	$dropdown = $vf();

	$select.trigger('afterCloseFancyOptions');
} // END: closeFancyOptions()

/**************************************************************************************
	END: FANCY SELECT DROPDOWN
**************************************************************************************/



/****************************************************************
	FORMS ACCESSIBILITY (A11y)
*****************************************************************/
function formsA11y(field) {
	var $field;
	if (field instanceof $vf || field instanceof jQuery) {
		$field = field;
	} else if (field) {
		$field = $vf('#' + field);
	}
	var parsleyId = $field.attr('data-parsley-id');
	//
	// Acessibility attributes
	//

	var required = $field.is('[required]') ? true : false;
	// IF checkbox/radio
	if ($field.is('[type=checkbox], [type=radio]')) {
		var type = $field.is('[type=checkbox]') ? 'checkbox' : 'radio';
		var checked = $field.prop('checked');
		$field.next('label').attr({
			'role': type,
			'aria-checked': checked,
			'aria-required': required,
		});
	}
	// ELSE, not checkbox/radio
	else {
		$field.attr({
			'aria-required': required,
		});
	}
	
}
function incrementInit(context) {
	var $context = getContext(context);

	$vf('[data-increment]', $context).each(function() {
		// Create the default or custom state of all the data-increment elments 
		var $this = $vf(this);
		incrementMinMaxCheck($this);
		incrementMessageUpdate($this);
	});

	// when a [data-increment-plus] is clicked
	$context.on('click keypress', '[data-increment-plus]:not(.disabled)', function(e) {
		if(keyClick(e) === true){
			var $increment = $vf(this).closest('[data-increment]');
			incrementPlus($increment);
			incrementMinMaxCheck($increment);
			incrementMessageUpdate($increment);
	 	}
	});

	// when a [data-increment-minus] is clicked
	$context.on('click keypress', '[data-increment-minus]:not(.disabled)', function(e) {
		if(keyClick(e) === true){
			var $increment = $vf(this).closest('[data-increment]');
			incrementMinus($increment);
			incrementMinMaxCheck($increment);
			incrementMessageUpdate($increment);
		}
	});
}


function incrementMessageUpdate($increment) {
	$increment.trigger('beforeIncrementMessageUpdate');
	var increment = $increment.attr('data-increment') || 1;
	var value = $increment.attr('data-increment-value') || 0;
	var message = $vf('[data-increment-message]', $increment).attr('data-increment-message') || '#';

	if (value > 1 || value < 1) {
		message = message.replace('#', value);
		message = message.replace('~', 's');
	} else if (value == 1) {
		message = message.replace('#', value);
		message = message.replace('~', '');
	}

	$vf('[data-increment-message]', $increment).text(message);
	$increment.trigger('afterIncrementMessageUpdate');
}

function incrementMinMaxCheck($increment) {
	$increment.trigger('beforeIncrementMinMaxCheck');
	var min = parseFloat($increment.attr('data-increment-min')) || 0;
	var max = parseFloat($increment.attr('data-increment-max')) || Infinity;
	var value = parseFloat($increment.attr('data-increment-value')) || 0;
	// disabling the minus and plus attribute elements
	if (value <= min) {
		$vf('[data-increment-minus]', $increment).addClass('disabled');
		$increment.attr('data-increment-value', min);
	} 
	if (value >= max) {
		$vf('[data-increment-plus]', $increment).addClass('disabled');
		$increment.attr('data-increment-value', max);
	} 

	// enabling the minus and plus attribute elements
	if(value < max) {
		$vf('[data-increment-plus]', $increment).removeClass('disabled');
	}
	if(value > min) {
		$vf('[data-increment-minus]', $increment).removeClass('disabled');
	}
	$increment.trigger('afterIncrementMinMaxCheck');
}

function incrementPlus($increment) {
	$increment.trigger('beforeIncrementPlus');
	var currentVal = parseFloat($increment.attr('data-increment-value'));
	var increment = parseFloat($increment.attr('data-increment')) || 1;
	var newVal = currentVal + increment;
	$increment.attr('data-increment-value', newVal);
	$increment.trigger('afterIncrementPlus');
}

function incrementMinus($increment) {
	$increment.trigger('beforeIncrementMinus');
	var currentVal = parseFloat($increment.attr('data-increment-value'));
	var increment = parseFloat($increment.attr('data-increment')) || 1;
	var newVal = parseFloat(currentVal - increment);
	$increment.attr('data-increment-value', newVal);
	$increment.trigger('afterIncrementMinus');
}


// Allows for horizontal scrolling via dragging either with mouse or with touch. 
// Prevents click events from being fired if dragging occurs so that clicks don't happen
// when the user really only wants to scroll.
function xScrollInit(context) {
	var $context = getContext(context);
	var clicked,
		clickedX,
		elementLeft,
		newX;

	$vf('[data-xscroll]').children().css({
		'display': 'inline-block',
		'float': 'none'
	});

	$context.off('mousedown', '[data-xscroll]');
	$context.on('mousedown', '[data-xscroll]', function(e){
		e.preventDefault();
		var $clickedElement = $vf(e.target);
		if ($clickedElement.parents('[data-xscroll]').length) {
			e.preventDefault();
	 		clicked		= true;
	 		clickedX	= e.pageX;
	 		elementLeft = $vf(this).scrollLeft();
		}
	});

	$context.off('mousemove', '[data-xscroll]');
	$context.on('mousemove', '[data-xscroll]', function(e){
		if (clicked) {
			newX = e.pageX;
 			$vf(this).scrollLeft(elementLeft - newX + clickedX);
 		}
	});

	$context.off('mouseup click', '[data-xscroll]');
	$context.on('mouseup click', '[data-xscroll]', function(e){
		clicked = false;
		if (Math.abs(newX - clickedX) > 15) {
			return false;
		}
	});
}

function revealInit(context) {
	var $context = getContext(context);

	// sets hidden [data-reveal-content] elements up with correct inline style values.
	$vf('[data-reveal-content].hide', $context).each(function() {
		$vf(this).css('display', 'none');
		revealHide($vf(this));
	});

	$vf(document).off('change', 'input[data-reveal-trigger], select[data-reveal-select]');
	$vf(document).on('change', 'input[data-reveal-trigger], select[data-reveal-select]', function() {
		updateReveal($vf(this));

	});

	$vf(document).off('click keypress', '[data-reveal-trigger]:not(input, label)');
	$vf(document).on('click keypress', '[data-reveal-trigger]:not(input, label)', function (e) {
		if(keyClick(e) === true){
			updateReveal($vf(this));
		}
	});

	/*
	** accessibility attributes
	**
	 */
	//$vf('[data-reveal-trigger]').attr({ 'aria-expanded': 'false', 'tabindex': '0' });
	$vf('[data-reveal-content]').attr('aria-hidden', 'true');
	$vf('[data-reveal-content]').prop('hidden', true);
	$vf('[data-reveal-trigger]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr('aria-expanded', 'false');
	});
}


function updateReveal($trigger) {
	$trigger.trigger('beforeUpdateReveal');
	$trigger.trigger('beforeRevealUpdate'); // adding for future compatibility (I expect this function name to be changed one day)



	function getContent($triggerEl) {
		
		// Create array of all content ids to be opened as indicated by [data-reveal-trigger]
		var idArray = $triggerEl.attr('data-reveal-trigger').split(' ');

		// create a variable that will hold all the content nodes
		var $content = $vf();
		// remove white space in between trigger content ids and pipe characters
		// loop through array, removing white space from array elements, then using the
		// trimmed array value to identify the content nodes to extend/add to $content
		for (var i=0; i < idArray.length; i++) {
			var id = idArray[i] = idArray[i].trim();
			// the ~= selects the element if it contains the id anywhere in the space delemited list
			$content = $content.add('[data-reveal-content~="'+ id + '"]');

			// check any matching [type="checkbox"][data-reveal-trigger].  Do reverse for [data-reveal-rev]
			var $matchingTrigger = $vf('[type=checkbox][data-reveal-trigger~="'+ id +'"]').not($triggerEl);
			var isTriggerChecked = $triggerEl.prop('checked');
			if ($matchingTrigger.is('[data-reveal-rev]')) {
				$matchingTrigger.prop('checked', !isTriggerChecked);
			} else {
				$matchingTrigger.prop('checked', isTriggerChecked);
			}
		}
		return $content;
	}

	// just like getContent, but with the idArray looking at [data-reveal-hide] instead of [data-reveal-trigger]
	function getHideContent($triggerEl) {
		// Create array of all content ids to be opened as indicated by [data-reveal-trigger]
		if ($triggerEl.is('[data-reveal-hide]')) {
			var idArray = $triggerEl.attr('data-reveal-hide').split(' ');

			var $content = $vf();

			for (var i=0; i < idArray.length; i++) {
				var id = idArray[i] = idArray[i].trim();
				// the ~= selects the element if it contains the id anywhere in the space delemited list
				$content = $content.add('[data-reveal-content~="'+ id + '"]');

				// check any matching [type="checkbox"][data-reveal-trigger].  Do reverse for [data-reveal-rev]
				var $matchingTrigger = $vf('[type=checkbox][data-reveal-trigger~="'+ id +'"]').not($triggerEl);
				var isTriggerChecked = $triggerEl.prop('checked');
				if ($matchingTrigger.is('[data-reveal-rev]')) {
					$matchingTrigger.prop('checked', isTriggerChecked);
				} else {
					$matchingTrigger.prop('checked', !isTriggerChecked);
				}
			}
			
			return $content;
		} else {
			return false;
		}
	}

	// checkbox
	if ($trigger.is('[type=checkbox]')) {
		var $content = getContent($trigger);

		// This function to run after revealHide or revealShow with checkboxes.
		// make array of all checkbox trigger names, then compare to matching content areas' .hide states.
		// Basically, makes many-to-many checkbox reveals behave with "AND" logic to determine checked state.
		var catchAllCheckboxUpdate = function () {
			var revealNames = [];
			var $triggers = $vf('[type=checkbox][data-reveal-trigger]');
			$triggers.each(function () {
				var $thisTrigger = $vf(this);
				var thisNames = $thisTrigger.attr('data-reveal-trigger').trim().split(' ');
				var checked = true;
				$vf.each(thisNames, function (index, value) {
					// IF content is hidden and not a reverse trigger
					if ($vf('[data-reveal-content="' + value + '"]').is('.hide') && !$thisTrigger.is('[data-reveal-rev]')) {
						checked = false;
					}
						// ELSE IF content is visible and IS a reverse trigger
					else if (!$vf('[data-reveal-content="' + value + '"]').is('.hide') && $thisTrigger.is('[data-reveal-rev]')) {
						checked = false;
					}
				});

				$thisTrigger.prop('checked', checked);
			});
		}

		if ($trigger.is('[data-reveal-rev]')) {
			// reversed: hide on checked. show on unchecked
			if ($trigger.prop('checked')) {
				$trigger.attr('aria-expanded', 'false');
				revealHide($content);
			} else {
				$trigger.attr('aria-expanded', 'true');
				revealShow($content);
			}
		} else {
			if ($trigger.prop('checked')) {
				$trigger.attr('aria-expanded', 'true');
				revealShow($content);
			} else {
				$trigger.attr('aria-expanded', 'false');
				revealHide($content);
			}
		}
		catchAllCheckboxUpdate();

	// radio button
	} else if ($trigger.is('[type=radio]')) {
		// get a collection of $content to show and $hide content to hide
		var groupName = $trigger.attr('name');
		var $group = $vf('input[name=' + groupName + '][data-reveal-trigger]');
		var $checked = $vf('input[name=' + groupName + '][data-reveal-trigger]:checked');
		var $content = getContent($checked);
		var $unChecked = $group.not($checked);
		var $hideContent = $vf();
		$unChecked.each(function() {
			$hideContent = $hideContent.add(getContent($vf(this)));
		});

		// Now hide it or show it based on precense of [data-reveal-rev]
		if($checked.is('[data-reveal-rev]')) {
			$checked.attr('aria-expanded', 'true');
			$unChecked.each(function() {
				$vf(this).attr('aria-expanded', 'false');
			});
			revealHide($content);
			revealShow($hideContent);
		} else {
			$checked.attr('aria-expanded', 'true');
			$unChecked.each(function() {
				$vf(this).attr('aria-expanded', 'false');
			});
			revealHide($hideContent);
			revealShow($content);
		}
	// <select> box (behaves similar to radio button)
	} else if ($trigger.is('[data-reveal-select]')) {
		// get a collection of $content to show and $hideContent to hide.
		var $selected = $vf('option:selected', $trigger);
		var $content = getContent($selected);
		var $unSelected = $selected.siblings('[data-reveal-trigger]');
		var $hideContent = $vf();
		$unSelected.each(function() {
			$hideContent = $hideContent.add(getContent($vf(this)));
		});

		// Now hide it or show it based on precense of [data-reveal-rev]
		if($selected.is('[data-reveal-rev]')) {
			$selected.attr('aria-expanded', 'true');
			$unSelected.attr('aria-expanded', 'false');
			revealHide($content);
			revealShow($hideContent);
		} else {
			$selected.attr('aria-expanded', 'true');
			$unSelected.attr('aria-expanded', 'false');
			revealHide($hideContent);
			revealShow($content);
		}
		// grouped triggers
	} else if ($trigger.is('[data-reveal-group]')) {
		var groupName = $trigger.attr('data-reveal-group');
		var showContentId = $trigger.attr('data-reveal-trigger');
		var $showContent = $vf('[data-reveal-content=' + showContentId + ']');
		var $triggerGroup = $vf('[data-reveal-group=' + groupName + ']').not($trigger);

		// show the content of the clicked trigger of the group, unless it's currently shown, 
		// in which case we hide the content and open nothing.
		if (!$showContent.is('.hide')) {
			$trigger.attr('aria-expanded', 'true');
			revealHide($showContent);
		} else {
			$trigger.attr('aria-expanded', 'true');
			revealShow($showContent);
		}

		// hide content of the group that is not the clicked trigger's group
		$triggerGroup.each(function () {
			var $this = $vf(this);
			var $contentToHide = $vf('[data-reveal-content=' + $this.attr('data-reveal-trigger') + ']')
			// *** TOGGLE-CLASS SUPPORT ***
			// IF $contentToHide not yet hidden, then it's going to, and if it has a data-reveal-toggle-class, we need to toggle the class too.
			if(!$contentToHide.is(':hidden') && $this.is('[data-reveal-toggle-class]')) {
				var toggleClassName = $this.attr('data-reveal-toggle-class');
				$this.toggleClass(toggleClassName);
			}
			// *** ALT-TEXT SUPPORT ***
			if(!$contentToHide.is(':hidden') && $this.is('[data-reveal-alt-text]')) {
				var altText = $this.attr('data-reveal-alt-text');
				var originalText = $this.text();
				$this.text(altText);
				$this.attr('data-reveal-alt-text', originalText);
			}
			$trigger.attr('aria-expanded', 'false');
			revealHide($contentToHide);
		});
	// other element
	} else {
		var $content = getContent($trigger);
		var $hideContent = getHideContent($trigger);
		$content.each(function() {
			if ($vf(this).hasClass('hide')) {
				$trigger.attr('aria-expanded', 'true');
				revealShow($vf(this));
			} else {
				$trigger.attr('aria-expanded', 'false');
				revealHide($vf(this));
			}
		});

		if($hideContent) {
			$trigger.attr('aria-expanded', 'false');
			$hideContent.each(function() {
				revealHide($vf(this));
			});
		}
	}

	// *** Check for swap-text ***
	// swap alt and actual text of $trigger element
	if($trigger.is('[data-reveal-alt-text]')) {
		// var $content = getContent($trigger);
		// var $hideContent = getHideContent($trigger);
		var altText = $trigger.attr('data-reveal-alt-text');
		var originalText = $trigger.text();
		$trigger.text(altText);
		$trigger.attr('data-reveal-alt-text', originalText);
	}

	// *** Check for swap-html ***
	// check for swapping content of trigger element
	if($trigger.is('[data-reveal-swap-html]')) {
		$vf('[data-reveal-html]').each(function() {
			$vf(this).slideToggle()
		});
	}

	// *** Check for toggle-class ***
	// check for swapping of trigger class names for extra style hooks
	if($trigger.is('[data-reveal-toggle-class]')) {
		var toggleClassName = $trigger.attr('data-reveal-toggle-class');
		$trigger.toggleClass(toggleClassName);
	}

	$trigger.trigger('afterUpdateReveal');
	$trigger.trigger('afterRevealUpdate'); // adding for future compatibility (I expect this function name to be changed one day)
}


/*
 * $content in both revealShow() and revealHide() should contain 1 or more 
 * content areas, so loop through it to show/hide each content area.
 * 		$content: jQuery object containing all the content areas (1 or more) to be hidden
 */
function revealShow($content) {
	$content.each(function() {
		var $this = $vf(this);
		var speed = 300;
		var speedData = parseInt($this.attr('data-reveal-speed'), 10);
		if ($this.is('[data-reveal-speed]') && speedData % 1 === 0) {
			speed = speedData;
		}
		// set the Transition property of $this content
		$this[0].style.transition="opacity " + speed + "ms";
		$this[0].style.webkitTransition="opacity " + speed + "ms";
		$this.trigger('beforeRevealShow');
		$this.slideDown(speed);
		$this.removeClass('hide');
		$this.attr('aria-hidden', 'false');
		$this.prop('hidden', false);
		$this.trigger('afterRevealShow');
	});
}

function revealHide($content) {
	$content.each(function() {
		var $this = $vf(this);
		var speed = 300;
		var speedData = parseInt($this.attr('data-reveal-speed'), 10);
		if ($this.is('[data-reveal-speed]') && speedData % 1 === 0) {
			speed = speedData;
		}
		// set the Transition property of $this content
		$this[0].style.transition="opacity " + speed + "ms";
		$this[0].style.webkitTransition="opacity " + speed + "ms";
		$this.trigger('beforeRevealHide');
		$this.addClass('hide').slideUp(speed);
		$this.attr('aria-hidden', 'true');
		$this.prop('hidden', true);
		$this.trigger('afterRevealHide');
	});
}


// Allows things to stick in place (fixed position) while scrolling. 
// See the Sticky-Kit jQuery plugin docs site: http://leafo.net/sticky-kit/
function stickyInit(context) {
	var $context = getContext(context);
	stickyKit($context);
	
}

function stickyKit($context) {
	$vf('[data-sticky]', $context).each(function(e) {
		var $this = $vf(this);
		$this.trigger('beforeStickyKit');
		var customOptionsText = {};
		var customOptions = {};
		// get options from data-sticky.
		if ($this.attr('data-sticky').length) {
			customOptionsText = $this.attr('data-sticky');
			customOptions = JSON.parse(customOptionsText);
		}

		var $potentialParent = $this.closest('[data-sticky-parent]');
	 	
		// Determine the `parent` element. Take options value passed
		// or use the sticky element's bottom margin plus sticky-to bottom padding.
	 	var $parent;
	 	if ("parent" in customOptions) {
	 		$parent = $vf(customOptions.parent);
	 	} else if ($potentialParent.length) {
			$parent = $potentialParent;
		} else {
			$parent = $this.parent();
		}

		// set some VZRF defaults
		var options = {
			"parent": $parent	
		}

		// gather a few vars for later use
		var originalZ = parseInt($this.css('z-index'), 10);
		var originalStyles = $this.attr('style');

		// extend the default options with VZRF's customOptions
		$vf.extend(options, customOptions);
		// initialize the sticky-kit plugin with updated options
		$this.stick_in_parent(options);
		
		// Set up several event functions for doing VZRF additions to the sticky-kit						
		$this.on('sticky_kit:stick sticky_kit:unbottom', function() {
			// add_class
			if("add_class" in customOptions) {
				$this.addClass(customOptions.add_class);
			}
			
			// remove_class
			if("remove_class" in customOptions) {
				$this.removeClass(customOptions.remove_class);
			}
			
			// z_index
			if ("z_index" in customOptions) {
				$this.css('z-index', customOptions.z_index);
			} else if (originalZ < 1) {
				$this.css('z-index', 1);
			} else {
				$this.css('z-index', originalZ)	
			}

		});

		$this.on('sticky_kit:unstick sticky_kit:bottom', function() {
			// add_class
			if("add_class" in customOptions) {
				$this.removeClass(customOptions.add_class);
			}
			
			// remove_class
			if("remove_class" in customOptions) {
				$this.addClass(customOptions.remove_class);
			}

		});
		
		$this.on('sticky_kit:unstick', function() {
			$this.attr('style', originalStyles);
		});

		// END custom VZRF options 
		/////////////////////////////////////////////////////////////////
		$this.trigger('afterStickyKit');
	});
}


// $vf(document).on('sticky_kit:unstick', function() {
// 	console.log('sticky_kit:unstick fired');
// });
// $vf(document).on('sticky_kit:bottom', function() {
// 	console.log('sticky_kit:bottom fired');
// });
// $vf(document).on('sticky_kit:stick', function() {
// 	console.log('sticky_kit:stick fired');
// });
// $vf(document).on('sticky_kit:unbottom', function() {
// 	console.log('sticky_kit:unbottom fired');
// });
/* DATEPICKER
See http://api.jqueryui.com/datepicker/ for complete API.
*/
var datepickerGlobalOptions = {
	showAnim: "fadeIn",
	hideIfNoPrevNext: true,
	dateFormat: "mm/dd/y",
	dayNamesMin: [ "S", "M", "T", "W", "T", "F", "S" ],
	showOtherMonths: true,
	selectOtherMonths: true,
	onClose: function(input, inst) {
		var $inst = inst.dpDiv;
		$inst.attr('aria-hidden', true).prop('hidden' ,true);
	},
	onSelect: function() {
		var date = $vf(this).datepicker('getDate');
		var prettyDate = $vf.datepicker.formatDate('m/dd/yy', date);
		// check markup for linking selection to a field or element
		if($vf(this).closest('[data-field-id]').length > 0) {
			var fieldId = $vf(this).closest('[data-field-id]').data('field-id');
			var $field = $vf('#' + fieldId);
			if ($field.is('input, textarea')) {
				$field.val(prettyDate).addClass('value');
				if (typeof Parsley == 'function') { 
					$vf('#' + fieldId).parsley().validate(); 
				}
			} else {
				$field.text(prettyDate);
			}
		}

		if ($vf(this).is('input, textarea')) {
			$vf(this).addClass('value');
		}
	}
}


function datepickerInit(context) {
	var $context = getContext(context);
	// set datepicker defaults
	$vf.datepicker.setDefaults(datepickerGlobalOptions);
}


/*
 * Keycode Reference
 * BACKSPACE: 8	 * COMMA: 188	 * DELETE: 46 	 * DOWN: 40
 * END: 35 		 * ENTER: 13	 * ESCAPE: 27 	 * HOME: 36
 * LEFT: 37 	 * PAGE_DOWN: 34 * PAGE_UP: 33	 * PERIOD: 190 
 * RIGHT: 39	 * SPACE: 32 	 * SHIFT: 16	 * TAB: 9
 * UP: 38
 */


// Extend datepicker's _doKeyDown function to remap keys to NOT require pressing Ctrl as Ctrl+
// in some browsers change browser tabs. Also just pressing keys without Ctrl+ seems more intuitive.
// Also extended the tab keydown behavior to rotate between month changing arrows and table/calendar area.
$vf.extend($vf.datepicker, {
	/* Handle keystrokes. */
	_doKeyDown: function (event) {
		var onSelect, dateStr, sel,
			inst = $vf.datepicker._getInst(event.target),
			handled = true,
			isRTL = inst.dpDiv.is(".ui-datepicker-rtl");

		inst._keyEvent = true;
		if ($vf.datepicker._datepickerShowing) {
			switch (event.keyCode) {
				case 9: $vf.datepicker._hideDatepicker();
					handled = false;
					break; // hide on tab out
				case 13: sel = $vf("td." + $vf.datepicker._dayOverClass + ":not(." +
									$vf.datepicker._currentClass + ")", inst.dpDiv);
					if (sel[0]) {
						$vf.datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
					}

					onSelect = $vf.datepicker._get(inst, "onSelect");
					if (onSelect) {
						dateStr = $vf.datepicker._formatDate(inst);

						// trigger custom callback
						onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
					} else {
						$vf.datepicker._hideDatepicker();
					}

					return false; // don't submit the form
				case 27: $vf.datepicker._hideDatepicker();
					break; // hide on escape
				case 33: $vf.datepicker._adjustDate(event.target, (event || event.ctrlKey ?
							-$vf.datepicker._get(inst, "stepBigMonths") :
							-$vf.datepicker._get(inst, "stepMonths")), "M");
					break; // previous month/year on page up/+ ctrl
				case 34: $vf.datepicker._adjustDate(event.target, (event || event.ctrlKey ?
							+$vf.datepicker._get(inst, "stepBigMonths") :
							+$vf.datepicker._get(inst, "stepMonths")), "M");
					break; // next month/year on page down/+ ctrl
				case 35: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._clearDate(event.target);
				}
					handled = event || event.ctrlKey || event.metaKey;
					break; // clear on ctrl or command +end
				case 36: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._gotoToday(event.target);
				}
					handled = event || event.ctrlKey || event.metaKey;
					break; // current on ctrl or command +home
				case 37: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._adjustDate(event.target, (isRTL ? +1 : -1), "D");
				}
					handled = event || event.ctrlKey || event.metaKey;
					// -1 day on ctrl or command +left
					if (event.originalEvent.altKey) {
						$vf.datepicker._adjustDate(event.target, (event || event.ctrlKey ?
							-$vf.datepicker._get(inst, "stepBigMonths") :
							-$vf.datepicker._get(inst, "stepMonths")), "M");
					}
					// next month/year on alt +left on Mac
					break;
				case 38: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._adjustDate(event.target, -7, "D");
				}
					handled = event || event.ctrlKey || event.metaKey;
					break; // -1 week on ctrl or command +up
				case 39: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._adjustDate(event.target, (isRTL ? -1 : +1), "D");
				}
					handled = event || event.ctrlKey || event.metaKey;
					// +1 day on ctrl or command +right
					if (event.originalEvent.altKey) {
						$vf.datepicker._adjustDate(event.target, (event || event.ctrlKey ?
							+$vf.datepicker._get(inst, "stepBigMonths") :
							+$vf.datepicker._get(inst, "stepMonths")), "M");
					}
					// next month/year on alt +right
					break;
				case 40: if (event || event.ctrlKey || event.metaKey) {
					$vf.datepicker._adjustDate(event.target, +7, "D");
				}
					handled = event || event.ctrlKey || event.metaKey;
					break; // +1 week on ctrl or command +down
				default: handled = false;
			}
		} else if (event.keyCode === 36 && event || event.ctrlKey) { // display the date picker on ctrl+home
			$vf.datepicker._showDatepicker(this);
		} else {
			handled = false;
		}

		if (handled) {
			event.preventDefault();
			event.stopPropagation();
		}
	}
});


$vf.extend($vf.datepicker, {
    _generateHTML_original: $vf.datepicker._generateHTML,
    _generateHTML: function (inst) {
        var $html = $vf(this._generateHTML_original(inst));
        var $inst = inst.dpDiv;
		$inst.attr('aria-hidden', false).prop('hidden' ,false);
		setTimeout(function () {
			$vf('.ui-datepicker', $inst).attr('aria-hidden', 'true').prop('hidden' ,true);
			$vf('.ui-datepicker-month', $inst).attr('aria-label', 'month');
			$vf('.ui-datepicker-year', $inst).attr('aria-label', 'year');
			$vf('.ui-datepicker-calendar', $inst).attr({ 'role': 'grid', 'aria-label': 'month year' });
			$vf('.ui-datepicker-prev', $inst).attr({ 'aria-label': 'previous'});
			$vf('.ui-datepicker-next', $inst).attr({ 'aria-label': 'next'});
		}, 100);
        return $html;
    }
});

function dropListInit(context) {
	var $context = getContext(context);

	// show the drop list on clicking of the drop list button (icon)
	$context.off('click keydown', '[data-drop-list]:not(.disabled):not(.active) [data-drop-list-button]');
	$context.on('click keydown', '[data-drop-list]:not(.disabled):not(.active) [data-drop-list-button]', function (e) {
		if(keyClick(e) === true){
			var $dropList = $vf(this).closest('[data-drop-list]');
			showDropList($dropList);
		} 
		else {

		}
	});

	// hide on click of list item
	$context.off('click keydown', '[data-drop-list] .drop-list_list > [tabindex=-1]:not([data-has-tabs])');
	$context.on('click keydown', '[data-drop-list] .drop-list_list > [tabindex=-1]:not([data-has-tabs])', function (e) {
		if(keyClick(e) === true){
			var $target = $vf(e.target);
			if (!$target.is('input, textarea, select, [data-has-tabs]')) {
				var $dropList = $vf(this).closest('[data-drop-list]');
				hideDropList($dropList);
			} 
		}
	});

	// For selectable version, hide on click of list item and update choice
	// COMPATIBILITY NOTE: .drop-list_choices is old way. As of 2.18.0 use [data-drop-list-select]
	$context.off('click keydown', '[data-drop-list-choices] > .drop-list_choice, [data-drop-list-select] > [tabindex=-1]');
	$context.on('click keydown','[data-drop-list-choices] > .drop-list_choice, [data-drop-list-select] > [tabindex=-1]', function (e) {
		if(keyClick(e) === true){
			var $target = $vf(e.target);
			if (!$target.is('input, textarea, select, [data-has-tabs]')) {
				e.preventDefault();
				var $this = $vf(this);
				$this.siblings().removeClass('active').attr('aria-checked', false);
				$this.addClass('active').attr('aria-checked', true);
			} 
		}
	});

	// hide on mouseout of of list 
	$context.off('mouseleave', '[data-drop-list]');
	$context.on('mouseleave', '[data-drop-list]', function() {
		var $this = $vf(this);
		var timeout = setTimeout(function () {
			if($this.is('.active')) {
			hideDropList($this);
			} else {
				clearTimeout(timeout);
			}
		}, 300);

		$this.on('mouseenter', function () {
			clearTimeout(timeout);
		});
	});

	// hide on re-click of .active drop list button
	$context.off('click keydown', '[data-drop-list].active [data-drop-list-button]');
	$context.on('click keydown', '[data-drop-list].active [data-drop-list-button]', function (e) {
		if(keyClick(e) === true){
			var $dropList = $vf(this).closest('[data-drop-list]');
			hideDropList($dropList);
		}
	});

	// hide on click of .page-overlay or .nested-overlay
	$context.off('click keydown', '.page-overlay.droplist, .nested-overlay');
	$context.on('click keydown', '.page-overlay.droplist, .nested-overlay', function (e) {
		if(keyClick(e) === true){
			var $dropList = $vf('[data-drop-list].active');
			if ($dropList.length) {
				hideDropList($dropList);
			}
		}
	});
	
	
	//
	// These two listeners make setDropListHeight() run when a Drop List opens or closes.
	// setDropListHeight() makes sure that the drop list becomes scrollable if the dropped contents
	// falls below the viewport when its opened.
	$context.on('afterShowDropList', '[data-drop-list]', function () {
		setDropListHeight($vf(this));
	});
	$context.on('afterHideDropList', '[data-drop-list]', function () {
		setDropListHeight($vf(this), true);
	});

	/*
	**  accessibility attributes
	**
	 */
	$vf('[data-drop-list-button]').each(function() {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		} 

		$this.attr('aria-listbox', true);
	});
	$vf('.drop-list_list > li, .drop-list_list > a, .drop-list_list > span, .drop-list_list > div').attr({
		'role': 'option',
		'tabindex': -1
	});
	$vf('.drop-list_list').prop('hidden',true);
	$vf('[data-drop-list-select] > .active').attr('aria-checked', true);
	$vf('[data-drop-list]').attr({ 'role': 'combobox' });

	/*
	*
	*	Keyboard bindings
	*  e.which reference:
	* end: 		35		 * home: 	36		 * left: 	37		 
	* up: 		38		 * right: 	39		 * down: 	40
	* esc: 		27		 * tab: 	9		 * space: 	32
	* enter: 	13 	
	*/

	// Key bindings for the Drop List activating Button/Icon
	$context.off('keydown', '.active > [data-drop-list-button]')
	$context.on('keydown', '.active > [data-drop-list-button]', function(e) {
		var $button = $vf(this);
		var $dropList = $button.closest('[data-drop-list]');
		var $list = $vf('.drop-list_list', $dropList);
		var code = e.which;

		// NOTE: the `space` and `enter` keyCodes are already taken care of in the 
		// keyClick event in an above listener.

		// only do if $dropList is .active
		if ($dropList.is('.active')) {
			// IF `esc` or `tab`
			if (code === 27 || code === 9) {
				e.preventDefault();
				hideDropList($dropList);
			}
			// ELSE IF any arrow keys or `home` key, put focus on first item
			else if ((code >= 36 && code <=40)) {
				e.preventDefault();
				$vf('[tabindex=-1]', $dropList).first().focus();
			}
			// ELSE IF `end`, put focus on last item
			else if (code === 35) {
				e.preventDefault();
				$vf('[tabindex=-1]', $dropList).last().focus();
			}
		}
	});

	// Key bindings for the Drop List's list items events
	$context.on('keydown', '.drop-list_list > [tabindex=-1]', function(e) {
		var $item = $vf(this);
		var $dropList = $item.closest('[data-drop-list]');
		var $listItems = $vf('.drop-list_list > [tabindex=-1]', $dropList);
		var code = e.which;

		// NOTE: the `space` and `enter` keyCodes are already taken care of in the 
		// keyClick event in an above listener.

		// only do if $dropList is .active
		if ($dropList.is('.active')) {
			
			// only do if focus is NOT inside a [data-has-tabs] item
			if($vf('[data-has-tabs] [tabindex=0]:focus').length < 1) {
				// IF `home`, go to first item
				if (code === 36) {
					e.preventDefault();
					$listItems.first().focus();
				}
				// ELSE IF `end`, go to last item
				else if (code === 35) {
					e.preventDefault();
					$listItems.last().focus();
				}
				// ELSE IF `right` or `down`, go to next item unless already last item
				else if(code === 39 || code === 40) {
					e.preventDefault();
					if (!$item.is(':last-child')) {
						$item.next().focus();
					}
				}
				// ELSE IF `left` or `up`, go to previous item, unless already at first item
				else if(code === 38 || code === 37) {
					e.preventDefault();
					if(!$item.is(':first-child')) {
						$item.prev().focus();
					}
				}
				// ELSE IF `esc` or (`tab` and $item is not [data-has-tabs], close the widget
				else if (code === 27 || ( code === 9 && !$item.is('[data-has-tabs]') )) {
					e.preventDefault();
					hideDropList($dropList);
				}
			}// end NOT [data-has-tabs] [tabindex=0]:focus

			// IF $item is [data-has-tabs] and `tab` or `enter`, put focus on first nested tabindex=0
			if ($item.is('[data-has-tabs]') && e.target == e.currentTarget && ( code === 9 || code === 13 )) {
				e.preventDefault();
				$vf('[tabindex=0]', $item).first().focus();
			}
			// ELSE IF $item is [data-has-tabs] and focus is inside, loop the so that if natural tabbing puts 
			// focus on the next drop list item, it immedately gets refocused back tothe first tabindex=0 inside the 
			// [data-has-tabs].  
			else if ($item.is('[data-has-tabs]') && code === 9) {
				// Wait an instant and see if focus ends up ouside of [data-has-tabs]. 
				// If so, put focus back on the [data-has-tabs] item.
				setTimeout(function() {
					if ($vf(':focus').closest('[data-has-tabs]').length === 0) {
						$item.focus();
					}
				}, 1);
			}
			// ELSE IF `esc` exit the inner [data-has-tabs] and put focus back on $item
			else if ($item.is('[data-has-tabs]') && code === 27) {
				$item.focus();
			}

		}// end IF $dropList.is('.active')
	});
}


function showDropList ($dropList) {
	$dropList.trigger('beforeShowDropList');
	saveFocus();
	$vf('.drop-list_list', $dropList).prop('hidden',false);
	$dropList.addClass('active');
	// See if this $dropList exists within a modal to determine if
	// there will will be need for one or more .nested-overlay elements within the modal.
	if ($dropList.closest('[data-modal]').length > 0) {
		// create an overlay for each of modal head, content, and footer.
		var $modal = $dropList.closest('[data-modal]');
		var $modalDivisions = $vf('[data-modal-header], [data-modal-content], [data-modal-footer]', $modal);
		$modalDivisions.each(function() {
			$vf(this).append('<div class="nested-overlay" />');
		});
		$vf('.nested-overlay', $modal).addClass('active invisible droplist');
	} 
	// Else not in a modal, so use .page-overlay
	else {
		// create overlay div if not already existing
		if ($vf('.page-overlay').length < 1) {
			$vf('body').append('<div class="page-overlay"></div>');
		}
		var $overlay = $vf('.page-overlay');
		// move to .main or .page.active if exists
		if ($dropList.closest('.main').length) {
			$overlay.appendTo($dropList.closest('.main'));
		} else if ($vf('.page.active').length) {
			$overlay.appendTo('.page.active');
		}
		$vf('.page-overlay').addClass('active invisible droplist');
	}
	//console.log($vf('.drop-list_list', $dropList));
	$vf(window).on('orientationchange', function() {
		hideDropList($dropList);
	});
	
	$dropList.trigger('afterShowDropList');
}

function hideDropList($dropList) {
	$dropList.trigger('beforeHideDropList');
	// save the height of the .drop-list_list so that you can see the fade out. Then remove height.
	var $theList = $vf('.drop-list_list', $dropList);
	var height = $theList.outerHeight();
	$theList.css('height', height);

	// Now that the height is temporarily forced-set, remove .active
	$dropList.removeClass('active');

	$vf(':focus').blur();
	
	// Figure out what overlay belongs with this drop list.  
	// It will either be a page level .page-overlay or one or more
	// .nested-overlay(s) in a modal
	var $overlay;
	if ($dropList.closest('[data-modal]').length > 0) {
		$overlay = $dropList.closest('[data-modal]').find('.nested-overlay');
		$overlay.removeClass('active invisible droplist');
		// leave time for any animation
		setTimeout(function() {
			// always removes from DOM
			$overlay.remove(); 
		}, 250);
	} else {
		$overlay = $vf('.page-overlay');
		$overlay.removeClass('active invisible droplist');
		setTimeout(function() {
			$overlay.appendTo('body');
		}, 250);
	}

	// Delay to wait for end of fade out then reset any applied inline height style
	setTimeout(function () {
		$theList[0].style.height = '';
	}, 300);

	resetFocus();
	$vf('.drop-list_list', $dropList).prop('hidden',true);
	$vf(window).off('orientationchange');

	$dropList.trigger('afterHideDropList');
}

/*	This is a refactored copy from the standard VZRF filter-bar.js function called setChoiceListHeight().
	It's been added and modified here to duplicate it's purpose for a Drop List Widget's list, which will
	allow the list to scroll within itself when there is not enough room on the screen to show the whole list.
	-- Parameters --
	$dropListWidget: the jQuery element that is the actual Drop List wrapping element [data-drop-list]
	close: (optional boolean) if set to true, it means you're closing the options, so reset any height
		styles that may have been set.
*/
function setDropListHeight($dropListWidget, close) {
	// if this $dropListWidget doesn't have a [data-drop-list-scroll] attribute on it's dropped list, then 
	// just ignore and exit the function.
	if(!$dropListWidget.find('[data-drop-list-scroll]').length) {
		return false;
	}

	$dropListWidget.trigger('beforeSetDropListHeight');
	var windowHeight = $vf(window).height();
	var listHeight = $vf('[data-drop-list-scroll]', $dropListWidget).height();
	var listOffset = $dropListWidget[0].getBoundingClientRect().bottom;
	var availableSpace = windowHeight - listOffset - 1;
	var $listAndItemSelectorVariations = $vf('[data-drop-list-scroll] > li > a, [data-drop-list-scroll] > a, [data-drop-list-scroll] > span', $dropListWidget);
	var defaultRightPadding = parseInt($listAndItemSelectorVariations.css('padding-right'));

	if (listHeight > availableSpace && !close) {
		var maxHeight = availableSpace;

		$vf('[data-drop-list-scroll]', $dropListWidget).css({ 'height': maxHeight, 'min-height': 100, 'overflow-x': 'hidden', 'overflow-y': 'auto' });

		// Figure out what width of scrollbar.
		// Create the measurement node
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'scrollbar-measure';
		document.body.appendChild(scrollDiv);
		$vf('.scrollbar-measure').css({
			'width': 100,
			'height': 100,
			'overflow': 'scroll',
			'position': 'absolute',
			'top': -9999
		});
		// Get the scrollbar width then delete the div
		var scrollbarWidth = (scrollDiv.offsetWidth - scrollDiv.clientWidth);
		document.body.removeChild(scrollDiv);

		// adjust padding per scrollbarWidth
		var adjustedRightPadding = defaultRightPadding + scrollbarWidth;
		var originalWidth = $listAndItemSelectorVariations[0].scrollWidth - scrollbarWidth;
		var adjustedWidth = originalWidth + adjustedRightPadding;
		$listAndItemSelectorVariations.css({'padding-right': adjustedRightPadding, 'width': adjustedWidth });
	} else if (close) {
		// remove certain styles that were applied when opened, so that when reopened everything calculates correctly.
		$vf('[data-drop-list-scroll]', $dropListWidget)[0].style.overflow = '';
		$listAndItemSelectorVariations.each(function () {
			this.style.paddingRight = '';
		});
	}

	$dropListWidget.trigger('afterSetDropListHeight');
}
function filterBarInit(context) {
		var $context = getContext(context);

		// Initialize the filter bars
		$vf('[data-filter-bar]', $context).each(function() {
			var $filterBar = $vf(this);
			$vf('[data-filter-bar-item]', $filterBar).each(function() {
				if ($vf(this).is('[data-multi-select]')) {
					updateMultiFilter($vf(this));
				} else {
					updateSingleFilter($vf(this), true);
				}
			});

		});

		// show/hide the drop list on clicking of the [data-filter-bar-item]
		// TODO: not sure why, but using $context instead of $vf(document) here messes things up when vzrfInit() or filterBarInit() is called with a scope passed as a parameter
		$vf(document).off('click keypress', '[data-filter-bar-item]:not(.disabled)');
		$vf(document).on('click keypress', '[data-filter-bar-item]:not(.disabled)', function (e) {
			if(keyClick(e) === true){
				e.preventDefault();
				var $target = $vf( e.target )
				var $this = $vf(this);
				// If click occured in a [data-filter-bar-choices], do nothing
				if ($target.is('[data-filter-bar-choices], [data-filter-bar-choices] *')) {
					return false;
				} else if ($this.is('.active')) {
					closeFilter($this);
					return false;
				}
				// Else If another filter bar is opened right now...
				else if ($vf('[data-filter-bar-item].active').length) {
					closeFilter($this);
					return false;
				}
				// Double check to see if there are more than one options to choose from.
				// If not, do nothing.
				if ($this.find('[data-filter-bar-choices] li').length > 1) {
					// deactivate all other filter-bar items that may be active
					$vf('[data-filter-bar-item].active').removeClass('active');
					openFilter($this);
				} else {
					return false;
				}
			}
		});

		// For single select only, hide on click of list item and update choice.
		// for multi select, hide on clicking off the list or the [data-filter-bar-item]
		$context.off('click keypress', '[data-filter-bar-choices] li');
		$context.on('click keypress', '[data-filter-bar-choices] li', function (e) {
			if(keyClick(e) === true){
				e.preventDefault();
				var $this = $vf(this);
				var $filterItem = $this.closest('[data-filter-bar-item]');
				$this.trigger('beforeClickFilterChoice');
				// check to see if multi-select or not
				if ($filterItem.is('[data-multi-select]')) {
					// multi-select true
					// check how many can be selected at once by looking at the value of
					// the data-multi-select attribute. No value = no limit.
					var $choices = $vf('[data-filter-bar-choices] li.active', $filterItem);
					var limit = parseInt($filterItem.attr('data-multi-select')) || Infinity;
					var count = $choices.length;

					// If the clicked item is active, deactiveate, otherwise make .active
					// so long that is doesn't exceed limit.
					if($this.hasClass('active')) {
						$this.removeClass('active');
					} else if (count < limit) {
						$this.addClass('active'); 
					} else if (count == limit) {
						// shake the [data-filter-bar-selected] element to indicate max reached
						$vf('[data-filter-bar-selected]', $filterItem).addClass('shake');
						setTimeout(function() {
							$vf('[data-filter-bar-selected]', $filterItem).removeClass('shake');
						}, 500);
					}

					updateMultiFilter($filterItem);

				} else {
					// multi-select false
					$this.siblings().removeClass('active');
					$this.addClass('active');
					$this.closest('[data-filter-bar-choices]').removeClass('active');
					updateSingleFilter($filterItem, $this);
				}

				$this.trigger('afterClickFilterChoice');
			}
		});

		// hide on mouseout of of list 
		$context.off('mouseleave', '[data-filter-bar] [data-filter-bar-item].active');
		$context.on('mouseleave', '[data-filter-bar] [data-filter-bar-item].active', function () {
			var $this = $vf(this);

			var interval = setTimeout(function () {
				closeFilter($this);
			}, 300);
			
			$this.on('mouseenter', function () {
				clearTimeout(interval);
			});
		});

		// hide on click of the overlay or nested overlay
		$context.off('click keypress', '.page-overlay.filterbar, .nested-overlay');
		$context.on('click keypress', '.page-overlay.filterbar, .nested-overlay', function (e) {
			if(keyClick(e) === true){
				var $filterItem = $vf('[data-filter-bar-item].active');
				if ($filterItem.length) {
					closeFilter($filterItem);
				}
			}
		});
  /*
  **  accessibility attributes
  **
   */
		$vf('[data-filter-bar-item]').each(function () {
			var $this = $vf(this);
			// set tabindex to 0 if not set already
			if ($this[0].hasAttribute('tabindex') === false) {
				$this.attr('tabindex', 0);

			}

			$this.attr('role','combobox');
		});
	$vf('[data-filter-bar-choices]').attr({'role': 'listbox', 'aria-labelledby': 'listlabel'});
	$vf('[data-filter-bar-choices]').prop('hidden',true);
	$vf('[data-filter-bar-choices] li').attr({ 'role': 'option', 'aria-selected': 'false'});
	$vf('[data-filter-bar-choices] li.active').attr({ 'aria-selected': 'true' });


	/*
	*
	*	Keyboard bindings
	*  e.which reference:
	* end: 		35		 * home: 	36		 * left: 	37		 
	* up: 		38		 * right: 	39		 * down: 	40
	* esc: 		27		 * tab: 	9		 * space: 	32
	* enter: 	13 	
	*/

	
	$context.off('keydown', '[data-filter-bar-item]:not(.disabled)');
	$context.on('keydown', '[data-filter-bar-item]:not(.disabled)', function(e) {
		var $this = $vf(this);
		var code = e.which;
		var $target = $vf(e.target)
		// NOTE: the `space` and `enter` keyCodes are already taken care of in the 
		// keyClick event in an above listener.

		// only do if filterbar  is .active
		if ($target.is('[data-filter-bar-item]:not(.disabled)')) {
			if ($this.is('.active')) {
				// IF `esc` key
				if (code === 27) {
					e.preventDefault();
					closeFilter($this);
				}
				else if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40) ) { // '38' is 'up' key and '40' is down key
					e.preventDefault();
		         	closeFilter($this);
				}
				// ELSE IF any arrow keys or `home` key, put focus on first item
				else if (code >= 36 && code <=40) {
					e.preventDefault();
					$vf('.filter-bar_choices', $this).children().first().focus();
				}
				// ELSE IF `end`, put focus on last item
				else if (code === 35) {
					e.preventDefault();
					$vf('.filter-bar_choices', $this).children().last().focus();
				}
				// ELSE IF `tab`, move on but make sure filter is closed
				else if (code === 9) {
					closeFilter($this, true);
				}
			} 
			else {
				if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40) ) { // '38' is 'up' key and '40' is down key
		         	if ($this.find('[data-filter-bar-choices] li').length > 1) {
					// deactivate all other filter-bar items that may be active
					$vf('[data-filter-bar-item].active').removeClass('active');
					openFilter($this);
				} else {
					return false;
				}
				}
			} 
		} 
	
	});


	$context.off('keydown', '[data-filter-bar-choices] li');
	$context.on('keydown', '[data-filter-bar-choices] li', function(e) {
		var $this = $vf(this);
		var $target = $vf(e.target)
		var $filterList = $this.closest('[data-filter-bar-item]');
		var $filterListItems = $vf('[data-filter-bar-choices] li', $filterList);
		var code = e.which;

		// NOTE: the `space` and `enter` keyCodes are already taken care of in the 
		// keyClick event in an above listener.

		// only do if filter bar is open
		if (! $target.is('[data-filter-bar-item]:not(.disabled)')) {
			if ($filterList.is('.active')) {
				// IF `home`, go to first item
				if (code === 36) {
					e.preventDefault();
					$filterListItems.first().focus();
				}
				// ELSE IF `end`, go to last item
				else if (code === 35) {
					e.preventDefault();
					$filterListItems.last().focus();
				}
				else if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40) ) { // '38' is 'up' key and '40' is down key
					e.preventDefault();
					//$this.closest('[data-filter-bar-item]').focus();
		         	closeFilter($filterList);
				}
				// ELSE IF `right` or `down`, go to next item unless already last item
				else if(code === 39 || code === 40) {
					e.preventDefault();
					if($this.is(':last-child')) {
						$this.focus();
					} else {
						$this.next().focus();
					}
					
				}
				// ELSE IF `left` or `up`, go to previous item, unless already at first item
				else if(code === 38 || code === 37) {
					e.preventDefault();
					if($this.is(':first-child')) {
						$this.focus();
					} else {
						$this.prev().focus();
					}
				}
				// ELSE IF ecape key
				else if(code === 27) {
					closeFilter($filterList);
				}
				// ELSE IF tab
				else if (code === 9) {
					if ($filterList.is('[data-multi-select]')) {
						$this.closest('[data-filter-bar-item]').focus();
						closeFilter($filterList, true);
					} else {
						// multi-select false
						$this.siblings().removeClass('active');
						$this.addClass('active');
						$this.closest('[data-filter-bar-choices]').removeClass('active');
						updateSingleFilter($filterList, false, $this, true);
					}	
				}
			} 
		} 

		
	});
}

// $filterItem: (required) the jQuery object for the [data-filter-bar-item]
function openFilter($filterItem) {
	$filterItem.trigger('beforeOpenFilter');
	$filterItem.addClass('active');
	setChoiceListHeight($filterItem);
	saveFocus();
	// See if this $filterItem exists within a modal to determine if
	// there will will be need for one or more .nested-overlay elements within the modal.
	if ($filterItem.closest('[data-modal]').length > 0) {
		// create an overlay for each of modal head, content, and footer.
		var $modal = $filterItem.closest('[data-modal]');
		var $modalDivisions = $vf('[data-modal-header], [data-modal-content], [data-modal-footer]', $modal);
		$modalDivisions.each(function() {
			$vf(this).append('<div class="nested-overlay" />');
		});

		$vf('.nested-overlay', $modal).addClass('active invisible filterbar');
	} 
	// Else not in a modal, so use .page-overlay
	else {
		if ($vf('.page-overlay').length < 1) {
			$vf('body').append('<div class="page-overlay vzrf"></div>');
		}
		// place the overlay inside the .main or .page.active if exists
		var $overlay = $vf('.page-overlay');
		if ($filterItem.closest('.main').length) {
			$overlay.appendTo($filterItem.closest('.main'));
		} else if ($vf('.page.active').length) {
			$overlay.appendTo('.page.active');
		}
		$vf('.page-overlay').addClass('active invisible filterbar');
	}
	$vf(window).on('orientationchange', function() {
		closeFilter($filterItem);
	});
	$vf('.filter-bar_choices', $filterItem).prop('hidden',false);
	$vf('.filter-bar_choices', $filterItem).children().attr({'tabindex': -1 });
	$filterItem.trigger('afterOpenFilter');
}

// $filterItem: (required) the jQuery object for the [data-filter-bar-item]
// haltResetFocus: (optional) if set to true, the resetFocus() funciton will not run at end of closing filter.
function closeFilter($filterItem, haltResetFocus) {
	$filterItem.trigger('beforeCloseFilter');
	$filterItem.removeClass('active');
	setChoiceListHeight($filterItem, true);

	// Figure out what overlay belongs with this Filter Bar.  
	// It will either be a page level .page-overlay or one or more
	// .nested-overlay(s) in a modal
	var $overlay;
	if($filterItem.closest('[data-modal]').length > 0) {
		$overlay = $filterItem.closest('[data-modal]').find('.nested-overlay');
		$overlay.removeClass('active invisible filterbar');
		// leave time for any animation
		setTimeout(function() {
			// always removes from DOM
			$overlay.remove(); 
		}, 250);
	} else {
		$overlay = $vf('.page-overlay.filterbar');
		$overlay.removeClass('active invisible filterbar');
		// place back in body node (rather than inside .page.active) if .page.active exists
		if ($vf('.page.active').length > 0) {
			setTimeout (function () {
				$overlay.appendTo('body');
			}, 250);
		}
	}

	if(haltResetFocus !== true) {
		setTimeout(function() {
			resetFocus();
		}, 350);
	}
	$vf('.filter-bar_choices', $filterItem).prop('hidden',true);
	$vf(window).off('orientationchange');
	$filterItem.trigger('afterCloseFilter');

}



// $filterItem: (required) the jQuery object for the [data-filter-bar-item]
// onLoadCheck: (optional) set as true when loading in init function to prevent calling closeFilter()
// $newChoice: (optional) the jQuery object for the selected choice.
//             Look for choice item with .active. If no active, thenen make the first choice 
//			   the active choice.
// haltResetFocus: (optional) if true, will pass the halting of resetFocus() when running closeFliter()
function updateSingleFilter($filterItem, onLoadCheck, $newChoice, haltResetFocus) {
	$filterItem.trigger('beforeUpdateSingleFilter');
	var $focused = $filterItem.find(':focus');
	var choiceText;
	if ($newChoice) {
		// update the data-filter-bar-selected
		choiceText = $vf('a', $newChoice).text();
	} else if ($filterItem.has('li.active').length > 0) {
		choiceText = $vf('li.active a', $filterItem).text();
	} else {
		// assign first choice as default active
		choiceText = $vf('[data-filter-bar-choices] li:first-child a', $filterItem).text();
		$vf('[data-filter-bar-choices] li:first-child', $filterItem).addClass('active');
	}
	$vf('[data-filter-bar-selected]', $filterItem).text(choiceText);
	if (onLoadCheck != true) {
		closeFilter($filterItem, haltResetFocus)
	}
	$filterItem.trigger('afterUpdateSingleFilter');
}

// $filterItem: (required) the jQuery object of the [data-filter-bar-item] for which
// 				we want to show the count of selected choices.
function updateMultiFilter($filterItem) {
	$filterItem.trigger('beforeUpdateMultiFilter');
	var nullText = "Make a selection";
	if ($filterItem.is('[data-null-text]')) {
		nullText = $filterItem.attr('data-null-text');
	} 
	var countText = "# Item~ Selected";
	if ($filterItem.is('[data-count-text]')) {
		countText = $filterItem.attr('data-count-text');
	} 
	var count = $vf('[data-filter-bar-choices] li.active', $filterItem).length;
	var finalText;

	if (count > 1) {
		countText = countText.replace('#', count);
		finalText = countText.replace('~', 's');
	} else if (count == 1) {
		if ($filterItem.is('[data-count-text-singular]')) {
			countText = countText.replace('#', count);
			finalText = countText.replace('~', '');
		} else {
			finalText = $vf('.active a', $filterItem).text();
		}
	} else if (count < 1) {
		finalText = nullText;
	}

	$vf('[data-filter-bar-selected]', $filterItem).text(finalText);
	$filterItem.trigger('afterUpdateMultiFilter');
}

// $filterItem:(required) the jQuery object of the [data-filter-bar-item] for which
//		we want to show the count of selected choices.
// close: (optional boolean) if set to true, it means you're closing the options, so reset any height
//		styles that may have been set.
function setChoiceListHeight($filterItem, close) {
	$filterItem.trigger('beforeSetChoiceListHeight');

	var windowHeight = $vf(window).height();
	var listHeight = $vf('[data-filter-bar-choices]', $filterItem).height();
	var listOffset = $filterItem[0].getBoundingClientRect().bottom;
	var availableSpace = windowHeight - listOffset;

	if (listHeight > availableSpace && !close) {
		var maxHeight = availableSpace - 15;

		$vf('[data-filter-bar-choices]', $filterItem).css({'height': maxHeight, 'min-height':120, 'overflow': 'auto'});
		
		// Figure out what width of scrollbar.
		// Create the measurement node
		var scrollDiv = document.createElement('div');
		scrollDiv.className = 'scrollbar-measure';
		document.body.appendChild(scrollDiv);
		$vf('.scrollbar-measure').css({
			'width':100, 
			'height':100, 
			'overflow':'scroll', 
			'position':'absolute', 
			'top':-9999
		});
		// Get the scrollbar width then delete the div
		var scrollbarWidth = (scrollDiv.offsetWidth - scrollDiv.clientWidth); 
		document.body.removeChild(scrollDiv);

		// if scrollbar width is > 0 then there is a visible scrollbar present, which screws up the 
		// auto width and the ellipsis, so remove the ellipsis by using use 'clip' instead.
		if (scrollbarWidth > 0) {
			// remove ellispis and change to clip to avoid weird pre-ellipsis thing with scrollbar appearing.
			$vf('[data-filter-bar-choices] > li > a', $filterItem).css('text-overflow', 'clip');
		}
	} else if (close) {
		// remove any styles that may have been set when opening
		setTimeout(function () {
			$vf('[data-filter-bar-choices]', $filterItem).removeAttr('style');
			$vf('[data-filter-bar-choices] > li > a', $filterItem).removeAttr('style');
		}, 500);
		
	}

	$filterItem.trigger('afterSetChoiceListHeight');
}

function listControlInit(context) {
	var $context = getContext(context);
	var doEachListControlItemHeight = function () {
		$vf('[data-list-control] > li', $context).each(function (index) {
			listControlItemHeight($vf(this), index);
		});
	}
	// decide if .m_single needs to be added to the li
	if ($vf('[data-list-control]').length) {
		doEachListControlItemHeight();
		$vf(window).on('resize orientationchange', function () {
			doEachListControlItemHeight();
		});
	}

	// When checking a checkbox or radio button with [data-list-control-check],
	// determine its checked state and if checked, add the .checked class to the List Item
	$context.off('change', '[data-list-control] [data-list-control-check]');
	$context.on('change', '[data-list-control] [data-list-control-check]', function () {
		var $this = $vf(this);
		var $item = $this.closest('.w_list-control > li');

		// if radio button, find it's group
		if($this.is('[type="radio"]')) {
			var groupName = $this.attr('name');
			$radioGroup = $vf('input[name="'+ groupName +'"]');

			// loop through the group to set each radio button's parent .checked class
			$radioGroup.each(function() {
				var $radio = $vf(this);
				var $radioItem = $radio.closest('.w_list-control > li');
				if ($radio.is(':checked')) {
					$radioItem.addClass('checked').attr('aria-checked', 'true');
				} else {
					$radioItem.removeClass('checked').attr('aria-checked', 'false');
				}
			})
		// else it's a checkbox (no group) so no need to loop
		} else { 
			if ($this.is(':checked')) {
				$item.addClass('checked').attr('aria-checked', 'true');
			} else {
				$item.removeClass('checked').attr('aria-checked', 'false');
			}
		}
	});

	// on load
	$vf('[data-list-control-check]', $context).each(function() {
		var $this = $vf(this);
		var $item = $vf(this).closest('[data-list-control] > li');

		// add a cursor:pointer to item
		$item.css('cursor', 'pointer');

		if ($this.is(':checked')) {
			$this.closest('li').addClass('checked').attr('aria-checked', 'true');
		} else {
			$this.closest('li').attr('aria-checked', 'false')
		}

		// Clicking anywhere in the item to select/check the radio/checkbox
		$item.off('click');
		$item.on('click', function(e) {
			$target = $vf(e.target);
			if ($target.is('[data-list-control] > li')) {
				var $field = $vf('[data-list-control-check]', $target);
				// IF radio button and not checked, check it.
				if ($field.prop('checked') == false && $field.is('[type=radio]')) {
					$field.prop('checked', true).change();
				}
				// ELSE IF checkbox, toggle the checked state
				else if ($field.prop('checked') && $field.is('[type=checkbox]')) {
					$field.prop('checked', false).change();
				} else if ($field.prop('checked') == false && $field.is('[type=checkbox]')) {
					$field.prop('checked', true).change();
				}
			}
		});
	});

	// adding and removing the open state to a li[data-accordion]
	$context.off('click keypress', '[data-list-control] [data-accordion]');
	$context.on('click keypress', '[data-list-control] [data-accordion]', function (e) {
		if(keyClick(e) === true) {
		e.preventDefault();
			var $this = $vf(this);
			var groupName;
			// restrict open class to only one item in the group at a time.
			if ($this.is('[data-accordion-group]') && !$this.hasClass('open')) {
				groupName = $this.attr('data-accordion-group');
				$vf('[data-accordion-group=' + groupName + ']').each(function (eleIndex, openGroup) {
					if ($vf(openGroup).hasClass('open')) {
						var $openElement = $vf(openGroup);
						closeAccordion($openElement);
						//break out of each loop if an open element is found.
						return false;
					} 
				});
				openAccordion($this);
			} else if (!$this.hasClass('open')) {		
				openAccordion($this);
			} else {
				closeAccordion($this);
			}
		}
	});
	

	/*
	** accessibility attributes setup
	**
	 */
	// accordion summary

	$vf('[data-accordion]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr('aria-expanded', 'false');
		$this.attr('role', 'tab');
	});
	$vf('[data-accordion].open').attr({
		'aria-expanded': 'true'
	});

	// accordion details
	$vf('[data-accordion] + .m_accordion-details').attr({
		'aria-role': 'tabpanel',
		'aria-hidden': 'true',
	});
	$vf('[data-accordion] + .m_accordion-details').prop({
		'hidden': true
	});
	$vf('[data-accordion].open + .m_accordion-details').attr({
		'aria-role': 'tabpanel',
		'aria-hidden': 'false'
	});
	$vf('[data-accordion].open + .m_accordion-details').prop({
		'hidden': false
	});

}



// For the openAccordion() and closeAccordion() Functions.
// Done to capture the height of the details so that CSS transitions can be applied.
// pass in the summary (label) object of the accordion then use 
// the DOM to find the details to open and close. 
function openAccordion($summaryObj) {
	$summaryObj.trigger('beforeOpenAccordion');
	$summaryObj.each(function () {
		var $summary = $vf(this);
		var $details = $summary.next();

		$details.hide();
		// give a little time for the js to hide grouped items
		setTimeout(function() {
			$summary.addClass('open').attr('aria-expanded', 'true');
			// check for line height adjustment
			listControlItemHeight($details);
			// animate slide down
			$details.slideDown(300, function() {
				$details.attr('aria-hidden', 'false');
				$details.prop('hidden',false);
			});
			$summaryObj.trigger('afterOpenAccordion');
		}, 50);
	});

}

function closeAccordion($summaryObj) {
	$summaryObj.trigger('beforeCloseAccordion');
	$summaryObj.each(function () {
		var $summary = $vf(this);
		var $details = $summary.next();

		// match the setTimeout of openAccordion();
		setTimeout(function() {
			$details.slideUp(300).attr('aria-hidden', 'true');
			$details.prop('hidden',true);
			$summary.removeClass('open').attr('aria-expanded', 'false');
			$summaryObj.trigger('afterCloseAccordion');
		}, 50);
	});
}


// decides if the item should get the .m_single class, which makes a single
// line of text be vertically spaced within the item's min-height
function listControlItemHeight($item) {
	$item.trigger('beforeListControlItemHeight');
	var minHeight = parseInt($item.css('min-height'), 10);
	var height = parseInt($item.css('height'), 10);
	/*
	console.log('row number ' + index);
	console.log('min-height => ' + minHeight);
	console.log('height => ' + height);
	console.log('===================');
	*/
	if ($item.hasClass('m_single') && height == minHeight) {
		return false;
	} else if (!$item.hasClass('m_single') && height <= minHeight) {
		$item.addClass('m_single');
	} else if ($item.hasClass('m_single') && height > minHeight + 5) {
		$item.removeClass('m_single');
	}
	$item.trigger('afterListControlItemHeight');
}
function modalInit(context) { 
	var $context = getContext(context);

	// add .vzrf to modals to ensure they work with namespaced css
	$vf('[data-modal]').addClass('vzrf');

	$context.off('click keypress', '[data-open-modal]');
	$context.on('click keypress', '[data-open-modal]', function (e) {
		if(keyClick(e) === true) {
			var modalId = $vf(this).attr('data-open-modal');
			$vf(this).attr("aria-haspopup", "false");
			if (!$vf(this).hasClass('disabled')) {
				if ($vf(this).is('[data-modal-section]')) {
					// section modals just cover a div with an ID matching the value of the [data-modal-section] value
					var sectionId = $vf(this).attr('data-modal-section');
					openModal(modalId, sectionId);
				} else {
					openModal(modalId);
				}
			} else {
				return false;
			}
	    }
	});

	$context.off('click keypress', '[data-close-modal]');
	$context.on('click keypress', '[data-close-modal]', function (e) {
		//e.preventDefault();
		if(keyClick(e) === true) {
			var $modal = $vf('[data-modal].active');
			var swap = $vf(this).is('[data-open-modal]');
			$vf('[data-open-modal]').attr('aria-haspopup', 'true');
			if (!$vf(this).hasClass('disabled')) {
				if ($vf(this).is('[data-validate-form]')) {
					if (!$vf('form', $modal).parsley().isValid()) {
						return false;
					} else {
						closeModal($modal, swap);
					}
				} else {
					closeModal($modal, swap);
				}
			} else {
				return false;
			}
		}
	});


	/* When a modal is open, certain actions can grow/shrink the content of the modal.
	   When these actions happen, run modalHeightSetter for the duration of the hight variation change */
	$vf('[data-modal]', $context).off('click keypress', '[data-modal-height], [data-accordion], [data-tab], [data-reveal-trigger], [data-reveal-trigger] + label');
	$vf('[data-modal]', $context).on('click keypress', '[data-modal-height], [data-accordion], [data-tab], [data-reveal-trigger], [data-reveal-trigger] + label', function (e) {
		var interval = setInterval(function () {
			modalHeightSetter();
		}, 10);

		setTimeout(function () {
			clearInterval(interval);
			modalHeightSetter();
			$vf('[data-modal].active [data-modal-content]').css('overflow-y', 'auto')
		}, 325);
	});


	/* Touch devices like to scroll the content behind the modal, when we are just trying
	   to scroll the content area in the modal. So we need to prevent propigation on touch scrolls. */
	/*	$vf('[data-modal-content]').on('touchmove touchstart touchend scroll scrollstart scrollend', function (e) {
			// this doesn't seem to work well. It seems mobile browsers just like to ignore this rule 
			// as well as the overflow:hidden; set on the body and html tags when the modal is opened.
			e.stopPropagation();
		});
	*/

	//IF NEEDED, this code will close the open modal when	clicking the overlay 
	$context.off('click', '.page-overlay');
	$context.on('click', '.page-overlay', function () {
		var $modal = $vf('[data-modal].active');
		if (!$modal.is('[data-disable-overlay-close]')) {
			closeModal($modal);
		}
	});


	/* Some other VZRF widgets will use the overlay, such as Filter Bar and Drop List.  If these are activated
	 * while a section Modal is open, and the opened widget is not inside the open modal, then close the opened (section) modal.
	 */
	$vf(document).on('beforeOpenFilter beforeShowDropList', function (e) {
		var $target = $vf(e.target);
		// IF the clicked thing is not in the active modal then do nothing
		if ($target.closest('[data-modal].active').length) {
			return false;
		}
			// ELSE close the modal id a modal is active
		else if ($vf('[data-modal].active').length) {
			closeModal($vf('[data-modal].active'));
		}
	});


	/* Iframe Modal does special setup on page load. */
	$vf('[data-modal-iframe]').each(function() {
		modalIframeSetup($vf(this));
	});
	$context.on('afterOpenModal', function () {
		// For some reason the sizing function does not always calculate correctly
		// when it is the first time the modal is shown.  Doing it twice in succession 
		// solves it with no UX downside. 
		setTimeout(function () {
			modalIframeSizing();
		}, 400);
		setTimeout(function () {
			modalIframeSizing();
		}, 700);
	});

	/* accessibility attributes */
	$vf('[data-modal]').attr({'role': 'dialog', 'aria-hidden': 'true'}).prop('hidden' ,true);

	$vf('[data-open-modal]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr({ 'aria-label': 'Opens a Modal' ,'aria-haspopup': "true"});
	});
	$vf('[data-close-modal]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);

		}

		$this.attr({ 'aria-label': 'Click here or press escape key to close the modal' });
	});

}// modalInit

// slow down the fireing of modalHeightSetter() calls with this debounce function.
$vf(function () {
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
	$vf(window).on('resize', debounce(function () {
		if($vf('[data-modal].active').length) {
			modalHeightSetter();

			if($vf('[data-modal].active').find('iframe').length) {
				modalIframeSizing();
			}
		}
	}, 100));

	$vf(window).on('orientationchange', function() {
		if($vf('[data-modal].active').length) {
			modalHeightSetter();
			if($vf('[data-modal].active').find('iframe').length) {
				modalIframeSizing();
			}
		}
	});
});

// modal: 'ModalName' or jQuery object
// section: 'SectionId' or jQuery object
function openModal(modal, section) {
	var $modal;
	if (modal instanceof $vf || modal instanceof jQuery) {
		$modal = modal;
	} else if (modal) {
		$modal = $vf('[data-modal=' + modal + ']');
	} else {
		console.error('Modal not defined or does not exist');
	}
	$modal.trigger('beforeOpenModal');
	saveFocus();
	$modal.attr({ 'aria-hidden': 'false', 'tabindex': '0' }).prop('hidden' ,false);
	$vf('[data-close-modal]', $modal).attr('tabindex', '0');
	$vf('main').attr('aria-hidden', 'true').prop('hidden' ,true);
	var $alreadyOpenModal = $vf('[data-modal].active');
	var $content = $vf('[data-modal-content]', $modal);
	var $header = $vf('[data-modal-header]', $modal);
	var $footer = $vf('[data-modal-footer]', $modal);
	var $section = false;
	if (section instanceof $vf || section instanceof jQuery) {
		$section = section;
	} else if (section) {
		$section = $vf('#' + section);
	}

	function activateModal() {
		// prevent body from scrolling
		$vf('body, html').addClass('no-scroll');

		$modal.addClass('active');	

		$vf('.page-overlay').addClass('active modal');
		if ($modal.hasClass('m_show-top-bar')) {
			$vf('.page-overlay').addClass('show-top-bar');
		}

		/*** TAB "Lock" inside modal ***/
		// So long as modal is open, lock the tabbing focus inside modal.
		// Also use Esc key to close modal.
		$vf(window).on('keyup', function(e) {
			// if TAB make sure it's inside $modal, if not make it so. 
			if(e.which === 9 && $vf(e.target).closest($modal).length == 0) {
				e.preventDefault();
				$modal.focus();
				modalHeightSetter();
			}

			// if ESC close modal.
			if(e.which === 27) {
				closeModal($modal);
			}
		});

	}

	function activateSectionModal() {
		$modal.trigger('beforeActivateSectionModal');
		var position = $section.css('position');
		if (position != 'absolute' && position != 'relative' && position != 'fixed') {
			$section.css('position', 'relative');
		}
		$section.css('overflow', 'hidden').attr('data-modal-section-element', '').scrollTop(0);

		$vf('.page-overlay').prependTo($section).addClass('modal absolute');
		setTimeout(function () {
			$vf('.page-overlay').addClass('active');
		}, 10)
		$modal.prependTo($section).addClass('m_section');
		setTimeout(function () {
			$modal.addClass('active');
			modalHeightSetter();
		}, 10);

		$modal.on('keyup', function(e) {
			// if ESC close modal.
			if(e.which === 27) {
				closeModal($modal);
			}
		});
		$modal.trigger('afterActivateSectionModal');
	}

	// make sure the modal you're trying to open actually exists
	if ($modal.length > 0) {
		// IF modal is not an immediate descendant of <body>, 
		// Pull the $modal out of whereever it may be and place just before the
		// closing <body> in order to avoid z-index issues
		if (!$modal.is('.active') && $modal.parent('body').length < 1) {
			$modal.appendTo('body');
		}

		// create overlay div if not already existing
		if ($vf('.page-overlay').length < 1) {
			$vf('body').append('<div class="page-overlay vzrf"></div>');
		} else {
			// ensure works with namepaced vzrf
			$vf('.page-overlay').addClass('vzrf');
		}
	

		// Different ways to open a modal depending on:
		// 1) IF clicked link's section is same as currently open section do nothing else, open in new section
		// 2) ELSE IF another modal is open, and new modal is not a section modal (normal modal)
		// 3) ELSE IF another modal is open, and the newly opened modal is a Section modal
		// 4) ELSE IF No other modal open and dot a section modal. Just normal behavior.
		// 5) ELSE No other modal open, but is a section modal. Open the section modal.

		// 1) IF clicked link's section is same as currently open section do nothing else, open in new section
		if ($modal.is($alreadyOpenModal) && $section.length > 0) {
			var prevSectionId = $modal.closest('[data-modal-section-element]').attr('id');
			if ($section.attr('id') === prevSectionId) {
				return false;
			} else {
				$modal.removeClass('active');
				$vf('[data-modal-section-element]').removeAttr('[data-modal-section-element]');
				$vf('.page-overlay').removeClass('active');
				setTimeout(function () {
					activateSectionModal();
				}, 350);
			}
		}
			// 2) another modal is open, and new modal is not a section modal
		else if ($alreadyOpenModal.length > 0 && !$section) {
			closeModal($alreadyOpenModal);
			// delay opening of new modal to allow time for $alreadyOpenModal to close
			setTimeout(function () {
				activateModal();
				modalVertAlign();
			}, 350);
		}
			// 3) another modal is open, and the newly opened modal is a Section modal
		else if ($alreadyOpenModal.length > 0 && $section.length > 0) {
			closeModal($alreadyOpenModal, true);
			setTimeout(function () {
				activateSectionModal();
				modalVertAlign();
			}, 350);
		}
			// 4) No other modal open and dot a section modal. Just normal behavior.
		else if (!$section) {
			activateModal();
		}
			// 5) No other modal open, but is a section modal. Open the section modal.
		else {
			activateSectionModal();
		}

		modalHeightSetter();
		setTimeout(function () {
		
			$modal.focus();
		}, 350);
	}
 	
	$modal.trigger('afterOpenModal');
}

// modal: 'ModalName' or jQuery object
// swap: undefined, false, true
function closeModal(modal, swap) {
	var $modal;
	if (modal instanceof $vf || modal instanceof jQuery) {
		$modal = modal;
	} else if (modal) {
		$modal = $vf('[data-modal=' + modal + ']');
	}
	$modal.trigger('beforeCloseModal');

	// remove this even handler which was set in side openModal() > activateModal()
	$vf(window).off('keyup');

	//$modal.attr({ 'aria-hidden': 'true', 'tabindex': '-1' }).prop('hidden' ,true);
	$vf('[data-close-modal]', $modal).attr('tabindex', '-1');
	//$vf('main').attr('aria-hidden', 'false').prop('hidden' ,false);
	// set a fixed height on modal so that it animates out nicely, then remove it once animation is done.
	var height = $modal.height();
	$modal.css('height', height);

	$modal.removeClass('active show-top-bar');
	setTimeout(function () {
		$modal.removeClass('m_section');
	}, 350);

	// If this modal was a section modal, then we need to reset the position set on the [data-modal-section-element]
	var $section = $vf('[data-modal-section-element]');
	if ($section.length > 0) {
		setTimeout(function () {
			$section.attr('style', '').removeAttr('data-modal-section-element');
		}, 350);
	}

	if (swap !== true) {
		$vf('.page-overlay.modal').removeClass('active modal show-top-bar');
		setTimeout(function () {
			$vf('.page-overlay').removeClass('absolute').appendTo('body');
		}, 350);
		$vf('body, html').removeClass('no-scroll');
	}

	// Reset the top position to the default value found in css, which is -100%
	// then remove the value once hidden
	$modal.css('top', '-100%');

	// if focus is on something inside the modal, such as a form field, then remove it. 
	$vf(':focus', $modal).blur();

	if ($vf('.page.active').length > 0) {
		setTimeout(function () {
			// nest the $modal back in the div.page.active
			$modal.appendTo('.page.active');
		}, 400);
	} else {
		// setTimeout(function () {
		// 	// nest the $modal back in the body
		// 	$modal.appendTo('body');
		// }, 400);
	}
	setTimeout(function () {
		$modal.attr({ 'aria-hidden': 'true', 'tabindex': '-1' }).prop('hidden', true);
		$vf('main').attr('aria-hidden', 'false').prop('hidden', false);

	}, 400);
	resetFocus();
	$modal.trigger('afterCloseModal');
};

function modalHeightSetter() {
	// make sure there is an active modal
	if ($vf('[data-modal].active').length < 1) {
		return false;
	}

	var $modal = $vf('[data-modal].active');
	$modal.trigger('beforeModalHeightSetter');

	var $content = $vf('[data-modal-content]', $modal);
	var $header = $vf('[data-modal-header]', $modal);
	var $footer = $vf('[data-modal-footer]', $modal);
	// reset any height previously set heights 
	$modal[0].style.height = '';
	$content[0].style.height = '';
	if($header.length) {
		$header[0].style.height = '';
		var headerHeight = $header[0].scrollHeight;
	} else {
		var headerHeight = 0;
	}
	if($footer.length) {
		$footer[0].style.height = '';
		var footerHeight = $footer[0].scrollHeight;
	} else {
		var footerHeight = 0;
	}
	var winHeight = $vf(window).height();
	var contentHeight = $content[0].scrollHeight || 0;

	// The modal's max height is set in CSS to be 90% or 100% depending on modal type.
	// Determine what the max height of the modal should be in px by multiplying 
	// winheight by .9 or 1 (90% or 100%).
	var modalMaxPercent = .9;
	if ($modal.is('.m_cover, .m_cover-all')) {
		modalMaxPercent = 1;
	}
	var modalMaxHeight = modalMaxPercent * winHeight;
	// Determine max height of content area by maxheight - header - footer
	var contentMaxHeight = modalMaxHeight - headerHeight - footerHeight;
	$content.css({
		'max-height': contentMaxHeight,
		'height': contentHeight
	});

	modalVertAlign();

	$modal.trigger('afterModalHeightSetter');
}

function modalVertAlign() {
	var $modal = $vf('[data-modal].active');
	var modalHeight = $modal.height();

	// special vertical positioning depending on modifier classes
	if ($modal.is('.m_vert-top, m_tall')) {
		$modal.css({
			"top": "5%",
			"margin-top": $vf(window).scrollTop(),
		});
	} else if ($modal.is('.m_cover, .m_cover-all')) {
		$modal.css({
			"top": 0,
			"margin-top": $vf(window).scrollTop(),
		});
	} else {
		$modal.css({
			"top": "50%",
			"margin-top": -1 * modalHeight / 2 + $vf(window).scrollTop()
		});
	}
}

function modalIframeSetup($modal) {
	$modal.trigger('beforeModalIframeSetup');
	// ensure an iframe does not already exist in this modal
	if($vf('iframe', $modal).length) {
		return false;
	}

	var src = $modal.attr('data-modal-iframe');


	// var testRequest = $vf.ajax({
	// 	url: src,
	// 	async: true, 
	// 	error: function() {
	// 		console.error("===========================================================================\n"
	// 			+ "VZRF Modal Iframe error: Cross-origin limitations\n"
	// 			+ "---------------------------------------------------------------------------\n"
	// 	        + "The iframe src is required to have the same domain as the parent page.\n" 
	// 	        + "This is so that the contents of the iframe can be access for programatically\n"
	// 	        + "determining the height of the iframe'd page. If same domain is not possible\n"
	// 	        + "in your situation then do not use [data-modal-iframe], but instead build your\n"
	// 	        + "own custom system inside the [data-modal-content] div of the modal. You will\n"
	// 	        + "likely need to set a fixed height for the iframe in this case.\n"
	// 	        + "===========================================================================");
	// 	}
	// });

	var $iframe = $vf('<iframe src="'+ src +'" scrolling="no"></iframe>');
	var modalContentHtml = '<div class="modal_content m_has-iframe" data-modal-content></div>';
	var iframeHeight;

	// IF data-modal-content does not exist, create it
	if($vf('[data-modal-content]', $modal).length < 1) {
		// IF $modal has a data-modal-header, put content after header
		if($vf('[data-modal-header]', $modal).length) {
			$vf('[data-modal-header]', $modal).after(modalContentHtml);
		} 
		// ELSE IF there is no header, but there is a .modal_x, put after the X
		else if ($vf('.modal_x', $modal).length) {
			$vf('.modal_x', $modal).after(modalContentHtml);
		}
		// ELSE it's the only child
		else {
			$modal.prepend(modalContentHtml);
		}
	}
	// ELSE data-modal-content does exist, so just make sure it has the .m_has-iframe class
	else {
		$vf('[data-modal-content]').addClass('m_has-iframe');
	}

	$vf.get( src )
		.fail(function() {
			console.error("===========================================================================\n"
					+ "VZRF Modal Iframe error: Cross-origin limitations\n"
					+ "---------------------------------------------------------------------------\n"
			        + "The iframe src is required to have the same domain as the parent page.\n" 
			        + "This is so that the contents of the iframe can be access for programatically\n"
			        + "determining the height of the iframe'd page. If same domain is not possible\n"
			        + "in your situation then do not use [data-modal-iframe], but instead build your\n"
			        + "own custom system inside the [data-modal-content] div of the modal. You will\n"
			        + "likely need to set a fixed height for the iframe in this case.\n"
			        + "===========================================================================");
		}).done(function() {
			$vf('[data-modal-content]', $modal).append($iframe);
			modalIframeSizing();
		});

	$modal.trigger('afterModalIframeSetup');
}

// Called from within modalIframeSetup() when iframe is loaded
// and used when window resizes, and when before/afterOpenModal event fires
function modalIframeSizing() {
	var $iframe = $vf('[data-modal].active iframe');
	$iframe.trigger('beforeModalIframeSizing');
	iframeNewHeight = $iframe.contents().find("body").outerHeight();
	$iframe.height(iframeNewHeight);
	modalHeightSetter();
	$iframe.trigger('afterModalIframeSizing');
}
function paginationInit(context) {
	var $context = getContext(context);

	// initial setup
	$vf('[data-pagination]').each(function() {
		var $this = $vf(this);
		var options = $this.attr('data-pagination');
		paginationBuilder($this, options);
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		// Accessibility Attributes
		$this.attr({
			'role': 'menubar',
			'aria-label': 'Pagination',
		});
	});

	// resize display of Pagination list items when window resizes
	var resizeTimer;
	$vf(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			$vf('[data-pagination]').each(function() {
				paginationDisplay($vf(this));
			});
			
		}, 50);
	});

	// set Pagination <a> click events
	$context.off('click keypress', '[data-pagination] a');
	$context.on('click keypress', '[data-pagination] a', function(e) {
		if(keyClick(e) === true) {
			var $this = $vf(this);
			var $parent = $this.parent();
			if ($parent.is('[data-page-first]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'first');
			} else if ($parent.is('[data-page-previous]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'previous');
			} else if ($parent.is('[data-page-next]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'next');
			} else if ($parent.is('[data-page-last]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'last');
			} else if ($parent.is('[data-page-number]')) {
				var number = parseInt($this.closest('[data-page-number]').attr('data-page-number'));
				paginationSetCurrentPage($this.closest('[data-pagination]'), number);
			}
		}
	});

	$context.off('keydown', '[data-pagination]');
	$context.on('keydown', '[data-pagination]', function(e) {
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		*/
		var $this = $vf(this);
		// IF home key, go to first page
		if (e.which === 36) {
			paginationSetCurrentPage($this, 'first');
		} 
		// ELSE IF end key
		else if (e.which === 35) {
			paginationSetCurrentPage($this, 'last');
		} 
		// ELSE IF left or up key
		else if (e.which === 37 || e.which === 38) {
			paginationSetCurrentPage($this, 'previous');
		} 
		// ELSE IF right or down key
		else if (e.which === 39 || e.which === 40) {
			paginationSetCurrentPage($this, 'next');
		} 

		// catch all
		if (e.which > 34 && e.which < 41) {
			e.preventDefault();
			$vf('.active a', $this).focus();
		}
		
	});
}


function paginationBuilder(list, options) {
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}

	var reInit = false;
	if($list.data('initialized')) {
		var reInit = true;
	}
	$list.trigger('beforePaginationBuilder');

	// Make a JSON object out of options, even if a string is passed (like from data- attribute).
	if (typeof options == 'string' && options.length) {
		options = JSON.parse(options);
	} 


	// set default settings
	var defaults = {
		numPages: 1, 
		currentPage: null,
		includeFirstLast: true, 
		useEllipsis: true, 
		onPaginationLoad: function() {},
		onPaginate: function() {}
	}

	var settings = $vf.extend({}, defaults, options, $list.data());

	var elType;
	var $items;
	var markup = '';

	// Is $this a `div` or `ul`. 
	if($list.is('div')) {
		elType = 'div';
	} else if ($list.is('ul')) {
		elType = 'li';
	} else {
		console.error('VZRF paginationBuilder() error: Your root pagination element must be a <div> or <ul>');
		return false;
	}

	//***********************************
	// ~ MARKUP CREATION: Build out the items of the pagination list based on settings
	//***********************************
	
	// Check for reinitialization and set currentPage.
	if (reInit) {
		// if currentPage is null (not explicitly set in reinitialization) 
		// then use currently .active page as currentPage
		if(settings.currentPage == null) {
			settings.currentPage = parseInt($list.data('currentPage'));	
		} 
		$list.empty();
	} else {
		// if currentPage is null, set to 1
		if(settings.currentPage == null) {
			settings.currentPage = 1;
		}
	}

	// Are we to include the `first` link?
	if(settings.includeFirstLast) {
		markup += '<' + elType + ' class="pagination_item m_first" data-page-first title="first"><a href="#FirstPage" tabindex="-1" aria-label="Go to first page"></a></'+ elType +'>' 
	} 
	// previous link
	markup += '<' + elType + ' class="pagination_item m_prev" data-page-previous title="previous"><a href="#PreviousPage" tabindex="-1" aria-label="Go to previous page"></a></'+ elType +'>';
	
	// Loop numPages to write markup for each page number
	for(var i = 1; i <= settings.numPages; i++) {
		// IF not the last page
		if (i != settings.numPages) {
			markup += '<' + elType + ' class="pagination_item" data-page-number="'+ i +'"><a href="#Page'+ i +'" tabindex="-1" aria-label="Page '+ i +'" aria-checked="false" role="menuitemradio">'+ i +'</a></'+ elType +'>';
		} 
		// ELSE , this is last page so add special data-last-page attribute.
		else {
			markup += '<' + elType + ' class="pagination_item" data-page-number="'+ i +'" data-last-page><a href="#Page'+ i +'" tabindex="-1" aria-label="Page '+ i +'. The last page." aria-checked="false" role="menuitemradio">'+ i +'</a></'+ elType +'>';
		}
	}
	
	// next link
	markup += '<' + elType + ' class="pagination_item m_next" data-page-next title="next"><a href="#NextPage" tabindex="-1" aria-label="Go to next page"></a></'+ elType +'>';

	// Are we to include the `last` link?
	if(settings.includeFirstLast) {
		markup += '<' + elType + ' class="pagination_item m_last" data-page-last title="last"><a href="#LastPage" tabindex="-1" aria-label="Go to last page"></a></'+ elType +'>' 
	} 

	// Create a jQuery object of all the items
	$items = $vf(markup);
	
	// If settings.useEllipsis, insert it just before last page
	$list.append($items);

	//***********************************
	// end MARKUP CREATION
	//***********************************
	


	//***********************************
	// ~ UPDATE LIST DATA AND SET CURRENT PAGE
	//***********************************
	// set data on jQuery element
	$list.data({
		'initialized': true,
		'numPages': settings.numPages || $vf('[data-page-number]', $list).length,
		'currentPage': settings.currentPage,
		'useEllipsis': settings.useEllipsis, 
		'includeFirstLast': settings.includeFirstLast
	}).removeData('pagination');

	
	// Now that list is built, set the current page by running setCurrentPage(). 
	// this function will also run calculateDisplay() inside it.
	paginationSetCurrentPage($list, settings.currentPage);
			
	//***********************************
	// end UPDATE LIST DATA AND SET CURRENT PAGE
	//***********************************



	//***********************************
	// ~ CALLBACKS
	//***********************************	
	// callback function for any time you change a page.
	$list.on('afterPaginationSetCurrentPage', function() {
		settings.onPaginate.call($list);
	});

	// run afterPaginate callback function, then trigger afterPagination event
	settings.onPaginationLoad.call($list);
	$list.trigger('afterPaginationBuilder');
	
	//***********************************
	// end CALLBACKS
	//***********************************
} // end paginationBuilder


// Function to Mark the current page
// page: integer representing page to select or any of the following string values: 'first', 'previous', 'next', 'last'
// list: a jQuery object representing the pagination list or a jQuery selector string that should be the pagination list. 
function paginationSetCurrentPage(list, page) {
	var $list;
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}
	$list.trigger('beforePaginationSetCurrentPage');

	var $items = $vf('.pagination_item', $list);

	// now activate the appropriate page
	$items.each(function() {
		var $item = $vf(this);
		// IF `page` is a number
		if(page % 1 === 0 && $item.is('[data-page-number='+ page +']')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		}
		else if(page === 'first' && $item.is('[data-page-number=1]')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		} else if(page === 'last' && $item.is('[data-last-page]')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		} else if(page === 'previous' && $item.is('.active')) {
			if($item.prev().is('[data-page-number]')) {
				$item.removeClass('active').prev('[data-page-number]').addClass('active').children('a').attr('aria-checked', 'true');
			}
			return false; // exit the .each() loop
		} else if(page === 'next' && $item.is('.active')) {
			if($item.next().is('[data-page-number]')) {
				$item.removeClass('active').next('[data-page-number]').addClass('active').children('a').attr('aria-checked', 'true');
			}
			return false; // exit the .each() loop
		}
		// ELSE if $item is none of these, make sure it doesn't have .active
		else {
			$item.removeClass('active');
			if ($item.is('[data-page-number]')) {
				$item.children('a').attr('aria-checked', 'false');
			}
		}
	});

	// update the list's data 
	$list.data('currentPage', parseInt($vf('[data-page-number].active', $list).attr('data-page-number')));

	// Check the new .active class and update the arrows appropriately
	if ($vf('[data-page-number=1]', $list).is('.active')) {
		$vf('.m_first, .m_prev', $list).attr({'disabled': 'disabled', 'aria-disabled': 'true'});
		$vf('.m_last, .m_next', $list).removeAttr('disabled').attr('aria-disabled', 'false');
	} else if ($vf('[data-last-page]', $list).is('.active')) {
		$vf('.m_first, .m_prev', $list).removeAttr('disabled').attr('aria-disabled', 'false');
		$vf('.m_last, .m_next', $list).attr({'disabled': 'disabled', 'aria-disabled': 'true'});
	} else {
		$vf('.pagination_item', $list).removeAttr('disabled');
	}

	// update the pagination display with calculateDisplay
	paginationDisplay($list);	
	$list.trigger('afterPaginationSetCurrentPage');

}

// hides and shows page numbers based on logicalness and magic
// `list`: can be an ID of the pagination list or jQuery object representing the same.
function paginationDisplay(list) {
	var $list;
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}
	$list.trigger('beforePaginationDisplay');
	var $pages = $vf('[data-page-number]', $list);
	var currentPage = $list.data('currentPage') || 1;
	var numPages = $list.data('numPages');
	var listWidth = $list.width();
	var pageWidth = $vf('[data-page-number].active', $list).outerWidth();
	var allPagesWidth = pageWidth * numPages;
	var arrowsWidth = (function() {
		var width = 0;
		$vf('.m_first, .m_prev, .m_next, .m_last', $list).each(function() {
			width =  width + $vf(this).outerWidth(true);
		});
		return width;
	})();

	var availableSpace = listWidth - arrowsWidth;

	var ellipsis;
	// IF $list's useEllipsis is true and window width large enough, set `ellipsis` to true
	if (($list.data('useEllipsis') && $vf(window).width() >= 380 )
		|| ($vf(window).width() >= 300 && $list.data('includeFirstLast') == false)) {
		ellipsis = true;
		// insert the ellipsis with correct element type (<li> vs <div>)
		var elType;
		if ($list.is('ul')) {
			elType = 'li';
		} else {
			elType = 'div'
		}

		// IF .m_ellipsis does not exist, create it
		if ($vf('.m_ellipsis', $list).length < 1) {
			$pages.last().before('<'+ elType +' class="pagination_item m_ellipsis" aria-disabled="true" role="separator"></'+ elType +'>');
		}
	} else {
		ellipsis = false
		$vf('.m_ellipsis', $list).remove();
	}
	

	// IF availableSpace is equal are greater than allPagesWidth, everything can be shown and
	// we don't need to show the ellipsis
	if (availableSpace >= allPagesWidth) {
		if(ellipsis) {
			$vf('.m_ellipsis', $list).remove();
		}
		$pages.show();
	} 
	// ELSE there is not enough space so we have to start hiding items and attempting to 
	// center the .active [data-page-number]
	else {
		
		var numToShow = Math.floor(availableSpace / pageWidth);
		var middle = Math.round(numToShow / 2) - 1; // minus 1 so that +/- middle doesn't count middle
		
		var highestShown;
		var lowestShown;
		
		// IF currentPage + middle exceeds numPages
		if (!ellipsis && currentPage + middle >= numPages) {
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF ellipsis is involved AND numToShow is even, make little adjustment to remove ellipsis at appropriate currentPage
		else if (ellipsis && numToShow % 2 == 0 && currentPage + middle + 2 >= numPages) {
			$vf('.m_ellipsis', $list).remove();
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF ellipsis is involved make little adjustment to remove ellipsis at appropriate currentPage
		else if (ellipsis && currentPage + middle + 1 >= numPages) {
			$vf('.m_ellipsis', $list).remove();
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF currentPage - middle is less than 1
		else if (currentPage - middle < 1) {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = numToShow - 2
				lowestShown = 1;
			} else {
				highestShown = numToShow;
				lowestShown = 1;
			}
		}
		// ELSE IF even number to be shown show one more to right than left
		else if(numToShow % 2 == 0) {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = currentPage + middle;
				lowestShown = currentPage - middle + 1;
			} else {
				highestShown = currentPage + middle + 1;
				lowestShown = currentPage - middle;
			}
		} 
		// ELSE split right down the middle.
		else {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = currentPage + middle - 1;
				lowestShown = currentPage - middle + 1;
			} else {
				highestShown = currentPage + middle;
				lowestShown = currentPage - middle;
			}
		}

		// console.log('===========================');
		// console.log('listWidth: ' + listWidth);
		// console.log('availableSpace: ' + availableSpace);
		// console.log('pageWidth: ' + pageWidth);
		// console.log('currentPage: ' + currentPage);
		// console.log('numToShow: ' + numToShow);
		// console.log('middle:' + middle);
		// console.log('lowestShown: ' + lowestShown);
		// console.log('highestShown: ' + highestShown);

		$pages.each(function(i) {
			i++; // increase the 0 index to equal page number
			var $this = $vf(this);

			
			// IF i is between lowest and highest number to show, then show it. 
			if(i >= lowestShown && i <= highestShown) {
				$this.show().attr('aria-hidden', 'false').prop('hidden' ,false);
			}
			// ELSE hide i
			else {
				$this.hide().attr('aria-hidden', 'true').prop('hidden' ,true);
			}
		}); // end $pages.each()

		if(ellipsis) {
			$pages.last().show().attr({'aria-hidden': 'false'}).prop('hidden' ,false);
		}
	}

	$list.trigger('afterPaginationDisplay');

}
function pwToggleInit(context) {
	var $context = getContext(context);

	// on load, show the hide/show toggle if field has a value
	$vf('[data-pw-toggle]').each(function() {
		var $this = $vf(this);
		var $input = $vf('input', $this);
		var $toggle = $vf('[data-pw-toggle-to]', $this);
		if ($toggle[0].hasAttribute('tabindex') === false) {
			$toggle.attr('tabindex', 0);

		}
		if($input.val().length > 0) {
			$this.addClass('focus');
			$toggle.attr({'aria-label':'Unmask field characters', 'aria-hidden': 'false'}).prop('hidden' ,false);
		} else {
			$toggle.attr({'aria-label':'Unmask field characters', 'aria-hidden': 'true'}).prop('hidden' ,true);
		}
		if ($vf('html').is('.old-ie')) {
			pwToggleIE9Support($input);
		}

		// Accessibility attributes
		if ($input.is('[id]')) {
			fieldId = $input.attr('id');
			$toggle.attr('aria-controls', fieldId);
		}

	});

	// show the show/hide text when input has focus and 
	// has something typed in it. Hide otherwise.
	$context.off('focus keyup', '[data-pw-toggle]');
	$context.on('focus keyup', '[data-pw-toggle]', function (e) {
		var $this = $vf(this)
		pwToggle($this);
	});

	// By default, the input type should be set to "password". 
	// We can switch to another text compatible input type, as 
	// by clicking the [data-toggle-to].
	$context.off('click keypress', '[data-pw-toggle-to]');
	$context.on('click keypress', '[data-pw-toggle-to]', function (e) {
		if (keyClick(e) === true) {
			pwToggleTo($vf(this));
		}
	});

	// If IE9, you have to do special steps to show the fake placeholder by 
	// placing the placeholder text as the value.
	if ($vf('html').is('.old-ie')) {
		$context.off('blur keyup', '[data-pw-toggle] > input');
		$context.on('blur keyup', '[data-pw-toggle] > input', function() {
			pwToggleIE9Support($vf(this));
		});
	}

}

// Show the show/hide text when input has focus and has something typed in it. Hide otherwise.
// Adds and removes the .m_show-toggle class for visibility of the toggle trigger (show/hide text)
function pwToggle($toggleWrap) {
	var $input = $vf('input', $toggleWrap);
	$toggleWrap.trigger('beforePwToggle');
	$input.trigger('beforePwToggle');

	if ($input.val().length > 0) {
		$toggleWrap.addClass('m_show-toggle');
		$vf('[data-pw-toggle-to]', $toggleWrap).attr({'aria-hidden': 'false'}).prop('hidden' ,false);
	} else {
		$toggleWrap.removeClass('m_show-toggle');
		$vf('[data-pw-toggle-to]', $toggleWrap).attr({'aria-hidden': 'true'}).prop('hidden' ,true);
	}

	$toggleWrap.trigger('afterPwToggle');
	$input.trigger('afterPwToggle');
}

// Switches to another text compatible input type, by clicking the [data-toggle-to].
function pwToggleTo($toggle) {
	var toType = $toggle.data('pw-toggle-to');
	var $input = $vf('input', $toggle.closest('[data-pw-toggle]'));
	var currentType = $input.attr('type');
	var value = $input.val();
	$toggle.trigger('beforePwToggleTo');
	$input.trigger('beforePwToggleTo');

	if (currentType == "password") {
		// switch to toType and change show/hide text to "Hide"
		$input.attr('type', toType);
		$toggle.text('Hide').attr('aria-label', 'Mask field characters');
	} else {
		// switch to "password" type and change show/hide text to "Show"
		$input.attr('type', 'password');
		$toggle.text('Show').attr('aria-label', 'Unmask field characters');
	}

	$input.focus();
	// Some browsers you have to force the cursor to the end of the input text.
	// If this function exists...
	if ($input[0].setSelectionRange) {
		// ... then use it
		// (Doesn't work in IE)

		// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
		var len = $input.val().length * 2;
		$input[0].setSelectionRange(len, len);
	}
	else {
		// ... otherwise replace the contents with itself
		// (Doesn't work in Google Chrome)
		$input.val($input.val());
	}

	// Scroll to the bottom, in case we're in a tall textarea
	// (Necessary for Firefox and Google Chrome)
	this.scrollTop = 999999;

	$toggle.trigger('afterPwToggleTo');
	$input.trigger('afterPwToggleTo');
}

// If IE9, you have to do special steps to show the fake placeholder by 
// placing the placeholder text as the value. 
// So base the type on the text of the [data-pw-toggle-to] element, 
// and not the value of the [data-pw-toggle-to] attribute.
function pwToggleIE9Support($input, event) {
	$input.trigger('beforepwToggleIE9Support');
	var $toggleWrap = $input.closest('[data-pw-toggle]');
	var $toggleTo = $vf('[data-pw-toggle-to]', $toggleWrap);
	setTimeout(function () {
		var value = $input.val().trim();
		var placeholder = $input.attr('placeholder').trim();
		var toggleText = $toggleTo.text();
		if (value === placeholder && toggleText === 'Show') {
			// change to type=text so we don't see the faux placeholder as password dots/stars
			$input.attr('type', 'text');
			$toggleWrap.removeClass('m_show-toggle');
		} else if (toggleText === 'Show') {
			$input.attr('type', 'password');
		} else {
			$input.attr('type', 'text');
		}

		$input.trigger('afterPwToggleIE9Support');
	}, 1);
}
function ratingInit(context) {
	var $context = getContext(context);

	// Pass each average rating element to the ratingSetAverage() function.
	// What if there are no reviews?
	$vf('[data-rating-avg]').each(function() {
		var $avg_element 	= $vf(this);
		ratingSetAverage($avg_element);
	});

	// Set active class to nodes and return the user's rating.
	$context.off('click keypress', '[data-rating-value]');
	$context.on('click keypress', '[data-rating-value]', function (e) {
		if(keyClick(e) === true){
			e.preventDefault();
			var $node = $vf(this);
			ratingSetPersonal($node);
		}
	});

	// Accessibility Attributes
	$vf('[data-rating-id]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr({ 'aria-valuemin': 1, 'aria-valuemax': 5});
	});
	$vf('[data-rating-value]').each(function() {
		var $this = $vf(this);
		var value = $this.attr('data-rating-value');
		$this.attr({'role': 'button', 'aria-label': 'select to rate '+ value +' out of 5 stars', 'tabindex': -1});
	})

	// Controlling Navigation of the Rating items
	$context.off('keydown keypress', '[data-rating-id]:not([data-rating-avg])');
	$context.on('keydown keypress', '[data-rating-id]:not([data-rating-avg])', function(e) {
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		 * esc: 	27
		*/
		var $this = $vf(this);
		var currentRating, 
			newRating;
		if ($vf('[data-rating-value].active', $this).length) {
			currentRating = parseInt($vf('[data-rating-value].active', $this).attr('data-rating-value'), 10);
		} else {
			currentRating = false;
		}

		// IF home key or 1 character, set rating to 1
		if (e.which === 36 || e.charCode === 49) {
			e.preventDefault();
			$vf('[data-rating-value=1]', $this).click();
		} 
		// ELSE IF end key or 5 character, set rating to 5
		else if (e.which === 35 || e.charCode === 53) {
			e.preventDefault();
			$vf('[data-rating-value=5]', $this).click();
		} 
		// ELSE IF 2 character, set rating to 2
		else if (e.charCode === 50) {
			e.preventDefault();
			$vf('[data-rating-value=2]', $this).click();
		} 
		// ELSE IF 3 character, set rating to 3
		else if (e.charCode === 51) {
			e.preventDefault();
			$vf('[data-rating-value=3]', $this).click();
		}
		// ELSE IF 4 character, set rating to 4
		else if (e.charCode === 52) {
			e.preventDefault();
			$vf('[data-rating-value=4]', $this).click();
		}  
		// ELSE IF 0 character, un-rate
		else if(e.charCode === 48) {
			// IF already unrated, do nothing
			if (currentRating < 1 || currentRating === false) {
				// nothing
			}
			// ELSE unrate by setting to already rated
			else {
				$vf('[data-rating-value='+ currentRating +']', $this).click();
			}
		}
		// ELSE IF left or down rate down by 1
		else if (e.which === 37 || e.which === 40) {
			e.preventDefault();
			// IF not rated, do nothing
			if(currentRating < 1 || currentRating === false) {
				// nothing
			} 
			// ELSE IF rated 1, un-rate by clicking on 1 again
			else if(currentRating === 1) {
				newRating = 1;
			}
			// ELSE deduct by one rating
			else {
				newRating = currentRating - 1;
			}
			$vf('[data-rating-value='+ newRating +']', $this).click();
		} 
		// ELSE IF up key or right key, rate up by 1
		else if(e.which === 38 || e.which === 39) {
			e.preventDefault();
			// IF currentRating is already at 5, do nothing
			if(currentRating === 5) {
				// nothing
			} 
			// ELSE IF currentRating is not set, set to 1
			else if(currentRating < 1 || currentRating === false) {
				newRating = 1;
			}
			// ELSE increase rating by 1
			else {
				newRating = currentRating + 1;
			}
			$vf('[data-rating-value='+ newRating +']', $this).click();
		} 
		// ELSE IF Esc key, reset focus back on $this (rating widget)
		else if (e.which === 27) {
			e.preventDefault();
			$this.focus();
		}

	}); // end keypress/keydown event

};// end ratingInit()


// $node is jquery object representing a [data-rating-value] which was clicked
function ratingSetPersonal($node) {
	// Variables for rating value and state classes.
	var userRating	 	= $node.attr('data-rating-value'), // string
		parentID		= $node.parent().attr('data-rating-id'),
		inactive		= 'm_inactive-node',
		active 			= 'm_active-node';

	// if the clicked node is already active, then cancel all active nodes and return false
	if ($node.is('.active')) {
		// un-rate this thing
		$node.removeClass('active ' + active).addClass(inactive);
		$node.siblings().removeClass(active).addClass(inactive);
		return -1; // exit ratingSetPersonal()
	}

	$node.siblings().removeClass('active');
	$node.addClass('active').focus();

	// Iterate over the elements of the clicked node's parent container
	// and compare it's value to the value of the selected node.
	$vf('[data-rating-id=' + parentID +  '] > [data-rating-value]').each(function(){
		var $this = $vf(this);
		var thisRating 	= $this.attr('data-rating-value');

		// Change class depending on which node the user clicked.
		// This logic is reversed because the elements are position right-to-left.
		if (thisRating <= userRating) {
			if ($this.hasClass(active)) {
				// Prevent adding multiple active classes.
			}
			else {
				$this.removeClass(inactive).addClass(active);
			}
		}
		else if (thisRating > userRating) {
			if ($this.hasClass(active)) {
				$this.removeClass(active).addClass(inactive);
			}
		}
	});

	$vf('[data-rating-id='+ parentID +']').attr('aria-valuenow', userRating);

	// User's personal rating to be submitted.
	return userRating;
};

// Set width as percent of container
// $avg_element is [data-rating-avg]
function ratingSetAverage($avg_element) {
	var $reviewElement	= $avg_element.children('[data-rating-reviews]'),
		loadedWidth		= $avg_element.find('.rating_avg-container').width() + 1, // plus 1 for Firefox fix, due to px rounding differences between browsers
		avgRating		= parseFloat($avg_element.attr('data-rating-avg')).toFixed(1),
		totalReviews 	= $reviewElement.attr('data-rating-reviews').toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

	// console.log(loadedWidth, avgRating, totalReviews);
	
	$vf('.rating_avg-container', $avg_element).width(loadedWidth).attr('');
	$vf('.rating_avg-constrictor', $avg_element).width((avgRating/5)*loadedWidth);
	$avg_element.attr({'title': avgRating + ' out of 5', 'aria-label': 'Average rating is '+ avgRating + ' out of 5', 'aria-valuenow': avgRating});
	$reviewElement.text('(' + totalReviews + ')').attr('aria-label', 'Total Reviews: ' + totalReviews);
	// $avg_element.show();
};

// Backward compatable naming. Introduced new names starting with 'rating' in VZRF 2.19.0
var setPersonal = ratingSetPersonal;
var setAverage = ratingSetAverage;

function stepsInit(context) {
	var $context = getContext(context);

	// add .vzrf class to each steps bar to ensure they work with namespaced css
	$vf('[data-steps]').addClass('vzrf');

	var doEachStepsSizing = function() {
		$vf('[data-steps]', $context).each(function () {
			stepsSizing($vf(this));
		});
	}

	if ($vf('[data-steps]').length) {
		doEachStepsSizing();
		$vf(window).on('resize orientationchange', function() {
			doEachStepsSizing();
		});
	}
	
	// on click of a step that is also a tab
	$context.off('click keypress', '[data-steps][data-tabs] [data-tab]');
	$context.on('click keypress', '[data-steps][data-tabs] [data-tab]', function (e) {
		if(keyClick(e) === true){
			var $steps = $vf(this).closest('[data-steps]');
			stepsSizing($steps);
		}
	});


	// accessibility attributes
	$vf('[data-steps]').each(function() {
		var $this = $vf(this);
		var numSteps = $this.find('.steps_step').length;
		var activeStep = $this.find('.active.steps_step').index() + 1;
		$this.attr({
			'role': 'progressbar', 
			'aria-valuemin': 1,
			'aria-valuemax': numSteps, 
			'aria-valuenow': activeStep
		})

		// if combined with Tabs widget, then let tablist be the role.
		if($this.is('[data-tabs]')) {
			$this.attr('role', 'tablist');
		}
	});
}


// $steps: jQuery object of the wrapper of the [data-steps] element;
function stepsSizing($steps) {
	$steps.trigger('beforeStepsSizing');

	$steps.addClass('m_resizing');

	var numSteps = $vf('.steps_step', $steps).length;
	var barWidth = $steps.width();
	var widestStepWidth = 0;
	var evenSpreadPercent = 100 / numSteps + '%';

	// Copy the [data-steps] to measure stuff off view, 
	// resetting inline styles of clone.
	var $clone = $steps.clone().removeClass('m_abbr').css({
		'position':'absolute',
		'width':barWidth,
		'right':'-9999px',
		'opacity':'0'
	});
	$vf('.steps_step', $clone).attr('style', '').addClass('active');
	$vf('body').append($clone);
	
	// Determine what the clone's widest item (step) is when 
	// all the text is visible.
	$vf('.steps_step', $clone).each(function(i) {
		i++
		var $this = $vf(this);
		var stepWidth = Math.floor($this.width() + parseInt($this.css('padding-right')) + 6);
		//console.log(i + ' stepWidth => ' + stepWidth)
		if (stepWidth > widestStepWidth) {
			widestStepWidth = stepWidth;
			//console.log(i + ' widestStepWidth = ' + widestStepWidth);
		}
	});
	$clone.remove();

	
	// If all the steps can fit and be equal width, then show them all, 
	// else abbreviate the non-active steps with .m_abbr
	if((widestStepWidth * numSteps) < barWidth) {
		$steps.removeClass('m_abbr');
		$vf('.steps_step', $steps).css('width', evenSpreadPercent)
	} else {
		$steps.addClass('m_abbr');
		var remainingBarWidth = barWidth - widestStepWidth;
		var evenSpreadRemaining = 1 / (numSteps - 1);
		$vf('.steps_step.active', $steps).css('width', widestStepWidth);
		$vf('.steps_step:not(.active)', $steps).css('width', evenSpreadRemaining * remainingBarWidth);
	}

	$steps.removeClass('m_resizing');
	// console.log('numSteps => ' + numSteps);
	// console.log('barWidth => ' + barWidth);
	// console.log('widestStepWidth => ' + widestStepWidth);
	// console.log('evenSpreadPercent => ' + evenSpreadPercent);
	// console.log('evenSpreadRemaining => ' + evenSpreadRemaining);
	// console.log('remainingBarWidth => ' + remainingBarWidth);

	$steps.trigger('afterStepsSizing');
}
/* 
	VZRF Swiper makes use of the idangerous-swiper3.js plugin found in vzrf/js/vendor
	and uses the plugin's namespacing options to use the VZRF BEM naming convention.
	See http://www.idangero.us/swiper/api for full API
*/
function swiperInit(context) {

    var $context = getContext(context);
    // Prepare this Swiper. Each Swiper must have a unique data-swiper value
    $vf('[data-swiper]', $context).each(function () {
        var $this = $vf(this);
        $this.trigger('beforeSwiperInit');
        var id = $this.attr('data-swiper');
        var options = {

            //identify next/previous buttons & pagination
            pagination: '[data-swiper=' + id + '] > .swiper_pager',
            nextButton: '[data-swiper=' + id + '] > [data-swiper-next]',
            prevButton: '[data-swiper=' + id + '] > [data-swiper-prev]',

            //BEM naming convention
            slideClass: 'swiper_item',
            slideActiveClass: 'active',
            slideVisibleClass: 'visible',
            slideNextClass: 'swiper_slide-next',
            slidePrevClass: 'swiper_slide-prev',
            wrapperClass: 'w_swiper',
            paginationHiddenClass: 'swiper_pagination-hidden',
            paginationProgressbarClass: 'swiper_pagination-progressbar',
            //pagination: .swiper_pager

            // vzrf default options
            speed: 300,
            paginationClickable: true,
			keyboardControl: true,
			spaceBetween: 12,
			loop: true,
			a11y: true,
			onSlideChangeStart: function (swiper) {
			    var $container = $vf(swiper.container);
			    $container.trigger('beforeSwiperSlideChange');
			},
			onSlideChangeEnd: function (swiper) {
			    var $container = $vf(swiper.container);
			    // accessibility attributes

			    $vf('.swiper_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
			    $vf('.swiper_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });


			    $vf('.swiper_item > div > [data-swiper-next]').attr('tabindex', -1);
			    $vf('.swiper_item.active > div > [data-swiper-next]').attr('tabindex', 0);
			    $vf('.swiper_item > div > [data-swiper-prev]').attr('tabindex', -1);
			    $vf('.swiper_item.active > div > [data-swiper-prev]').attr('tabindex', 0);

			    $container.trigger('afterSwiperSlideChange');
			},
			onInit: function (swiper) {
			    var $container = $vf(swiper.container)
			    // accessibility attributes
			    $vf('.swiper_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
			    $vf('.swiper_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });
			    //$vf('[data-swiper-prev]', $container).attr({ 'aria-label': 'previous', 'tabindex': '0' });
			    $vf('[data-swiper-pager-list]', $container).attr('aria-label', 'swiper buttons');
			    $vf('[data-swiper-next]').each(function () {
			    	var $this = $vf(this);
			    	//set tabindex to 0 if not set already
			        if ($this[0].hasAttribute('tabindex') === false) {
			            $this.attr('tabindex', 0);
			        }
			        $this.attr('aria-label', 'next');
			    });
			    $vf('[data-swiper-prev]').each(function () {
			    	var $this = $vf(this);
			    	//set tabindex to 0 if not set already
			        if ($this[0].hasAttribute('tabindex') === false) {
			            $this.attr('tabindex', 0);
			        }
			        $this.attr('aria-label', 'previous');
			    });
			}
        }

        if ($this.is('[data-swiper-options]')) {
            var customOptionsText = $this.attr('data-swiper-options');
            var customOptions = JSON.parse(customOptionsText);
            $vf.extend(options, customOptions);
        }
		// run swiperToSwiper() to create a Swiper instance for the first time. 
        swiperToSwiper(id, options);

        $vf('.swiper-slide-duplicate > div >.button').attr('tabindex', -1);

		// Make work with Reveal Widget
		$this.closest('[data-reveal-content]').on('afterRevealShow', function() {
		    vfSwipers[id].onResize();
		});
		$this.trigger('afterSwiperInit');
    });

    var lastClicked;

    document.onkeydown = function(e) {
        //if (e.originalEvent) e = e.originalEvent; //jquery fix
        var kc = e.keyCode || e.charCode;
        if ((kc === 32 || kc === 13) && (lastClicked)) {
            vfSwipers[lastClicked].slideNext();
        }
    };

    $vf('[data-swiper-prev]', $context).off('click');
    $vf('[data-swiper-prev]', $context).on('click', function (e) {
        if (keyClick(e) === true) {
            var $this = $vf(this);
            lastClicked = $this.closest('[data-swiper]').attr('data-swiper');
            var swiperId;
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            vfSwipers[swiperId].slidePrev();
        }
    });
    $vf('[data-swiper-next]', $context).off('click');
    $vf('[data-swiper-next]', $context).on('click', function (e) {
        if (keyClick(e) === true) {
            var $this = $vf(this);
            var swiperId;
            lastClicked = $this.closest('[data-swiper]').attr('data-swiper');
            if ($this.closest('[data-swiper]').length) {
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            } else {
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            }
            vfSwipers[swiperId].slideNext();
        }
    });
}

// Global object that will hold all the iDangerous Swipers.
var vfSwipers = {};

// This function converts a [data-swiper] element into a full blown iDangerous Swiper.
// Parameters:
//		swiperId - string. The value found in the [data-swiper] attribute.
//		options - JSON. The JSON string containing all the customized options. 
function swiperToSwiper(swiperId, options) {
    var $swiper = $vf('[data-swiper=' + swiperId + ']');
    $swiper.trigger('beforeSwiperToSwiper');
    vfSwipers[swiperId] = $swiper.swiper(options);
    // add a DOM flag that this carousel has been initialized.
    $swiper.attr('data-swiper-init', 'true');
    $swiper.trigger('afterSwiperToSwiper');
}

function tabsInit(context) {
	var $context = getContext(context);
	
	// activating content areas when a page loads with an active tab
	$vf('[data-tab].active', $context).each(function() {
		switchTabs($vf(this));
	})
	
	// activating a new tab on click
	$context.off('click keypress', '[data-tab]');
	$context.on('click keypress', '[data-tab]', function (e) {
		if(keyClick(e) === true){
			var $tab = $vf(this);
			switchTabs($tab);
		}
	});

	// activating a new tab on radio change
	$context.off('change', '[data-tabs] [type=radio]');
	$context.on('change', '[data-tabs] [type=radio]', function (e) {
		var $radio = $vf(this);
		if ($radio.next().is('label[data-tab]')) {
			switchTabs($radio.next());
		} 
	});

	// Activating a new tab on touchend of label. 
	// This is needed because iOS doesn't like doing the click with the label due to bug. 
	$context.off('touchend', 'label[data-tab]');
	$context.on('touchend', 'label[data-tab]', function () {
		var $tab = $vf(this);
		switchTabs($tab);
	});

	/*
	**  accessibility attributes
	**
	 */

	$vf('[data-tabs]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		$this.attr('role', 'tablist');
	});
	$vf('[data-tabs] [type=radio]+label[data-tab]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);

		}
	});
	$vf('[data-tab]:not(label)').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);
		}
		$this.attr('role', 'tab');
		$this.attr('aria-selected', 'false');
	});


	$vf('[data-tab].active').attr({ 'aria-selected': true });
	$vf('[data-tabs-content]').attr({'role': 'tabpanel', 'aria-hidden': true});
	$vf('[data-tabs-content]').prop('hidden' ,true);
	$vf('[data-tabs-content].active').attr('aria-hidden', false);
	$vf('[data-tabs-content].active').prop('hidden' ,false);


	$context.off('keydown', '[data-tabs]');
	$context.on('keydown', '[data-tabs]', function(e) {
		if ($vf(this).find('label[data-tab]').length) {
			return;
		}
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		*/
		var $tablist = $vf(e.target).closest('[data-tabs]');
		var $tabs = $vf('> [data-tab]', $tablist);
		var activeTab = $tablist.find('> [data-tab].active').index();
		var lastTab = $tablist.find('> [data-tab]').length - 1;
		var prevTab = (function() {
			if (activeTab - 1 < 0) {
				return 0;
			} else {
				return activeTab - 1;
			}
		})();
		var nextTab = (function() {
			if (activeTab + 1 > lastTab) {
				return lastTab;
			} else {
				return activeTab + 1;
			}
		})();
		// IF home key, go to first tab
		if (e.which === 36) {
			switchTabs($vf($tabs.eq(0)));
		} 
		// ELSE IF end key, go to last tab
		else if (e.which === 35) {
			switchTabs($vf($tabs.eq(lastTab)));
		} 
		// ELSE IF left or up key, go to prev tab
		else if (e.which === 37 || e.which === 38) {
			switchTabs($vf($tabs.eq(prevTab)));
		} 
		// ELSE IF right or down key, go to next tab
		else if (e.which === 39 || e.which === 40) {
			switchTabs($vf($tabs.eq(nextTab)));
		} 

		// catch all
		if (e.which > 34 && e.which < 41) {
			e.preventDefault();
		}
		
	});
}


function switchTabs($selectedTab) {
	$selectedTab.trigger('beforeSwitchTabs');
	var $tabGroup = $selectedTab.closest('[data-tabs]')
	var tabName = $selectedTab.attr('data-tab');
	// deactivate all tabs in the group, then activate the clicked one
	$vf('> [data-tab]',$tabGroup).removeClass('active').attr('aria-selected', false);
	$selectedTab.addClass('active').attr('aria-selected', true).focus();
	// IF a label for a radio button
	if($selectedTab.is('label[data-tab]')) {
		$vf('#'+ $selectedTab.attr('for')).prop('checked', true);
	}


	// Find a [data-tabs-content] with the same tabName, then find
	// its [data-tabs-content-wrap] so that we can show the matching
	// [data-tabs-content] but hide all the others in the wrapper.
	var $content = $vf('[data-tabs-content="'+ tabName + '"]');
	var $contentWrap = $content.closest('[data-tabs-content-wrap]');

	// Hide all the content in the wrap then show the $content
	// Get any nested content areas to exclude later.
	var $nestedContentWraps = $contentWrap.find('[data-tabs-content-wrap] [data-tabs-content]');
	$vf('[data-tabs-content]', $contentWrap).not($nestedContentWraps).hide().removeClass('active').attr('aria-hidden', true).prop('hidden' ,true);
	$content.show().addClass('active').attr('aria-hidden', false).prop('hidden' ,false);

	// If this is a combo Tabs + Steps Widget then also update the aria-valuenow attribute
	if($tabGroup.is('[data-steps]')) {
		var activeStep = $tabGroup.find('.active.steps_step').index() + 1;
		$tabGroup.attr('aria-valuenow', activeStep);
	}

	// Initialize any List Controls that may have been hidden in the 
	// hidden content area, passing the visible content to listControlInit().
	listControlInit($content);
	$selectedTab.trigger('afterSwitchTabs');
}
// Tooltips can be used sort of like modals, in that you put the html for it
// at the bottom of the HTML page. A tooltip is then activated by clicking on 
// an element with the data-open-tooltip attribute with the value equal to the 
// Tooltip's data-tooltip attribute. However, while modals are always positioned
// in the same place relative to the top of the viewport, tooltips are positioned
// relative to the element used to activate it.

// Tooltips also have to width sizing options.  By giving the .w_tooltip a 
// modifying css class of .m_[size] you can pick from 4 max-width sizes.  However, 
// if the data-percent-available-space attribute is present, its value will be
// used as a percent based width.  The percent is relative to the amount
// of space from the left edge of the activiating element [data-open-tooltip] to
// the right edge of .main.  So a data-percent-available-space="90" causes the width  
// to be 90% of the space between the [data-open-tooltip] and the right side of .main.
// (This would be reversed for the tooltip contining the .m_rev class.). And if a .m_[size]
// class is also present it will attempt to stretch to 90% of the width until it reaches
// the .m_[size] max width.
function tooltipInit(context) {
	var $context = getContext(context);
	var tooltipTimer;


	$context.off('click keypress', '[data-open-tooltip]:not(.active)');
	$context.on('click keypress', '[data-open-tooltip]:not(.active)', function (e) {
		if (keyClick(e) === true) {
			var $this = $vf(this);
			// if this is a form field return false and let focus event handle it
			if ($this.is('input, select, textarea')) {
				return false;
			}

			var tipId = $this.attr('data-open-tooltip').trim();
			clearTimeout(tooltipTimer);
			closeTooltip();
			if (e.target.hasAttribute('data-open-tooltip')) {
				openTooltip(tipId, $this);
			}
		}
	});

	$context.off('click keypress', '[data-close-tooltip]');
	$context.on('click keypress', '[data-close-tooltip]', function (e) {
		if (keyClick(e) === true) {
			closeTooltip();
		}
	});

	//
	// for hover activated tooltips
	//
	$context.off('mouseover', '[data-open-tooltip][data-tooltip-hover]:not(.active)');
	$context.on('mouseover', '[data-open-tooltip][data-tooltip-hover]:not(.active)', function (e) {
		var $this = $vf(this);
		var delay = parseInt($this.attr('data-tooltip-hover')) || 150;

		tooltipTimer = setTimeout(function () {

			// if this is a form field return false and let focus event handle it
			if ($this.is('input, select, textarea')) {
				return false;
			}

			var tipId = $this.attr('data-open-tooltip');

			closeTooltip();
			if (e.target.hasAttribute('data-open-tooltip')) {
				openTooltip(tipId, $this, true);
			}
		}, delay);
	});

	$context.off('mouseout', '[data-open-tooltip][data-tooltip-hover]')
	$context.on('mouseout', '[data-open-tooltip][data-tooltip-hover]', function () {
		clearTimeout(tooltipTimer);
		closeTooltip();
	});


	//
	// for form fields that have data-open-tooltip.
	// Must be wrapped in [data-tooltip-field]
	//
	$context.off('focus', '[data-tooltip-field]');
	$context.on('focus', '[data-tooltip-field]', function () {
		var $this = $vf(this);
		var tipId = $vf('[data-open-tooltip]', $this).attr('data-open-tooltip');
		closeTooltip();
		openTooltip(tipId, $this);
	});

	$context.off('blur', '[data-tooltip-field]');
	$context.on('blur', '[data-tooltip-field]', function () {
		closeTooltip(true);
	});

	/*
	**  accessibility attributes
	**
	 */
	$vf('[data-open-tooltip]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr('aria-label', 'Show a tooltip');
	});
	$vf('[data-close-tooltip]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr('aria-label', 'Close tooltip');
	});
	$vf('[data-tooltip]').attr({ 'role': 'tooltip', 'aria-hidden': 'true' });
	// [data-tooltip-open] is applied to the <body> tag when there's a tooltip open.
	$context.off('keydown', '[data-tooltip], [data-tooltip-open]');
	$context.on('keydown', '[data-tooltip], [data-tooltip-open]', function (e) {
		if (e.which !== 27) {
			return;
		} else if ($vf(e.target).is('[data-open-tooltip]')) {
			closeTooltip();
		} else {
			closeTooltip();
			e.preventDefault();
		}
	});
}


// tipId: the text value of the [data-tooltip] attribute
// $tipActivator: jQuery object of the [data-open-tooltip] element
// hoverActivated: boolean. true if a hover activated tooltip
function openTooltip(tipId, $tipActivator, hoverActivated) {
	var $tooltip = $vf('[data-tooltip="' + tipId + '"]');

	$tooltip.trigger('beforeOpenTooltip');

	$vf('body').attr('data-tooltip-open', 'true');

	// If not a field tooltip
	if ($tipActivator.closest('[data-tooltip-field]').length == 0) {
		saveFocus();
	}

	$vf('[data-tooltip]').attr('aria-hidden', 'false');
	$tipActivator.addClass('active');
	if (hoverActivated) {
		$tooltip.addClass('m_hover');
	} else {
		$tooltip.removeClass('m_hover');
	}

	// DETERMINE WIDTH IF [data-percent-available-space] IS PRESENT:
	// Finds the space between the [data-open-tooltip] element and the edge
	// of .main. Then sets the width of the tooltip as a percent of this width.
	// If a .m_[size] class is also precent, the tooltip will not grow greater than
	// the max-width set by .m_[size].
	//
	// mainNegativeSpace is the difference of the right edge of .main, and the 
	// [data-open-tooltip] element, unless .m_rev is set, which makes it 
	// the difference of the left edge .main and the [data-open-tooptip] element.
	if (parseInt($tooltip.attr('data-percent-available-space'), 10) > 1) {
		var percent = $tooltip.attr('data-percent-available-space');
	} else {
		percent = 100;
	}

	var tipPos = $tipActivator.offset();
	var tipPosViewport = $tipActivator[0].getBoundingClientRect();
	var activatorWidth = $tipActivator.width();
	var tooltipSpacing = parseInt($tooltip.css('padding-left'), 10);
	if ($vf('.page.active').length > 0) {
		var $main = $vf('.page.active .main');
	} else if ($vf('.main').length > 0) {
		var $main = $vf('.main');
	} else {
		var $main = $tipActivator.closest($vf('.row, .modal_content, .w_modal'))
	}
	var mainWidth = $main.width();
	var mainPos = $main.offset();
	var mainNegativeSpace;

	// Calculate if there is more space to the right or left of the tipActivator. Make the tip 
	// flow in the direction of whichever is greater.
	var spaceLeft = tipPosViewport.left;
	var spaceRight = $vf(window).width() - tipPosViewport.right;
	var spaceBottom = tipPosViewport.bottom;
	var spaceTop = tipPosViewport.top;
	if ($tooltip.is('[data-tooltip-vertical]')) {

		if ($tooltip.data("tooltip-vertical") === "") {
			if (spaceTop < 120) {
				$tooltip.addClass('m_bottom');
			} else if (spaceTop > 1000) {
				$tooltip.removeClass('m_bottom');
			}
		} else if ($tooltip.data("tooltip-vertical") === "down") {
			$tooltip.addClass('m_bottom');
		} else {
			$tooltip.removeClass('m_bottom');
		}

	} else {
		if (spaceLeft > spaceRight) {
			$tooltip.addClass('m_rev');
		} else {
			$tooltip.removeClass('m_rev');
		}
	}
	if ($tooltip.hasClass('m_rev')) {
		mainNegativeSpace = tipPos.left - mainPos.left - tooltipSpacing;
	} else {
		mainNegativeSpace = mainWidth + mainPos.left - tipPos.left - tooltipSpacing - activatorWidth;
	}

	var tooltipWidth = mainNegativeSpace * (percent / 100);
	var toolWidth = $vf('[data-tooltip-vertical]').width();
	if ($tooltip.is('[data-tooltip-vertical]')) {
		if (toolWidth > spaceRight) {
			if (spaceLeft > spaceRight) {
				$tooltip.addClass('m_flow-left');
			} else {
				$tooltip.removeClass('m_flow-left');
			}
		} else {
			if ($tooltip.hasClass('m_flow-left')) {
				$tooltip.removeClass('m_flow-left');
			}
		}
	} else {
		$tooltip.css('width', tooltipWidth);
	}

	// nest the $tooltip inside the $tipActivator
	$tooltip.appendTo($tipActivator);
	$tooltip.addClass('active').fadeIn(300, function () {
		// IF not a field tooltip, AND close button exists put focus on data-close-tooltip, otherwise put focus on actual tooltip
		if ($tipActivator.closest('[data-tooltip-field]').length == 0) {
			if ($vf('[data-close-tooltip]', $tooltip).length) {
				$vf('[data-close-tooltip]', $tooltip).focus();
			} else {
				$tooltip.focus();
			}
		}
	});

	// Test height of tooltip and compare to available downward space to display. If not enough
	// room then check if there is enough room to flow upward rather than default downward. If so, 
	// add the .m_flow-up class.
	var tooltipHeight = $tooltip[0].scrollHeight;
	var windowHeight = $vf(window).height();
	if (tipPosViewport.top + tooltipHeight > windowHeight && tipPosViewport.top > tooltipHeight) {
		// if not a form field tooltip
		if ($tooltip.parents('[data-tooltip-field]').length < 1) {
			$tooltip.addClass('m_flow-up').css('margin-top', 37 - tooltipHeight);
		} else {
			$tooltip.addClass('m_flow-up').css('margin-top', $tooltip.parent('[data-tooltip-field]').height() + 10 - tooltipHeight);
		}
	} else {
		$tooltip.removeClass('m_flow-up').css('margin-top', 'auto');
	}
	if ($tooltip.is('[data-tooltip-vertical]')) {
		$tooltip.removeClass('m_flow-up').css('margin-top', 'auto');
	}
	if (!$tipActivator.is('[data-tooltip-field]')) {
		// close tooltips on window resize
		$vf(window).resize(function () {
			closeTooltip();
		});
	}

	$tooltip.trigger('afterOpenTooltip');
}

//fieldTip: boolean. ture if this is a field tooltip
function closeTooltip(fieldTip) {
	var $activeTooltip = $vf('[data-tooltip].active');
	$activeTooltip.trigger('beforeCloseTooltip');
	$vf('[data-toopltip]').attr('aria-hidden', 'true');
	if (fieldTip) {
		$activeTooltip.fadeOut(150).removeClass('active').attr('aria-hidden', true);
		$vf('[data-open-tooltip].active, [data-tooltip-field].active').removeClass('active');
	} else {
		$activeTooltip.fadeOut(150, function () {
			$vf(this).removeClass('active').attr('aria-hidden', true);
			$vf('[data-open-tooltip].active, [data-tooltip-field].active').removeClass('active');
		});
	}

	$vf('body').removeAttr('data-tooltip-open');


	if (fieldTip === false) {
		setTimeout(function () {
			resetFocus();
		}, 300);
	}
	$activeTooltip.trigger('afterCloseTooltip');
}
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


/*! VZRF Version 2.20.0 */
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
/*! VZRF Version 2.20.0 */
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



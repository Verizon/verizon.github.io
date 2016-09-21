/*! VZRF Version 2.20.0 */
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

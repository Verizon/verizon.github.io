/*! VZRF Version 2.20.0 */
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
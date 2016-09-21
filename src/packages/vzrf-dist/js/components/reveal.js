/*! VZRF Version 2.20.0 */
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


/*! VZRF Version 2.20.0 */
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
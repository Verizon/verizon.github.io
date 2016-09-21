/*! VZRF Version 2.20.0 */
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
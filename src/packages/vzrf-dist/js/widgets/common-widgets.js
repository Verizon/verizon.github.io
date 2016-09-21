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
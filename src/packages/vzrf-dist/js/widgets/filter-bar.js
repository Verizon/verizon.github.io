/*! VZRF Version 2.20.0 */
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

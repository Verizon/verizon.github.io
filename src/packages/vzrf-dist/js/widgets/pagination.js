/*! VZRF Version 2.20.0 */
function paginationInit(context) {
	var $context = getContext(context);

	// initial setup
	$vf('[data-pagination]').each(function() {
		var $this = $vf(this);
		var options = $this.attr('data-pagination');
		paginationBuilder($this, options);
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		// Accessibility Attributes
		$this.attr({
			'role': 'menubar',
			'aria-label': 'Pagination',
		});
	});

	// resize display of Pagination list items when window resizes
	var resizeTimer;
	$vf(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function() {
			$vf('[data-pagination]').each(function() {
				paginationDisplay($vf(this));
			});
			
		}, 50);
	});

	// set Pagination <a> click events
	$context.off('click keypress', '[data-pagination] a');
	$context.on('click keypress', '[data-pagination] a', function(e) {
		if(keyClick(e) === true) {
			var $this = $vf(this);
			var $parent = $this.parent();
			if ($parent.is('[data-page-first]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'first');
			} else if ($parent.is('[data-page-previous]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'previous');
			} else if ($parent.is('[data-page-next]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'next');
			} else if ($parent.is('[data-page-last]')) {
				paginationSetCurrentPage($this.closest('[data-pagination]'), 'last');
			} else if ($parent.is('[data-page-number]')) {
				var number = parseInt($this.closest('[data-page-number]').attr('data-page-number'));
				paginationSetCurrentPage($this.closest('[data-pagination]'), number);
			}
		}
	});

	$context.off('keydown', '[data-pagination]');
	$context.on('keydown', '[data-pagination]', function(e) {
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		*/
		var $this = $vf(this);
		// IF home key, go to first page
		if (e.which === 36) {
			paginationSetCurrentPage($this, 'first');
		} 
		// ELSE IF end key
		else if (e.which === 35) {
			paginationSetCurrentPage($this, 'last');
		} 
		// ELSE IF left or up key
		else if (e.which === 37 || e.which === 38) {
			paginationSetCurrentPage($this, 'previous');
		} 
		// ELSE IF right or down key
		else if (e.which === 39 || e.which === 40) {
			paginationSetCurrentPage($this, 'next');
		} 

		// catch all
		if (e.which > 34 && e.which < 41) {
			e.preventDefault();
			$vf('.active a', $this).focus();
		}
		
	});
}


function paginationBuilder(list, options) {
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}

	var reInit = false;
	if($list.data('initialized')) {
		var reInit = true;
	}
	$list.trigger('beforePaginationBuilder');

	// Make a JSON object out of options, even if a string is passed (like from data- attribute).
	if (typeof options == 'string' && options.length) {
		options = JSON.parse(options);
	} 


	// set default settings
	var defaults = {
		numPages: 1, 
		currentPage: null,
		includeFirstLast: true, 
		useEllipsis: true, 
		onPaginationLoad: function() {},
		onPaginate: function() {}
	}

	var settings = $vf.extend({}, defaults, options, $list.data());

	var elType;
	var $items;
	var markup = '';

	// Is $this a `div` or `ul`. 
	if($list.is('div')) {
		elType = 'div';
	} else if ($list.is('ul')) {
		elType = 'li';
	} else {
		console.error('VZRF paginationBuilder() error: Your root pagination element must be a <div> or <ul>');
		return false;
	}

	//***********************************
	// ~ MARKUP CREATION: Build out the items of the pagination list based on settings
	//***********************************
	
	// Check for reinitialization and set currentPage.
	if (reInit) {
		// if currentPage is null (not explicitly set in reinitialization) 
		// then use currently .active page as currentPage
		if(settings.currentPage == null) {
			settings.currentPage = parseInt($list.data('currentPage'));	
		} 
		$list.empty();
	} else {
		// if currentPage is null, set to 1
		if(settings.currentPage == null) {
			settings.currentPage = 1;
		}
	}

	// Are we to include the `first` link?
	if(settings.includeFirstLast) {
		markup += '<' + elType + ' class="pagination_item m_first" data-page-first title="first"><a href="#FirstPage" tabindex="-1" aria-label="Go to first page"></a></'+ elType +'>' 
	} 
	// previous link
	markup += '<' + elType + ' class="pagination_item m_prev" data-page-previous title="previous"><a href="#PreviousPage" tabindex="-1" aria-label="Go to previous page"></a></'+ elType +'>';
	
	// Loop numPages to write markup for each page number
	for(var i = 1; i <= settings.numPages; i++) {
		// IF not the last page
		if (i != settings.numPages) {
			markup += '<' + elType + ' class="pagination_item" data-page-number="'+ i +'"><a href="#Page'+ i +'" tabindex="-1" aria-label="Page '+ i +'" aria-checked="false" role="menuitemradio">'+ i +'</a></'+ elType +'>';
		} 
		// ELSE , this is last page so add special data-last-page attribute.
		else {
			markup += '<' + elType + ' class="pagination_item" data-page-number="'+ i +'" data-last-page><a href="#Page'+ i +'" tabindex="-1" aria-label="Page '+ i +'. The last page." aria-checked="false" role="menuitemradio">'+ i +'</a></'+ elType +'>';
		}
	}
	
	// next link
	markup += '<' + elType + ' class="pagination_item m_next" data-page-next title="next"><a href="#NextPage" tabindex="-1" aria-label="Go to next page"></a></'+ elType +'>';

	// Are we to include the `last` link?
	if(settings.includeFirstLast) {
		markup += '<' + elType + ' class="pagination_item m_last" data-page-last title="last"><a href="#LastPage" tabindex="-1" aria-label="Go to last page"></a></'+ elType +'>' 
	} 

	// Create a jQuery object of all the items
	$items = $vf(markup);
	
	// If settings.useEllipsis, insert it just before last page
	$list.append($items);

	//***********************************
	// end MARKUP CREATION
	//***********************************
	


	//***********************************
	// ~ UPDATE LIST DATA AND SET CURRENT PAGE
	//***********************************
	// set data on jQuery element
	$list.data({
		'initialized': true,
		'numPages': settings.numPages || $vf('[data-page-number]', $list).length,
		'currentPage': settings.currentPage,
		'useEllipsis': settings.useEllipsis, 
		'includeFirstLast': settings.includeFirstLast
	}).removeData('pagination');

	
	// Now that list is built, set the current page by running setCurrentPage(). 
	// this function will also run calculateDisplay() inside it.
	paginationSetCurrentPage($list, settings.currentPage);
			
	//***********************************
	// end UPDATE LIST DATA AND SET CURRENT PAGE
	//***********************************



	//***********************************
	// ~ CALLBACKS
	//***********************************	
	// callback function for any time you change a page.
	$list.on('afterPaginationSetCurrentPage', function() {
		settings.onPaginate.call($list);
	});

	// run afterPaginate callback function, then trigger afterPagination event
	settings.onPaginationLoad.call($list);
	$list.trigger('afterPaginationBuilder');
	
	//***********************************
	// end CALLBACKS
	//***********************************
} // end paginationBuilder


// Function to Mark the current page
// page: integer representing page to select or any of the following string values: 'first', 'previous', 'next', 'last'
// list: a jQuery object representing the pagination list or a jQuery selector string that should be the pagination list. 
function paginationSetCurrentPage(list, page) {
	var $list;
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}
	$list.trigger('beforePaginationSetCurrentPage');

	var $items = $vf('.pagination_item', $list);

	// now activate the appropriate page
	$items.each(function() {
		var $item = $vf(this);
		// IF `page` is a number
		if(page % 1 === 0 && $item.is('[data-page-number='+ page +']')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		}
		else if(page === 'first' && $item.is('[data-page-number=1]')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		} else if(page === 'last' && $item.is('[data-last-page]')) {
			$item.addClass('active').children('a').attr('aria-checked', 'true');
		} else if(page === 'previous' && $item.is('.active')) {
			if($item.prev().is('[data-page-number]')) {
				$item.removeClass('active').prev('[data-page-number]').addClass('active').children('a').attr('aria-checked', 'true');
			}
			return false; // exit the .each() loop
		} else if(page === 'next' && $item.is('.active')) {
			if($item.next().is('[data-page-number]')) {
				$item.removeClass('active').next('[data-page-number]').addClass('active').children('a').attr('aria-checked', 'true');
			}
			return false; // exit the .each() loop
		}
		// ELSE if $item is none of these, make sure it doesn't have .active
		else {
			$item.removeClass('active');
			if ($item.is('[data-page-number]')) {
				$item.children('a').attr('aria-checked', 'false');
			}
		}
	});

	// update the list's data 
	$list.data('currentPage', parseInt($vf('[data-page-number].active', $list).attr('data-page-number')));

	// Check the new .active class and update the arrows appropriately
	if ($vf('[data-page-number=1]', $list).is('.active')) {
		$vf('.m_first, .m_prev', $list).attr({'disabled': 'disabled', 'aria-disabled': 'true'});
		$vf('.m_last, .m_next', $list).removeAttr('disabled').attr('aria-disabled', 'false');
	} else if ($vf('[data-last-page]', $list).is('.active')) {
		$vf('.m_first, .m_prev', $list).removeAttr('disabled').attr('aria-disabled', 'false');
		$vf('.m_last, .m_next', $list).attr({'disabled': 'disabled', 'aria-disabled': 'true'});
	} else {
		$vf('.pagination_item', $list).removeAttr('disabled');
	}

	// update the pagination display with calculateDisplay
	paginationDisplay($list);	
	$list.trigger('afterPaginationSetCurrentPage');

}

// hides and shows page numbers based on logicalness and magic
// `list`: can be an ID of the pagination list or jQuery object representing the same.
function paginationDisplay(list) {
	var $list;
	if (list instanceof $vf || list instanceof jQuery) {
		$list = list;
	} else {
		$list = $vf('#' + list);
	}
	$list.trigger('beforePaginationDisplay');
	var $pages = $vf('[data-page-number]', $list);
	var currentPage = $list.data('currentPage') || 1;
	var numPages = $list.data('numPages');
	var listWidth = $list.width();
	var pageWidth = $vf('[data-page-number].active', $list).outerWidth();
	var allPagesWidth = pageWidth * numPages;
	var arrowsWidth = (function() {
		var width = 0;
		$vf('.m_first, .m_prev, .m_next, .m_last', $list).each(function() {
			width =  width + $vf(this).outerWidth(true);
		});
		return width;
	})();

	var availableSpace = listWidth - arrowsWidth;

	var ellipsis;
	// IF $list's useEllipsis is true and window width large enough, set `ellipsis` to true
	if (($list.data('useEllipsis') && $vf(window).width() >= 380 )
		|| ($vf(window).width() >= 300 && $list.data('includeFirstLast') == false)) {
		ellipsis = true;
		// insert the ellipsis with correct element type (<li> vs <div>)
		var elType;
		if ($list.is('ul')) {
			elType = 'li';
		} else {
			elType = 'div'
		}

		// IF .m_ellipsis does not exist, create it
		if ($vf('.m_ellipsis', $list).length < 1) {
			$pages.last().before('<'+ elType +' class="pagination_item m_ellipsis" aria-disabled="true" role="separator"></'+ elType +'>');
		}
	} else {
		ellipsis = false
		$vf('.m_ellipsis', $list).remove();
	}
	

	// IF availableSpace is equal are greater than allPagesWidth, everything can be shown and
	// we don't need to show the ellipsis
	if (availableSpace >= allPagesWidth) {
		if(ellipsis) {
			$vf('.m_ellipsis', $list).remove();
		}
		$pages.show();
	} 
	// ELSE there is not enough space so we have to start hiding items and attempting to 
	// center the .active [data-page-number]
	else {
		
		var numToShow = Math.floor(availableSpace / pageWidth);
		var middle = Math.round(numToShow / 2) - 1; // minus 1 so that +/- middle doesn't count middle
		
		var highestShown;
		var lowestShown;
		
		// IF currentPage + middle exceeds numPages
		if (!ellipsis && currentPage + middle >= numPages) {
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF ellipsis is involved AND numToShow is even, make little adjustment to remove ellipsis at appropriate currentPage
		else if (ellipsis && numToShow % 2 == 0 && currentPage + middle + 2 >= numPages) {
			$vf('.m_ellipsis', $list).remove();
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF ellipsis is involved make little adjustment to remove ellipsis at appropriate currentPage
		else if (ellipsis && currentPage + middle + 1 >= numPages) {
			$vf('.m_ellipsis', $list).remove();
			highestShown = numPages;
			lowestShown = numPages - numToShow + 1;
		} 
		// ELSE IF currentPage - middle is less than 1
		else if (currentPage - middle < 1) {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = numToShow - 2
				lowestShown = 1;
			} else {
				highestShown = numToShow;
				lowestShown = 1;
			}
		}
		// ELSE IF even number to be shown show one more to right than left
		else if(numToShow % 2 == 0) {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = currentPage + middle;
				lowestShown = currentPage - middle + 1;
			} else {
				highestShown = currentPage + middle + 1;
				lowestShown = currentPage - middle;
			}
		} 
		// ELSE split right down the middle.
		else {
			if(ellipsis) {
				$vf('.m_ellipsis', $list).show();
				highestShown = currentPage + middle - 1;
				lowestShown = currentPage - middle + 1;
			} else {
				highestShown = currentPage + middle;
				lowestShown = currentPage - middle;
			}
		}

		// console.log('===========================');
		// console.log('listWidth: ' + listWidth);
		// console.log('availableSpace: ' + availableSpace);
		// console.log('pageWidth: ' + pageWidth);
		// console.log('currentPage: ' + currentPage);
		// console.log('numToShow: ' + numToShow);
		// console.log('middle:' + middle);
		// console.log('lowestShown: ' + lowestShown);
		// console.log('highestShown: ' + highestShown);

		$pages.each(function(i) {
			i++; // increase the 0 index to equal page number
			var $this = $vf(this);

			
			// IF i is between lowest and highest number to show, then show it. 
			if(i >= lowestShown && i <= highestShown) {
				$this.show().attr('aria-hidden', 'false').prop('hidden' ,false);
			}
			// ELSE hide i
			else {
				$this.hide().attr('aria-hidden', 'true').prop('hidden' ,true);
			}
		}); // end $pages.each()

		if(ellipsis) {
			$pages.last().show().attr({'aria-hidden': 'false'}).prop('hidden' ,false);
		}
	}

	$list.trigger('afterPaginationDisplay');

}
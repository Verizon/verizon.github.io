/*! VZRF Version 2.20.0 */
function offCanvasInit(context) {
	var $context = getContext(context);

	var $menu = $vf('[data-off-canvas]');
	$menu.trigger('beforeOffCanvasInit');
	///***********************************
	// Events
	//***********************************
	// show/hide menu on icon click
	$context.off('click keypress', '[data-off-canvas-button]');
	$context.on('click keypress', '[data-off-canvas-button]', function (e) {
		e.preventDefault();
		if(keyClick(e) === true) {
			var menuOpen = $vf('body').attr('data-off-canvas-active');

			if (menuOpen == "false") {
				mobileNavState('open', $menu);
			} else {
				mobileNavState('close', $menu);
			}
		}
	});

	// Go to second level of navigation if a [data-more] element is clicked
	$menu.off('click keypress', '[data-more]');
	$menu.on('click keypress', '[data-more]', function (e) {
		e.preventDefault();
		if(keyClick(e) === true) {
			var $this = $vf(this);
			
			// if the current level of the nav is 2, then don't animate the 
			// change of level 2 options when a different level 1 is clicked.
			// Do this by adding the modifier class .swap to the nav. 
			if ($menu.attr('data-current-level') == "2") {
				$menu.addClass('swap');
			}

			if ($this.closest('ul').is('[data-level="1"]')) {
				// deactivate any currently selected level-1 items
				$vf('[data-level="1"] > li', $menu).removeClass('active focus');
				$menu.attr('data-current-level', "2");
			}

			$this.closest('li').addClass('active focus');
			offCanvasA11y();
		}
	});

	// Switch the active level-2 navigation item for the current list 
	// and close the nav.
	$menu.off('click keypress', '[data-link]');
	$menu.on('click keypress', '[data-link]', function (e) {
		if(keyClick(e) === true) {
			var $this = $vf(this);
			var levelWhenClicked = $menu.attr('data-current-level');

			
			// if the clicked link is a level-1, then put 
			// the menu back in level 1 active mode.
			if($this.closest('ul').is('[data-level="1"]')) {
				$menu.attr('data-current-level', '1');
				$vf('[data-level="1"] > li', $menu).removeClass('active focus');
			}

			$menu.removeClass('swap');
			$vf('[data-level="2"] > li', $menu).removeClass('active focus');
			$this.closest('li').addClass('active focus');

			// do this to overcome a strange webkit bug where sometimes the list items 
			// of level 2 do not display until scroll event is fired.  Strange.
			$menu.scroll();

			// If clicking a level 1 link when level 2 is showing, then delay the 
			// close of the navigation to give the animation of going back to level 1
			// time to complete. 
			if(levelWhenClicked == "2" && $this.closest('ul').is('[data-level="1"]')) {
				setTimeout(function() {
					mobileNavState('close', $menu);
				}, 300); // time needs to match the css animation speed
			} else {
				mobileNavState('close', $menu);
			}
			offCanvasA11y();
		}
	});

	// clicking the back button
	$menu.off('click keypress', '[data-back]');
	$menu.on('click keypress', '[data-back]', function (e) {
		e.preventDefault();
		if(keyClick(e) === true) {
			$menu.removeClass('swap');
			$menu.attr('data-current-level', '1');
			offCanvasA11y();
		}
	});


	// Controlling Navigation through the navigation 
	// with use of arrow keys;
	$context.off('keydown', '[data-off-canvas]');
	$context.on('keydown', '[data-off-canvas]', function(e) {
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		 * esc: 	27		 * enter: 	13		 * space: 	32
		*/
		var $menu = $vf(this);
		var $target = $vf(e.target);
		var $level2FocusItem = $vf('.active [data-level=2] > .focus', $menu);
		var $level1FocusItem = $vf('[data-level=1] > .focus', $menu);

		// IF home key, go to top of current list
		if (e.which === 36) {
			if($menu.attr('data-current-level') == 2) {
				$level2FocusItem.removeClass('focus');
				$level2FocusItem.siblings().removeClass('focus');
				$level2FocusItem.closest('[data-level]').children().first().addClass('focus').children('[data-more], [data-link]').focus();
			} else {
				$level1FocusItem.removeClass('focus');
				$level1FocusItem.siblings().removeClass('focus');
				$level1FocusItem.closest('[data-level]').children().first().addClass('focus').children('[data-more], [data-link]').focus();
			}
		} 
		// ELSE IF end key, go to bottom of current list
		else if (e.which === 35) {
			if($menu.attr('data-current-level') == 2) {
				$level2FocusItem.removeClass('focus');
				$level2FocusItem.siblings().removeClass('focus');
				$level2FocusItem.closest('[data-level]').children().last().addClass('focus').children('[data-more], [data-link]').focus();
			} else {
				$level1FocusItem.removeClass('focus');
				$level1FocusItem.siblings().removeClass('focus');
				$level1FocusItem.closest('[data-level]').children().last().addClass('focus').children('[data-more], [data-link]').focus();
			}
		} 
		// ELSE IF left go to prev level menu
		else if (e.which === 37) {
			// IF level 2, go back to level 1 view by clicking the data-back icon
			if($menu.attr('data-current-level') == 2) {
				var $parent = $level2FocusItem.closest('[data-level=1] > li');
				$vf('[data-back]', $menu).click();
				// put focus on the parent [data-level=1]
				$parent.addClass('focus').children('[data-more], [data-link]').focus();	
			}
		} 
		// ELSE IF right key or enter key or space key, go to next level menu
		else if (e.which === 39 || e.which === 13 || e.which === 32) {
			e.preventDefault();
			// IF menu is level 1
			if($menu.attr('data-current-level') == 1) {
				$level1FocusItem.siblings('.active').removeClass('.active');
				// simulate click of the focused item
				$vf('[data-level=1] > .focus > [data-more]', $menu).click();
				// remove .focus class from level 2 items.
				$vf('[data-level=1] > .focus [data-level=2] li', $menu).removeClass('focus');
				//add focus to the first level 2 item.
				$vf('[data-level=1] > .focus [data-level=2] li:first-child', $menu).addClass('focus').children('[data-more], [data-link]').focus();
				// force redraw in Chrome to overcome bug
				$vf('[data-level=2]', $menu).hide().show(0);
				setTimeout(function() {
					$vf('[data-level=2]:visible', $menu).hide().show(0);
				}, 350);
			}
			// ELSE IF level 2 and keycode is enter or space, click on that link to go to page
			else if($menu.attr('data-current-level') == 2 && (e.which === 13 || e.which === 32)) {
				
				var href = $vf('[data-link], [data-more]', $level2FocusItem).attr('href');
				$vf('[data-link], [data-more]', $level2FocusItem).click();
				window.location.href = href;
			}
		}
		// ELSE IF up key, go up one menu item
		else if(e.which === 38) {
			if($menu.attr('data-current-level') == 2 && ! $level2FocusItem.is(':first-child')) {
				$level2FocusItem.removeClass('focus');
				$level2FocusItem.prev().addClass('focus').children('[data-more], [data-link]').focus();
			} 
			else if ($menu.attr('data-current-level') == 2 && $level2FocusItem.is(':first-child')) {
				// do nothing
			}
			else if (!$level1FocusItem.is(':first-child')) {
				$level1FocusItem.removeClass('focus');
				$level1FocusItem.prev().addClass('focus').children('[data-more], [data-link]').focus();
			}
		} 
		// ELSE IF down key, go down one menu item
		else if(e.which === 40) {
			if($menu.attr('data-current-level') == 2 && ! $level2FocusItem.is(':last-child')) {
				$level2FocusItem.removeClass('focus');
				$level2FocusItem.next().addClass('focus').children('[data-more], [data-link]').focus();
			} 
			else if($menu.attr('data-current-level') == 2 && $level2FocusItem.is(':last-child')) {
				// do nothing
			}
			else if (!$level1FocusItem.is(':last-child')) {
				$level1FocusItem.removeClass('focus');
				$level1FocusItem.next().addClass('focus').children('[data-more], [data-link]').focus();
			}
		} 
		// ELSE IF Esc or Tab key, close menu.
		else if ( (e.which === 27 || e.which === 9) && $menu.is('.active')) {
			e.preventDefault();
			mobileNavState('close', $menu)
		}

		// catch all
		if (e.which > 34 && e.which < 41) {
			e.preventDefault();
		}
	});


	//***************
	// END EVENTS
	//***************


	// create overlay div if not already existing
	if ($vf('.page-overlay').length < 1) {
		$vf('body').append('<div class="page-overlay vzrf"></div>');
	} else {
		// ensure works with namepaced vzrf
		$vf('.page-overlay').addClass('vzrf');
	}

	$menu.trigger('afterOffCanvasInit');


	// Accessibility Attributes
	$vf('[data-off-canvas-button]').attr({'tabindex': 0, 'aria-haspopup': true})
	$vf('[data-off-canvas]').attr({'role': 'navigation', 'aria-hidden': true, 'tabindex': -1});
	$vf('[data-off-canvas] [data-level=1]').attr('role', 'menubar');
	$vf('[data-off-canvas] li').attr('role', 'menuitem');
	$vf('[data-more], [data-link], [data-back]', '[data-off-canvas]').attr('tabindex', '-1');
	


	offCanvasA11y();
}

function offCanvasA11y() {
	$vf('[data-off-canvas] [data-level=2]').each(function() {
		var $this = $vf(this);
		$this.closest('li').attr('aria-haspopup', true);
		if ($this.closest('li').is('.active')) {
			$this.attr('aria-hidden', false);
		} else {
			$this.attr('aria-hidden', true);
		}
	});
}
offCanvasA11y();

function mobileNavState(state, $menu) {
	var $menuBtn = $vf('[data-off-canvas-button]');

	if (state === 'open') {
		saveFocus();

		// place focus on active level 2 element or active level 1 element
		if($menu.is('[data-current-level=2]')) {
			var $activeItem = $vf('[data-level=1] > li.active > [data-level=2] > .active, [data-level=1] > li.active > [data-level=2] > .focus', $menu);
		} else {
			var $activeItem = $vf('[data-level=1] > li.active');
		}
		$activeItem.addClass('focus').find('[data-link], [data-more]').focus();
		$activeItem.siblings().removeClass('focus');

		if ($vf('html').hasClass('no-top-fixed')) {
			// for Android quirks, get height of nav, and set the .main to that height
			var menuHeight = $vf('.off-canvas_list-wrap', $menu).height();
			$vf('.main').css({ 'height': menuHeight, 'overflow': 'hidden' });
		}
		$vf('body').attr('data-off-canvas-active', 'true');
		$vf('.page-overlay').on('scroll mousewheel wheel touchmove touchstart', function (e) {
			e.preventDefault();
			e.stopPropagation();
		});
		$menuBtn.addClass('active');
			
		$menu.addClass('active')
		

		// close the nav when clicking on the .page_overlay
		$vf('html').on('click touchend', '.page-overlay', function () {
			if ($vf('body').attr('data-off-canvas-active') == "true") {
				mobileNavState('close', $menu);
			}
		});

	}

	if (state === 'close') {
		if ($vf('html').hasClass('no-top-fixed')) {
			// reverting changes applied on Open state for Android quirks.
			$vf('.main').css({ 'height': 'auto', 'overflow': 'auto' });
		}
		$vf('body').attr('data-off-canvas-active', 'false');
		$vf('.page-overlay').off('scroll mousewheel wheel touchmove touchstart').on('scroll mousewheel wheel touchmove touchstart');
		$menuBtn.removeClass('active').focus();
		$menu.removeClass('active swap');
		resetFocus();
	}

	offCanvasA11y();
}
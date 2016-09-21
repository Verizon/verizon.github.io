/*! VZRF Version 2.20.0 */
function a11yInit(context) {
	var $context = getContext(context);

	$vf(document).trigger('beforeA11yInit')
	/*
	** This JS file contains scripts that will append accessibility attributes to components and pages
	**
	*/
	
	$context.off('touchstart mousedown');
	$context.on('touchstart mousedown', function () {
		focusRingHide();
	});

	$context.off('keydown');
	$context.on('keydown', function (e) {
		// if navigation type of key is pressed (tab, esc, left, up, right, down)
		var code = e.which;
		if (code === 9 || code === 27 || (code >= 37 && code <= 40)) {
			focusRingShow();
		} 
	});
	
		
	$vf('a', $context).each(function() {
		var $this = $vf(this);
		// IF target is _blank and does not already have a title, add a title attribute.
		if ($this.is('[target=_blank]') && !$this.is('title')) {
			$this.attr('title', 'Opens New Window');
		}
	});


	/*
	** appending accessibility attributes to html semantic elements
	** 
	*/
	$vf('main', $context).attr('role', 'main');
	$vf('header', $context).attr('role', 'banner');
	$vf('nav', $context).attr('role', 'navigation');
	$vf('article', $context).attr('role', 'article');
	$vf('section', $context).attr('role', 'region');
	$vf('aside', $context).attr('role', 'complementary');
	$vf('footer', $context).attr('role', 'contentinfo');

	/*
	**  appending accessibility attributes to buttons
	**  
	*/
	$vf('.button', $context).each(function () {
		var $this = $vf(this);

		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		$this.attr('role', 'button');
	});

	//$vf('.button', $context).attr({'role': 'button','tabindex':'0'});

	/*
	** appending accessibility attributes to loading indicators
	**
	*/
	$vf('.loader', $context).attr({ 'role': 'alertdialog', 'aria-busy': 'true' });

	/*
	** appending accessibility attributes to loading Top Bar
	**
	*/
	$vf('.w_top-bar', $context).attr({ 'role': 'menubar' });

	/*
	** assigning tabindex to anchor tags
	**
	*/
	$vf('a', $context).attr({ 'tabindex': 0 });

	/*
	**assigning aria tags to vzicons
	**
	*/
	$vf('.vzicon', $context).attr({ 'aria-hidden': 'true' });

	$vf(document).trigger('afterA11yInit');
} // end accessibilityInit();

/*
**  Global function for detecting space and enter keys and mouse click
**
*/
function keyClick(e){ 
var code = e.charCode || e.keyCode;      
	if (e.type === 'click'){
	    return true;
	}
	else if (e.type === 'keydown') {
		if ((e.altKey && e.which === 38) || (e.altKey && e.which === 40) ) { // '38' is 'up' key and '40' is down key
		    return true;
		} else if (code === 32){		// '32' is spacebar
			// Do not scroll page when spacebar is hit while currentTarget is the actual target, 
			// but do allow default spacebar action otherwise.
			if (e.currentTarget === e.target) {
				e.preventDefault();
			}
	        return true;
	    }
	    else if (code === 13) { // '13' is 'enter' key
	        return true;
	    }
	}
	else if (e.type === 'keypress'){
	    if (code === 32){		// '32' is spacebar
			// Do not scroll page when spacebar is hit while currentTarget is the actual target, 
			// but do allow default spacebar action otherwise.
			if (e.currentTarget === e.target) {
				e.preventDefault();
			}
	        return true;
	    }
	    else if (code === 13) { // '13' is 'enter' key
	        return true;
	    }
	}
	else {
	    return false;
	}
}	


/*
 * Global set of functions for keeping track of a last focused element
 * when we move that focus inside of some screen-controling widget such 
 * as a Modal. When the widget use is complete, give focus back to the 
 * original element.
 */
var $vfFocus = $vf(document.activeElement);
function saveFocus() {
	$vfFocus = $vf(document.activeElement)
	return $vfFocus;
}

function resetFocus() {
	$vfFocus.focus();
	return $vfFocus;
}


/*
 * Focus Ring funtions.
 * Show the focus ring when navigating using the keyboard, but hide the 
 * focus ring when using mouse/touch events
 */

function focusRingHide() {
	// if the #FocusRingStyles does not exist, create it.
	if ($vf('#HideFocusRing').length === 0) {
		var styleHtml = '<style id="HideFocusRing">*:focus { outline:none; }</style>';
		$vf('head').append(styleHtml);
	} 
	
}

function focusRingShow() {
	if ($vf('#HideFocusRing').length) {
		$vf('#HideFocusRing').remove();
	} 	
}

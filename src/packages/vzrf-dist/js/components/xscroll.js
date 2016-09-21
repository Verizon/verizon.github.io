/*! VZRF Version 2.20.0 */
// Allows for horizontal scrolling via dragging either with mouse or with touch. 
// Prevents click events from being fired if dragging occurs so that clicks don't happen
// when the user really only wants to scroll.
function xScrollInit(context) {
	var $context = getContext(context);
	var clicked,
		clickedX,
		elementLeft,
		newX;

	$vf('[data-xscroll]').children().css({
		'display': 'inline-block',
		'float': 'none'
	});

	$context.off('mousedown', '[data-xscroll]');
	$context.on('mousedown', '[data-xscroll]', function(e){
		e.preventDefault();
		var $clickedElement = $vf(e.target);
		if ($clickedElement.parents('[data-xscroll]').length) {
			e.preventDefault();
	 		clicked		= true;
	 		clickedX	= e.pageX;
	 		elementLeft = $vf(this).scrollLeft();
		}
	});

	$context.off('mousemove', '[data-xscroll]');
	$context.on('mousemove', '[data-xscroll]', function(e){
		if (clicked) {
			newX = e.pageX;
 			$vf(this).scrollLeft(elementLeft - newX + clickedX);
 		}
	});

	$context.off('mouseup click', '[data-xscroll]');
	$context.on('mouseup click', '[data-xscroll]', function(e){
		clicked = false;
		if (Math.abs(newX - clickedX) > 15) {
			return false;
		}
	});
}

/*! VZRF Version 2.20.0 */
// get the height of the fixed bottom and then make an invisible element at
// the bottom of the page that is the same height so make an invisible bottom
// spacing. 
function fixedBottomInit(context) {
	var $context = getContext(context);

	var $activePage;

	// get the [data-fixed-bottom] element if exists in .page.active
	// or if not on a .page type flow, just see if it's in the DOM anywhere
	if ($vf('.page.active').length > 0) {
		$activePage = $vf('.page.active');
		var $bottomEl = $vf('.page.active [data-fixed-bottom]');
		// now put it as a direct child of the <body> so it can float properly
		$bottomEl.appendTo('body');

		// When new virtual page (.page element) is shown via a change in URL hash, 
		// put the $bottomEl back in its original .page element (i.e. $activePage)
		$vf(window).on('hashchange', function () {
			$bottomEl.appendTo($activePage);
		});
	} else {
		var $bottomEl = $vf('[data-fixed-bottom]');
	}

	var bottomFixedHeight = $bottomEl.outerHeight();

	// create #BottomSpacer div if not already existing
	if ($vf('#BottomSpacer').length < 1) {
		$vf('body').append('<div id="BottomSpacer"></div>');
	} 
	$vf(document).trigger('beforeFixedBottom');
	$vf('#BottomSpacer').css('height', bottomFixedHeight);
	$vf(document).trigger('afterFixedBottom');
}
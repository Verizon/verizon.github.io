/*! VZRF Version 2.20.0 */
function ratingInit(context) {
	var $context = getContext(context);

	// Pass each average rating element to the ratingSetAverage() function.
	// What if there are no reviews?
	$vf('[data-rating-avg]').each(function() {
		var $avg_element 	= $vf(this);
		ratingSetAverage($avg_element);
	});

	// Set active class to nodes and return the user's rating.
	$context.off('click keypress', '[data-rating-value]');
	$context.on('click keypress', '[data-rating-value]', function (e) {
		if(keyClick(e) === true){
			e.preventDefault();
			var $node = $vf(this);
			ratingSetPersonal($node);
		}
	});

	// Accessibility Attributes
	$vf('[data-rating-id]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr({ 'aria-valuemin': 1, 'aria-valuemax': 5});
	});
	$vf('[data-rating-value]').each(function() {
		var $this = $vf(this);
		var value = $this.attr('data-rating-value');
		$this.attr({'role': 'button', 'aria-label': 'select to rate '+ value +' out of 5 stars', 'tabindex': -1});
	})

	// Controlling Navigation of the Rating items
	$context.off('keydown keypress', '[data-rating-id]:not([data-rating-avg])');
	$context.on('keydown keypress', '[data-rating-id]:not([data-rating-avg])', function(e) {
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		 * esc: 	27
		*/
		var $this = $vf(this);
		var currentRating, 
			newRating;
		if ($vf('[data-rating-value].active', $this).length) {
			currentRating = parseInt($vf('[data-rating-value].active', $this).attr('data-rating-value'), 10);
		} else {
			currentRating = false;
		}

		// IF home key or 1 character, set rating to 1
		if (e.which === 36 || e.charCode === 49) {
			e.preventDefault();
			$vf('[data-rating-value=1]', $this).click();
		} 
		// ELSE IF end key or 5 character, set rating to 5
		else if (e.which === 35 || e.charCode === 53) {
			e.preventDefault();
			$vf('[data-rating-value=5]', $this).click();
		} 
		// ELSE IF 2 character, set rating to 2
		else if (e.charCode === 50) {
			e.preventDefault();
			$vf('[data-rating-value=2]', $this).click();
		} 
		// ELSE IF 3 character, set rating to 3
		else if (e.charCode === 51) {
			e.preventDefault();
			$vf('[data-rating-value=3]', $this).click();
		}
		// ELSE IF 4 character, set rating to 4
		else if (e.charCode === 52) {
			e.preventDefault();
			$vf('[data-rating-value=4]', $this).click();
		}  
		// ELSE IF 0 character, un-rate
		else if(e.charCode === 48) {
			// IF already unrated, do nothing
			if (currentRating < 1 || currentRating === false) {
				// nothing
			}
			// ELSE unrate by setting to already rated
			else {
				$vf('[data-rating-value='+ currentRating +']', $this).click();
			}
		}
		// ELSE IF left or down rate down by 1
		else if (e.which === 37 || e.which === 40) {
			e.preventDefault();
			// IF not rated, do nothing
			if(currentRating < 1 || currentRating === false) {
				// nothing
			} 
			// ELSE IF rated 1, un-rate by clicking on 1 again
			else if(currentRating === 1) {
				newRating = 1;
			}
			// ELSE deduct by one rating
			else {
				newRating = currentRating - 1;
			}
			$vf('[data-rating-value='+ newRating +']', $this).click();
		} 
		// ELSE IF up key or right key, rate up by 1
		else if(e.which === 38 || e.which === 39) {
			e.preventDefault();
			// IF currentRating is already at 5, do nothing
			if(currentRating === 5) {
				// nothing
			} 
			// ELSE IF currentRating is not set, set to 1
			else if(currentRating < 1 || currentRating === false) {
				newRating = 1;
			}
			// ELSE increase rating by 1
			else {
				newRating = currentRating + 1;
			}
			$vf('[data-rating-value='+ newRating +']', $this).click();
		} 
		// ELSE IF Esc key, reset focus back on $this (rating widget)
		else if (e.which === 27) {
			e.preventDefault();
			$this.focus();
		}

	}); // end keypress/keydown event

};// end ratingInit()


// $node is jquery object representing a [data-rating-value] which was clicked
function ratingSetPersonal($node) {
	// Variables for rating value and state classes.
	var userRating	 	= $node.attr('data-rating-value'), // string
		parentID		= $node.parent().attr('data-rating-id'),
		inactive		= 'm_inactive-node',
		active 			= 'm_active-node';

	// if the clicked node is already active, then cancel all active nodes and return false
	if ($node.is('.active')) {
		// un-rate this thing
		$node.removeClass('active ' + active).addClass(inactive);
		$node.siblings().removeClass(active).addClass(inactive);
		return -1; // exit ratingSetPersonal()
	}

	$node.siblings().removeClass('active');
	$node.addClass('active').focus();

	// Iterate over the elements of the clicked node's parent container
	// and compare it's value to the value of the selected node.
	$vf('[data-rating-id=' + parentID +  '] > [data-rating-value]').each(function(){
		var $this = $vf(this);
		var thisRating 	= $this.attr('data-rating-value');

		// Change class depending on which node the user clicked.
		// This logic is reversed because the elements are position right-to-left.
		if (thisRating <= userRating) {
			if ($this.hasClass(active)) {
				// Prevent adding multiple active classes.
			}
			else {
				$this.removeClass(inactive).addClass(active);
			}
		}
		else if (thisRating > userRating) {
			if ($this.hasClass(active)) {
				$this.removeClass(active).addClass(inactive);
			}
		}
	});

	$vf('[data-rating-id='+ parentID +']').attr('aria-valuenow', userRating);

	// User's personal rating to be submitted.
	return userRating;
};

// Set width as percent of container
// $avg_element is [data-rating-avg]
function ratingSetAverage($avg_element) {
	var $reviewElement	= $avg_element.children('[data-rating-reviews]'),
		loadedWidth		= $avg_element.find('.rating_avg-container').width() + 1, // plus 1 for Firefox fix, due to px rounding differences between browsers
		avgRating		= parseFloat($avg_element.attr('data-rating-avg')).toFixed(1),
		totalReviews 	= $reviewElement.attr('data-rating-reviews').toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

	// console.log(loadedWidth, avgRating, totalReviews);
	
	$vf('.rating_avg-container', $avg_element).width(loadedWidth).attr('');
	$vf('.rating_avg-constrictor', $avg_element).width((avgRating/5)*loadedWidth);
	$avg_element.attr({'title': avgRating + ' out of 5', 'aria-label': 'Average rating is '+ avgRating + ' out of 5', 'aria-valuenow': avgRating});
	$reviewElement.text('(' + totalReviews + ')').attr('aria-label', 'Total Reviews: ' + totalReviews);
	// $avg_element.show();
};

// Backward compatable naming. Introduced new names starting with 'rating' in VZRF 2.19.0
var setPersonal = ratingSetPersonal;
var setAverage = ratingSetAverage;

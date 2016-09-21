/*! VZRF Version 2.20.0 */
function stepsInit(context) {
	var $context = getContext(context);

	// add .vzrf class to each steps bar to ensure they work with namespaced css
	$vf('[data-steps]').addClass('vzrf');

	var doEachStepsSizing = function() {
		$vf('[data-steps]', $context).each(function () {
			stepsSizing($vf(this));
		});
	}

	if ($vf('[data-steps]').length) {
		doEachStepsSizing();
		$vf(window).on('resize orientationchange', function() {
			doEachStepsSizing();
		});
	}
	
	// on click of a step that is also a tab
	$context.off('click keypress', '[data-steps][data-tabs] [data-tab]');
	$context.on('click keypress', '[data-steps][data-tabs] [data-tab]', function (e) {
		if(keyClick(e) === true){
			var $steps = $vf(this).closest('[data-steps]');
			stepsSizing($steps);
		}
	});


	// accessibility attributes
	$vf('[data-steps]').each(function() {
		var $this = $vf(this);
		var numSteps = $this.find('.steps_step').length;
		var activeStep = $this.find('.active.steps_step').index() + 1;
		$this.attr({
			'role': 'progressbar', 
			'aria-valuemin': 1,
			'aria-valuemax': numSteps, 
			'aria-valuenow': activeStep
		})

		// if combined with Tabs widget, then let tablist be the role.
		if($this.is('[data-tabs]')) {
			$this.attr('role', 'tablist');
		}
	});
}


// $steps: jQuery object of the wrapper of the [data-steps] element;
function stepsSizing($steps) {
	$steps.trigger('beforeStepsSizing');

	$steps.addClass('m_resizing');

	var numSteps = $vf('.steps_step', $steps).length;
	var barWidth = $steps.width();
	var widestStepWidth = 0;
	var evenSpreadPercent = 100 / numSteps + '%';

	// Copy the [data-steps] to measure stuff off view, 
	// resetting inline styles of clone.
	var $clone = $steps.clone().removeClass('m_abbr').css({
		'position':'absolute',
		'width':barWidth,
		'right':'-9999px',
		'opacity':'0'
	});
	$vf('.steps_step', $clone).attr('style', '').addClass('active');
	$vf('body').append($clone);
	
	// Determine what the clone's widest item (step) is when 
	// all the text is visible.
	$vf('.steps_step', $clone).each(function(i) {
		i++
		var $this = $vf(this);
		var stepWidth = Math.floor($this.width() + parseInt($this.css('padding-right')) + 6);
		//console.log(i + ' stepWidth => ' + stepWidth)
		if (stepWidth > widestStepWidth) {
			widestStepWidth = stepWidth;
			//console.log(i + ' widestStepWidth = ' + widestStepWidth);
		}
	});
	$clone.remove();

	
	// If all the steps can fit and be equal width, then show them all, 
	// else abbreviate the non-active steps with .m_abbr
	if((widestStepWidth * numSteps) < barWidth) {
		$steps.removeClass('m_abbr');
		$vf('.steps_step', $steps).css('width', evenSpreadPercent)
	} else {
		$steps.addClass('m_abbr');
		var remainingBarWidth = barWidth - widestStepWidth;
		var evenSpreadRemaining = 1 / (numSteps - 1);
		$vf('.steps_step.active', $steps).css('width', widestStepWidth);
		$vf('.steps_step:not(.active)', $steps).css('width', evenSpreadRemaining * remainingBarWidth);
	}

	$steps.removeClass('m_resizing');
	// console.log('numSteps => ' + numSteps);
	// console.log('barWidth => ' + barWidth);
	// console.log('widestStepWidth => ' + widestStepWidth);
	// console.log('evenSpreadPercent => ' + evenSpreadPercent);
	// console.log('evenSpreadRemaining => ' + evenSpreadRemaining);
	// console.log('remainingBarWidth => ' + remainingBarWidth);

	$steps.trigger('afterStepsSizing');
}
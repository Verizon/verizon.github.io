/*! VZRF Version 2.20.0 */
function incrementInit(context) {
	var $context = getContext(context);

	$vf('[data-increment]', $context).each(function() {
		// Create the default or custom state of all the data-increment elments 
		var $this = $vf(this);
		incrementMinMaxCheck($this);
		incrementMessageUpdate($this);
	});

	// when a [data-increment-plus] is clicked
	$context.on('click keypress', '[data-increment-plus]:not(.disabled)', function(e) {
		if(keyClick(e) === true){
			var $increment = $vf(this).closest('[data-increment]');
			incrementPlus($increment);
			incrementMinMaxCheck($increment);
			incrementMessageUpdate($increment);
	 	}
	});

	// when a [data-increment-minus] is clicked
	$context.on('click keypress', '[data-increment-minus]:not(.disabled)', function(e) {
		if(keyClick(e) === true){
			var $increment = $vf(this).closest('[data-increment]');
			incrementMinus($increment);
			incrementMinMaxCheck($increment);
			incrementMessageUpdate($increment);
		}
	});
}


function incrementMessageUpdate($increment) {
	$increment.trigger('beforeIncrementMessageUpdate');
	var increment = $increment.attr('data-increment') || 1;
	var value = $increment.attr('data-increment-value') || 0;
	var message = $vf('[data-increment-message]', $increment).attr('data-increment-message') || '#';

	if (value > 1 || value < 1) {
		message = message.replace('#', value);
		message = message.replace('~', 's');
	} else if (value == 1) {
		message = message.replace('#', value);
		message = message.replace('~', '');
	}

	$vf('[data-increment-message]', $increment).text(message);
	$increment.trigger('afterIncrementMessageUpdate');
}

function incrementMinMaxCheck($increment) {
	$increment.trigger('beforeIncrementMinMaxCheck');
	var min = parseFloat($increment.attr('data-increment-min')) || 0;
	var max = parseFloat($increment.attr('data-increment-max')) || Infinity;
	var value = parseFloat($increment.attr('data-increment-value')) || 0;
	// disabling the minus and plus attribute elements
	if (value <= min) {
		$vf('[data-increment-minus]', $increment).addClass('disabled');
		$increment.attr('data-increment-value', min);
	} 
	if (value >= max) {
		$vf('[data-increment-plus]', $increment).addClass('disabled');
		$increment.attr('data-increment-value', max);
	} 

	// enabling the minus and plus attribute elements
	if(value < max) {
		$vf('[data-increment-plus]', $increment).removeClass('disabled');
	}
	if(value > min) {
		$vf('[data-increment-minus]', $increment).removeClass('disabled');
	}
	$increment.trigger('afterIncrementMinMaxCheck');
}

function incrementPlus($increment) {
	$increment.trigger('beforeIncrementPlus');
	var currentVal = parseFloat($increment.attr('data-increment-value'));
	var increment = parseFloat($increment.attr('data-increment')) || 1;
	var newVal = currentVal + increment;
	$increment.attr('data-increment-value', newVal);
	$increment.trigger('afterIncrementPlus');
}

function incrementMinus($increment) {
	$increment.trigger('beforeIncrementMinus');
	var currentVal = parseFloat($increment.attr('data-increment-value'));
	var increment = parseFloat($increment.attr('data-increment')) || 1;
	var newVal = parseFloat(currentVal - increment);
	$increment.attr('data-increment-value', newVal);
	$increment.trigger('afterIncrementMinus');
}


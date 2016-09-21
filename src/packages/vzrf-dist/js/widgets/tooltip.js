/*! VZRF Version 2.20.0 */
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
/*! VZRF Version 2.20.0 */
function tabsInit(context) {
	var $context = getContext(context);
	
	// activating content areas when a page loads with an active tab
	$vf('[data-tab].active', $context).each(function() {
		switchTabs($vf(this));
	})
	
	// activating a new tab on click
	$context.off('click keypress', '[data-tab]');
	$context.on('click keypress', '[data-tab]', function (e) {
		if(keyClick(e) === true){
			var $tab = $vf(this);
			switchTabs($tab);
		}
	});

	// activating a new tab on radio change
	$context.off('change', '[data-tabs] [type=radio]');
	$context.on('change', '[data-tabs] [type=radio]', function (e) {
		var $radio = $vf(this);
		if ($radio.next().is('label[data-tab]')) {
			switchTabs($radio.next());
		} 
	});

	// Activating a new tab on touchend of label. 
	// This is needed because iOS doesn't like doing the click with the label due to bug. 
	$context.off('touchend', 'label[data-tab]');
	$context.on('touchend', 'label[data-tab]', function () {
		var $tab = $vf(this);
		switchTabs($tab);
	});

	/*
	**  accessibility attributes
	**
	 */

	$vf('[data-tabs]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}
		$this.attr('role', 'tablist');
	});
	$vf('[data-tabs] [type=radio]+label[data-tab]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);

		}
	});
	$vf('[data-tab]:not(label)').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);
		}
		$this.attr('role', 'tab');
		$this.attr('aria-selected', 'false');
	});


	$vf('[data-tab].active').attr({ 'aria-selected': true });
	$vf('[data-tabs-content]').attr({'role': 'tabpanel', 'aria-hidden': true});
	$vf('[data-tabs-content]').prop('hidden' ,true);
	$vf('[data-tabs-content].active').attr('aria-hidden', false);
	$vf('[data-tabs-content].active').prop('hidden' ,false);


	$context.off('keydown', '[data-tabs]');
	$context.on('keydown', '[data-tabs]', function(e) {
		if ($vf(this).find('label[data-tab]').length) {
			return;
		}
		/* e.which reference:
		 * end: 	35		 * home: 	36		 * left: 	37		 
		 * up: 		38		 * right: 	39		 * down: 	40
		*/
		var $tablist = $vf(e.target).closest('[data-tabs]');
		var $tabs = $vf('> [data-tab]', $tablist);
		var activeTab = $tablist.find('> [data-tab].active').index();
		var lastTab = $tablist.find('> [data-tab]').length - 1;
		var prevTab = (function() {
			if (activeTab - 1 < 0) {
				return 0;
			} else {
				return activeTab - 1;
			}
		})();
		var nextTab = (function() {
			if (activeTab + 1 > lastTab) {
				return lastTab;
			} else {
				return activeTab + 1;
			}
		})();
		// IF home key, go to first tab
		if (e.which === 36) {
			switchTabs($vf($tabs.eq(0)));
		} 
		// ELSE IF end key, go to last tab
		else if (e.which === 35) {
			switchTabs($vf($tabs.eq(lastTab)));
		} 
		// ELSE IF left or up key, go to prev tab
		else if (e.which === 37 || e.which === 38) {
			switchTabs($vf($tabs.eq(prevTab)));
		} 
		// ELSE IF right or down key, go to next tab
		else if (e.which === 39 || e.which === 40) {
			switchTabs($vf($tabs.eq(nextTab)));
		} 

		// catch all
		if (e.which > 34 && e.which < 41) {
			e.preventDefault();
		}
		
	});
}


function switchTabs($selectedTab) {
	$selectedTab.trigger('beforeSwitchTabs');
	var $tabGroup = $selectedTab.closest('[data-tabs]')
	var tabName = $selectedTab.attr('data-tab');
	// deactivate all tabs in the group, then activate the clicked one
	$vf('> [data-tab]',$tabGroup).removeClass('active').attr('aria-selected', false);
	$selectedTab.addClass('active').attr('aria-selected', true).focus();
	// IF a label for a radio button
	if($selectedTab.is('label[data-tab]')) {
		$vf('#'+ $selectedTab.attr('for')).prop('checked', true);
	}


	// Find a [data-tabs-content] with the same tabName, then find
	// its [data-tabs-content-wrap] so that we can show the matching
	// [data-tabs-content] but hide all the others in the wrapper.
	var $content = $vf('[data-tabs-content="'+ tabName + '"]');
	var $contentWrap = $content.closest('[data-tabs-content-wrap]');

	// Hide all the content in the wrap then show the $content
	// Get any nested content areas to exclude later.
	var $nestedContentWraps = $contentWrap.find('[data-tabs-content-wrap] [data-tabs-content]');
	$vf('[data-tabs-content]', $contentWrap).not($nestedContentWraps).hide().removeClass('active').attr('aria-hidden', true).prop('hidden' ,true);
	$content.show().addClass('active').attr('aria-hidden', false).prop('hidden' ,false);

	// If this is a combo Tabs + Steps Widget then also update the aria-valuenow attribute
	if($tabGroup.is('[data-steps]')) {
		var activeStep = $tabGroup.find('.active.steps_step').index() + 1;
		$tabGroup.attr('aria-valuenow', activeStep);
	}

	// Initialize any List Controls that may have been hidden in the 
	// hidden content area, passing the visible content to listControlInit().
	listControlInit($content);
	$selectedTab.trigger('afterSwitchTabs');
}
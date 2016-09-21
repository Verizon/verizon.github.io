/*! VZRF Version 2.20.0 */
// Allows things to stick in place (fixed position) while scrolling. 
// See the Sticky-Kit jQuery plugin docs site: http://leafo.net/sticky-kit/
function stickyInit(context) {
	var $context = getContext(context);
	stickyKit($context);
	
}

function stickyKit($context) {
	$vf('[data-sticky]', $context).each(function(e) {
		var $this = $vf(this);
		$this.trigger('beforeStickyKit');
		var customOptionsText = {};
		var customOptions = {};
		// get options from data-sticky.
		if ($this.attr('data-sticky').length) {
			customOptionsText = $this.attr('data-sticky');
			customOptions = JSON.parse(customOptionsText);
		}

		var $potentialParent = $this.closest('[data-sticky-parent]');
	 	
		// Determine the `parent` element. Take options value passed
		// or use the sticky element's bottom margin plus sticky-to bottom padding.
	 	var $parent;
	 	if ("parent" in customOptions) {
	 		$parent = $vf(customOptions.parent);
	 	} else if ($potentialParent.length) {
			$parent = $potentialParent;
		} else {
			$parent = $this.parent();
		}

		// set some VZRF defaults
		var options = {
			"parent": $parent	
		}

		// gather a few vars for later use
		var originalZ = parseInt($this.css('z-index'), 10);
		var originalStyles = $this.attr('style');

		// extend the default options with VZRF's customOptions
		$vf.extend(options, customOptions);
		// initialize the sticky-kit plugin with updated options
		$this.stick_in_parent(options);
		
		// Set up several event functions for doing VZRF additions to the sticky-kit						
		$this.on('sticky_kit:stick sticky_kit:unbottom', function() {
			// add_class
			if("add_class" in customOptions) {
				$this.addClass(customOptions.add_class);
			}
			
			// remove_class
			if("remove_class" in customOptions) {
				$this.removeClass(customOptions.remove_class);
			}
			
			// z_index
			if ("z_index" in customOptions) {
				$this.css('z-index', customOptions.z_index);
			} else if (originalZ < 1) {
				$this.css('z-index', 1);
			} else {
				$this.css('z-index', originalZ)	
			}

		});

		$this.on('sticky_kit:unstick sticky_kit:bottom', function() {
			// add_class
			if("add_class" in customOptions) {
				$this.removeClass(customOptions.add_class);
			}
			
			// remove_class
			if("remove_class" in customOptions) {
				$this.addClass(customOptions.remove_class);
			}

		});
		
		$this.on('sticky_kit:unstick', function() {
			$this.attr('style', originalStyles);
		});

		// END custom VZRF options 
		/////////////////////////////////////////////////////////////////
		$this.trigger('afterStickyKit');
	});
}


// $vf(document).on('sticky_kit:unstick', function() {
// 	console.log('sticky_kit:unstick fired');
// });
// $vf(document).on('sticky_kit:bottom', function() {
// 	console.log('sticky_kit:bottom fired');
// });
// $vf(document).on('sticky_kit:stick', function() {
// 	console.log('sticky_kit:stick fired');
// });
// $vf(document).on('sticky_kit:unbottom', function() {
// 	console.log('sticky_kit:unbottom fired');
// });
/*! VZRF Version 2.20.0 */
/* 
	VZRF carousel makes use of the idangerous.swiper.min.js plugin found in vzrf/js/vendor
	and uses the plugin's namespacing options to use the VZRF BEM naming convention.
	See http://www.idangero.us/sliders/swiper/api.php for full API
*/
function carouselInit(context) {
	var $context = getContext(context);

	// Prepare this Carousel. Each Carousel must have a unique data-carousel value
	$vf('[data-carousel]', $context).each(function () {
		var $this = $vf(this);
		$this.trigger('beforeCarouselInit');
		var id = $this.attr('data-carousel');

		var options = {
			// pagination selector
			pagination: '[data-carousel-pager='+ id +'] > [data-carousel-pager-list]',

			// VZRF BEM naming convention
			wrapperClass: 'carousel_list',
			slideClass: 'carousel_item',
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			slideElement: 'li',
			noSwipingClass: 'm_no-swipe',
			paginationElement: 'span',
			paginationElementClass: 'carousel_pager-item',
			paginationActiveClass: 'active',
			paginationVisibleClass: 'visible',

			// Other vzrf default options
			loop: true,
			paginationClickable: true,
			roundLengths: true,
			cssWidthAndHeight: 'height',
			updateOnImagesReady:true,
			onSlideChangeStart: function (swiper) {
				var $container = $vf(swiper.container);
				$container.trigger('beforeCarouselSlideChange');
				// get the height of the newly active slide then set the height of the carousel to match
				var height = $vf(swiper.container).find('.carousel_item.active').height();
				$container.height(height);
			},
			onSlideChangeEnd: function(swiper) {
				var $container = $vf(swiper.container);
				// accessibility attributes
				$vf('.carousel_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
				$vf('.carousel_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });
				$vf('.carousel_item > div > [data-carousel-next]').attr('tabindex', -1);
				$vf('.carousel_item.active > div > [data-carousel-next]').attr('tabindex', 0);
				$vf('.carousel_item > div > [data-carousel-prev]').attr('tabindex', -1);
				$vf('.carousel_item.active > div > [data-carousel-prev]').attr('tabindex', 0);
				$container.trigger('afterCarouselSlideChange');
			},
			onInit: function(swiper) {
				var $container = $vf(swiper.container)
				var height = $container.find('.carousel_item.active').height();
				$container.height(height);

				// accessibility attributes
				$vf('.carousel_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
				$vf('.carousel_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });
				//$vf('[data-carousel-prev]', $container).attr({'aria-label':'previous', 'tabindex': '0'});
				$vf('[data-carousel-pager-list]', $container).attr('aria-label', 'carousel buttons');
				//$vf('[data-carousel-next]', $container).attr({ 'aria-label': 'next', 'tabindex': '0' });
				$vf('[data-carousel-next]').each(function () {
					var $this = $vf(this);
					// set tabindex to 0 if not set already
					if ($this[0].hasAttribute('tabindex') === false) {
						$this.attr('tabindex', 0);

					}

					$this.attr('aria-label', 'next');
				});
				$vf('[data-carousel-prev]').each(function () {
					var $this = $vf(this);
					// set tabindex to 0 if not set already
					if ($this[0].hasAttribute('tabindex') === false) {
						$this.attr('tabindex', 0);

					}

					$this.attr('aria-label', 'previous');
				});
			}
		}

		if ($this.is('[data-carousel-options]')) {
			var customOptionsText = $this.attr('data-carousel-options');
			var customOptions = JSON.parse(customOptionsText);
			$vf.extend(options, customOptions);
		}


		// reInit() if this carousel is already initialized. Prevents double initializing on run of vzrfInit()
		if ($this.is('[data-carousel-init=true]')) {
			// reInitialize Swiper if it's already been created by carouselToSwiper()
			carousels[id].reInit();			
		} else {
			// run carouselToSwiper() to create a Swiper instance for the first time. 
			carouselToSwiper(id, options);
		}

		$vf('.swiper-slide-duplicate > div >.button').attr('tabindex', -1);

		// Make work with Reveal Widget
		$this.closest('[data-reveal-content]').on('afterRevealShow', function() {
			carousels[id].resizeFix();
		});

		$this.trigger('afterCarouselInit');
	});

	// prev and next pager elements
	$vf('[data-carousel-prev]', $context).off('click keypress');
	$vf('[data-carousel-prev]', $context).on('click keypress', function(e) {
		if(keyClick(e) === true){ 
			var $this = $vf(this);
			var carouselId;
			if ($this.closest('[data-carousel-pager]').length) {
				carouselId = $this.closest('[data-carousel-pager]').attr('data-carousel-pager');
			} else {
				carouselId = $this.closest('[data-carousel]').attr('data-carousel');
			}
			carousels[carouselId].swipePrev();
		}
	});
	$vf('[data-carousel-next]', $context).off('click keypress');
	$vf('[data-carousel-next]', $context).on('click keypress', function(e) {
		if(keyClick(e) === true){ 
			var $this = $vf(this);
			var carouselId;
			if ($this.closest('[data-carousel-pager]').length) {
				carouselId = $this.closest('[data-carousel-pager]').attr('data-carousel-pager');
			} else {
				carouselId = $this.closest('[data-carousel]').attr('data-carousel');
			}
			carousels[carouselId].swipeNext();
		}
	});
}

var carousels = {};

function carouselToSwiper(carouselId, options) {
	var $carousel = $vf('[data-carousel=' + carouselId + ']');
	
	$carousel.trigger('beforeCarouselToSwiper');
	
	carousels[carouselId] = $carousel.swiper(options);
	// add a DOM flag that this carousel has been initialized.
	$carousel.attr('data-carousel-init', 'true');
	
	$carousel.trigger('afterCarouselToSwiper');
}


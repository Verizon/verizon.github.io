/*! VZRF Version 2.20.0 */
/* 
	VZRF Swiper makes use of the idangerous-swiper3.js plugin found in vzrf/js/vendor
	and uses the plugin's namespacing options to use the VZRF BEM naming convention.
	See http://www.idangero.us/swiper/api for full API
*/
function swiperInit(context) {

    var $context = getContext(context);
    // Prepare this Swiper. Each Swiper must have a unique data-swiper value
    $vf('[data-swiper]', $context).each(function () {
        var $this = $vf(this);
        $this.trigger('beforeSwiperInit');
        var id = $this.attr('data-swiper');
        var options = {

            //identify next/previous buttons & pagination
            pagination: '[data-swiper=' + id + '] > .swiper_pager',
            nextButton: '[data-swiper=' + id + '] > [data-swiper-next]',
            prevButton: '[data-swiper=' + id + '] > [data-swiper-prev]',

            //BEM naming convention
            slideClass: 'swiper_item',
            slideActiveClass: 'active',
            slideVisibleClass: 'visible',
            slideNextClass: 'swiper_slide-next',
            slidePrevClass: 'swiper_slide-prev',
            wrapperClass: 'w_swiper',
            paginationHiddenClass: 'swiper_pagination-hidden',
            paginationProgressbarClass: 'swiper_pagination-progressbar',
            //pagination: .swiper_pager

            // vzrf default options
            speed: 300,
            paginationClickable: true,
			keyboardControl: true,
			spaceBetween: 12,
			loop: true,
			a11y: true,
			onSlideChangeStart: function (swiper) {
			    var $container = $vf(swiper.container);
			    $container.trigger('beforeSwiperSlideChange');
			},
			onSlideChangeEnd: function (swiper) {
			    var $container = $vf(swiper.container);
			    // accessibility attributes

			    $vf('.swiper_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
			    $vf('.swiper_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });


			    $vf('.swiper_item > div > [data-swiper-next]').attr('tabindex', -1);
			    $vf('.swiper_item.active > div > [data-swiper-next]').attr('tabindex', 0);
			    $vf('.swiper_item > div > [data-swiper-prev]').attr('tabindex', -1);
			    $vf('.swiper_item.active > div > [data-swiper-prev]').attr('tabindex', 0);

			    $container.trigger('afterSwiperSlideChange');
			},
			onInit: function (swiper) {
			    var $container = $vf(swiper.container)
			    // accessibility attributes
			    $vf('.swiper_item', $container).attr({ 'aria-hidden': 'true', 'tabindex': '-1' });
			    $vf('.swiper_item.active', $container).attr({ 'aria-hidden': 'false', 'tabindex': '0' });
			    //$vf('[data-swiper-prev]', $container).attr({ 'aria-label': 'previous', 'tabindex': '0' });
			    $vf('[data-swiper-pager-list]', $container).attr('aria-label', 'swiper buttons');
			    $vf('[data-swiper-next]').each(function () {
			    	var $this = $vf(this);
			    	//set tabindex to 0 if not set already
			        if ($this[0].hasAttribute('tabindex') === false) {
			            $this.attr('tabindex', 0);
			        }
			        $this.attr('aria-label', 'next');
			    });
			    $vf('[data-swiper-prev]').each(function () {
			    	var $this = $vf(this);
			    	//set tabindex to 0 if not set already
			        if ($this[0].hasAttribute('tabindex') === false) {
			            $this.attr('tabindex', 0);
			        }
			        $this.attr('aria-label', 'previous');
			    });
			}
        }

        if ($this.is('[data-swiper-options]')) {
            var customOptionsText = $this.attr('data-swiper-options');
            var customOptions = JSON.parse(customOptionsText);
            $vf.extend(options, customOptions);
        }
		// run swiperToSwiper() to create a Swiper instance for the first time. 
        swiperToSwiper(id, options);

        $vf('.swiper-slide-duplicate > div >.button').attr('tabindex', -1);

		// Make work with Reveal Widget
		$this.closest('[data-reveal-content]').on('afterRevealShow', function() {
		    vfSwipers[id].onResize();
		});
		$this.trigger('afterSwiperInit');
    });

    var lastClicked;

    document.onkeydown = function(e) {
        //if (e.originalEvent) e = e.originalEvent; //jquery fix
        var kc = e.keyCode || e.charCode;
        if ((kc === 32 || kc === 13) && (lastClicked)) {
            vfSwipers[lastClicked].slideNext();
        }
    };

    $vf('[data-swiper-prev]', $context).off('click');
    $vf('[data-swiper-prev]', $context).on('click', function (e) {
        if (keyClick(e) === true) {
            var $this = $vf(this);
            lastClicked = $this.closest('[data-swiper]').attr('data-swiper');
            var swiperId;
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            vfSwipers[swiperId].slidePrev();
        }
    });
    $vf('[data-swiper-next]', $context).off('click');
    $vf('[data-swiper-next]', $context).on('click', function (e) {
        if (keyClick(e) === true) {
            var $this = $vf(this);
            var swiperId;
            lastClicked = $this.closest('[data-swiper]').attr('data-swiper');
            if ($this.closest('[data-swiper]').length) {
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            } else {
                swiperId = $this.closest('[data-swiper]').attr('data-swiper');
            }
            vfSwipers[swiperId].slideNext();
        }
    });
}

// Global object that will hold all the iDangerous Swipers.
var vfSwipers = {};

// This function converts a [data-swiper] element into a full blown iDangerous Swiper.
// Parameters:
//		swiperId - string. The value found in the [data-swiper] attribute.
//		options - JSON. The JSON string containing all the customized options. 
function swiperToSwiper(swiperId, options) {
    var $swiper = $vf('[data-swiper=' + swiperId + ']');
    $swiper.trigger('beforeSwiperToSwiper');
    vfSwipers[swiperId] = $swiper.swiper(options);
    // add a DOM flag that this carousel has been initialized.
    $swiper.attr('data-swiper-init', 'true');
    $swiper.trigger('afterSwiperToSwiper');
}

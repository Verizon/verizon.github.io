/*! VZRF Version 2.20.0 */
function modalInit(context) { 
	var $context = getContext(context);

	// add .vzrf to modals to ensure they work with namespaced css
	$vf('[data-modal]').addClass('vzrf');

	$context.off('click keypress', '[data-open-modal]');
	$context.on('click keypress', '[data-open-modal]', function (e) {
		if(keyClick(e) === true) {
			var modalId = $vf(this).attr('data-open-modal');
			$vf(this).attr("aria-haspopup", "false");
			if (!$vf(this).hasClass('disabled')) {
				if ($vf(this).is('[data-modal-section]')) {
					// section modals just cover a div with an ID matching the value of the [data-modal-section] value
					var sectionId = $vf(this).attr('data-modal-section');
					openModal(modalId, sectionId);
				} else {
					openModal(modalId);
				}
			} else {
				return false;
			}
	    }
	});

	$context.off('click keypress', '[data-close-modal]');
	$context.on('click keypress', '[data-close-modal]', function (e) {
		//e.preventDefault();
		if(keyClick(e) === true) {
			var $modal = $vf('[data-modal].active');
			var swap = $vf(this).is('[data-open-modal]');
			$vf('[data-open-modal]').attr('aria-haspopup', 'true');
			if (!$vf(this).hasClass('disabled')) {
				if ($vf(this).is('[data-validate-form]')) {
					if (!$vf('form', $modal).parsley().isValid()) {
						return false;
					} else {
						closeModal($modal, swap);
					}
				} else {
					closeModal($modal, swap);
				}
			} else {
				return false;
			}
		}
	});


	/* When a modal is open, certain actions can grow/shrink the content of the modal.
	   When these actions happen, run modalHeightSetter for the duration of the hight variation change */
	$vf('[data-modal]', $context).off('click keypress', '[data-modal-height], [data-accordion], [data-tab], [data-reveal-trigger], [data-reveal-trigger] + label');
	$vf('[data-modal]', $context).on('click keypress', '[data-modal-height], [data-accordion], [data-tab], [data-reveal-trigger], [data-reveal-trigger] + label', function (e) {
		var interval = setInterval(function () {
			modalHeightSetter();
		}, 10);

		setTimeout(function () {
			clearInterval(interval);
			modalHeightSetter();
			$vf('[data-modal].active [data-modal-content]').css('overflow-y', 'auto')
		}, 325);
	});


	/* Touch devices like to scroll the content behind the modal, when we are just trying
	   to scroll the content area in the modal. So we need to prevent propigation on touch scrolls. */
	/*	$vf('[data-modal-content]').on('touchmove touchstart touchend scroll scrollstart scrollend', function (e) {
			// this doesn't seem to work well. It seems mobile browsers just like to ignore this rule 
			// as well as the overflow:hidden; set on the body and html tags when the modal is opened.
			e.stopPropagation();
		});
	*/

	//IF NEEDED, this code will close the open modal when	clicking the overlay 
	$context.off('click', '.page-overlay');
	$context.on('click', '.page-overlay', function () {
		var $modal = $vf('[data-modal].active');
		if (!$modal.is('[data-disable-overlay-close]')) {
			closeModal($modal);
		}
	});


	/* Some other VZRF widgets will use the overlay, such as Filter Bar and Drop List.  If these are activated
	 * while a section Modal is open, and the opened widget is not inside the open modal, then close the opened (section) modal.
	 */
	$vf(document).on('beforeOpenFilter beforeShowDropList', function (e) {
		var $target = $vf(e.target);
		// IF the clicked thing is not in the active modal then do nothing
		if ($target.closest('[data-modal].active').length) {
			return false;
		}
			// ELSE close the modal id a modal is active
		else if ($vf('[data-modal].active').length) {
			closeModal($vf('[data-modal].active'));
		}
	});


	/* Iframe Modal does special setup on page load. */
	$vf('[data-modal-iframe]').each(function() {
		modalIframeSetup($vf(this));
	});
	$context.on('afterOpenModal', function () {
		// For some reason the sizing function does not always calculate correctly
		// when it is the first time the modal is shown.  Doing it twice in succession 
		// solves it with no UX downside. 
		setTimeout(function () {
			modalIframeSizing();
		}, 400);
		setTimeout(function () {
			modalIframeSizing();
		}, 700);
	});

	/* accessibility attributes */
	$vf('[data-modal]').attr({'role': 'dialog', 'aria-hidden': 'true'}).prop('hidden' ,true);

	$vf('[data-open-modal]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', 0);

		}

		$this.attr({ 'aria-label': 'Opens a Modal' ,'aria-haspopup': "true"});
	});
	$vf('[data-close-modal]').each(function () {
		var $this = $vf(this);
		// set tabindex to 0 if not set already
		if ($this[0].hasAttribute('tabindex') === false) {
			$this.attr('tabindex', -1);

		}

		$this.attr({ 'aria-label': 'Click here or press escape key to close the modal' });
	});

}// modalInit

// slow down the fireing of modalHeightSetter() calls with this debounce function.
$vf(function () {
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
	$vf(window).on('resize', debounce(function () {
		if($vf('[data-modal].active').length) {
			modalHeightSetter();

			if($vf('[data-modal].active').find('iframe').length) {
				modalIframeSizing();
			}
		}
	}, 100));

	$vf(window).on('orientationchange', function() {
		if($vf('[data-modal].active').length) {
			modalHeightSetter();
			if($vf('[data-modal].active').find('iframe').length) {
				modalIframeSizing();
			}
		}
	});
});

// modal: 'ModalName' or jQuery object
// section: 'SectionId' or jQuery object
function openModal(modal, section) {
	var $modal;
	if (modal instanceof $vf || modal instanceof jQuery) {
		$modal = modal;
	} else if (modal) {
		$modal = $vf('[data-modal=' + modal + ']');
	} else {
		console.error('Modal not defined or does not exist');
	}
	$modal.trigger('beforeOpenModal');
	saveFocus();
	$modal.attr({ 'aria-hidden': 'false', 'tabindex': '0' }).prop('hidden' ,false);
	$vf('[data-close-modal]', $modal).attr('tabindex', '0');
	$vf('main').attr('aria-hidden', 'true').prop('hidden' ,true);
	var $alreadyOpenModal = $vf('[data-modal].active');
	var $content = $vf('[data-modal-content]', $modal);
	var $header = $vf('[data-modal-header]', $modal);
	var $footer = $vf('[data-modal-footer]', $modal);
	var $section = false;
	if (section instanceof $vf || section instanceof jQuery) {
		$section = section;
	} else if (section) {
		$section = $vf('#' + section);
	}

	function activateModal() {
		// prevent body from scrolling
		$vf('body, html').addClass('no-scroll');

		$modal.addClass('active');	

		$vf('.page-overlay').addClass('active modal');
		if ($modal.hasClass('m_show-top-bar')) {
			$vf('.page-overlay').addClass('show-top-bar');
		}

		/*** TAB "Lock" inside modal ***/
		// So long as modal is open, lock the tabbing focus inside modal.
		// Also use Esc key to close modal.
		$vf(window).on('keyup', function(e) {
			// if TAB make sure it's inside $modal, if not make it so. 
			if(e.which === 9 && $vf(e.target).closest($modal).length == 0) {
				e.preventDefault();
				$modal.focus();
				modalHeightSetter();
			}

			// if ESC close modal.
			if(e.which === 27) {
				closeModal($modal);
			}
		});

	}

	function activateSectionModal() {
		$modal.trigger('beforeActivateSectionModal');
		var position = $section.css('position');
		if (position != 'absolute' && position != 'relative' && position != 'fixed') {
			$section.css('position', 'relative');
		}
		$section.css('overflow', 'hidden').attr('data-modal-section-element', '').scrollTop(0);

		$vf('.page-overlay').prependTo($section).addClass('modal absolute');
		setTimeout(function () {
			$vf('.page-overlay').addClass('active');
		}, 10)
		$modal.prependTo($section).addClass('m_section');
		setTimeout(function () {
			$modal.addClass('active');
			modalHeightSetter();
		}, 10);

		$modal.on('keyup', function(e) {
			// if ESC close modal.
			if(e.which === 27) {
				closeModal($modal);
			}
		});
		$modal.trigger('afterActivateSectionModal');
	}

	// make sure the modal you're trying to open actually exists
	if ($modal.length > 0) {
		// IF modal is not an immediate descendant of <body>, 
		// Pull the $modal out of whereever it may be and place just before the
		// closing <body> in order to avoid z-index issues
		if (!$modal.is('.active') && $modal.parent('body').length < 1) {
			$modal.appendTo('body');
		}

		// create overlay div if not already existing
		if ($vf('.page-overlay').length < 1) {
			$vf('body').append('<div class="page-overlay vzrf"></div>');
		} else {
			// ensure works with namepaced vzrf
			$vf('.page-overlay').addClass('vzrf');
		}
	

		// Different ways to open a modal depending on:
		// 1) IF clicked link's section is same as currently open section do nothing else, open in new section
		// 2) ELSE IF another modal is open, and new modal is not a section modal (normal modal)
		// 3) ELSE IF another modal is open, and the newly opened modal is a Section modal
		// 4) ELSE IF No other modal open and dot a section modal. Just normal behavior.
		// 5) ELSE No other modal open, but is a section modal. Open the section modal.

		// 1) IF clicked link's section is same as currently open section do nothing else, open in new section
		if ($modal.is($alreadyOpenModal) && $section.length > 0) {
			var prevSectionId = $modal.closest('[data-modal-section-element]').attr('id');
			if ($section.attr('id') === prevSectionId) {
				return false;
			} else {
				$modal.removeClass('active');
				$vf('[data-modal-section-element]').removeAttr('[data-modal-section-element]');
				$vf('.page-overlay').removeClass('active');
				setTimeout(function () {
					activateSectionModal();
				}, 350);
			}
		}
			// 2) another modal is open, and new modal is not a section modal
		else if ($alreadyOpenModal.length > 0 && !$section) {
			closeModal($alreadyOpenModal);
			// delay opening of new modal to allow time for $alreadyOpenModal to close
			setTimeout(function () {
				activateModal();
				modalVertAlign();
			}, 350);
		}
			// 3) another modal is open, and the newly opened modal is a Section modal
		else if ($alreadyOpenModal.length > 0 && $section.length > 0) {
			closeModal($alreadyOpenModal, true);
			setTimeout(function () {
				activateSectionModal();
				modalVertAlign();
			}, 350);
		}
			// 4) No other modal open and dot a section modal. Just normal behavior.
		else if (!$section) {
			activateModal();
		}
			// 5) No other modal open, but is a section modal. Open the section modal.
		else {
			activateSectionModal();
		}

		modalHeightSetter();
		setTimeout(function () {
		
			$modal.focus();
		}, 350);
	}
 	
	$modal.trigger('afterOpenModal');
}

// modal: 'ModalName' or jQuery object
// swap: undefined, false, true
function closeModal(modal, swap) {
	var $modal;
	if (modal instanceof $vf || modal instanceof jQuery) {
		$modal = modal;
	} else if (modal) {
		$modal = $vf('[data-modal=' + modal + ']');
	}
	$modal.trigger('beforeCloseModal');

	// remove this even handler which was set in side openModal() > activateModal()
	$vf(window).off('keyup');

	//$modal.attr({ 'aria-hidden': 'true', 'tabindex': '-1' }).prop('hidden' ,true);
	$vf('[data-close-modal]', $modal).attr('tabindex', '-1');
	//$vf('main').attr('aria-hidden', 'false').prop('hidden' ,false);
	// set a fixed height on modal so that it animates out nicely, then remove it once animation is done.
	var height = $modal.height();
	$modal.css('height', height);

	$modal.removeClass('active show-top-bar');
	setTimeout(function () {
		$modal.removeClass('m_section');
	}, 350);

	// If this modal was a section modal, then we need to reset the position set on the [data-modal-section-element]
	var $section = $vf('[data-modal-section-element]');
	if ($section.length > 0) {
		setTimeout(function () {
			$section.attr('style', '').removeAttr('data-modal-section-element');
		}, 350);
	}

	if (swap !== true) {
		$vf('.page-overlay.modal').removeClass('active modal show-top-bar');
		setTimeout(function () {
			$vf('.page-overlay').removeClass('absolute').appendTo('body');
		}, 350);
		$vf('body, html').removeClass('no-scroll');
	}

	// Reset the top position to the default value found in css, which is -100%
	// then remove the value once hidden
	$modal.css('top', '-100%');

	// if focus is on something inside the modal, such as a form field, then remove it. 
	$vf(':focus', $modal).blur();

	if ($vf('.page.active').length > 0) {
		setTimeout(function () {
			// nest the $modal back in the div.page.active
			$modal.appendTo('.page.active');
		}, 400);
	} else {
		// setTimeout(function () {
		// 	// nest the $modal back in the body
		// 	$modal.appendTo('body');
		// }, 400);
	}
	setTimeout(function () {
		$modal.attr({ 'aria-hidden': 'true', 'tabindex': '-1' }).prop('hidden', true);
		$vf('main').attr('aria-hidden', 'false').prop('hidden', false);

	}, 400);
	resetFocus();
	$modal.trigger('afterCloseModal');
};

function modalHeightSetter() {
	// make sure there is an active modal
	if ($vf('[data-modal].active').length < 1) {
		return false;
	}

	var $modal = $vf('[data-modal].active');
	$modal.trigger('beforeModalHeightSetter');

	var $content = $vf('[data-modal-content]', $modal);
	var $header = $vf('[data-modal-header]', $modal);
	var $footer = $vf('[data-modal-footer]', $modal);
	// reset any height previously set heights 
	$modal[0].style.height = '';
	$content[0].style.height = '';
	if($header.length) {
		$header[0].style.height = '';
		var headerHeight = $header[0].scrollHeight;
	} else {
		var headerHeight = 0;
	}
	if($footer.length) {
		$footer[0].style.height = '';
		var footerHeight = $footer[0].scrollHeight;
	} else {
		var footerHeight = 0;
	}
	var winHeight = $vf(window).height();
	var contentHeight = $content[0].scrollHeight || 0;

	// The modal's max height is set in CSS to be 90% or 100% depending on modal type.
	// Determine what the max height of the modal should be in px by multiplying 
	// winheight by .9 or 1 (90% or 100%).
	var modalMaxPercent = .9;
	if ($modal.is('.m_cover, .m_cover-all')) {
		modalMaxPercent = 1;
	}
	var modalMaxHeight = modalMaxPercent * winHeight;
	// Determine max height of content area by maxheight - header - footer
	var contentMaxHeight = modalMaxHeight - headerHeight - footerHeight;
	$content.css({
		'max-height': contentMaxHeight,
		'height': contentHeight
	});

	modalVertAlign();

	$modal.trigger('afterModalHeightSetter');
}

function modalVertAlign() {
	var $modal = $vf('[data-modal].active');
	var modalHeight = $modal.height();

	// special vertical positioning depending on modifier classes
	if ($modal.is('.m_vert-top, m_tall')) {
		$modal.css({
			"top": "5%",
			"margin-top": $vf(window).scrollTop(),
		});
	} else if ($modal.is('.m_cover, .m_cover-all')) {
		$modal.css({
			"top": 0,
			"margin-top": $vf(window).scrollTop(),
		});
	} else {
		$modal.css({
			"top": "50%",
			"margin-top": -1 * modalHeight / 2 + $vf(window).scrollTop()
		});
	}
}

function modalIframeSetup($modal) {
	$modal.trigger('beforeModalIframeSetup');
	// ensure an iframe does not already exist in this modal
	if($vf('iframe', $modal).length) {
		return false;
	}

	var src = $modal.attr('data-modal-iframe');


	// var testRequest = $vf.ajax({
	// 	url: src,
	// 	async: true, 
	// 	error: function() {
	// 		console.error("===========================================================================\n"
	// 			+ "VZRF Modal Iframe error: Cross-origin limitations\n"
	// 			+ "---------------------------------------------------------------------------\n"
	// 	        + "The iframe src is required to have the same domain as the parent page.\n" 
	// 	        + "This is so that the contents of the iframe can be access for programatically\n"
	// 	        + "determining the height of the iframe'd page. If same domain is not possible\n"
	// 	        + "in your situation then do not use [data-modal-iframe], but instead build your\n"
	// 	        + "own custom system inside the [data-modal-content] div of the modal. You will\n"
	// 	        + "likely need to set a fixed height for the iframe in this case.\n"
	// 	        + "===========================================================================");
	// 	}
	// });

	var $iframe = $vf('<iframe src="'+ src +'" scrolling="no"></iframe>');
	var modalContentHtml = '<div class="modal_content m_has-iframe" data-modal-content></div>';
	var iframeHeight;

	// IF data-modal-content does not exist, create it
	if($vf('[data-modal-content]', $modal).length < 1) {
		// IF $modal has a data-modal-header, put content after header
		if($vf('[data-modal-header]', $modal).length) {
			$vf('[data-modal-header]', $modal).after(modalContentHtml);
		} 
		// ELSE IF there is no header, but there is a .modal_x, put after the X
		else if ($vf('.modal_x', $modal).length) {
			$vf('.modal_x', $modal).after(modalContentHtml);
		}
		// ELSE it's the only child
		else {
			$modal.prepend(modalContentHtml);
		}
	}
	// ELSE data-modal-content does exist, so just make sure it has the .m_has-iframe class
	else {
		$vf('[data-modal-content]').addClass('m_has-iframe');
	}

	$vf.get( src )
		.fail(function() {
			console.error("===========================================================================\n"
					+ "VZRF Modal Iframe error: Cross-origin limitations\n"
					+ "---------------------------------------------------------------------------\n"
			        + "The iframe src is required to have the same domain as the parent page.\n" 
			        + "This is so that the contents of the iframe can be access for programatically\n"
			        + "determining the height of the iframe'd page. If same domain is not possible\n"
			        + "in your situation then do not use [data-modal-iframe], but instead build your\n"
			        + "own custom system inside the [data-modal-content] div of the modal. You will\n"
			        + "likely need to set a fixed height for the iframe in this case.\n"
			        + "===========================================================================");
		}).done(function() {
			$vf('[data-modal-content]', $modal).append($iframe);
			modalIframeSizing();
		});

	$modal.trigger('afterModalIframeSetup');
}

// Called from within modalIframeSetup() when iframe is loaded
// and used when window resizes, and when before/afterOpenModal event fires
function modalIframeSizing() {
	var $iframe = $vf('[data-modal].active iframe');
	$iframe.trigger('beforeModalIframeSizing');
	iframeNewHeight = $iframe.contents().find("body").outerHeight();
	$iframe.height(iframeNewHeight);
	modalHeightSetter();
	$iframe.trigger('afterModalIframeSizing');
}
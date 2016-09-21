/*! VZRF Version 2.20.0 */
// 
// Adds the browser name and version number to the body tag
// for use in special cases for browser comparability issues.
//
// Makes use of the bowser object from bowser.min.js. (Note the Mario Brothers spelling of "bowser", not "browser")
//
var browserDetect = {};
$vf(function () {
	// native iOS web view fix
	if (bowser.version == undefined) {
		bowser.version = 999;
	}

	var browserName = JSON.stringify(bowser.name).replace(/"/g, '');
	var browserVersion = JSON.stringify(bowser.version).replace(/"/g, '');
	var simpleOsVersion = parseFloat(bowser.osversion);
	var ios = false;
	if (browserName == 'iPhone' || browserName == 'iPad' || browserName == 'iPod') {
		ios = true;
	}

	browserDetect = {
		browserName: browserName,
		browserVersion: browserVersion,
		simpleOsVersion: simpleOsVersion,
		ios: ios
	}

	//***********************************
	// io and device checks
	//***********************************
	if (ios) { $vf('html').addClass('device-ios'); }
	if (bowser.android) { $vf('html').addClass('device-android'); }
	if (bowser.windowsphone) { $vf('html').addClass('device-windowsphone'); }
	if (bowser.blackberry) { $vf('html').addClass('device-blackberry'); }
	if (bowser.firefoxos) { $vf('html').addClass('device-firefoxos'); }
	if (bowser.webos) { $vf('html').addClass('device-webos'); }
	if (bowser.tablet || bowser.mobile) {
		if (bowser.mobile) { $vf('html').addClass('device-mobile'); }
		if (bowser.tablet) { $vf('html').addClass('device-tablet'); }
	} else {
		$vf('html').addClass('device-desktop');
	}

	// console.log('simpleOsVersion == ' + simpleOsVersion + ' | browserName == ' + browserName + ' | browserVersion == ' + browserVersion + ' | ios = ' + ios);
	// alert('simpleOsVersion == ' + simpleOsVersion + ' | browserName == ' + browserName + ' | browserVersion == ' + browserVersion + ' | ios = ' + ios);
	
	$vf('html').addClass('browser-name-' + browserName.toLowerCase().replace(/\s+/g, "-") + ' browser-version-' + parseInt(browserVersion));

	//***********************************
	// Android 
	//***********************************
	if (browserName == "Android") {
		//$vf('html').addClass('no-top-fixed alt-off-canvas');
		$vf('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, user-scalable=no');
	}

	//***********************************
	// iOS - adding ios specific string to the content attribute to fix iOS 9 bug.  https://developer.apple.com/library/ios/releasenotes/General/WhatsNewInSafari/Articles/Safari_9.html#//apple_ref/doc/uid/TP40014305-CH9-SW36
	//***********************************
	if (ios && browserVersion >= 9) {
		$vf('meta[name=viewport]').attr('content', $vf('meta[name=viewport]').attr('content') + ', shrink-to-fit=no');
	}

	//***********************************
	// Rotating Loader spinner doesn't work on pseudo elements in some browsers.
	//***********************************
	if (browserName == "Android" || (ios && browserVersion < 7) || browserName == "Internet Explorer" && browserVersion < 10) {
		$vf('html').addClass('gif-loader');
	}
	
	//***********************************
	// Put .old-ie class on the html tag for general ie9 specific styles.
	//***********************************
	if (browserName == "Internet Explorer" && browserVersion < 10) {
		$vf('html').addClass('old-ie');
	}

	//***********************************
	// Android 4.0 and 4.4 have problem with input type=number  not allowing decimal on the number keyboard. Fix it here by replacing with tel.
	//***********************************
	androidNumberToTel();

});

function androidNumberToTel() {
	if (bowser.android && browserDetect.simpleOsVersion <= 4.0 || browserDetect.simpleOsVersion == 4.1 || browserDetect.simpleOsVersion == 4.3 || browserDetect.simpleOsVersion == 4.4) {
		$vf('input[type="number"]').attr('type', 'tel');
	}
}
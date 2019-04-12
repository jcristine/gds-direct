/**
 * takes EMC session id either from cookies or query params,
 * redirects to login form if it's not available
 */
(() => {
	let urlObj = new URL(window.location.href);
	let rawToken = urlObj.searchParams.get('token');
	urlObj.searchParams.delete('token');
	let hashStr = urlObj.hash.substr(1);
	urlObj.hash = '';

	let hashData = {};
	let cookieData = {};
	for (let pair of hashStr.split('&')) {
		let [key, value] = pair.split('=');
		hashData[key] = value;
	}
	for (let pair of document.cookie.split('; ')) {
		let [key, value] = pair.split('=');
		if (value) { // there may be duplicates
			cookieData[key] = value;
		}
	}

	let emcSessionId = hashData.emcSessionId || cookieData.emcSessionId;

	let redirectToLoginPage = () => {
		fetch('/emcLoginUrl?returnUrl=' + encodeURIComponent(window.location.href))
			.then(rs => rs.json())
			.then(rsBody => {
				if (rsBody.emcLoginUrl) {
					window.location.href = rsBody.emcLoginUrl;
				} else {
					console.error('Invalid /emcLoginUrl response', rsBody);
				}
			});
	};

	let whenEmcSessionId = new Promise((resolve) => {
		if (emcSessionId) {
			resolve(emcSessionId);
		} else {
			if (rawToken) {
				fetch('/authorizeEmcToken?token=' + encodeURIComponent(rawToken))
					.then(rs => rs.json())
					.then(rsBody => resolve(rsBody.emcSessionId));
			} else {
				redirectToLoginPage();
			}
		}
	});

	whenEmcSessionId.then(emcSessionId => {
		document.cookie = 'emcSessionId=' + emcSessionId;
		window.history.replaceState('', '', urlObj.href); // remove GET params and # params
	});

	window.GdsDirectPlusPage = window.GdsDirectPlusPage || {};
	window.GdsDirectPlusPage.whenEmcSessionId = whenEmcSessionId;
	window.GdsDirectPlusPage.redirectToLoginPage = redirectToLoginPage;
})();
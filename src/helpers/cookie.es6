'use strict';

export function cookieSet(name, value, xdays) {
	let d = new Date();
	d.setTime(d.getTime() + (xdays*24*60*60*1000));
	const expires = 'expires='+ d.toUTCString();
	document.cookie = name + '=' + value + '; ' + expires;
}
'use strict';

export function cookieGet(name) {
	const value = '; ' + document.cookie;
	const parts = value.split('; ' + name + '=');

	if (parts.length === 2)
		return parts.pop().split(';').shift();
}

export function cookieSet(name, value, xdays) {
	let d = new Date();
	d.setTime(d.getTime() + (xdays*24*60*60*1000));
	const expires = 'expires='+ d.toUTCString();
	document.cookie = name + '=' + value + '; ' + expires;
}
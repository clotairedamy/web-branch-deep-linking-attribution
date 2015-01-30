goog.provide('utils');

/** @define {boolean} */
var DEBUG = true;

/** @typedef {string} */
message;

/** @typedef {{session_id:string, identity_id:string, link:string, data:string, referring_identity:string}} */
utils.sessionData;

/** @type {Object<string,message>} */
utils.messages = {
	missingParam: 'API request $1 missing parameter $2',
	invalidType: 'API request $1, parameter $2 is not $3',
	nonInit: 'Branch SDK not initialized',
	existingInit: 'Branch SDK already initilized',
	missingAppId: 'Missing Branch app ID'
};

/**
 * @param {message}
 * @param {?Array.<*>}
 * @throws {Error}
 */
utils.error = function(message, params) {
	throw new Error(utils.message(message, params));
};

/**
 * @param {message}
 * @param {?Array.<*>}
 */
utils.message = function(message, param) {
	var msg = message.replace(/\$(\d)/g, function(_, place) {
		return param[parseInt(place) - 1];
	});
	if (DEBUG && console) { console.log(msg); }
	return msg;
};

/**
 * @returns {?utils.sessionData}
 */
utils.readStore = function() {
	try {
		return JSON.parse(sessionStorage.getItem('branch_session')) || {};
	}
	catch (e) {
		return {};
	}
};

/**
 * @param {utils.sessionData}
 */
utils.store = function(data) {
	sessionStorage.setItem('branch_session', JSON.stringify(data));
};

utils.identity = function() {
	return utils.readSession() && utils.readSession().identity_id;
};
utils.session = function() {
	return utils.readSession() && utils.readSession().session_id;
};

utils.merge = function(to, from) {
	for (var attr in from) {
		if (from.hasOwnProperty(attr)) { to[attr] = from[attr]; }
	}
	return to;
};

utils.hashValue = function(key) {
	try {
		return location.hash.match(new RegExp(key + ':([^&]*)'))[1];
	}
	catch (e) {
		return '';
	}
};

utils.mobileReady = function() {
	return navigator.userAgent.match(/android|i(os|p(hone|od|ad))/i);
};

utils.closeBanner = function() {
	var d = document.getElementById('branch-banner');
	if (d) {
		d.parentNode.removeChild(d);
		document.body.style.marginTop = '0px';
	}
};
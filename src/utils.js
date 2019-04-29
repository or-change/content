const crypto = require('crypto');

exports.sha256 = function () {
	return crypto.createHmac('sha256');
}
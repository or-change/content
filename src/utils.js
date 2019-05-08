const crypto = require('crypto');

exports.sha256 = function (data) {
	return crypto.createHmac('sha256', 'secret').update(data).digest('hex');
};
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	name: {
		first: String,
		last: String
	},
	email: String,
	username: String,
	password: String
}), 'user');
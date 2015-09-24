var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	active: Boolean
}), 'user');
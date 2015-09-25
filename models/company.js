var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Company', new Schema({
	name: String,
	description: String,
	user_id: Schema.ObjectId,
}), 'company');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Company', new Schema({
	no: String,
	name: String,
	description: String,
	user_id: Schema.ObjectId,
}), 'company');
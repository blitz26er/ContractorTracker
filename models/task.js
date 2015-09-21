var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Task', new Schema({
	name: String,
	description: String,
	company_id: Schema.ObjectId
}), 'task');
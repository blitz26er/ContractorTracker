var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('JobReport', new Schema({
	no: String,
	name: String,
	description: String,
	user_id: Schema.ObjectId,
	company_id: Schema.ObjectId,
	job_id: Schema.ObjectId,
	tasks: [{
		_id: Schema.ObjectId,
		name: String,
		description: String,
		rate: Number,
		unit: String,
		work_period: Number
	}]
}), 'jobreport');

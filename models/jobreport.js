var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('JobReport', new Schema({
	comment: String,
	report_date: Date,
	no: String,
	name: String,
	description: String,
	job_id: Schema.ObjectId,
	user_id: Schema.ObjectId,
	user_name: String,
	company_id: Schema.ObjectId,
	fee: Number,
	tasks: [{
		_id: Schema.ObjectId,
		name: String,
		description: String,
		rate: Number,
		unit: String,
		work_period: Number,
		fee: Number,
	}]
}), 'jobreport');

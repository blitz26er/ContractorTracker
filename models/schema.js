var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
	firstname: String,
	lastname: String,
	email: String,
	password: String,
	active: Boolean,
	companies: [{
		type:Schema.ObjectId, ref: 'Company'
	}]
});

var CompanySchema = new Schema({
	no: String,
	name: String,
	description: String,
	user: [{
		type: Schema.ObjectId, ref: 'User'}
	}]

})

module.exports.UserModel = mongoose.model('User', UserSchema);
module.exports.CompanyModel = mongoose.model('Company', CompanyModel);
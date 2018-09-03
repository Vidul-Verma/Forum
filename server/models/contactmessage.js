const mongoose = require('mongoose');

var ContactMessage = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 1
	},
	email: {
		type: String,
		required: true,
		minlength: 1
	},
	gre: {
		type: String,
		required:false
	},
	toefl: {
		type: String,
		required:false
	},
	ielts: {
		type: String,
		required:false
	},
	cgpa: {
		type: String,
		required:false
	},
	phone: {
		type: String,
		required:false
	},
	message: {
		type: String,
		required: true,
		minlength: 1
	},
	createdAt: {
		type: Date,
        required: true,
		default: Date.now()
	},
	readByAdmin: {
		type: Boolean,
		default: false
	}
});

var ContactMessage = mongoose.model('ContactMessage', ContactMessage);

module.exports = {
	ContactMessage
};

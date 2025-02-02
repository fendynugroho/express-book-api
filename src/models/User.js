import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// Todo: add uniqueness and email validation to email field
const schema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			lowercase: true,
			index: true,
			unique: true
		},
		passwordHash: {
			type: String,
			required: true
		},
		confirmed: { type: Boolean, default: false },
		confirmationToken: { type: String, default: '' }
	},
	{ timestamp: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{
			email: this.email,
			confirmed: this.confirmed
		},
		process.env.SECRET_KEY
	);
};
schema.methods.generateResetPasswordToken = function generateResetPasswordToken() {
	return jwt.sign(
		{
			_id: this._id
		},
		process.env.SECRET_KEY,
		{ expiresIn: '1h' }
	);
};
schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		confirmed: this.confirmed,
		token: this.generateJWT()
	};
};

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.setConfirmationToken = function setConfirmationToken(password) {
	this.confirmationToken = this.generateJWT();
};

schema.plugin(uniqueValidator, { message: 'This email already registered!' });

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
	return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
};

schema.methods.generateResetPasswordUrl = function generateResetPasswordUrl() {
	return `${
		process.env.HOST
	}/reset-password/${this.generateResetPasswordToken()}`;
};

export default mongoose.model('User', schema);

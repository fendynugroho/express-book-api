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
		confirmed: { type: Boolean, default: false }
	},
	{ timestamp: true }
);

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.generateJWT = function generateJWT() {
	return jwt.sign(
		{
			email: this.email
		},
		process.env.SECRET_KEY
	);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		token: this.generateJWT()
	};
};

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.plugin(uniqueValidator, { message: 'This email already registered!' });

export default mongoose.model('User', schema);

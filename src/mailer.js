import nodemailer from 'nodemailer';

const from = '"BookApp" <info@bookapp.com>';

function setup() {
	return nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});
}

export function sendConfirmationEmail(user) {
	const transport = setup();
	const email = {
		from,
		to: user.email,
		subject: 'Welcome to the book app membership!',
		text: `Welcome to the book app, please confirm your email!.
        
        ${user.generateConfirmationUrl()}
        `
	};

	transport.sendMail(email);
}

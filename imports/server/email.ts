import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import settings from '/settings';
import { check } from 'meteor/check';

const configureMailServer = () => {
	// process.env.MAIL_URL = 'smtp://192.168.0.13:25';
	process.env.MAIL_URL = settings.mail_url_smtp;
};

export const getHTMLEmailTemplate = async (
	title = settings.name,
	text = 'Message',
	footer?: string
): Promise<string> => {
	let template = await Assets.getTextAsync('templateEmail.html');

	const data: Record<string, string> = {
		title,
		text,
		footer: footer ?? '',
	};

	template = template.replace(/\{\{\{?\s*(\w+)\s*\}?\}\}/g, (_, key) => {
		return data[key] ?? '';
	});

	return template;
};

async function sendEmail(
	to: string,
	from: string,
	subject: string,
	msg: string,
	attachments: object[] = []
): Promise<string> {
	// Make sure that all arguments are strings.
	check([to, from, subject, msg], [String]);
    // Let other method calls from the same client start running, without
	// waiting for the email sending to complete.
	// this.unblock();
	try {
		await Email.sendAsync({
			to,
			from,
			subject,
			replyTo: settings.mail_no_reply,
			html: await getHTMLEmailTemplate(subject, msg),
			attachments
		});
		return 'EMAIL OK';
	} catch (e) {
		throw e;
	}
}

Meteor.methods({
	sendEmail
});

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
	configureMailServer();
});

import Mailjet from 'node-mailjet';

const mailjet = Mailjet.apiConnect(
    process.env.API_MAILJET_KEY || '', // Remplace avec ta clé API
    process.env.API_MAILJET_SECRET || '' // Remplace avec ta clé secrète
);
import { User } from '../db/models/users';
import { Attendee } from '../db/models/attendees';



async function sendMail(
    to: Attendee,
    tpl: number,
    vars: { [key: string]: any },
    bcc?: User[]
) {

    let emailFrom = process.env.API_MAILJET_FROM;
    try {
        const request = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: emailFrom,
                        Name: "Eventz",
                    },
                    To: [{ Email: to.email, Name: to.firstname }],
                    TemplateID: tpl, // Remplace par ton TemplateID
                    TemplateLanguage: true,
                    Variables: vars,
                },
            ],
        });
        console.log("Mail Sent:", JSON.stringify(request.body, null, 2));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error sending email:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
    }

}

export { sendMail };

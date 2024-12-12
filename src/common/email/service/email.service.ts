import sgMail from '@sendgrid/mail';
import { config } from '../../config/default';

const sendGridAPIKey: string = config.SEND_GRID_API_KEY;
const sendGridSenderEmail: string = config.SEND_GRID_SENDER_EMAIL;
const sendGridTemplateId: string = config.SEND_GRID_TEMPLATE_ID;
const senbdGridEnabled: boolean = config.SEND_GRID_ENABLE;


async function sendEmail(to: string, message: any) {
    if (!senbdGridEnabled) {
        console.log("SendGrid is disabled");
        return;
    }
    sgMail.setApiKey(sendGridAPIKey);
    const msg = {
        to: to,
        from: sendGridSenderEmail,
        templateId: sendGridTemplateId,
        dynamic_template_data: message
    };
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);
    }
}

export { sendEmail };
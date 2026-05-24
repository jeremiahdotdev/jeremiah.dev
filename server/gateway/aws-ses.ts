import { ContactFormResponse, ContactFormSchemaType } from '@/types/contact'
import config from '@/config.json'
import {SESClient, SendEmailCommand} from '@aws-sdk/client-ses'
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings'

export async function sendEmail(contact: ContactFormSchemaType): Promise<ContactFormResponse> {
    if (!process.env.SES_RECIPIENT_ADDRESS) {
        throw new Error(`ERROR: Environment variable process.env.SES_RECIPIENT_ADDRESS is not set.`);
    }
    
    const $t = await getSiteDictionary()

    const awsConfig = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        apiVersion: "2010-12-01",
        region: "us-east-2"
    }
    const params = {
        Destination: {
            ToAddresses: [
                process.env.SES_RECIPIENT_ADDRESS
            ]
        }, 
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8", 
                    Data: contact.body
                }
            }, 
            Subject: {
                Charset: "UTF-8", 
                Data: `${config.api.site}: ${contact.subject}`
            }
        }, 
        ReplyToAddresses: [
            contact.email
        ], 
        Source: process.env.SES_SENDER_ADDRESS
    };

    const client = new SESClient(awsConfig);
    const send = new SendEmailCommand(params)
    const response = await client.send(send)

    const wasSuccess = response.$metadata.httpStatusCode === 200;

    return {
        success: wasSuccess,
        message: wasSuccess ? $t.contact.successMessage: $t.contact.failureMessage 
    }
}
    

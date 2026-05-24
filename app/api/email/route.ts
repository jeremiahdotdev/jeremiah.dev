import { sendEmail } from '@/server/gateway/aws-ses';
import { ContactFormSchemaType } from '@/types/contact';
import { NextRequest, NextResponse } from 'next/server';
import { verifyCaptcha } from '@/server/gateway/google-captcha';
import { getSiteDictionary } from '@/sanity/lib/getSiteSettings';

let requestCount = 0; // Global request counter
let lastResetTime = Date.now(); // Last reset timestamp
let wasNotified = false; // Determines if the warning email was sent.
const requestLimit = 50; // Request limit
const timeWindow = 3600000; // 1 hour in milliseconds

export async function POST(request: NextRequest) {
    const $t = await getSiteDictionary();
    const contactFormData: ContactFormSchemaType = await request.json();
    const token: string | null = request.headers.get("token");

    // Reset counter if the time window has passed
    if (Date.now() - lastResetTime > timeWindow) {
        requestCount = 0;
        lastResetTime = Date.now();
        wasNotified = false;
    }

    // Check if the request limit is exceeded
    if (++requestCount > requestLimit) {
        if (!wasNotified) {
            wasNotified = true;
            await sendEmail({
                email: "jeremiah.dev",
                body: `The throttle was reached at: ${new Date().toUTCString()}`,
                subject: "WARNING: THROTTLE REACHED"
            });
        }
        return NextResponse.json({ success: false, message: $t.contact.tooManyRequests });
    }

    // Verify CAPTCHA
    const isValid = await verifyCaptcha(token);
    
    if (isValid) {
        const response = await sendEmail(contactFormData);
        return NextResponse.json(response);
    } else {
        return NextResponse.json({ success: false, message: $t.contact.captchaFailed });
    }
}

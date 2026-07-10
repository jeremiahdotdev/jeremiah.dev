import config from '@/config.json';

export async function verifyCaptcha(token: string | null) { 
    if (!token) return false;
    
    const captchaResponse = await fetch(`${config.captcha}?key=${process.env.CAPTCHA_API_KEY}`, {
        method: 'POST',
        body: JSON.stringify({
            "event": {
              "token": `${token}`,
              "expectedAction": "submit",
              "siteKey": `${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`,
            }
        })
    });

    const captchaPayload = await captchaResponse.json();

    return !!captchaPayload?.tokenProperties?.valid
}
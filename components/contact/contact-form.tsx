"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/content/content-provider";
import { ContactFormResponse, ContactFormSchema, ContactFormSchemaType } from "@/types/contact";
import config from "@/config.json";
import { useCallback, useEffect, useRef, useState } from "react";
import ContactFormField from "./contact-form-field";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { TypographyMuted } from "../ui/typography";

export function ContactForm() {
  const [timesUsed, setTimesUsed] = useState<number>(-1);
  const [responseMessage, setResponseMessage] = useState<string>();
  const [responseFailed, setResponseFailed] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const loggedMessage = useRef(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const enableButton = useCallback(() => { setIsDisabled(false); }, []);
  const $t = useDictionary();
  const attemptThreshold = 1;

  const form = useForm<ContactFormSchemaType>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      email: "",
      subject: "",
      body: "",
    },
  });

  useEffect(()=>{
    // Note to developers on cookie usage for Google Recaptcha. 
    if (!loggedMessage.current) console.log($t.dev)
    loggedMessage.current = true
  }, [$t])

  const onSubmit = useCallback(
    async (values: ContactFormSchemaType) => {
      if (!executeRecaptcha) {
        setResponseMessage($t.contact.captchaFailed);
      } else {
        const token = await executeRecaptcha("submit");
        setResponseMessage("");
        setIsDisabled(true);
        try {
          const response = await fetch(config.api.email, {
            method: 'POST',
            headers: { token: token },
            body: JSON.stringify(values),
          });
          const { success, message }: ContactFormResponse = await response.json();
          setResponseMessage(message);
          setResponseFailed(!success);
          form.reset();
        } catch (error) {
          console.error(error);
        } finally {
          setTimesUsed(value => value + 1);
          setTimeout(enableButton, 5000 * (2 ** timesUsed));
        }
      }
    }, [$t, form, enableButton, executeRecaptcha, timesUsed]
  );
      
  return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-3/4 flex flex-col items-center justify-center gap-2">
          <ContactFormField name="email" type="email" label={$t.contact.email.label} placeholder={$t.contact.email.placeholder} description={$t.contact.email.description} />
          <ContactFormField name="subject" type="text" label={$t.contact.subject.label} placeholder={$t.contact.subject.placeholder} description={$t.contact.subject.description} />
          <ContactFormField name="body" type="textarea" label={$t.contact.body.label} placeholder={$t.contact.body.placeholder} description={$t.contact.body.description} />
          <Button disabled={isDisabled} type="submit" className="w-full md:w-1/2">
            {((timesUsed < attemptThreshold) || !isDisabled) ? $t.contact.button.label : $t.contact.button.pastAttemptThreshold}
          </Button>
          <TypographyMuted variant="status" tone={responseFailed ? "destructive" : "default"} className="flex w-full md:w-1/2 justify-end items-center">
            {responseMessage}
          </TypographyMuted>
        </form>
      </FormProvider>
  );
}

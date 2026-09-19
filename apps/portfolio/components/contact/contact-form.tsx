"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/content/content-provider";
import { ContactFormResponse, ContactFormSchema, ContactFormSchemaType } from "@/types/contact";
import config from "@/config.json";
import { useEffect, useRef, useState } from "react";
import ContactFormField from "./contact-form-field";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Typography } from "../ui/typography";
import SectionCard from "../shared/section-card";

export function ContactForm() {
  const [timesUsed, setTimesUsed] = useState<number>(-1);
  const [responseMessage, setResponseMessage] = useState<string>();
  const [responseFailed, setResponseFailed] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const loggedMessage = useRef(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
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

  useEffect(() => () => clearTimeout(cooldownTimer.current), []);

  async function onSubmit(values: ContactFormSchemaType) {
      if (!executeRecaptcha) {
        setResponseMessage($t.contact.captchaFailed);
        setResponseFailed(true);
      } else {
        setResponseMessage("");
        setResponseFailed(false);
        setIsDisabled(true);
        try {
          const token = await executeRecaptcha("submit");
          const response = await fetch(config.api.email, {
            method: 'POST',
            headers: { token, "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const { success, message }: ContactFormResponse = await response.json();
          setResponseMessage(message);
          setResponseFailed(!success);
          if (success) form.reset();
        } catch (error) {
          console.error(error);
          setResponseMessage($t.contact.failureMessage);
          setResponseFailed(true);
        } finally {
          setTimesUsed(value => value + 1);
          cooldownTimer.current = setTimeout(() => setIsDisabled(false), 5000 * (2 ** timesUsed));
        }
      }
  }
      
  return (
      <SectionCard className="mx-auto w-full max-w-3xl sm:py-6">
        <div className="text-center"><Typography as="h2" variant="section-label">{$t.contact.heading}</Typography></div>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 flex w-full flex-col gap-5">
            <ContactFormField name="email" type="email" label={$t.contact.email.label} placeholder={$t.contact.email.placeholder} description={$t.contact.email.description} />
            <ContactFormField name="subject" type="text" label={$t.contact.subject.label} placeholder={$t.contact.subject.placeholder} description={$t.contact.subject.description} />
            <ContactFormField name="body" type="textarea" label={$t.contact.body.label} placeholder={$t.contact.body.placeholder} description={$t.contact.body.description} />
            <Button disabled={isDisabled} type="submit" className="min-h-12 rounded-lg px-8 text-sm sm:self-end">
              {((timesUsed < attemptThreshold) || !isDisabled) ? $t.contact.button.label : $t.contact.button.pastAttemptThreshold}
            </Button>
            <Typography variant={responseFailed ? "error" : "caption"} role="status" aria-live="polite">
              {responseMessage}
            </Typography>
          </form>
        </FormProvider>
      </SectionCard>
  );
}

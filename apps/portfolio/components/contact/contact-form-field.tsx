import { FC, memo } from "react";
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

type ContactFormFieldProps = {
  name: "email" | "subject" | "body";
  type: string;
  label: string;
  description: string;
  placeholder: string;
};

const fieldClassName = "rounded-lg border-border/60 bg-background/60 text-base placeholder:text-muted-foreground/70";

const ContactFormField: FC<ContactFormFieldProps> = ({ type, name, label, description, placeholder }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem  className="w-full">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" 
              ? <Textarea className={`${fieldClassName} min-h-40 resize-y`} placeholder={placeholder} {...field} />
              : <Input className={`${fieldClassName} h-12`} autoComplete={field.name} type={type} placeholder={placeholder} {...field} />
            }
          </FormControl>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default memo(ContactFormField);

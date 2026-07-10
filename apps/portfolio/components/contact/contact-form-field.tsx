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
              ? <Textarea placeholder={placeholder} {...field} />
              : <Input autoComplete={field.name} type={type} placeholder={placeholder} {...field} />
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

import en from '@/dictionaries/en.json'

//This setup is easily adapted for internationalization. 
const dictionaries = {
  en: () => en,
}

export const getDictionary = () => dictionaries['en']()
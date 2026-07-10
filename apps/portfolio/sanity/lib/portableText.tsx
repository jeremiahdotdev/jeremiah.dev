import { PortableText } from '@portabletext/react'

export type PortableTextValue = Parameters<typeof PortableText>[0]['value']

export function renderPortableText(value?: PortableTextValue) {
  return value ? <PortableText value={value} /> : undefined
}

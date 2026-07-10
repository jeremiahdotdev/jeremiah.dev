
import { cn } from "@/lib/utils"
import { createElement, JSX, ReactNode } from "react"

export function ComponentOf({jsx, style}: {jsx: any, style?: string}) {
  let index = 0;
  return componentOfElement(jsx, style, index)
}

export function componentOfElement(el: any, style?: string, index?: number): JSX.Element | ReactNode {
  const hasChildren = el?.props?.children
  const hasChildrenArray = hasChildren && Array.isArray(hasChildren)

  if (!el?.type) return `${el}`

  let n = index ?? 0;
  const children = hasChildrenArray 
      ? el.props.children.map((child: any) => componentOfElement(child, style, ++n)) 
      : componentOfElement(el.props.children, style, ++n)

  if (hasChildren) {
    return createElement(
      el.type, 
      { ...el.props, key:`${el.type}-${n}`, className: cn(el.props.className, style) }, 
      children
    )
  } else {
    return createElement(
      el.type, 
      { ...el.props, key:`${el.type}-${n}`, className: cn(el.props.className, style) }
    )
  }
}

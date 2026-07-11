import React from "react";

export const If = ({ children }: { children: React.ReactNode | Element | React.ReactNode[] }) => {
  return <>{children}</>;
}

export const Else = ({ children }: { children: React.ReactNode | Element | React.ReactNode[] }) => {
  return <>{children}</>;
}

export const Check = ({ condition, children }: { condition: any; children: React.ReactNode | React.ReactNode[] }) => {

  let childrenArray: React.ReactNode[] = [];
  
  if (Array.isArray(children)) {
    childrenArray = children;
  } else {
    childrenArray = [children];
  }

  if (Boolean(condition)) {
    return childrenArray.filter((child) => React.isValidElement(child) && child.type === If);
  } else {
    return childrenArray.filter((child) => React.isValidElement(child) && child.type === Else);
  }
}


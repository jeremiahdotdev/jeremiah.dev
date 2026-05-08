"use client"
import { FC, useEffect, useState, memo, useMemo } from "react";

interface ThemeToggleProps {
    className?: string,
    stack: string[],
    end: string,
}

const TypeHeading: FC<ThemeToggleProps> = ({className, stack, end}: ThemeToggleProps) => {
    // the duration in milliseconds
    const duration = 5000;

    // the string that is shared between all the values in the stack
    let sharedText = ""
    const minLength = Math.min(...stack.map(i => i.length))
    for (let x = 0; x < minLength; x++) {
        const stringToCheck = stack[0].substring(0, x)
        if (!stack.some(val => {
            return val.substring(0, x) !== stack[0].substring(0, x)
        })) {
            sharedText = stringToCheck.substring(0, stringToCheck.length-1)
        }
    }
    // the stack without the shared string
    const newStack = stack.map(val => val.replace(sharedText, ''));
    const [title, setTitle] = useState<string>("")

    const [heading, setHeading] = useState<string>("")
    const [complete, setComplete] = useState<boolean>(false)
    
    const typeAhead = (index: number, length: number) => ((index % 2 === 0) || (index === length - 1)) ? "" : "|"

    const typeWord = (word: string, action=setHeading) => {
        const wordArray = word.split("");
        wordArray.forEach((character, index) => {
            setTimeout(() => { 
                action(`${wordArray.slice(0, index+1).join("")}${typeAhead(index, wordArray.length)}`)
            }, index * 150)
            
            // When you reach the end of the stack, cease typing. 
            if (index === wordArray.length - 1) return;
        })    
    }

    const untypeWord = (word: string) => {
        const wordArray = word.split("");
        wordArray.forEach((character, index) => {
            setTimeout(() => { 
                setHeading(`${wordArray.slice(0, wordArray.length-index-1).join("")}${typeAhead(index, wordArray.length)}`)
            }, index * 150 + (duration/2))
        })    
    }

    const typeEffect = () => {
        if (complete) return

        newStack.forEach((sentence, index) => {
            setTimeout(() => { 
                if (index < newStack.length) typeWord(sentence)
                if (index < newStack.length) untypeWord(sentence)
            }, index * duration)

            // When you reach the end of the stack, cease typing. 
            if (index === newStack.length - 1) return setComplete(true)
        })
        setTimeout(() => { 
            typeWord(end, setTitle)
        }, newStack.length * duration)
    }

    useEffect(typeEffect)

    const typeHeading = useMemo(() => (
        <span className={`font-serif flex items-center justify-center ${className}`}>
            <h1 className={`text-3xl md:text-4xl`}>
                {sharedText}{heading}{title}
            </h1>
        </span>
    ), [className, sharedText, heading, title])

    return typeHeading
}

export default memo(TypeHeading);
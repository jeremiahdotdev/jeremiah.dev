"use client"
import { FC, useEffect, useState, memo, useMemo, useRef } from "react";

interface ThemeToggleProps {
    className?: string,
    stack: string[],
    end: string,
}

const TypeHeading: FC<ThemeToggleProps> = ({className, stack, end}: ThemeToggleProps) => {
    // the duration in milliseconds
    const duration = 5000;

    const { sharedText, newStack } = useMemo(() => {
        let nextSharedText = ""
        const minLength = Math.min(...stack.map(i => i.length))

        for (let x = 0; x < minLength; x++) {
            const stringToCheck = stack[0].substring(0, x)
            if (!stack.some(val => {
                return val.substring(0, x) !== stack[0].substring(0, x)
            })) {
                nextSharedText = stringToCheck.substring(0, stringToCheck.length-1)
            }
        }

        return {
            sharedText: nextSharedText,
            newStack: stack.map(val => val.replace(nextSharedText, '')),
        }
    }, [stack])

    const [title, setTitle] = useState<string>("")
    const [heading, setHeading] = useState<string>(" ")
    const timeoutIds = useRef<number[]>([])
    const hasStarted = useRef(false)
    
    const typeAhead = (index: number, length: number) => ((index % 2 === 0) || (index === length - 1)) ? "" : "|"

    const typeWord = (word: string, action=setHeading) => {
        const wordArray = word.split("");
        wordArray.forEach((character, index) => {
            const timeoutId = window.setTimeout(() => { 
                action(`${wordArray.slice(0, index+1).join("")}${typeAhead(index, wordArray.length)}`)
            }, index * 150)
            timeoutIds.current.push(timeoutId)
            
            // When you reach the end of the stack, cease typing. 
            if (index === wordArray.length - 1) return;
        })    
    }

    const untypeWord = (word: string) => {
        const wordArray = word.split("");
        wordArray.forEach((character, index) => {
            const timeoutId = window.setTimeout(() => { 
                setHeading(`${wordArray.slice(0, wordArray.length-index-1).join("")}${typeAhead(index, wordArray.length)}`)
            }, index * 150 + (duration/2))
            timeoutIds.current.push(timeoutId)
        })    
    }

    const typeEffect = () => {
        if (hasStarted.current) return
        hasStarted.current = true

        newStack.forEach((sentence, index) => {
            const timeoutId = window.setTimeout(() => { 
                typeWord(sentence)
                untypeWord(sentence)
            }, index * duration)
            timeoutIds.current.push(timeoutId)
        })
        const timeoutId = window.setTimeout(() => { 
            typeWord(end, setTitle)
        }, newStack.length * duration)
        timeoutIds.current.push(timeoutId)
    }

    useEffect(() => {
        typeEffect()

        return () => {
            timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
            timeoutIds.current = []
            hasStarted.current = false
        }
    }, [end, newStack])

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

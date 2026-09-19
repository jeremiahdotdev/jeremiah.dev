"use client"
import { Typography } from "@/components/ui/typography";
import { FC, useEffect, useState, memo, useMemo } from "react";

interface TypeHeadingProps {
    className?: string,
    stack: string[],
    end: string,
}

const TypeHeading: FC<TypeHeadingProps> = ({className, stack, end}: TypeHeadingProps) => {
    // the duration in milliseconds
    const duration = 5000;

    const { sharedText, newStack } = useMemo(() => {
        if (stack.length === 0) return { sharedText: "", newStack: [] };

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

    useEffect(() => {
        const timeoutIds: number[] = [];
        const typeAhead = (index: number, length: number) => (
            (index % 2 === 0) || (index === length - 1) ? "" : "|"
        );

        function typeWord(word: string, action = setHeading) {
            const characters = Array.from(word);
            characters.forEach((_, index) => {
                timeoutIds.push(window.setTimeout(() => {
                    action(`${characters.slice(0, index + 1).join("")}${typeAhead(index, characters.length)}`);
                }, index * 150));
            });
        }

        function untypeWord(word: string) {
            const characters = Array.from(word);
            characters.forEach((_, index) => {
                timeoutIds.push(window.setTimeout(() => {
                    setHeading(`${characters.slice(0, characters.length - index - 1).join("")}${typeAhead(index, characters.length)}`);
                }, index * 150 + duration / 2));
            });
        }

        newStack.forEach((sentence, index) => {
            timeoutIds.push(window.setTimeout(() => {
                setTitle("");
                typeWord(sentence);
                untypeWord(sentence);
            }, index * duration));
        });
        timeoutIds.push(window.setTimeout(() => {
            setHeading("");
            typeWord(end, setTitle);
        }, newStack.length * duration));

        return () => timeoutIds.forEach(window.clearTimeout);
    }, [end, newStack]);

    const typeHeading = useMemo(() => (
        <div className={`flex items-center justify-center ${className}`}>
          <div className="px-5 text-center">
            <Typography as="h1" variant="page">
                {sharedText}{heading}{title}
            </Typography>
          </div>
        </div>
    ), [className, sharedText, heading, title])

    return typeHeading
}

export default memo(TypeHeading);

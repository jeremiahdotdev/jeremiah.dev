import { AspectRatio } from "@/globals/aspect-ratio";

interface GetQueryProps {
    minWidth?: AspectRatio, 
    maxWidth?: AspectRatio
}

export function getQuery({minWidth, maxWidth}: GetQueryProps): string {
    const queryOf = (type: "min" | "max", value: AspectRatio) => `(${type}-width: ${value}px)`
    const queryParameters = []
    if (!!minWidth) queryParameters.push(queryOf("min", minWidth));
    if (!!maxWidth) queryParameters.push(queryOf("max", maxWidth));
    return queryParameters.join(" and ")
}
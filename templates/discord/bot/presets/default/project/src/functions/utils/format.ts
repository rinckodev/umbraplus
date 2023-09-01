export function zeroPad(number: number): string {
    return number < 10 ? String(number) : `0${number}`; 
}

export function brBuilder(...text: string[]){
    return text.join("\n");
}

type ExtractVarKeys<T extends string> = T extends `${infer _}var(${infer Key})${infer Rest}`
? Key | ExtractVarKeys<Rest>
: never;

type StringFormat<T extends string> = {
    [K in ExtractVarKeys<T>]?: string;
};

export function formatString<T extends string>(input: T, values: StringFormat<T>): string {
    const regex = /var\(([^)]+)\)/g;
    const result = input.replace(regex, (_, key: T) => values[key] || "");

    return result;
}
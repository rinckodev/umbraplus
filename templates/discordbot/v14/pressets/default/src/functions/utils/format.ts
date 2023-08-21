export function zeroPad(number: number): string {
    return number < 10 ? String(number) : `0${number}`; 
}

export function brBuilder(...text: string[]){
    return text.join("\n");
}
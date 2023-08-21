import { gray, red } from "chalk";

export function onCrash(...errors: Array<any>){
    console.error(gray("[Anti Crash] "), red(errors.join("\n")));
}
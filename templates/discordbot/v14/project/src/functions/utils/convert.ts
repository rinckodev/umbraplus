export function hexToRgb(color: string){
    if (color.startsWith("#")){
        return parseInt(color.slice(1), 16);
    } 
    return parseInt(color, 16);
}
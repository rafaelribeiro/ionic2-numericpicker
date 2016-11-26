export function parseTemplate(template: string): { integers: number, decimals: number } {
    const formats: string[] = [];

    template = template.replace(/[^\w\s]/gi, ' ');

    let parsed = template.split('.');

    return { integers: parsed[0].length, decimals: parsed[1] ? parsed[1].length : 0 };
}

export function numberValueRange(pow: number, min: number, max: number): number[] {
    let ret = [];
    min = Math.round(min / pow);
    max = Math.round(max / pow);
    for (var index = 0; index < 10; index++) {
        if (min > pow) continue;
        if (max < pow) continue;
        ret.push(index);
    }
    return ret;
}

export function getValueFromFormat(value:number, format:{ integers: number, decimals: number }){
    
}
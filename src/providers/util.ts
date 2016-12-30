export function parseTemplate(template: string): { integers: number, decimals: number } {
    template = template.replace(',', '');
    let parsed: Array<string> = template.split('.');
    return { integers: parsed[0].length, decimals: parsed[1] ? parsed[1].length : 0 };
}

export function numberValueRange(pow: number, min: number, max: number): number[] {
    let ret: Array<number> = [];
    min = getNthDigit(min, min.toString().length - pow);
    max = getNthDigit(max, min.toString().length - pow);
    for (let index: number = 0; index < 10; index++) {
        if (min > index) continue;
        if (max < index) continue;
        ret.push(index);
    }
    return ret;
}

export function getValueFromFormat(value: number, pow: number, decimal?: boolean): number {
    if (decimal === true) { value = Math.round((value % 1) * Math.pow(10, pow)); };
    return getNthDigit(value, pow);
}

function getNthDigit(val: number, n: number): number {
    let modVal: number = val % Math.pow(10, n); // remove all digits larger than nth
    return Math.floor(modVal / Math.pow(10, n - 1)); // remove all digits less than nth
}

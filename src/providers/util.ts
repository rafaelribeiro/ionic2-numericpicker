export function parseTemplate(template: string): { integers: number, decimals: number } {
    const formats: string[] = [];

    template = template.replace(/[^\w\s]/gi, ' ');

    let parsed = template.split('.');

    return { integers: parsed[0].length, decimals: parsed[1] ? parsed[1].length : 0 };
}

export function numberValueRange(pow: number, min: number, max: number): number[] {
    let ret = [];
    min = getNthDigit(min, pow);
    max = getNthDigit(max, pow);
    for (var index = 0; index < 10; index++) {
        if (min > index) continue;
        if (max < index) continue;
        ret.push(index);
    }
    return ret;
}

export function getValueFromFormat(value: number, pow: number) {
    return getNthDigit(value, pow);
}


function getNthDigit(val, n) {
    var modVal = val % Math.pow(10, n);//Remove all digits larger than nth
    return Math.floor(modVal / Math.pow(10, n - 1));//Remove all digits less than nth
}

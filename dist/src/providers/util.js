export function parseTemplate(template) {
    var formats = [];
    template = template.replace(/[^\w\s]/gi, ' ');
    var parsed = template.split('.');
    return { integers: parsed[0].length, decimals: parsed[1] ? parsed[1].length : 0 };
}
export function numberValueRange(pow, min, max) {
    var ret = [];
    min = getNthDigit(min, pow);
    max = getNthDigit(max, pow);
    for (var index = 0; index < 10; index++) {
        if (min > index)
            continue;
        if (max < index)
            continue;
        ret.push(index);
    }
    return ret;
}
export function getValueFromFormat(value, pow) {
    return getNthDigit(value, pow);
}
function getNthDigit(val, n) {
    var modVal = val % Math.pow(10, n); //Remove all digits larger than nth
    return Math.floor(modVal / Math.pow(10, n - 1)); //Remove all digits less than nth
}
//# sourceMappingURL=util.js.map
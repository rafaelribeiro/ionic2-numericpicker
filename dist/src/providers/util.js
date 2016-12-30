export function parseTemplate(template) {
    template = template.replace(',', '');
    var parsed = template.split('.');
    return { integers: parsed[0].length, decimals: parsed[1] ? parsed[1].length : 0 };
}
export function numberValueRange(pow, min, max) {
    var ret = [];
    min = getNthDigit(min, min.toString().length - pow);
    max = getNthDigit(max, min.toString().length - pow);
    for (var index = 0; index < 10; index++) {
        if (min > index)
            continue;
        if (max < index)
            continue;
        ret.push(index);
    }
    return ret;
}
export function getValueFromFormat(value, pow, decimal) {
    if (decimal === true) {
        value = Math.round((value % 1) * Math.pow(10, pow));
    }
    ;
    return getNthDigit(value, pow);
}
function getNthDigit(val, n) {
    var modVal = val % Math.pow(10, n); // remove all digits larger than nth
    return Math.floor(modVal / Math.pow(10, n - 1)); // remove all digits less than nth
}
//# sourceMappingURL=util.js.map
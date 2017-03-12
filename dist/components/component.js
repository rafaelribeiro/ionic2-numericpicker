var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Component, ElementRef, EventEmitter, HostListener, Input, Optional, Output, Renderer, ViewEncapsulation, forwardRef, } from '@angular/core';
import { Config, Form, Ion, Item, PickerController, } from 'ionic-angular';
import { NG_VALUE_ACCESSOR, } from '@angular/forms';
import { getValueFromFormat, numberValueRange, parseTemplate, } from '../providers/util';
import { isArray, isPresent, isString, isTrueProperty, isObject, isFunction, } from 'ionic-angular/util/util';
export var NUMERIC_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return Numeric; }),
    multi: true,
};
var DEFAULT_FORMAT = 'XX.XX';
var Numeric = (function (_super) {
    __extends(Numeric, _super);
    function Numeric(_form, config, elementRef, renderer, _item, _pickerCtrl) {
        var _this = _super.call(this, config, elementRef, renderer, 'datetime') || this;
        _this._form = _form;
        _this._item = _item;
        _this._pickerCtrl = _pickerCtrl;
        _this._disabled = false;
        _this._text = '';
        _this._isOpen = false;
        _this._value = 0;
        _this.cancelText = 'Cancel';
        _this.doneText = 'Done';
        _this.pickerOptions = {};
        _this.ionChange = new EventEmitter();
        _this.ionCancel = new EventEmitter();
        _form.register(_this);
        if (_item) {
            _this.id = 'dt-' + _item.registerInput('datetime');
            _this._labelId = 'lbl-' + _item.id;
            _this._item.setElementClass('item-datetime', true);
        }
        return _this;
    }
    Object.defineProperty(Numeric.prototype, "min", {
        set: function (val) {
            this._min = +val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Numeric.prototype, "max", {
        set: function (val) {
            this._max = +val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Numeric.prototype, "mode", {
        set: function (val) {
            this._setMode(val);
        },
        enumerable: true,
        configurable: true
    });
    Numeric.prototype._click = function (ev) {
        if (ev.detail === 0) {
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        this.open();
    };
    Numeric.prototype._keyup = function () {
        if (!this._isOpen) {
            this.open();
        }
    };
    Numeric.prototype.open = function () {
        var _this = this;
        if (this._disabled) {
            return;
        }
        console.debug('numeric, open picker');
        var pickerOptions = this.merge({}, this.pickerOptions);
        var picker = this._pickerCtrl.create(pickerOptions);
        pickerOptions.buttons = [
            {
                text: this.cancelText,
                role: 'cancel',
                handler: function () {
                    _this.ionCancel.emit(null);
                },
            },
            {
                text: this.doneText,
                handler: function (data) {
                    console.debug('numeric, done', data);
                    _this.onChange(data);
                    _this.ionChange.emit(data);
                },
            },
        ];
        this.generate(picker);
        this.validate(picker);
        picker.ionChange.subscribe(function () {
            _this.validate(picker);
        });
        picker.present(pickerOptions);
        this._isOpen = true;
        picker.onDidDismiss(function () {
            _this._isOpen = false;
        });
    };
    Numeric.prototype.merge = function (dst) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this._baseExtend(dst, [].slice.call(arguments, 1), true);
    };
    Numeric.prototype._baseExtend = function (dst, objs, deep) {
        for (var i = 0, ii = objs.length; i < ii; ++i) {
            var obj = objs[i];
            if (!obj || !isObject(obj) && !isFunction(obj))
                continue;
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];
                if (deep && isObject(src)) {
                    if (!isObject(dst[key]))
                        dst[key] = isArray(src) ? [] : {};
                    this._baseExtend(dst[key], [src], true);
                }
                else {
                    dst[key] = src;
                }
            }
        }
        return dst;
    };
    Numeric.prototype.generate = function (picker) {
        var _this = this;
        var template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;
        if (isPresent(template)) {
            var format_1 = parseTemplate(template);
            var _loop_1 = function (index) {
                var values = void 0;
                values = numberValueRange(index, this_1._min, this_1._max);
                var column = {
                    name: 'int' + index.toString(),
                    options: values.map(function (val) {
                        return {
                            value: val,
                            text: val,
                        };
                    }),
                };
                if (column.options.length) {
                    var selected = column.options.find(function (opt) { return opt.value === getValueFromFormat(_this.getValue(), format_1.integers - index); });
                    if (selected) {
                        column.selectedIndex = column.options.indexOf(selected);
                    }
                    picker.addColumn(column);
                }
            };
            var this_1 = this;
            for (var index = 0; index < format_1.integers; index++) {
                _loop_1(index);
            }
            if (format_1.decimals) {
                var seperator = {
                    name: 'seperator',
                    options: [{
                            value: '.',
                            text: '.',
                        }],
                };
                picker.addColumn(seperator);
                var _loop_2 = function (index) {
                    var values = void 0;
                    values = numberValueRange(index, this_2._min, this_2._max);
                    var column = {
                        name: 'dec' + index.toString(),
                        options: values.map(function (val) {
                            return {
                                value: val,
                                text: val,
                            };
                        }),
                    };
                    if (column.options.length) {
                        var selected = column.options.find(function (opt) { return opt.value === getValueFromFormat(_this.getValue(), format_1.decimals - index, true); });
                        if (selected) {
                            column.selectedIndex = column.options.indexOf(selected);
                        }
                        picker.addColumn(column);
                    }
                };
                var this_2 = this;
                for (var index = 0; index < format_1.decimals; index++) {
                    _loop_2(index);
                }
            }
        }
        this.divyColumns(picker);
    };
    Numeric.prototype.validate = function (picker) {
        var i;
        var columns = picker.getColumns();
        picker.refresh();
    };
    Numeric.prototype.divyColumns = function (picker) {
        var pickerColumns = picker.getColumns();
        var columns = [];
        pickerColumns.forEach(function (col, i) {
            columns.push(0);
            col.options.forEach(function (opt) {
                if (opt.text.length > columns[i]) {
                    columns[i] = opt.text.length;
                }
            });
        });
        if (columns.length === 2) {
            var width = Math.max(columns[0], columns[1]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].align = 'left';
            pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = width * 17 + "px";
        }
        else if (columns.length === 3) {
            var width = Math.max(columns[0], columns[2]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].columnWidth = columns[1] * 17 + "px";
            pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = width * 17 + "px";
            pickerColumns[2].align = 'left';
        }
    };
    Numeric.prototype.setValue = function (newData) {
        this._value = this.convertColumnsToNumbers(newData);
    };
    Numeric.prototype.getValue = function () {
        return this._value || 0;
    };
    Numeric.prototype.checkHasValue = function (inputValue) {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    };
    Numeric.prototype.updateText = function () {
        var template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
        var text = this.getValue().toString();
        var indices = [];
        for (var i = 0; i < template.length; i++) {
            if (template[i] === ',')
                indices.push(i);
        }
        var seperator = template.indexOf('.');
        var templateDecimals = template.split('.')[1];
        if (seperator !== -1) {
            if (text.indexOf('.') === -1)
                text += '.';
            var textDecimals = text.split('.')[1];
            while (templateDecimals.length !== textDecimals.length) {
                textDecimals += '0';
                text += '0';
            }
        }
        else if (text.indexOf('.') !== -1) {
            text = text.split('.')[0];
        }
        if (indices.length > 0 && template.length === text.length + indices.length) {
            for (var add = 0; add < indices.length; add++) {
                text = text.slice(0, add + indices[add]) + ',' + text.slice(add + indices[add]);
            }
        }
        this._text = text;
    };
    Object.defineProperty(Numeric.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            this._disabled = isTrueProperty(val);
            this._item && this._item.setElementClass('item-datetime-disabled', this._disabled);
        },
        enumerable: true,
        configurable: true
    });
    Numeric.prototype.writeValue = function (val) {
        console.debug('numeric, writeValue', val);
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    };
    Numeric.prototype.ngAfterContentInit = function () {
        this.updateText();
    };
    Numeric.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function (val) {
            _this.setValue(val);
            _this.updateText();
            _this.checkHasValue(val);
            fn(_this._value);
            _this.onTouched();
        };
    };
    Numeric.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    Numeric.prototype.onChange = function (val) {
        console.debug('numeric, onChange w/out formControlName', val);
        this.setValue(val);
        this.updateText();
        this.onTouched();
    };
    Numeric.prototype.onTouched = function () {
    };
    Numeric.prototype.ngOnDestroy = function () {
        this._form.deregister(this);
    };
    Numeric.prototype.convertColumnsToNumbers = function (columns) {
        if (columns === null)
            return 0;
        var result = 0;
        var keys = Object.keys(columns);
        var _loop_3 = function (index) {
            var element = keys.find(function (k) { return k.replace('int', '') === index.toString(); });
            if (!element)
                return "break";
            result = result * Math.pow(10, index === 0 ? 0 : 1);
            result += columns[element].value;
        };
        for (var index = 0; index < 10; index++) {
            var state_1 = _loop_3(index);
            if (state_1 === "break")
                break;
        }
        if (keys.some(function (d) { return d === 'seperator'; })) {
            var _loop_4 = function (index) {
                var element = keys.find(function (k) { return k.replace('dec', '') === index.toString(); });
                if (!element)
                    return "break";
                result += columns[element].value / Math.pow(10, index + 1);
                result = +result.toFixed(index + 1);
            };
            for (var index = 0; index < 10; index++) {
                var state_2 = _loop_4(index);
                if (state_2 === "break")
                    break;
            }
        }
        return result;
    };
    return Numeric;
}(Ion));
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], Numeric.prototype, "min", null);
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], Numeric.prototype, "max", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], Numeric.prototype, "displayFormat", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], Numeric.prototype, "pickerFormat", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], Numeric.prototype, "cancelText", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], Numeric.prototype, "doneText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], Numeric.prototype, "pickerOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], Numeric.prototype, "mode", null);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], Numeric.prototype, "ionChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], Numeric.prototype, "ionCancel", void 0);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UIEvent]),
    __metadata("design:returntype", void 0)
], Numeric.prototype, "_click", null);
__decorate([
    HostListener('keyup.space'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Numeric.prototype, "_keyup", null);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], Numeric.prototype, "disabled", null);
Numeric = __decorate([
    Component({
        selector: 'ion-numeric',
        template: '<div class="datetime-text">{{_text}}</div>' +
            '<button aria-haspopup="true" ' +
            'type="button" ' +
            '[id]="id" ' +
            'ion-button="item-cover" ' +
            '[attr.aria-labelledby]="_labelId" ' +
            '[attr.aria-disabled]="_disabled" ' +
            'class="item-cover">' +
            '</button>',
        host: {
            '[class.numeric-disabled]': '_disabled',
        },
        providers: [NUMERIC_VALUE_ACCESSOR],
        encapsulation: ViewEncapsulation.None,
    }),
    __param(4, Optional()),
    __param(5, Optional()),
    __metadata("design:paramtypes", [Form,
        Config,
        ElementRef,
        Renderer,
        Item,
        PickerController])
], Numeric);
export { Numeric };
function convertToArrayOfNumbers(input, type) {
    var values = [];
    if (isString(input)) {
        input = input.replace(/\[|\]|\s/g, '').split(',');
    }
    if (isArray(input)) {
        input.forEach(function (num) {
            num = parseInt(num, 10);
            if (!isNaN(num)) {
                values.push(num);
            }
        });
    }
    if (!values.length) {
        console.warn("Invalid \"" + type + "Values\". Must be an array of numbers, or a comma separated string of numbers.");
    }
    return values;
}
function convertToArrayOfStrings(input, type) {
    if (isPresent(input)) {
        var values_1 = [];
        if (isString(input)) {
            input = input.replace(/\[|\]/g, '').split(',');
        }
        if (isArray(input)) {
            input.forEach(function (val) {
                val = val.trim();
                if (val) {
                    values_1.push(val);
                }
            });
        }
        if (!values_1.length) {
            console.warn("Invalid \"" + type + "Names\". Must be an array of strings, or a comma separated string.");
        }
        return values_1;
    }
}
//# sourceMappingURL=component.js.map
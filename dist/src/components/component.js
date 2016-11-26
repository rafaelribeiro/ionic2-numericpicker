var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { Component, Input, Output, EventEmitter, HostListener, ViewEncapsulation, Optional, ElementRef, Renderer } from '@angular/core';
import { Form, Config, Item, PickerController, Ion } from 'ionic-angular';
import { merge, isArray, isString, isPresent, isTrueProperty } from 'ionic-angular/util/util';
import { parseTemplate, numberValueRange, getValueFromFormat } from '../providers/util';
export var Numeric = (function (_super) {
    __extends(Numeric, _super);
    function Numeric(_form, config, elementRef, renderer, _item, _pickerCtrl) {
        _super.call(this, config, elementRef, renderer, 'numeric');
        this._form = _form;
        this._item = _item;
        this._pickerCtrl = _pickerCtrl;
        this._disabled = false;
        this._text = '';
        this._isOpen = false;
        this._value = 0;
        /**
         * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
         */
        this.cancelText = 'Cancel';
        /**
         * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
         */
        this.doneText = 'Done';
        /**
         * @input {any} Any additional options that the picker interface can accept.
         * See the [Picker API docs](../../picker/Picker) for the picker options.
         */
        this.pickerOptions = {};
        /**
         * @output {any} Any expression to evaluate when the numeric selection has changed.
         */
        this.ionChange = new EventEmitter();
        /**
         * @output {any} Any expression to evaluate when the numeric selection was cancelled.
         */
        this.ionCancel = new EventEmitter();
        _form.register(this);
        if (_item) {
            this.id = 'dt-' + _item.registerInput('numeric');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-numeric', true);
        }
    }
    Object.defineProperty(Numeric.prototype, "mode", {
        /**
         * @input {string} The mode to apply to this component.
         */
        set: function (val) {
            this._setMode(val);
        },
        enumerable: true,
        configurable: true
    });
    Numeric.prototype._click = function (ev) {
        if (ev.detail === 0) {
            // do not continue if the click event came from a form submit
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
    /**
  * @private
  */
    Numeric.prototype.open = function () {
        var _this = this;
        if (this._disabled) {
            return;
        }
        console.debug('numeric, open picker');
        // the user may have assigned some options specifically for the alert
        var pickerOptions = merge({}, this.pickerOptions);
        var picker = this._pickerCtrl.create(pickerOptions);
        pickerOptions.buttons = [
            {
                text: this.cancelText,
                role: 'cancel',
                handler: function () {
                    _this.ionCancel.emit(null);
                }
            },
            {
                text: this.doneText,
                handler: function (data) {
                    console.debug('numeric, done', data);
                    _this.onChange(data);
                    _this.ionChange.emit(data);
                }
            }
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
    /**
      * @private
      */
    Numeric.prototype.generate = function (picker) {
        var _this = this;
        // if a picker format wasn't provided, then fallback
        // to use the display format
        var template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;
        if (isPresent(template)) {
            var format = parseTemplate(template);
            for (var index = 0; index < format.integers; index++) {
                var values = void 0;
                values = numberValueRange(index, this._min, this._max);
                var column = {
                    name: index.toString(),
                    options: values.map(function (val) {
                        return {
                            value: val,
                            text: val,
                        };
                    })
                };
                if (column.options.length) {
                    // cool, we've loaded up the columns with options
                    // preselect the option for this column
                    var selected = column.options.find(function (opt) { return opt.value === getValueFromFormat(_this._value, index); });
                    if (selected) {
                        // set the select index for this column's options
                        column.selectedIndex = column.options.indexOf(selected);
                    }
                    // add our newly created column to the picker
                    picker.addColumn(column);
                }
            }
        }
        this.divyColumns(picker);
    };
    /**
       * @private
       */
    Numeric.prototype.validate = function (picker) {
        var i;
        var columns = picker.getColumns();
        picker.refresh();
    };
    /**
     * @private
     */
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
    /**
     * @private
     */
    Numeric.prototype.setValue = function (newData) {
        this._value = +newData;
    };
    /**
     * @private
     */
    Numeric.prototype.getValue = function () {
        return this._value;
    };
    /**
     * @private
     */
    Numeric.prototype.checkHasValue = function (inputValue) {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    };
    /**
     * @private
     */
    Numeric.prototype.updateText = function () {
        // create the text of the formatted data
        var template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
        this._text = this._value.toString();
    };
    Object.defineProperty(Numeric.prototype, "disabled", {
        /**
         * @input {boolean} Whether or not the numeric component is disabled. Default `false`.
         */
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            this._disabled = isTrueProperty(val);
            this._item && this._item.setElementClass('item-numeric-disabled', this._disabled);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    Numeric.prototype.writeValue = function (val) {
        console.debug('numeric, writeValue', val);
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    };
    /**
     * @private
     */
    Numeric.prototype.ngAfterContentInit = function () {
        this.updateText();
    };
    /**
     * @private
     */
    Numeric.prototype.registerOnChange = function (fn) {
        var _this = this;
        this._fn = fn;
        this.onChange = function (val) {
            console.debug('numeric, onChange', val);
            _this.setValue(val);
            _this.updateText();
            _this.checkHasValue(val);
            fn(_this._value);
            _this.onTouched();
        };
    };
    /**
     * @private
     */
    Numeric.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    /**
     * @private
     */
    Numeric.prototype.onChange = function (val) {
        // onChange used when there is not an formControlName
        console.debug('numeric, onChange w/out formControlName', val);
        this.setValue(val);
        this.updateText();
        this.onTouched();
    };
    /**
     * @private
     */
    Numeric.prototype.onTouched = function () { };
    /**
     * @private
     */
    Numeric.prototype.ngOnDestroy = function () {
        this._form.deregister(this);
    };
    Numeric.decorators = [
        { type: Component, args: [{
                    selector: 'ion-numeric',
                    template: '<div class="numeric-text">{{_text}}</div>' +
                        '<button aria-haspopup="true" ' +
                        'type="button" ' +
                        '[id]="id" ' +
                        'ion-button="item-cover" ' +
                        '[attr.aria-labelledby]="_labelId" ' +
                        '[attr.aria-disabled]="_disabled" ' +
                        'class="item-cover">' +
                        '</button>',
                    host: {
                        '[class.numeric-disabled]': '_disabled'
                    },
                    encapsulation: ViewEncapsulation.None,
                },] },
    ];
    /** @nocollapse */
    Numeric.ctorParameters = [
        { type: Form, },
        { type: Config, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: Item, decorators: [{ type: Optional },] },
        { type: PickerController, decorators: [{ type: Optional },] },
    ];
    Numeric.propDecorators = {
        'min': [{ type: Input },],
        'max': [{ type: Input },],
        'displayFormat': [{ type: Input },],
        'pickerFormat': [{ type: Input },],
        'cancelText': [{ type: Input },],
        'doneText': [{ type: Input },],
        'pickerOptions': [{ type: Input },],
        'mode': [{ type: Input },],
        'ionChange': [{ type: Output },],
        'ionCancel': [{ type: Output },],
        '_click': [{ type: HostListener, args: ['click', ['$event'],] },],
        '_keyup': [{ type: HostListener, args: ['keyup.space',] },],
        'disabled': [{ type: Input },],
    };
    return Numeric;
}(Ion));
/**
 * @private
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input, type) {
    var values = [];
    if (isString(input)) {
        // convert the string to an array of strings
        // auto remove any whitespace and [] characters
        input = input.replace(/\[|\]|\s/g, '').split(',');
    }
    if (isArray(input)) {
        // ensure each value is an actual number in the returned array
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
/**
 * @private
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input, type) {
    if (isPresent(input)) {
        var values = [];
        if (isString(input)) {
            // convert the string to an array of strings
            // auto remove any [] characters
            input = input.replace(/\[|\]/g, '').split(',');
        }
        if (isArray(input)) {
            // trim up each string value
            input.forEach(function (val) {
                val = val.trim();
                if (val) {
                    values.push(val);
                }
            });
        }
        if (!values.length) {
            console.warn("Invalid \"" + type + "Names\". Must be an array of strings, or a comma separated string.");
        }
        return values;
    }
}
var DEFAULT_FORMAT = 'XX.XX';
//# sourceMappingURL=component.js.map
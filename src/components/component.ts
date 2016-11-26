import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewEncapsulation, Optional, ElementRef, Renderer, AfterContentInit } from '@angular/core';
import { Form, Config, Item, PickerController, Picker, Ion, PickerColumn, PickerColumnOption } from 'ionic-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumericData } from '../models/data';
import { merge, isArray, isString, isPresent, isBlank, isTrueProperty } from 'ionic-angular/util/util';
import { parseTemplate, numberValueRange, getValueFromFormat } from '../providers/util';
@Component({
    selector: 'ion-numeric',
    template:
    '<div class="numeric-text">{{_text}}</div>' +
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
})
export class Numeric extends Ion implements AfterContentInit, ControlValueAccessor {
    _disabled: any = false;
    _labelId: string;
    _text: string = '';
    _fn: Function;
    _isOpen: boolean = false;
    _min: number;
    _max: number;
    _value: number = 0;

    /**
     * @private
     */
    id: string;

    /**
     * @input {string} The minimum number allowed. Value must be a number string
     * following the
     */
    @Input() min: string;

    /**
     * @input {string} The maximum number allowed. Value must be a number string
     * following the
     */
    @Input() max: string;

    /**
     * @input {string} The display format of the number as text that shows
     * within the item. When the `pickerFormat` input is not used, then the
     * `displayFormat` is used for both display the formatted text, and determining
     * the number picker's columns. See the `pickerFormat` input description for
     * more info. Defaults to `XX.XX`.
     */
    @Input() displayFormat: string;

    /**
     * @input {string} The format of the numeric picker columns the user selects.
     *  Defaults to use `displayFormat`.
     */
    @Input() pickerFormat: string;

    /**
     * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
     */
    @Input() cancelText: string = 'Cancel';

    /**
     * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
     */
    @Input() doneText: string = 'Done';


    /**
     * @input {any} Any additional options that the picker interface can accept.
     * See the [Picker API docs](../../picker/Picker) for the picker options.
     */
    @Input() pickerOptions: any = {};

    /**
     * @input {string} The mode to apply to this component.
     */
    @Input()
    set mode(val: string) {
        this._setMode(val);
    }

    /**
     * @output {any} Any expression to evaluate when the numeric selection has changed.
     */
    @Output() ionChange: EventEmitter<any> = new EventEmitter();

    /**
     * @output {any} Any expression to evaluate when the numeric selection was cancelled.
     */
    @Output() ionCancel: EventEmitter<any> = new EventEmitter();
    constructor(
        private _form: Form,
        config: Config,
        elementRef: ElementRef,
        renderer: Renderer,
        @Optional() private _item: Item,
        @Optional() private _pickerCtrl: PickerController
    ) {
        super(config, elementRef, renderer, 'numeric');
        _form.register(this);


        if (_item) {
            this.id = 'dt-' + _item.registerInput('numeric');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-numeric', true);
        }
    }

    @HostListener('click', ['$event'])
    _click(ev: UIEvent) {
        if (ev.detail === 0) {
            // do not continue if the click event came from a form submit
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        this.open();
    }

    @HostListener('keyup.space')
    _keyup() {
        if (!this._isOpen) {
            this.open();
        }
    }

    /**
  * @private
  */
    open() {
        if (this._disabled) {
            return;
        }

        console.debug('numeric, open picker');

        // the user may have assigned some options specifically for the alert
        let pickerOptions = merge({}, this.pickerOptions);

        let picker = this._pickerCtrl.create(pickerOptions);
        pickerOptions.buttons = [
            {
                text: this.cancelText,
                role: 'cancel',
                handler: () => {
                    this.ionCancel.emit(null);
                }
            },
            {
                text: this.doneText,
                handler: (data: any) => {
                    console.debug('numeric, done', data);
                    this.onChange(data);
                    this.ionChange.emit(data);
                }
            }
        ];

        this.generate(picker);
        this.validate(picker);

        picker.ionChange.subscribe(() => {
            this.validate(picker);
        });

        picker.present(pickerOptions);

        this._isOpen = true;
        picker.onDidDismiss(() => {
            this._isOpen = false;
        });
    }


    /**
      * @private
      */
    generate(picker: Picker) {
        // if a picker format wasn't provided, then fallback
        // to use the display format
        let template = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

        if (isPresent(template)) {

            let format = parseTemplate(template);
            for (var index = 0; index < format.integers; index++) {
                let values: any[];
                values = numberValueRange(index, this._min, this._max);
                let column: PickerColumn = {
                    name: index.toString(),
                    options: values.map(val => {
                        return {
                            value: val,
                            text: val,
                        };
                    })
                };

                if (column.options.length) {
                    // cool, we've loaded up the columns with options
                    // preselect the option for this column
                    var selected = column.options.find(opt => opt.value === getValueFromFormat(this._value, index));
                    if (selected) {
                        // set the select index for this column's options
                        column.selectedIndex = column.options.indexOf(selected);
                    }

                    // add our newly created column to the picker
                    picker.addColumn(column);
                }
            }
            // loop through each format in the template
            // create a new picker column to build up with data
        }
        this.divyColumns(picker);
    }
    /**
       * @private
       */
    validate(picker: Picker) {
        let i: number;
        let columns = picker.getColumns();
        picker.refresh();
    }

    /**
     * @private
     */
    divyColumns(picker: Picker) {
        let pickerColumns = picker.getColumns();
        let columns: number[] = [];

        pickerColumns.forEach((col, i) => {
            columns.push(0);

            col.options.forEach(opt => {
                if (opt.text.length > columns[i]) {
                    columns[i] = opt.text.length;
                }
            });

        });

        if (columns.length === 2) {
            var width = Math.max(columns[0], columns[1]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].align = 'left';
            pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;

        } else if (columns.length === 3) {
            var width = Math.max(columns[0], columns[2]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].columnWidth = `${columns[1] * 17}px`;
            pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
            pickerColumns[2].align = 'left';
        }
    }

    /**
     * @private
     */
    setValue(newData: any) {
        this._value = this.convertColumnsToNumbers(newData);
    }

    /**
     * @private
     */
    getValue(): number {
        return this._value;
    }

    /**
     * @private
     */
    checkHasValue(inputValue: any) {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    }

    /**
     * @private
     */
    updateText() {
        // create the text of the formatted data
        const template = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
        this._text = this._value.toString();
    }

    /**
     * @input {boolean} Whether or not the numeric component is disabled. Default `false`.
     */
    @Input()
    get disabled() {
        return this._disabled;
    }

    set disabled(val) {
        this._disabled = isTrueProperty(val);
        this._item && this._item.setElementClass('item-numeric-disabled', this._disabled);
    }

    /**
     * @private
     */
    writeValue(val: any) {
        console.debug('numeric, writeValue', val);
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    }

    /**
     * @private
     */
    ngAfterContentInit() {
        this.updateText();
    }

    /**
     * @private
     */
    registerOnChange(fn: Function): void {
        this._fn = fn;
        this.onChange = (val: any) => {
            console.debug('numeric, onChange', val);
            this.setValue(val);
            this.updateText();
            this.checkHasValue(val);

            fn(this._value);

            this.onTouched();
        };
    }

    /**
     * @private
     */
    registerOnTouched(fn: any) { this.onTouched = fn; }

    /**
     * @private
     */
    onChange(val: any) {
        // onChange used when there is not an formControlName
        console.debug('numeric, onChange w/out formControlName', val);
        this.setValue(val);
        this.updateText();
        this.onTouched();
    }

    /**
     * @private
     */
    onTouched() { }

    /**
     * @private
     */
    ngOnDestroy() {
        this._form.deregister(this);
    }

    convertColumnsToNumbers(columns: any): number {

        let result = 0;
        let keys = Object.keys(columns);
        for (var index = 0; index < keys.length; index++) {
            var element = columns[keys[index]];
            result += element.value * Math.pow(10, index);
        }
        return result;
    }
}

/**
 * @private
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input: any, type: string): number[] {
    var values: number[] = [];

    if (isString(input)) {
        // convert the string to an array of strings
        // auto remove any whitespace and [] characters
        input = input.replace(/\[|\]|\s/g, '').split(',');
    }

    if (isArray(input)) {
        // ensure each value is an actual number in the returned array
        input.forEach((num: any) => {
            num = parseInt(num, 10);
            if (!isNaN(num)) {
                values.push(num);
            }
        });
    }

    if (!values.length) {
        console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
    }

    return values;
}

/**
 * @private
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input: any, type: string): string[] {
    if (isPresent(input)) {
        var values: string[] = [];

        if (isString(input)) {
            // convert the string to an array of strings
            // auto remove any [] characters
            input = input.replace(/\[|\]/g, '').split(',');
        }

        if (isArray(input)) {
            // trim up each string value
            input.forEach((val: any) => {
                val = val.trim();
                if (val) {
                    values.push(val);
                }
            });
        }

        if (!values.length) {
            console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
        }

        return values;
    }


}

const DEFAULT_FORMAT = 'XX.XX';
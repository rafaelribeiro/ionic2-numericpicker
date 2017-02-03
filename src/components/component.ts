import {
    AfterContentInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Optional,
    Output,
    Renderer,
    ViewEncapsulation,
    forwardRef,
} from '@angular/core';
import {
    Config,
    Form,
    Ion,
    Item,
    Picker,
    PickerColumn,
    PickerColumnOption,
    PickerController,
} from 'ionic-angular';
import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
    getValueFromFormat,
    numberValueRange,
    parseTemplate,
} from '../providers/util';
import {
    isArray,
    isPresent,
    isString,
    isTrueProperty,
    isObject,
    isFunction,
} from 'ionic-angular/util/util';

export const NUMERIC_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Numeric),
    multi: true,
};
const DEFAULT_FORMAT: string = 'XX.XX';

@Component({
    selector: 'ion-numeric',
    template:
    '<div class="datetime-text">{{_text}}</div>' +
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
})
export class Numeric extends Ion implements AfterContentInit, ControlValueAccessor {
    public _disabled: boolean = false;
    public _labelId: string;
    public _text: string = '';
    private _fn: Function;
    private _isOpen: boolean = false;
    private _min: number;
    private _max: number;
    private _value: number = 0;

    public id: string;

    /**
     * @input {string} The minimum number allowed. Value must be a number string
     * following the
     */
    @Input() public set min(val: string) {
        this._min = +val;
    }

    /**
     * @input {string} The maximum number allowed. Value must be a number string
     * following the
     */
    @Input() public set max(val: string) {
        this._max = +val;
    }

    /**
     * @input {string} The display format of the number as text that shows
     * within the item. When the `pickerFormat` input is not used, then the
     * `displayFormat` is used for both display the formatted text, and determining
     * the number picker's columns. See the `pickerFormat` input description for
     * more info. Defaults to `XX.XX`.
     */
    @Input() public displayFormat: string;

    /**
     * @input {string} The format of the numeric picker columns the user selects.
     *  Defaults to use `displayFormat`.
     */
    @Input() public pickerFormat: string;

    /**
     * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
     */
    @Input() public cancelText: string = 'Cancel';

    /**
     * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
     */
    @Input() public doneText: string = 'Done';

    /**
     * @input {any} Any additional options that the picker interface can accept.
     * See the [Picker API docs](../../picker/Picker) for the picker options.
     */
    @Input() public pickerOptions: any = {};

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
    @Output() public ionChange: EventEmitter<any> = new EventEmitter();

    /**
     * @output {any} Any expression to evaluate when the numeric selection was cancelled.
     */
    @Output() public ionCancel: EventEmitter<any> = new EventEmitter();
    constructor(
        private _form: Form,
        config: Config,
        elementRef: ElementRef,
        renderer: Renderer,
        @Optional() private _item: Item,
        @Optional() private _pickerCtrl: PickerController,
    ) {
        super(config, elementRef, renderer, 'datetime');
        _form.register(this);

        if (_item) {
            this.id = 'dt-' + _item.registerInput('datetime');
            this._labelId = 'lbl-' + _item.id;
            this._item.setElementClass('item-datetime', true);
        }
    }

    @HostListener('click', ['$event'])
    public _click(ev: UIEvent): void {
        if (ev.detail === 0) {
            // do not continue if the click event came from a form submit
            return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        this.open();
    }

    @HostListener('keyup.space')
    public _keyup(): void {
        if (!this._isOpen) {
            this.open();
        }
    }

    private open(): void {
        if (this._disabled) {
            return;
        }

        console.debug('numeric, open picker');

        // the user may have assigned some options specifically for the alert
        let pickerOptions: any = this.merge({}, this.pickerOptions);

        let picker: Picker = this._pickerCtrl.create(pickerOptions);
        pickerOptions.buttons = [
            {
                text: this.cancelText,
                role: 'cancel',
                handler: () => {
                    this.ionCancel.emit(null);
                },
            },
            {
                text: this.doneText,
                handler: (data: any) => {
                    console.debug('numeric, done', data);
                    this.onChange(data);
                    this.ionChange.emit(data);
                },
            },
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
    private merge(dst: any, ...args: any[]) {
        return this._baseExtend(dst, [].slice.call(arguments, 1), true);
    }

    private _baseExtend(dst: any, objs: any, deep: boolean) {
        for (let i = 0, ii = objs.length; i < ii; ++i) {
            let obj = objs[i];
            if (!obj || !isObject(obj) && !isFunction(obj)) continue;
            let keys = Object.keys(obj);
            for (let j = 0, jj = keys.length; j < jj; j++) {
                let key = keys[j];
                let src = obj[key];

                if (deep && isObject(src)) {
                    if (!isObject(dst[key])) dst[key] = isArray(src) ? [] : {};
                    this._baseExtend(dst[key], [src], true);
                } else {
                    dst[key] = src;
                }
            }
        }

        return dst;
    }
    private generate(picker: Picker): void {
        // if a picker format wasn't provided, then fallback
        // to use the display format
        let template: string = this.pickerFormat || this.displayFormat || DEFAULT_FORMAT;

        if (isPresent(template)) {

            let format: { integers: number, decimals: number } = parseTemplate(template);
            for (let index: number = 0; index < format.integers; index++) {
                let values: any[];
                values = numberValueRange(index, this._min, this._max);
                let column: PickerColumn = {
                    name: 'int' + index.toString(),
                    options: values.map(val => {
                        return {
                            value: val,
                            text: val,
                        };
                    }),
                };

                if (column.options.length) {
                    // cool, we've loaded up the columns with options
                    // preselect the option for this column
                    let selected: PickerColumnOption =
                        column.options.find(opt => opt.value === getValueFromFormat(this.getValue(), format.integers - index));
                    if (selected) {
                        // set the select index for this column's options
                        column.selectedIndex = column.options.indexOf(selected);
                    }

                    // add our newly created column to the picker
                    picker.addColumn(column);
                }
            }
            if (format.decimals) {
                let seperator: PickerColumn = {
                    name: 'seperator',
                    options: [{
                        value: '.',
                        text: '.',
                    }],
                };
                picker.addColumn(seperator);
                for (let index: number = 0; index < format.decimals; index++) {
                    let values: any[];
                    values = numberValueRange(index, this._min, this._max);
                    let column: PickerColumn = {
                        name: 'dec' + index.toString(),
                        options: values.map(val => {
                            return {
                                value: val,
                                text: val,
                            };
                        }),
                    };

                    if (column.options.length) {
                        // cool, we've loaded up the columns with options
                        // preselect the option for this column
                        let selected: PickerColumnOption =
                            column.options.find(opt => opt.value === getValueFromFormat(this.getValue(), format.decimals - index, true));
                        if (selected) {
                            // set the select index for this column's options
                            column.selectedIndex = column.options.indexOf(selected);
                        }

                        // add our newly created column to the picker
                        picker.addColumn(column);
                    }
                }
            }
            // loop through each format in the template
            // create a new picker column to build up with data
        }
        this.divyColumns(picker);
    }

    private validate(picker: Picker): void {
        let i: number;
        let columns: PickerColumn[] = picker.getColumns();
        picker.refresh();
    }

    private divyColumns(picker: Picker): void {
        let pickerColumns: PickerColumn[] = picker.getColumns();
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
            let width: number = Math.max(columns[0], columns[1]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].align = 'left';
            pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;

        } else if (columns.length === 3) {
            let width: number = Math.max(columns[0], columns[2]);
            pickerColumns[0].align = 'right';
            pickerColumns[1].columnWidth = `${columns[1] * 17}px`;
            pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
            pickerColumns[2].align = 'left';
        }
    }

    private setValue(newData: any): void {
        this._value = this.convertColumnsToNumbers(newData);
    }

    private getValue(): number {
        return this._value || 0;
    }

    private checkHasValue(inputValue: any): void {
        if (this._item) {
            this._item.setElementClass('input-has-value', !!(inputValue && inputValue !== ''));
        }
    }

    private updateText(): void {
        // create the text of the formatted data
        const template: string = this.displayFormat || this.pickerFormat || DEFAULT_FORMAT;
        let text: string = this.getValue().toString();
        let indices: Array<any> = [];
        for (let i: number = 0; i < template.length; i++) {
            if (template[i] === ',') indices.push(i);
        }
        // add zeros based on template
        let seperator: number = template.indexOf('.');
        let templateDecimals: string = template.split('.')[1];
        if (seperator !== -1) {
            if (text.indexOf('.') === -1)
                text += '.';
            let textDecimals: string = text.split('.')[1];

            while (templateDecimals.length !== textDecimals.length) {
                textDecimals += '0';
                text += '0';
            }
        }
        else if (text.indexOf('.') !== -1) {
            text = text.split('.')[0];
        }
        if (indices.length > 0 && template.length === text.length + indices.length) {
            for (let add: number = 0; add < indices.length; add++) {
                text = text.slice(0, add + indices[add]) + ',' + text.slice(add + indices[add]);
            }
        }
        this._text = text;
    }

    /**
     * @input {boolean} Whether or not the numeric component is disabled. Default `false`.
     */
    @Input()
    get disabled(): any {
        return this._disabled;
    }

    set disabled(val: any) {
        this._disabled = isTrueProperty(val);
        this._item && this._item.setElementClass('item-datetime-disabled', this._disabled);
    }

    public writeValue(val: any): void {
        console.debug('numeric, writeValue', val);
        this.setValue(val);
        this.updateText();
        this.checkHasValue(val);
    }

    public ngAfterContentInit(): void {
        this.updateText();
    }

    public registerOnChange(fn: Function): void {
        this._fn = fn;
        this.onChange = (val: any) => {
            this.setValue(val);
            this.updateText();
            this.checkHasValue(val);

            fn(this._value);

            this.onTouched();
        };
    }

    public registerOnTouched(fn: any): void { this.onTouched = fn; }

    private onChange(val: any): void {
        // onChange used when there is not an formControlName
        console.debug('numeric, onChange w/out formControlName', val);
        this.setValue(val);
        this.updateText();
        this.onTouched();
    }

    private onTouched(): void {
        // do nothing
    }

    public ngOnDestroy(): void {
        this._form.deregister(this);
    }

    private convertColumnsToNumbers(columns: any): number {
        if (columns === null) return 0;
        let result: number = 0;
        let keys: Array<string> = Object.keys(columns);
        for (let index: number = 0; index < 10; index++) {
            let element: string = keys.find(k => k.replace('int', '') === index.toString());
            if (!element) break;
            result = result * Math.pow(10, index === 0 ? 0 : 1);
            result += columns[element].value;
        }
        if (keys.some(d => d === 'seperator')) {
            for (let index: number = 0; index < 10; index++) {
                let element: string = keys.find(k => k.replace('dec', '') === index.toString());
                if (!element) break;
                result += columns[element].value / Math.pow(10, index + 1);
                result = +result.toFixed(index + 1);
            }
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
    let values: number[] = [];

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
        let values: string[] = [];

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

import { AfterContentInit, ElementRef, EventEmitter, Renderer } from '@angular/core';
import { Config, Form, Ion, Item, PickerController } from 'ionic-angular';
import { ControlValueAccessor } from '@angular/forms';
export declare const NUMERIC_VALUE_ACCESSOR: any;
export declare class Numeric extends Ion implements AfterContentInit, ControlValueAccessor {
    private _form;
    private _item;
    private _pickerCtrl;
    _disabled: boolean;
    _labelId: string;
    _text: string;
    private _fn;
    private _isOpen;
    private _min;
    private _max;
    private _value;
    id: string;
    /**
     * @input {string} The minimum number allowed. Value must be a number string
     * following the
     */
    min: string;
    /**
     * @input {string} The maximum number allowed. Value must be a number string
     * following the
     */
    max: string;
    /**
     * @input {string} The display format of the number as text that shows
     * within the item. When the `pickerFormat` input is not used, then the
     * `displayFormat` is used for both display the formatted text, and determining
     * the number picker's columns. See the `pickerFormat` input description for
     * more info. Defaults to `XX.XX`.
     */
    displayFormat: string;
    /**
     * @input {string} The format of the numeric picker columns the user selects.
     *  Defaults to use `displayFormat`.
     */
    pickerFormat: string;
    /**
     * @input {string} The text to display on the picker's cancel button. Default: `Cancel`.
     */
    cancelText: string;
    /**
     * @input {string} The text to display on the picker's "Done" button. Default: `Done`.
     */
    doneText: string;
    /**
     * @input {any} Any additional options that the picker interface can accept.
     * See the [Picker API docs](../../picker/Picker) for the picker options.
     */
    pickerOptions: any;
    /**
     * @input {string} The mode to apply to this component.
     */
    mode: string;
    /**
     * @output {any} Any expression to evaluate when the numeric selection has changed.
     */
    ionChange: EventEmitter<any>;
    /**
     * @output {any} Any expression to evaluate when the numeric selection was cancelled.
     */
    ionCancel: EventEmitter<any>;
    constructor(_form: Form, config: Config, elementRef: ElementRef, renderer: Renderer, _item: Item, _pickerCtrl: PickerController);
    _click(ev: UIEvent): void;
    _keyup(): void;
    private open();
    private generate(picker);
    private validate(picker);
    private divyColumns(picker);
    private setValue(newData);
    private getValue();
    private checkHasValue(inputValue);
    private updateText();
    /**
     * @input {boolean} Whether or not the numeric component is disabled. Default `false`.
     */
    disabled: any;
    writeValue(val: any): void;
    ngAfterContentInit(): void;
    registerOnChange(fn: Function): void;
    registerOnTouched(fn: any): void;
    private onChange(val);
    private onTouched();
    ngOnDestroy(): void;
    private convertColumnsToNumbers(columns);
}

import { EventEmitter, ElementRef, Renderer, AfterContentInit } from '@angular/core';
import { Form, Config, Item, PickerController, Picker, Ion } from 'ionic-angular';
import { ControlValueAccessor } from '@angular/forms';
export declare class Numeric extends Ion implements AfterContentInit, ControlValueAccessor {
    private _form;
    private _item;
    private _pickerCtrl;
    _disabled: any;
    _labelId: string;
    _text: string;
    _fn: Function;
    _isOpen: boolean;
    _min: number;
    _max: number;
    _value: number;
    /**
     * @private
     */
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
    /**
  * @private
  */
    open(): void;
    /**
      * @private
      */
    generate(picker: Picker): void;
    /**
       * @private
       */
    validate(picker: Picker): void;
    /**
     * @private
     */
    divyColumns(picker: Picker): void;
    /**
     * @private
     */
    setValue(newData: any): void;
    /**
     * @private
     */
    getValue(): number;
    /**
     * @private
     */
    checkHasValue(inputValue: any): void;
    /**
     * @private
     */
    updateText(): void;
    /**
     * @input {boolean} Whether or not the numeric component is disabled. Default `false`.
     */
    disabled: any;
    /**
     * @private
     */
    writeValue(val: any): void;
    /**
     * @private
     */
    ngAfterContentInit(): void;
    /**
     * @private
     */
    registerOnChange(fn: Function): void;
    /**
     * @private
     */
    registerOnTouched(fn: any): void;
    /**
     * @private
     */
    onChange(val: any): void;
    /**
     * @private
     */
    onTouched(): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    convertColumnsToNumbers(columns: Array<{
        value: number;
        text: string;
    }>): number;
}

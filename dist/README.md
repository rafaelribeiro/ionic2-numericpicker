# Ionic Numeric Picker


To Install

```
    npm i ionic2-numericpicker --save
```

To import

```
      imports: [
          NumericModule
     ],
```

To Use

```
<ion-item>
  <ion-label>Number</ion-label>
  <ion-numeric item-content displayFormat="xx" [(ngModel)]="myDate"></ion-numeric>
</ion-item>
```


# Options

* min  	

Optional. Minimum number that can be selected

* max

Optional. Maximum number that can be selected

* displayFormat

Default is XX.XX. Determines how it should be displayed after selection

* pickerFormat

Default is displayFormat. Determines how it should be displayed in the pickerFormat

* cancelText

 The text to display on the picker's cancel button. Default: Cancel.

* doneText

 The text to display on the picker's "Done" button. Default: Done.

* pickerOptions

  Any additional options that the picker interface can accept. See the Picker API docs for the picker options.

* mode

 The mode to apply to this component.

* disabled

 Whether or not the datetime component is disabled. Default false.

 # Output Events

* ionChange
 
  Any expression to evaluate when the datetime selection has changed.

* ionCancel

 Any expression to evaluate when the datetime selection was cancelled.


 # Sass Variables

 For the sake of convience it uses the datetime classes.

 * $datetime-ios-padding-top
 
  Padding top of the component

 * $datetime-ios-padding-right

 Padding right of the component

 * $datetime-ios-padding-bottom

 Padding bottom of the DateTime component

 * $datetime-ios-padding-left

 Padding left of the DateTime component
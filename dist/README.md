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
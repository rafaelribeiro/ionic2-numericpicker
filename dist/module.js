import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Numeric } from './components/component';
var NumericModule = (function () {
    function NumericModule() {
    }
    return NumericModule;
}());
export { NumericModule };
NumericModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    Numeric,
                ],
                providers: [],
                exports: [
                    Numeric,
                ],
                imports: [
                    BrowserModule,
                ],
                schemas: [
                    CUSTOM_ELEMENTS_SCHEMA,
                ],
            },] },
];
NumericModule.ctorParameters = function () { return []; };
//# sourceMappingURL=module.js.map
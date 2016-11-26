import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Numeric } from './components/component';
export var NumericModule = (function () {
    function NumericModule() {
    }
    NumericModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        Numeric
                    ],
                    providers: [],
                    exports: [Numeric
                    ],
                    imports: [
                        BrowserModule
                    ],
                    schemas: [
                        CUSTOM_ELEMENTS_SCHEMA
                    ]
                },] },
    ];
    /** @nocollapse */
    NumericModule.ctorParameters = [];
    return NumericModule;
}());
//# sourceMappingURL=module.js.map
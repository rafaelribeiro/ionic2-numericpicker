import { async } from '@angular/core/testing';
import { Numeric } from './component';
import { TestUtils } from '../tests/test';
var fixture = null;
var instance = null;
describe('Numeric Component', function () {
    beforeEach(async(function () { return TestUtils.beforeEachCompiler([Numeric]).then(function (compiled) {
        fixture = compiled.fixture;
        instance = compiled.instance;
    }); }));
    afterEach(function () {
        fixture.destroy();
    });
    it('initialises', function () {
        expect(instance).not.toBeNull();
    });
});
//# sourceMappingURL=component.spec.js.map
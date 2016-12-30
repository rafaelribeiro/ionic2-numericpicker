import { ComponentFixture, async } from '@angular/core/testing';

import { Numeric } from './component';
import { TestUtils } from '../tests/test';

let fixture: ComponentFixture<Numeric> = null;
let instance: any = null;

describe('Numeric Component', () => {

    beforeEach(async(() => TestUtils.beforeEachCompiler([Numeric]).then(compiled => {
        fixture = compiled.fixture;
        instance = compiled.instance;
    })));

    afterEach(() => {
        fixture.destroy();
    });

    it('initialises', () => {
        expect(instance).not.toBeNull();
    });
});

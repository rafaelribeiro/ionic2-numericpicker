import './polyfills.ts';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { TestBed } from '@angular/core/testing';
export declare class TestUtils {
    static beforeEachCompiler(components: Array<any>): Promise<{
        fixture: any;
        instance: any;
    }>;
    static configureIonicTestingModule(components: Array<any>): typeof TestBed;
    static eventFire(el: any, etype: string): void;
}

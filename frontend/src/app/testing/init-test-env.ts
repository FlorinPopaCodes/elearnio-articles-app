import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

const flag = Symbol.for('ng-testbed-init');
if (!(globalThis as any)[flag]) {
  (globalThis as any)[flag] = true;
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting(),
  );
}

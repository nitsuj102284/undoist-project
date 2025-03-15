import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  generateUuid(): string {
    return crypto.randomUUID();
  }


  mapBooleansToBit(arr: any[]): any[] {
    return arr.map(v => {
      if (typeof v !== 'boolean') return v;
      return v ? 1 : 0;
    });
  }


  mapObjectBooleansToBit(obj: Object): any {
    const newObj: any = { ...obj };
    Object.keys(newObj).forEach(k => {
      if (typeof newObj[k] === 'boolean') {
        newObj[k] = newObj[k] ? 1 : 0;
      }
    });

    return newObj;
  }


  defaultSort(a: any, b: any): number {
    if (typeof a !== 'object' && typeof b !== 'object') {
      return a > b ? 1 : -1;
    }

    if (a.sortOrder != null && b.sortOrder != null) {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
    }

    const aName: string = a.name || a.title || '';
    const bName: string = b.name || b.title || '';
    
    return aName > bName ? 1 : -1;
  }


  stringToCamelCase(str: string): string {
    if (typeof str !== 'string') return str;

    const words: string[] = str.split(/(?=[A-Z])|\s+/);
    str = words.map((word, i) => {
      if (!i) return word.toLowerCase();
      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
    }).join('');

    return str;
  }


  getSpecialKeySymbol(): string {
    const isMac: boolean = window.navigator.platform.startsWith('Mac');
    return isMac ? '⌘' : '^';
  }


  focusNextElement(): void {
    const focusableEls: HTMLElement[] = Array.from(this.document.querySelectorAll('input, select, textarea, button, .ql-editor'))
      .map(el => el as HTMLElement)
      .filter(el => this.isElementVisible(el));
    const focusedIndex: number = focusableEls.indexOf(this.document.activeElement as HTMLElement);

    if (focusedIndex !== -1 && focusedIndex < focusableEls.length - 1) {
      focusableEls[focusedIndex + 1].focus();
      return;
    }

    focusableEls[0].focus();
  }


  isElementVisible(el: HTMLElement): boolean {
    let currentEl: HTMLElement = el;
    while (currentEl) {
      const style = window.getComputedStyle(currentEl);
      if (style.visibility === 'hidden' || style.display === 'none') return false;

      currentEl = currentEl.parentElement;
    }

    return true;
  }


  clearFormControlsWithOnlyHtml(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(k => {
      const control: FormControl = <FormControl>formGroup.controls[k];
      const val: any = control.value;
      if (typeof val !== 'string') return;

      const textVal: string = val.replace(/<[^>]*>/g, '').trim();
      if (!textVal) control.setValue(null);
    });
  }

}

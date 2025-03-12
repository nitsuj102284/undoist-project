import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }


  stringToCamelCase(str: string): string {
    if (typeof str !== 'string') return str;

    const words: string[] = str.split(' ');
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

}

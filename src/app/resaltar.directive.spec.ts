import { ResaltarDirective } from './resaltar.directive';
import { ElementRef } from '@angular/core';

describe('ResaltarDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {
      nativeElement: document.createElement('div')
    };

    const directive = new ResaltarDirective(mockElementRef as ElementRef);
    expect(directive).toBeTruthy();
  });
});
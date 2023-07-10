import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appResaltar]'
})
export class ResaltarDirective {

@Input() appResaltar :number=0; 

  @HostListener('mouseenter') onMouseEnter() {
    if(this.appResaltar>10){

    this.highlight('yellow');
    }
    else{
    
    this.highlight('red');
    }
    }
    
    @HostListener('mouseleave') onMouseLeave() {
        this.highlight('');
    }

    public highlight(color:string){
    this.el.nativeElement.style.backgroundColor= color;

    }
    constructor(public el:ElementRef) {
        
    }


}

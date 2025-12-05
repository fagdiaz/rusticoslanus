import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appMyMessage]'
})
export class MyMessageDirective implements OnInit {
  @Input('appMyMessage') uidRemitente: string | undefined;

  constructor(
    private el: ElementRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && currentUser.uid === this.uidRemitente) {
      this.el.nativeElement.classList.add('mensaje-mio');
    } else {
      this.el.nativeElement.classList.add('mensaje-otro');
    }
  }
}

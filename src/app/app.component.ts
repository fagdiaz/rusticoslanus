import { Component, OnInit } from '@angular/core';
import { filter, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'rusticoslanus';

  constructor(private authService: AuthService, private chatService: ChatService) {}

  ngOnInit(): void {
    this.authService.user$.pipe(
      filter(user => !!user && !!user.uid),
      take(1)
    ).subscribe((user) => {
      const uid = user?.uid;
      if (uid) {
        this.chatService.startGlobalPollingConversationsAndUnread(uid);
      }
    });
  }
}

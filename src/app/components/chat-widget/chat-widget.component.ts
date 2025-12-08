import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements OnInit, OnDestroy {
  isOpen = false;
  unreadConversationsCount$ = this.chatService.unreadConversationsCount$;
  @ViewChild(ChatComponent) chatComponent?: ChatComponent;

  constructor(private chatService: ChatService, private authService: AuthService) {}

  ngOnInit(): void {
    this.chatService.initGlobalUnreadPolling();
    this.authService.user$
      .pipe(
        filter((u): u is any => !!u && !!(u as any).uid),
        take(1)
      )
      .subscribe((u) => this.chatService.refreshUnreadOnce((u as any).uid));
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.chatComponent?.scrollToBottom(), 0);
    }
  }

  ngOnDestroy(): void {
  }
}

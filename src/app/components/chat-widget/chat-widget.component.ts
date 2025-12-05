import { Component, ViewChild } from '@angular/core';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  isOpen = false;
  @ViewChild(ChatComponent) chatComponent?: ChatComponent;

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => this.chatComponent?.scrollToBottom(), 0);
    }
  }
}

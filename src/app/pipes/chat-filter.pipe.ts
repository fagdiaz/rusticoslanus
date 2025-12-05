import { Pipe, PipeTransform } from '@angular/core';
import { MensajeChat } from '../services/chat.service';

@Pipe({
  name: 'chatFilter'
})
export class ChatFilterPipe implements PipeTransform {
  transform(mensajes: MensajeChat[], filtro: string): MensajeChat[] {
    if (!mensajes) {
      return [];
    }

    if (!filtro) {
      return mensajes;
    }

    const filtroLower = filtro.toLowerCase();

    return mensajes.filter(msg =>
      msg.texto.toLowerCase().includes(filtroLower) ||
      msg.emailRemitente.toLowerCase().includes(filtroLower)
    );
  }
}

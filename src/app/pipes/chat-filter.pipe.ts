import { Pipe, PipeTransform } from '@angular/core';
import { MensajeChat } from '../services/chat.service';

@Pipe({
  name: 'chatFilter'
})
export class ChatFilterPipe implements PipeTransform {
  transform(mensajes: MensajeChat[] | null | undefined, filtro: string | null | undefined): MensajeChat[] {
    if (!mensajes || !mensajes.length) return [];
    if (!filtro || !filtro.trim()) return mensajes;

    const term = filtro.trim().toLowerCase();

    return mensajes.filter(msg => {
      const texto = (msg.texto || '').toLowerCase();
      return texto.includes(term);
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styles: [],
})
export class ChatComponent implements OnInit {
  mensaje: string = '';
  // con esta variable vamos a arreglar para que la barra de desplazamiento siempre baje al mensaje y luego vamos al ngOnit
  elemento: any;

  constructor(public chatService: ChatService) {
    // this.chatService.cargarMensajes()
    //       .subscribe((mensaje:any[])=>{
    //         console.log(mensaje);
    //       })
    this.chatService
      .cargarMensajes()
      //En el subscribe llamamos la funcion de flecha y hacemos el siguiente codigo con el scrllTop y el scrollHeight
      //Pero como lo hace tan rapido le incluimos un setTimeout
      //Esto me sirve para que siempre quede en la linea de abajo cada vez que envio el mensaje
      .subscribe(() => {
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 20);
      });
  }

  //capturamos el elemento que tenemos en el html id="app-mensajes"
  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
  }

  enviar_mensaje() {
    console.log(this.mensaje);
    if (this.mensaje.length === 0) {
      return;
    }
    this.chatService
      .agregarMensaje(this.mensaje)
      //Eliminamos el texto ya que si se dispara se supone que se envio por eso se deja vacio el texto
      .then(() => (this.mensaje = ''))
      .catch((err) => console.log('Error al enviar', err));
  }
}

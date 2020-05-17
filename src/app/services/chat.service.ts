import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';
 

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public chats: Mensaje[] = [];
  //Antes de iniciar declaramos este usuario de tipo vacio para poder loguearnos y otras cosas relacionadas a lo que me regrese la 
  //autenticacion
  public usuario: any ={};
  private itemsCollection: AngularFirestoreCollection<Mensaje>;

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {
  //Debemos susbirnos a un observable de lo que nos retorne el afAuth
  //De esta manera estamos escuchando cualquier cambio que suceda en la autenticacion
  this.afAuth.authState.subscribe( user =>{
    //Cuando es la primera vez llega vacio y no tenemos inforacion por lo cual llega nulo
    
    //Aqui vemos la autenticacion del usuario que es de donde viene toda la informacion del usuario uid y displayName
    console.log('Estado del usuario', user);

    //Si no existe un usuario retorne
    if(!user){
      return;
    }

    this.usuario.nombre = user.displayName;
    this.usuario.uid =user.uid;

  })
}

  // Recibe el proveedor de tipo string
  login( proveedor: string){
    //Tambien puedo implementar github o el que necesite
    //Luego nos vamos al componente chat service y lo inyectamos verificar procedimiento alla
    if(proveedor === 'google'){
      this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }else
    {
      this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider());
    }

      
  }
  logout(){
    // Debemos desloguear el usuario con 
    this.afAuth.signOut();
    this.usuario.uid = null;
  }


  // Cargar mensajes en firebase
  cargarMensajes() {
    // Como los mensajes se muestran desordenados debemos enviarle un query a firebase despues de chats enviamos el ref ordenamos 
    // por fecha y de forma descendente y solo mostramos una limitante de 5 para eso sirve el limit
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc').limit(5));
    return this.itemsCollection.valueChanges().pipe(
      map((mensajes: Mensaje[]) => {
        console.log(mensajes);
        
        //Con este ajuste debemos ordenar los mensajes para que no se vean desordenados no basta con el query que hacemos
        this.chats = [];
        for (let mensaje of mensajes){
          // con unshift insertamos siempre en la primera posicion
          this.chats.unshift (mensaje);
        }
        return this.chats;        
        // this.chats = mensajes;
      })
    );
  }

  agregarMensaje(texto: string){
    // necesito enviar a firebase la estructrura completa 
    // TODO falta el UID del usuario
    let mensaje:Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid: this.usuario.uid
    }
    //Devuelve una promesa y puedo hacer el then o el catch en donde yo quiera
    return this.itemsCollection.add( mensaje);
  }

}

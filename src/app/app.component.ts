import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent  implements OnInit{
  // chats: Observable<any[]>;
  // chats2:Observable<any[]>;
  constructor(
    // firestore: AngularFirestore
    public chatservice: ChatService
  ) {
    // this.chats = firestore.collection('chats').valueChanges();
    // this. chats2 = firestore.collection('chats2').valueChanges();
    // console.log(this.chats);
    console.log(chatservice);
  }

  ngOnInit(){
    console.log(this.chatservice);
  }
}

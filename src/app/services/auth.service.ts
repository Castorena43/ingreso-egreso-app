import { Injectable } from '@angular/core';
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {map} from "rxjs";
import {Usuario} from "../models/usuario.model";
import {AngularFirestore} from "@angular/fire/compat/firestore";

interface Register extends Login {
  name: string;
}

interface Login {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth,
              private firestore: AngularFirestore) { }

  initAuthListener () {
    this.auth.authState.subscribe(fuser => {
      console.log(fuser);
    })
  }

  isAuth () {
    return this.auth.authState.pipe(
      map(fuser => fuser !== null)
    )
  }

  register (data: Register) {
    return this.auth.createUserWithEmailAndPassword(data.email, data.password)
      .then(({user}) => {
        const newUser = new Usuario(user?.uid || '', data.name, data.email);
        return this.firestore.doc(`${user?.uid}/usuario`).set({...newUser})
      });
  }

  login (data: Login) {
    return this.auth.signInWithEmailAndPassword(data.email, data.password);
  }

  logout () {
    return this.auth.signOut();
  }
}

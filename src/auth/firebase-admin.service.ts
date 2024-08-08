import { Injectable } from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';
import { firebaseConfig } from '../config/firebase.config';

@Injectable()
export class FirebaseAdminService {
  constructor() {
    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseConfig),
      });
    }
  }

  async deleteUser(uid: string): Promise<void> {
    return firebaseAdmin.auth().deleteUser(uid);
  }
}

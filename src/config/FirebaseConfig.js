import * as firebase from "firebase";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import { ApiConfig } from "./ApiConfig";

const firebaseConfig = {
  apiKey: ApiConfig.apiKey,
  authDomain: ApiConfig.authDomain,
  databaseURL: ApiConfig.databaseURL,
  projectId: ApiConfig.projectId,
  storageBucket: ApiConfig.storageBucket,
  messagingSenderId: ApiConfig.messagingSenderId,
  appId: ApiConfig.appId,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };

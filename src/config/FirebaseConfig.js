import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyD_QiB-4dXZMZyu60aEjBfA_8ucrQwoahg',
  authDomain: 'america-scores.firebaseapp.com',
  databaseURL: 'https://america-scores.firebaseio.com',
  projectId: 'america-scores',
  storageBucket: 'america-scores.appspot.com',
  messagingSenderId: '688897090799',
  appId: '1:688897090799:web:309bc9231449447df6e71a',
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
import app from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyChw6tbQ4tXKBNcY20jyZK5ie-KfZVbQSk",
  authDomain: "collection-maker.firebaseapp.com",
  databaseURL: "https://collection-maker.firebaseio.com",
  projectId: "collection-maker",
  storageBucket: "collection-maker.appspot.com",
  messagingSenderId: "612058539737",
  appId: "1:612058539737:web:657a127ace2c434bd300c8"
};


		app.initializeApp(firebaseConfig); //var fan är app filen?



export default app;

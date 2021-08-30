import firebase from "firebase";
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB2TaC-bZFGODj0TtdF4At1iqGtGoLNz5M",
    authDomain: "simplest-social-network.firebaseapp.com",
    projectId: "simplest-social-network",
    storageBucket: "simplest-social-network.appspot.com",
    messagingSenderId: "1059964371113",
    appId: "1:1059964371113:web:42a6c2fca624f8f525e9b8",
    measurementId: "G-W8SESNJJ4J"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
const db = app.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();

export { auth, provider, db, storage };
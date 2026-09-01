// Replace these values with the ones from your own Firebase project.
// Firebase Console -> Project settings -> General -> "Your apps" -> SDK setup and configuration
// These values are safe to make public - they identify your project, they are not secret keys.
// Your data is protected by Firestore Security Rules instead (see README.md).

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

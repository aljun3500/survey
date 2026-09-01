// Firebase project config for college-life-survey.
// These values are safe to be public - they identify your project, not secret keys.
// Your data is protected by Firestore Security Rules instead (see README.md).

const firebaseConfig = {
  apiKey: "AIzaSyA3HoVB0-HRW-FPhYjTG5Dv58UjBPIhzQc",
  authDomain: "college-life-survey.firebaseapp.com",
  projectId: "college-life-survey",
  storageBucket: "college-life-survey.firebasestorage.app",
  messagingSenderId: "739932037530",
  appId: "1:739932037530:web:88dc57eaf08c6fc4949a23"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyB_UjYSRK8r_jt_e2CB1HSBsPZ_T3BlvOo",
    authDomain: "epms-2d83d.firebaseapp.com",
    projectId: "epms-2d83d",
    storageBucket: "epms-2d83d.appspot.com",
    messagingSenderId: "617482899729",
    appId: "1:617482899729:web:0a6573337323692c0cfcb0",
    measurementId: "G-MMYPBQF47D"
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// Function to upload image to Firebase Storage
const uploadImageToFirebase = async (imageFile) => {
  try {
    const storageRef = ref(storage, `images/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = `https://storage.googleapis.com/${firebaseConfig.storageBucket}/images/${imageFile.name}`;
    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to Firebase:", error);
    throw new Error("Error uploading image to Firebase");
  }
};

export { uploadImageToFirebase };

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import moment from "moment";
import config from "../../firebase.json";

export const app = initializeApp(config);
const auth = getAuth(app);
const storage = getStorage(app);
export const db = getFirestore(app);

const uploadImage = async (uri) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const user = auth.currentUser;
  const fileRef = ref(storage, `/profile/${user.uid}/photo.png`);
  const snapshot = await uploadBytes(fileRef, blob, {
    contentType: "image/png",
  });

  blob.close();
  return await getDownloadURL(fileRef);
};

export const logout = async () => {
  return await signOut(auth);
};
export const login = async ({ email, password }) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signup = async ({ email, password, name, photoUrl }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const storageUrl = photoUrl.startsWith("https")
    ? photoUrl
    : await uploadImage(photoUrl);
  await updateProfile(auth.currentUser, {
    displayName: name,
    photoURL: storageUrl,
  });
  return user;
};

export const getCurrentUser = () => {
  const { uid, displayName, email, photoURL } = auth.currentUser;
  return { uid, name: displayName, email, photoUrl: photoURL };
};

export const updateUserPhoto = async (photoUrl) => {
  const user = auth.currentUser;
  const storageUrl = photoUrl.startsWith("https")
    ? photoUrl
    : await uploadImage(photoUrl);
  await updateProfile(user, { photoURL: storageUrl });
  return { name: user.displayName, email: user.email, photoUrl: user.photoURL };
};

//DB//
export const createChannel = async ({ title, description }) => {
  const channelCollection = collection(db, "channels");
  const newChannelRef = doc(channelCollection);
  const id = newChannelRef.id;
  const newChannel = {
    id,
    title,
    description,
    createdAt: Date.now(),
  };
  await setDoc(newChannelRef, newChannel);
  return id;
};

export const createMessage = async ({ channelId, message }) => {
  console.log(channelId);
  console.log(message);
  const docRef = doc(db, `channels/${channelId}/messages`, message._id);
  await setDoc(docRef, { ...message, createdAt: Date.now() });
};

import { db } from "@/src/configs/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
} from "@firebase/firestore";

interface Note {
  id?: string;
  title: string;
  tagline: string;
  body: string;
  isPinned: boolean;
}

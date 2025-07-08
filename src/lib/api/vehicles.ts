import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig';

export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  year: string;
  plate: string;
}

const db = getFirestore(firebaseApp);
const col = collection(db, 'vehicles');

export async function getVehicles(): Promise<Vehicle[]> {
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
}

export async function addVehicle(data: Omit<Vehicle, 'id'>) {
  await addDoc(col, data);
}

export async function updateVehicle(id: string, data: Omit<Vehicle, 'id'>) {
  await updateDoc(doc(db, 'vehicles', id), data);
}

export async function deleteVehicle(id: string) {
  await deleteDoc(doc(db, 'vehicles', id));
} 
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig';

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
}

const db = getFirestore(firebaseApp);
const col = collection(db, 'customers');

export async function getCustomers(): Promise<Customer[]> {
  const snap = await getDocs(col);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
}

export async function addCustomer(data: Omit<Customer, 'id'>) {
  await addDoc(col, data);
}

export async function updateCustomer(id: string, data: Omit<Customer, 'id'>) {
  await updateDoc(doc(db, 'customers', id), data);
}

export async function deleteCustomer(id: string) {
  await deleteDoc(doc(db, 'customers', id));
} 
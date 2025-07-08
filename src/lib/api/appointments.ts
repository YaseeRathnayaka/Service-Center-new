import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, orderBy } from 'firebase/firestore';
import { firebaseApp } from '../../firebaseConfig';

export type Appointment = {
  id?: string;
  customer: string;
  vehicle: string;
  date: string | Timestamp;
  status: string;
  createdAt?: Timestamp;
};

const db = getFirestore(firebaseApp);
const col = collection(db, 'appointments');

export async function getAppointments(): Promise<Appointment[]> {
  const q = query(col, orderBy('date', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
}

export async function addAppointment(data: Omit<Appointment, 'id'>) {
  return addDoc(col, {
    ...data,
    date: data.date ? (typeof data.date === 'string' ? Timestamp.fromDate(new Date(data.date)) : data.date) : null,
    createdAt: Timestamp.now(),
  });
}

export async function updateAppointment(id: string, data: Partial<Appointment>) {
  return updateDoc(doc(db, 'appointments', id), data);
}

export async function deleteAppointment(id: string) {
  return deleteDoc(doc(db, 'appointments', id));
} 
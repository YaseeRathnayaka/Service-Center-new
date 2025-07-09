import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebaseConfig";

export interface Employee {
  id?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  skill?: string;
  address?: string;
}

const db = getFirestore(firebaseApp);
const col = collection(db, "employees");

export async function getEmployees(): Promise<Employee[]> {
  const snap = await getDocs(col);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Employee));
}

export async function addEmployee(data: Omit<Employee, "id">) {
  await addDoc(col, data);
}

export async function updateEmployee(id: string, data: Omit<Employee, "id">) {
  await updateDoc(doc(db, "employees", id), data);
}

export async function deleteEmployee(id: string) {
  await deleteDoc(doc(db, "employees", id));
}

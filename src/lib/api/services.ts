import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { firebaseApp } from "../../firebaseConfig";

export interface Service {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number; // in minutes
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceHead {
  id?: string;
  serviceId: string;
  employeeId: string;
  employeeName: string;
  assignedAt: Date;
  status: 'active' | 'inactive';
}

export interface ServiceLaborer {
  id?: string;
  serviceId: string;
  employeeId: string;
  employeeName: string;
  role: string;
  assignedAt: Date;
  status: 'active' | 'inactive';
}

const db = getFirestore(firebaseApp);

// Services collection
const servicesCol = collection(db, "services");
const serviceHeadsCol = collection(db, "serviceHeads");
const serviceLaborersCol = collection(db, "serviceLaborers");

// Services CRUD operations
export async function getServices(): Promise<Service[]> {
  const snap = await getDocs(servicesCol);
  return snap.docs.map((doc) => ({ 
    id: doc.id, 
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate() || new Date(),
  } as Service));
}

export async function addService(data: Omit<Service, "id" | "createdAt" | "updatedAt">) {
  const serviceData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await addDoc(servicesCol, serviceData);
}

export async function updateService(id: string, data: Partial<Omit<Service, "id" | "createdAt">>) {
  const updateData = {
    ...data,
    updatedAt: new Date(),
  };
  await updateDoc(doc(db, "services", id), updateData);
}

export async function deleteService(id: string) {
  await deleteDoc(doc(db, "services", id));
}

// Service Heads CRUD operations
export async function getServiceHeads(serviceId?: string): Promise<ServiceHead[]> {
  let q;
  if (serviceId) {
    q = query(serviceHeadsCol, where("serviceId", "==", serviceId));
  } else {
    q = query(serviceHeadsCol);
  }
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ 
    id: doc.id, 
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate() || new Date(),
  } as ServiceHead));
}

export async function addServiceHead(data: Omit<ServiceHead, "id" | "assignedAt">) {
  const headData = {
    ...data,
    assignedAt: new Date(),
  };
  await addDoc(serviceHeadsCol, headData);
}

export async function updateServiceHead(id: string, data: Partial<Omit<ServiceHead, "id" | "assignedAt">>) {
  await updateDoc(doc(db, "serviceHeads", id), data);
}

export async function deleteServiceHead(id: string) {
  await deleteDoc(doc(db, "serviceHeads", id));
}

// Service Laborers CRUD operations
export async function getServiceLaborers(serviceId?: string): Promise<ServiceLaborer[]> {
  let q;
  if (serviceId) {
    q = query(serviceLaborersCol, where("serviceId", "==", serviceId));
  } else {
    q = query(serviceLaborersCol);
  }
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ 
    id: doc.id, 
    ...doc.data(),
    assignedAt: doc.data().assignedAt?.toDate() || new Date(),
  } as ServiceLaborer));
}

export async function addServiceLaborer(data: Omit<ServiceLaborer, "id" | "assignedAt">) {
  const laborerData = {
    ...data,
    assignedAt: new Date(),
  };
  await addDoc(serviceLaborersCol, laborerData);
}

export async function updateServiceLaborer(id: string, data: Partial<Omit<ServiceLaborer, "id" | "assignedAt">>) {
  await updateDoc(doc(db, "serviceLaborers", id), data);
}

export async function deleteServiceLaborer(id: string) {
  await deleteDoc(doc(db, "serviceLaborers", id));
} 
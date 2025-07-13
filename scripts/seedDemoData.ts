import { getFirestore, collection, getDocs, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { firebaseApp } from '../src/firebaseConfig';

const db = getFirestore(firebaseApp);

async function clearCollection(colName: string) {
  const colRef = collection(db, colName);
  const snap = await getDocs(colRef);
  for (const docu of snap.docs) {
    await deleteDoc(docu.ref);
  }
}

async function seed() {
  // Clear all collections
  await clearCollection('vehicles');
  await clearCollection('customers');
  await clearCollection('employees');
  await clearCollection('services');
  await clearCollection('appointments');

  // Vehicles
  const vehicles = [
    { make: 'Toyota', model: 'Camry', year: '2020', plate: 'ABC123' },
    { make: 'Honda', model: 'Civic', year: '2019', plate: 'XYZ789' },
    { make: 'Ford', model: 'F-150', year: '2021', plate: 'TRK456' },
    { make: 'BMW', model: 'X3', year: '2022', plate: 'BMW321' },
  ];
  const vehicleRefs = [];
  for (const v of vehicles) {
    const ref = await addDoc(collection(db, 'vehicles'), v);
    vehicleRefs.push({ ...v, id: ref.id });
  }

  // Customers
  const customers = [
    { name: 'Alice Smith', email: 'alice@example.com', phone: '555-1234' },
    { name: 'Bob Johnson', email: 'bob@example.com', phone: '555-5678' },
    { name: 'Charlie Lee', email: 'charlie@example.com', phone: '555-8765' },
    { name: 'Diana King', email: 'diana@example.com', phone: '555-4321' },
  ];
  const customerRefs = [];
  for (const c of customers) {
    const ref = await addDoc(collection(db, 'customers'), c);
    customerRefs.push({ ...c, id: ref.id });
  }

  // Employees
  const employees = [
    { name: 'Evan Miller', email: 'evan@example.com', role: 'Mechanic' },
    { name: 'Fiona Clark', email: 'fiona@example.com', role: 'Advisor' },
    { name: 'George Hall', email: 'george@example.com', role: 'Technician' },
    { name: 'Hannah Scott', email: 'hannah@example.com', role: 'Cleaner' },
  ];
  for (const e of employees) {
    await addDoc(collection(db, 'employees'), e);
  }

  // Services
  const services = [
    { name: 'Oil Change', price: 50, duration: 45 },
    { name: 'Brake Service', price: 120, duration: 120 },
    { name: 'Tire Rotation', price: 40, duration: 30 },
    { name: 'AC Service', price: 90, duration: 90 },
    { name: 'Inspection', price: 70, duration: 60 },
  ];
  for (const s of services) {
    await addDoc(collection(db, 'services'), s);
  }

  // Appointments (linking vehicles and customers)
  const today = new Date();
  const appointments = [
    {
      customer: customers[0].name,
      vehicle: vehicles[0].plate,
      date: Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate())),
      status: 'Scheduled',
    },
    {
      customer: customers[1].name,
      vehicle: vehicles[1].plate,
      date: Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)),
      status: 'Completed',
    },
    {
      customer: customers[2].name,
      vehicle: vehicles[2].plate,
      date: Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2)),
      status: 'In Progress',
    },
    {
      customer: customers[3].name,
      vehicle: vehicles[3].plate,
      date: Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3)),
      status: 'Cancelled',
    },
    {
      customer: customers[0].name,
      vehicle: vehicles[1].plate,
      date: Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 4)),
      status: 'Completed',
    },
  ];
  for (const a of appointments) {
    await addDoc(collection(db, 'appointments'), a);
  }

  console.log('Demo data seeded successfully!');
}

seed().catch(console.error); 
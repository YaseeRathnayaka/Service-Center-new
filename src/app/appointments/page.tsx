"use client"
import React, { useState, useEffect } from 'react';
import { getAppointments, addAppointment, updateAppointment, deleteAppointment, Appointment } from '../../lib/api/appointments';
import AtomicForm, { AtomicField } from '../../components/atoms/AtomicForm';
import Button from '../../components/atoms/Button';
import Table from '../../components/atoms/Table';
import Drawer from '../../components/molecules/Drawer';
import Dialog from '../../components/molecules/Dialog';
import "remixicon/fonts/remixicon.css";
import { toast } from 'react-toastify';
import LottieLoader from '../../components/atoms/LottieLoader';

const statusOptions = [
  { label: 'Scheduled', value: 'Scheduled' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer: '',
    vehicle: '',
    date: '',
    status: 'Scheduled',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch appointments
  const fetchData = async () => {
    setLoading(true);
    setAppointments(await getAppointments());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  // Open drawer for add/edit
  const openDrawer = (appt?: Appointment) => {
    if (appt) {
      setEditId(appt.id!);
      setForm({
        customer: appt.customer,
        vehicle: appt.vehicle,
        date: appt.date && typeof appt.date === 'object' && 'toDate' in appt.date ? appt.date.toDate().toISOString().slice(0, 10) : String(appt.date),
        status: appt.status,
      });
    } else {
      setEditId(null);
      setForm({ customer: '', vehicle: '', date: '', status: 'Scheduled' });
    }
    setFormError('');
    setDrawerOpen(true);
  };

  // Handle form field changes
  const handleField = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [name]: e.target.value }));
  };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editId) {
        await updateAppointment(editId, form);
        toast.success('Appointment updated successfully');
      } else {
        await addAppointment(form);
        toast.success('Appointment added successfully');
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Error saving appointment');
      toast.error(err.message || 'Error saving appointment');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteAppointment(deleteId);
      toast.success('Appointment deleted');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting appointment');
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  // Table columns
  const columns = [
    { label: 'Customer', accessor: 'customer' },
    { label: 'Vehicle', accessor: 'vehicle' },
    { label: 'Date', accessor: 'date', render: (v: any) => v && v.toDate ? v.toDate().toISOString().slice(0, 10) : v },
    { label: 'Status', accessor: 'status', render: (v: string) => {
      if (v === 'Completed') return <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">Completed</span>;
      if (v === 'Pending') return <span className="px-2 py-1 rounded bg-red-100 text-red-600 text-xs">Pending</span>;
      return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{v}</span>;
    } },
    {
      label: 'Actions', accessor: 'actions', render: (_: any, row: Appointment) => (
        <div className="flex gap-2">
          <Button iconOnly variant="secondary" aria-label="Edit appointment">
            <i className="ri-edit-2-line text-lg" />
          </Button>
          <Button iconOnly variant="danger" aria-label="Delete appointment" onClick={() => handleDelete(row.id!)}>
            <i className="ri-delete-bin-6-line text-lg" />
          </Button>
        </div>
      )
    },
  ];

  // AtomicForm fields
  const fields: AtomicField[] = [
    { name: 'customer', label: 'Customer', type: 'text', value: form.customer, onChange: handleField('customer'), required: true },
    { name: 'vehicle', label: 'Vehicle', type: 'text', value: form.vehicle, onChange: handleField('vehicle'), required: true },
    { name: 'date', label: 'Date', type: 'date', value: form.date, onChange: handleField('date'), required: true },
    { name: 'status', label: 'Status', type: 'select', value: form.status, onChange: handleField('status'), options: statusOptions, required: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">Appointment Management</h1>
        <Button onClick={() => openDrawer()} variant="primary">+ Add Appointment</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        <h2 className="font-semibold mb-2 text-blue-900">All Appointments</h2>
        <Table columns={columns} data={appointments} />
        {(loading || formLoading || deleteLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <LottieLoader size={64} />
          </div>
        )}
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editId ? 'Edit Appointment' : 'Add Appointment'}>
        <AtomicForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel={editId ? 'Update' : 'Add'}
          loading={formLoading}
          error={formError}
        />
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setDeleteId(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
} 
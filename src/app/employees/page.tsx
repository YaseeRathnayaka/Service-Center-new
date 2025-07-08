"use client";
import React, { useState, useEffect } from 'react';
import Table from '../../components/atoms/Table';
import Button from '../../components/atoms/Button';
import Drawer from '../../components/molecules/Drawer';
import Dialog from '../../components/molecules/Dialog';
import LottieLoader from '../../components/atoms/LottieLoader';
import AtomicForm, { AtomicField } from '../../components/atoms/AtomicForm';
import { toast } from 'react-toastify';
import { getEmployees, addEmployee, updateEmployee, deleteEmployee, Employee } from '../../lib/api/employees';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', role: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setEmployees(await getEmployees());
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const openDrawer = (employee?: Employee) => {
    if (employee) {
      setEditId(employee.id!);
      setForm({ name: employee.name, email: employee.email, role: employee.role });
    } else {
      setEditId(null);
      setForm({ name: '', email: '', role: '' });
    }
    setFormError('');
    setDrawerOpen(true);
  };

  const handleField = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editId) {
        await updateEmployee(editId, form);
        toast.success('Employee updated successfully');
      } else {
        await addEmployee(form);
        toast.success('Employee added successfully');
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || 'Error saving employee');
      toast.error(err.message || 'Error saving employee');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteEmployee(deleteId);
      toast.success('Employee deleted');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting employee');
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  const columns = [
    { label: 'Name', accessor: 'name' },
    { label: 'Email', accessor: 'email' },
    { label: 'Role', accessor: 'role' },
    {
      label: 'Actions', accessor: 'actions', render: (_: any, row: Employee) => (
        <div className="flex gap-2">
          <Button iconOnly variant="secondary" aria-label="Edit employee" onClick={() => openDrawer(row)}>
            <i className="ri-edit-2-line text-lg" />
          </Button>
          <Button iconOnly variant="danger" aria-label="Delete employee" onClick={() => handleDelete(row.id!)}>
            <i className="ri-delete-bin-6-line text-lg" />
          </Button>
        </div>
      )
    },
  ];

  const fields: AtomicField[] = [
    { name: 'name', label: 'Name', type: 'text', value: form.name, onChange: handleField('name'), required: true },
    { name: 'email', label: 'Email', type: 'email', value: form.email, onChange: handleField('email'), required: true },
    { name: 'role', label: 'Role', type: 'text', value: form.role, onChange: handleField('role'), required: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-900">Employee Management</h1>
        <Button onClick={() => openDrawer()} variant="primary">+ Add Employee</Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        <h2 className="font-semibold mb-2 text-blue-900">All Employees</h2>
        <Table columns={columns} data={employees} />
        {(loading || formLoading || deleteLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <LottieLoader size={64} />
          </div>
        )}
      </div>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editId ? 'Edit Employee' : 'Add Employee'}>
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
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
} 
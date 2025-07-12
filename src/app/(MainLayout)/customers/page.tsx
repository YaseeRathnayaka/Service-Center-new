"use client";
import React, { useState, useEffect } from "react";
import { 
  FaUsers 
} from "react-icons/fa";
import Table, { Column } from "../../../components/atoms/Table";
import Button from "../../../components/atoms/Button";
import Drawer from "../../../components/molecules/Drawer";
import Dialog from "../../../components/molecules/Dialog";
import LottieLoader from "../../../components/atoms/LottieLoader";
import AtomicForm, { AtomicField } from "../../../components/atoms/AtomicForm";
import { toast } from "react-toastify";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  Customer,
} from "../../../lib/api/customers";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setCustomers(await getCustomers());
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const openDrawer = (customer?: Customer) => {
    if (customer) {
      setEditId(customer.id!);
      setForm({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setEditId(null);
      setForm({ name: "", email: "", phone: "" });
    }
    setFormError("");
    setDrawerOpen(true);
  };

  const handleField =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      if (editId) {
        await updateCustomer(editId, form);
        toast.success("Customer updated successfully");
      } else {
        await addCustomer(form);
        toast.success("Customer added successfully");
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Error saving customer");
      toast.error(error.message || "Error saving customer");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteCustomer(deleteId);
      toast.success("Customer deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Error deleting customer");
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  const columns: Column<Customer>[] = [
    {
      label: "Name",
      accessor: "name",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: "Email",
      accessor: "email",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: "Phone",
      accessor: "phone",
      render: (value: string | undefined) => value ?? "",
    },
  ];

  const fields: AtomicField[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: form.name,
      onChange: handleField("name"),
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: form.email,
      onChange: handleField("email"),
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      value: form.phone,
      onChange: handleField("phone"),
      required: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaUsers className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">
            Customer Management
          </h1>
        </div>
        <Button onClick={() => openDrawer()} variant="primary">
          Add Customer
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        <div className="flex items-center gap-2 mb-4">
          <FaUsers className="text-xl text-blue-600" />
          <h2 className="font-semibold text-blue-900">All Customers</h2>
        </div>
        <Table columns={columns} data={customers} />
        {(loading || formLoading || deleteLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <LottieLoader size={64} />
          </div>
        )}
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editId ? "Edit Customer" : "Add Customer"}
        footer={
          <div className="flex justify-end gap-3">
            <Button 
              variant="secondary" 
              onClick={() => setDrawerOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading
                ? editId
                  ? "Updating..."
                  : "Adding..."
                : editId
                ? "Update"
                : "Add"}
            </Button>
          </div>
        }
      >
        <AtomicForm
          fields={fields}
          onSubmit={handleSubmit}
          loading={formLoading}
          error={formError}
          submitLabel=""
        />
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}

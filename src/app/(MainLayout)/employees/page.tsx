"use client";
import React, { useState, useEffect } from "react";
import { 
  FaUsers, FaUserPlus, FaEdit, FaTrash, FaDownload, FaEllipsisV, 
  FaUser, FaEnvelope, FaUserTie, FaPhone, FaTools, FaMapMarkerAlt 
} from "react-icons/fa";
import Table from "../../../components/atoms/Table";
import Button from "../../../components/atoms/Button";
import Drawer from "../../../components/molecules/Drawer";
import Dialog from "../../../components/molecules/Dialog";
import LottieLoader from "../../../components/atoms/LottieLoader";
import AtomicForm, { AtomicField } from "../../../components/atoms/AtomicForm";
import { toast } from "react-toastify";
import {
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  Employee,
} from "../../../lib/api/employees";
import jsPDF from "jspdf";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    role: string;
    phone?: string;
    skill?: string;
    address?: string;
  }>({ name: "", email: "", role: "", phone: "", skill: "", address: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setEmployees(await getEmployees());
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const openDrawer = (employee?: Employee) => {
    if (employee) {
      setEditId(employee.id!);
      setForm({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone || "",
        skill: employee.skill || "",
        address: employee.address || "",
      });
    } else {
      setEditId(null);
      setForm({
        name: "",
        email: "",
        role: "",
        phone: "",
        skill: "",
        address: "",
      });
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
        await updateEmployee(editId, form);
        toast.success("Employee updated successfully");
      } else {
        await addEmployee(form);
        toast.success("Employee added successfully");
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.message || "Error saving employee");
      toast.error(err.message || "Error saving employee");
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
      toast.success("Employee deleted");
    } catch (err: any) {
      toast.error(err.message || "Error deleting employee");
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  const handleDownloadPDF = (employee: Employee) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employee Details", 10, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${employee.name}`, 10, 40);
    doc.text(`Email: ${employee.email}`, 10, 50);
    doc.text(`Role: ${employee.role}`, 10, 60);
    doc.text(`Phone: ${employee.phone || "-"}`, 10, 70);
    doc.text(`Skill: ${employee.skill || "-"}`, 10, 80);
    doc.text(`Address: ${employee.address || "-"}`, 10, 90);
    doc.save(`${employee.name || "employee"}_details.pdf`);
  };

  const columns = [
    { 
      label: "Name", 
      accessor: "name" as keyof Employee,
      render: (value: string | undefined) => value ?? ""
    },
    { 
      label: "Email", 
      accessor: "email" as keyof Employee,
      render: (value: string | undefined) => value ?? ""
    },
    { 
      label: "Role", 
      accessor: "role" as keyof Employee,
      render: (value: string | undefined) => value ?? ""
    },
    {
      label: "Actions",
      accessor: "actions" as keyof Employee,
      render: (_: any, row: Employee) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => openDrawer(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(row.id!)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => handleDownloadPDF(row)}
          >
            Download
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setModalEmployee(row);
              setModalOpen(true);
            }}
          >
            Details
          </Button>
        </div>
      ),
    },
  ];

  const fields: AtomicField[] = [
    {
      name: "name",
      label: "Name",
      type: "text",
      value: form.name || "",
      onChange: handleField("name"),
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      value: form.email || "",
      onChange: handleField("email"),
      required: true,
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      value: form.role || "",
      onChange: handleField("role"),
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      value: form.phone || "",
      onChange: handleField("phone"),
      required: false,
    },
    {
      name: "skill",
      label: "Skill",
      type: "text",
      value: form.skill || "",
      onChange: handleField("skill"),
      required: false,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      value: form.address || "",
      onChange: handleField("address"),
      required: false,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-blue-900">
            Employee Management
          </h1>
        </div>
        <Button onClick={() => openDrawer()} variant="primary">
          Add Employee
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        <div className="flex items-center gap-2 mb-4">
          <FaUsers className="text-xl text-blue-600" />
          <h2 className="font-semibold text-blue-900">All Employees</h2>
        </div>
        <Table columns={columns} data={employees} />
        {(loading || formLoading || deleteLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <LottieLoader size={64} />
          </div>
        )}
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          editId ? "Edit Employee" : "Add Employee"
        }
      >
        <AtomicForm
          fields={fields}
          onSubmit={handleSubmit}
          submitLabel={editId ? "Update" : "Add"}
          loading={formLoading}
          error={formError}
        />
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
      {modalOpen && modalEmployee && (
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Employee Details"
          message={
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <FaUser className="text-blue-600" />
                <div>
                  <span className="font-semibold">Name:</span> {modalEmployee.name}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-600" />
                <div>
                  <span className="font-semibold">Email:</span> {modalEmployee.email}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaUserTie className="text-purple-600" />
                <div>
                  <span className="font-semibold">Role:</span> {modalEmployee.role}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-orange-600" />
                <div>
                  <span className="font-semibold">Phone:</span> {modalEmployee.phone || "-"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaTools className="text-teal-600" />
                <div>
                  <span className="font-semibold">Skill:</span> {modalEmployee.skill || "-"}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-red-600" />
                <div>
                  <span className="font-semibold">Address:</span> {modalEmployee.address || "-"}
                </div>
              </div>
            </div>
          }
          confirmLabel="Close"
          onConfirm={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

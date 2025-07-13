"use client";
import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaCarSide,
  FaHistory,
  FaDownload,
} from "react-icons/fa";
import Table, { Column } from "../../../components/atoms/Table";
import Button from "../../../components/atoms/Button";
import Drawer from "../../../components/molecules/Drawer";
import Dialog from "../../../components/molecules/Dialog";
import LottieLoader from "../../../components/atoms/LottieLoader";
import AtomicForm, { AtomicField } from "../../../components/atoms/AtomicForm";
import { toast } from "react-toastify";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  Vehicle,
} from "../../../lib/api/vehicles";
import { getAppointments, Appointment } from '../../../lib/api/appointments';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    plate: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [serviceHistory, setServiceHistory] = useState<Appointment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setVehicles(await getVehicles());
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const openDrawer = (vehicle?: Vehicle) => {
    if (vehicle) {
      setEditId(vehicle.id!);
      setForm({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
      });
    } else {
      setEditId(null);
      setForm({ make: "", model: "", year: "", plate: "" });
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
        await updateVehicle(editId, form);
        toast.success("Vehicle updated successfully");
      } else {
        await addVehicle(form);
        toast.success("Vehicle added successfully");
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Error saving vehicle");
      toast.error(error.message || "Error saving vehicle");
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteVehicle(deleteId);
      toast.success("Vehicle deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Error deleting vehicle");
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  // Fetch service history for a vehicle
  const openHistory = async (vehicle: Vehicle) => {
    setHistoryVehicle(vehicle);
    setHistoryOpen(true);
    setHistoryLoading(true);
    const appts = await getAppointments();
    setServiceHistory(appts.filter(a => a.vehicle === vehicle.plate));
    setHistoryLoading(false);
  };

  // Download service history as CSV
  const downloadHistory = (vehicle: Vehicle) => {
    const rows = [
      ['Customer', 'Date', 'Status'],
      ...serviceHistory.map(a => [a.customer, typeof a.date === 'object' && 'toDate' in a.date ? a.date.toDate().toISOString().slice(0,10) : a.date, a.status])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service_history_${vehicle.plate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const columns: Column<Vehicle>[] = [
    {
      label: "Make",
      accessor: "make",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: "Model",
      accessor: "model",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: "Year",
      accessor: "year",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: "Plate",
      accessor: "plate",
      render: (value: string | undefined) => value ?? "",
    },
    {
      label: 'Actions',
      accessor: 'actions' as keyof Vehicle,
      render: (_: any, row: Vehicle) => (
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold"
            onClick={() => openHistory(row)}
            title="View Service History"
          >
            <FaHistory /> History
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-xs font-semibold"
            onClick={() => { openHistory(row); setTimeout(() => downloadHistory(row), 500); }}
            title="Download Service History"
          >
            <FaDownload /> Download
          </button>
        </div>
      ),
    },
  ];

  const fields: AtomicField[] = [
    {
      name: "make",
      label: "Make",
      type: "text",
      value: form.make,
      onChange: handleField("make"),
      required: true,
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      value: form.model,
      onChange: handleField("model"),
      required: true,
    },
    {
      name: "year",
      label: "Year",
      type: "text",
      value: form.year,
      onChange: handleField("year"),
      required: true,
    },
    {
      name: "plate",
      label: "Plate",
      type: "text",
      value: form.plate,
      onChange: handleField("plate"),
      required: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaCar className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">
            Vehicle Management
          </h1>
        </div>
        <Button onClick={() => openDrawer()} variant="primary">
          Add Vehicle
        </Button>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        <div className="flex items-center gap-2 mb-4">
          <FaCarSide className="text-xl text-blue-600" />
          <h2 className="font-semibold text-blue-900">All Vehicles</h2>
        </div>
        <Table columns={columns} data={vehicles} />
        {(loading || formLoading || deleteLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
            <LottieLoader size={64} />
          </div>
        )}
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editId ? "Edit Vehicle" : "Add Vehicle"}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="primary" type="submit" disabled={formLoading}>
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
      <Drawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={historyVehicle ? `Service History: ${historyVehicle.plate}` : 'Service History'}
        footer={null}
      >
        {historyLoading ? (
          <div className="flex items-center justify-center py-8">
            <LottieLoader size={48} />
          </div>
        ) : serviceHistory.length === 0 ? (
          <div className="text-gray-500 py-8 text-center">No service history found for this vehicle.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {serviceHistory.map((a, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-4 py-2">{a.customer}</td>
                    <td className="px-4 py-2">{typeof a.date === 'object' && 'toDate' in a.date ? a.date.toDate().toISOString().slice(0,10) : a.date}</td>
                    <td className="px-4 py-2">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import {
  FaCar,
  FaCarSide,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaIdCard,
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

  const columns: Column<Vehicle>[] = [
    {
      label: "Make",
      accessor: "make",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FaCar className="text-blue-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      label: "Model",
      accessor: "model",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FaCarSide className="text-green-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      label: "Year",
      accessor: "year",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-600" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      label: "Plate",
      accessor: "plate",
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <FaIdCard className="text-orange-600" />
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
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
          <FaPlus className="mr-2" />+ Add Vehicle
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
        title={
          <div className="flex items-center gap-2">
            {editId ? (
              <FaEdit className="text-blue-600" />
            ) : (
              <FaPlus className="text-blue-600" />
            )}
            {editId ? "Edit Vehicle" : "Add Vehicle"}
          </div>
        }
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
          submitLabel={editId ? "Update" : "Add"}
        />
      </Drawer>
      <Dialog
        open={confirmOpen}
        onClose={() => {
          setConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title={
          <div className="flex items-center gap-2">
            <FaTrash className="text-red-600" />
            Delete Vehicle
          </div>
        }
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}

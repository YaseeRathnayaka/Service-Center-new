"use client";
import React, { useState, useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaHourglassHalf, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock 
} from "react-icons/fa";
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  Appointment,
} from "../../../lib/api/appointments";
import { getVehicles, addVehicle } from '../../../lib/api/vehicles';
import AtomicForm, { AtomicField } from "../../../components/atoms/AtomicForm";
import Button from "../../../components/atoms/Button";
import Table, { Column } from "../../../components/atoms/Table";
import Drawer from "../../../components/molecules/Drawer";
import Dialog from "../../../components/molecules/Dialog";
import "remixicon/fonts/remixicon.css";
import { toast } from "react-toastify";
import LottieLoader from "../../../components/atoms/LottieLoader";
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';

const statusOptions = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function mapAppointmentsToEvents(appts: Appointment[]): RBCEvent[] {
  return appts.map((a) => {
    let date: Date;
    if (typeof a.date === 'object' && 'toDate' in a.date) {
      date = a.date.toDate();
    } else {
      date = new Date(a.date as string);
    }
    return {
      title: `${a.customer} (${a.status})`,
      start: date,
      end: date,
      allDay: true,
      resource: a,
    };
  });
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    customer: "",
    vehicle: "",
    date: "",
    status: "Scheduled",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [view, setView] = useState<'table' | 'calendar'>('table');

  // Fetch appointments
  const fetchData = async () => {
    setLoading(true);
    setAppointments(await getAppointments());
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Open drawer for add/edit
  const openDrawer = (appt?: Appointment) => {
    if (appt) {
      setEditId(appt.id!);
      setForm({
        customer: appt.customer,
        vehicle: appt.vehicle,
        date:
          appt.date && typeof appt.date === "object" && "toDate" in appt.date
            ? appt.date.toDate().toISOString().slice(0, 10)
            : String(appt.date),
        status: appt.status,
      });
    } else {
      setEditId(null);
      setForm({ customer: "", vehicle: "", date: "", status: "Scheduled" });
    }
    setFormError("");
    setDrawerOpen(true);
  };

  // Handle form field changes
  const handleField =
    (name: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
    };

  // Submit add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      // Check if vehicle exists by plate
      const vehicles = await getVehicles();
      const existingVehicle = vehicles.find(v => v.plate === form.vehicle);
      if (!existingVehicle) {
        // If not, add vehicle with minimal info
        await addVehicle({ make: '', model: '', year: '', plate: form.vehicle });
      }
      if (editId) {
        await updateAppointment(editId, form);
        toast.success("Appointment updated successfully");
      } else {
        await addAppointment(form);
        toast.success("Appointment added successfully");
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: unknown) {
      const error = err as Error;
      setFormError(error.message || "Error saving appointment");
      toast.error(error.message || "Error saving appointment");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteAppointment(deleteId);
      toast.success("Appointment deleted");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Error deleting appointment");
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  // Table columns
  const columns: Column<Appointment>[] = [
    {
      label: "Customer",
      accessor: "customer",
      render: (value: string | import("firebase/firestore").Timestamp | undefined) => typeof value === 'string' ? value : '',
    },
    {
      label: "Vehicle",
      accessor: "vehicle",
      render: (value: string | import("firebase/firestore").Timestamp | undefined) => typeof value === 'string' ? value : '',
    },
    {
      label: "Date",
      accessor: "date",
      render: (v: Appointment["date"] | undefined) => (
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-purple-600" />
          <span>
            {v && typeof v === "object" && "toDate" in v
              ? v.toDate().toISOString().slice(0, 10)
              : v}
          </span>
        </div>
      ),
    },
    {
      label: "Status",
      accessor: "status",
      render: (
        v: string | import("firebase/firestore").Timestamp | undefined,
        row: Appointment
      ) => {
        if (typeof v === "string") {
          let icon, bgColor, textColor;

          if (v === "Completed") {
            icon = <FaCheckCircle className="text-green-600" />;
            bgColor = "bg-green-100";
            textColor = "text-green-700";
          } else if (v === "Scheduled") {
            icon = <FaClock className="text-blue-600" />;
            bgColor = "bg-blue-100";
            textColor = "text-blue-700";
          } else if (v === "In Progress") {
            icon = <FaHourglassHalf className="text-orange-600" />;
            bgColor = "bg-orange-100";
            textColor = "text-orange-700";
          } else if (v === "Cancelled") {
            icon = <FaTimesCircle className="text-red-600" />;
            bgColor = "bg-red-100";
            textColor = "text-red-700";
          } else {
            icon = <FaClock className="text-gray-600" />;
            bgColor = "bg-gray-100";
            textColor = "text-gray-700";
          }

          return (
            <div className="flex items-center gap-2">
              {icon}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${bgColor} ${textColor}`}
              >
                {v}
              </span>
              <select
                className="ml-2 border rounded px-2 py-1 text-xs"
                value={v}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    await updateAppointment(row.id!, { status: newStatus });
                    setAppointments((prev) =>
                      prev.map((appt) =>
                        appt.id === row.id ? { ...appt, status: newStatus } : appt
                      )
                    );
                    toast.success("Status updated");
                  } catch (err: unknown) {
                    const error = err as Error;
                    toast.error(error.message || "Error updating status");
                  }
                }}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }
        // If v is a Timestamp or undefined, just render as string
        return String(v ?? "");
      },
    },
  ];

  // AtomicForm fields
  const fields: AtomicField[] = [
    {
      name: "customer",
      label: "Customer",
      type: "text",
      value: form.customer,
      onChange: handleField("customer"),
      required: true,
    },
    {
      name: "vehicle",
      label: "Vehicle",
      type: "text",
      value: form.vehicle,
      onChange: handleField("vehicle"),
      required: true,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      value: form.date,
      onChange: handleField("date"),
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      value: form.status,
      onChange: handleField("status"),
      options: statusOptions,
      required: true,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-blue-900">
            Appointments
          </h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setView('table')} variant={view === 'table' ? 'primary' : 'secondary'}>
            Table View
          </Button>
          <Button onClick={() => setView('calendar')} variant={view === 'calendar' ? 'primary' : 'secondary'}>
            Calendar View
          </Button>
          <Button onClick={() => openDrawer()} variant="primary">
            Add Appointment
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-4 relative">
        {view === 'table' ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <FaCalendarAlt className="text-xl text-blue-600" />
              <h2 className="font-semibold text-blue-900">All Appointments</h2>
            </div>
            <Table columns={columns} data={appointments} />
            {(loading || formLoading || deleteLoading) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-xl">
                <LottieLoader size={64} />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow p-4">
            <Calendar
              localizer={localizer}
              events={mapAppointmentsToEvents(appointments)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600, background: 'white', borderRadius: '1rem' }}
              popup
              views={['month', 'week', 'day']}
              eventPropGetter={() => ({ style: { background: '#2563eb', color: 'white', borderRadius: 8, border: 'none' } })}
            />
          </div>
        )}
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editId ? "Edit Appointment" : "Add Appointment"}
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
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
}

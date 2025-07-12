"use client";
import React, { useState, useEffect } from "react";
import { 
  FaTools, FaPlus, FaEdit, FaTrash, FaUserTie, FaUsers, FaDollarSign, 
  FaClock, FaTag, FaCheckCircle, FaTimesCircle, FaEllipsisV,
  FaUser, FaCalendarAlt, FaCog
} from "react-icons/fa";
import Button from "../../../components/atoms/Button";
import Drawer from "../../../components/molecules/Drawer";
import Dialog from "../../../components/molecules/Dialog";
import LottieLoader from "../../../components/atoms/LottieLoader";
import AtomicForm, { AtomicField } from "../../../components/atoms/AtomicForm";
import { toast } from "react-toastify";
import {
  getServices,
  addService,
  updateService,
  deleteService,
  getServiceHeads,
  addServiceHead,
  updateServiceHead,
  deleteServiceHead,
  getServiceLaborers,
  addServiceLaborer,
  updateServiceLaborer,
  deleteServiceLaborer,
  Service,
  ServiceHead,
  ServiceLaborer,
} from "../../../lib/api/services";
import {
  getEmployees,
  Employee,
} from "../../../lib/api/employees";

type TabType = 'services' | 'heads' | 'laborers';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('services');
  const [services, setServices] = useState<Service[]>([]);
  const [serviceHeads, setServiceHeads] = useState<ServiceHead[]>([]);
  const [serviceLaborers, setServiceLaborers] = useState<ServiceLaborer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesData, headsData, laborersData, employeesData] = await Promise.all([
        getServices(),
        getServiceHeads(),
        getServiceLaborers(),
        getEmployees(),
      ]);
      setServices(servicesData);
      setServiceHeads(headsData);
      setServiceLaborers(laborersData);
      setEmployees(employeesData);
    } catch (error) {
      toast.error("Error fetching data");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openDrawer = (data?: any) => {
    if (data) {
      setEditId(data.id);
      setForm(data);
    } else {
      setEditId(null);
      setForm({});
    }
    setFormError("");
    setDrawerOpen(true);
  };

  const handleField = (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f: any) => ({ ...f, [name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");
    try {
      if (activeTab === 'services') {
        if (editId) {
          await updateService(editId, form);
          toast.success("Service updated successfully");
        } else {
          await addService(form);
          toast.success("Service added successfully");
        }
      } else if (activeTab === 'heads') {
        if (editId) {
          await updateServiceHead(editId, form);
          toast.success("Service head updated successfully");
        } else {
          await addServiceHead(form);
          toast.success("Service head assigned successfully");
        }
      } else if (activeTab === 'laborers') {
        if (editId) {
          await updateServiceLaborer(editId, form);
          toast.success("Service laborer updated successfully");
        } else {
          await addServiceLaborer(form);
          toast.success("Service laborer assigned successfully");
        }
      }
      setDrawerOpen(false);
      fetchData();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error saving data";
      setFormError(errorMessage);
      toast.error(errorMessage);
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
      if (activeTab === 'services') {
        await deleteService(deleteId);
        toast.success("Service deleted");
      } else if (activeTab === 'heads') {
        await deleteServiceHead(deleteId);
        toast.success("Service head removed");
      } else if (activeTab === 'laborers') {
        await deleteServiceLaborer(deleteId);
        toast.success("Service laborer removed");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error deleting data";
      toast.error(errorMessage);
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setDeleteId(null);
    fetchData();
  };

  const getServiceFields = (): AtomicField[] => [
    {
      name: "name",
      label: "Service Name",
      type: "text",
      value: form.name || "",
      onChange: handleField("name"),
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      value: form.description || "",
      onChange: handleField("description"),
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      value: form.category || "",
      onChange: handleField("category"),
      required: true,
      options: [
        { value: "maintenance", label: "Maintenance" },
        { value: "repair", label: "Repair" },
        { value: "inspection", label: "Inspection" },
        { value: "cleaning", label: "Cleaning" },
        { value: "other", label: "Other" },
      ],
    },
    {
      name: "price",
      label: "Price ($)",
      type: "number",
      value: form.price || "",
      onChange: handleField("price"),
      required: true,
    },
    {
      name: "duration",
      label: "Duration (minutes)",
      type: "number",
      value: form.duration || "",
      onChange: handleField("duration"),
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      value: form.status || "active",
      onChange: handleField("status"),
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const getServiceHeadFields = (): AtomicField[] => [
    {
      name: "serviceId",
      label: "Service",
      type: "select",
      value: form.serviceId || "",
      onChange: handleField("serviceId"),
      required: true,
      options: services.map(service => ({ value: service.id!, label: service.name })),
    },
    {
      name: "employeeId",
      label: "Employee",
      type: "select",
      value: form.employeeId || "",
      onChange: handleField("employeeId"),
      required: true,
      options: employees.map(emp => ({ value: emp.id!, label: emp.name })),
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      value: form.status || "active",
      onChange: handleField("status"),
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const getServiceLaborerFields = (): AtomicField[] => [
    {
      name: "serviceId",
      label: "Service",
      type: "select",
      value: form.serviceId || "",
      onChange: handleField("serviceId"),
      required: true,
      options: services.map(service => ({ value: service.id!, label: service.name })),
    },
    {
      name: "employeeId",
      label: "Employee",
      type: "select",
      value: form.employeeId || "",
      onChange: handleField("employeeId"),
      required: true,
      options: employees.map(emp => ({ value: emp.id!, label: emp.name })),
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
      name: "status",
      label: "Status",
      type: "select",
      value: form.status || "active",
      onChange: handleField("status"),
      required: true,
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const tabs = [
    { id: 'services', label: 'Services', count: services.length },
    { id: 'heads', label: 'Service Heads', count: serviceHeads.length },
    { id: 'laborers', label: 'Service Laborers', count: serviceLaborers.length },
  ];

  if (loading) {
    return <LottieLoader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600">Manage services, assign heads and laborers</p>
        </div>
        <Button
          onClick={() => openDrawer()}
          className=""
        >
          Add {activeTab === 'services' ? 'Service' : activeTab === 'heads' ? 'Service Head' : 'Service Laborer'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white border-2 border-slate-200 shadow-lg">
        {activeTab === 'services' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Name</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Category</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Price</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Duration</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {services.map((service) => (
                  <tr key={service.id} className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500">
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <FaTools className="text-blue-600" />
                        <span className="font-medium text-slate-700 group-hover:text-slate-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <FaTag className="text-green-600" />
                        <span className="text-slate-700 group-hover:text-slate-900">{service.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <FaDollarSign className="text-green-600" />
                        <span className="text-slate-700 group-hover:text-slate-900">${service.price}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-purple-600" />
                        <span className="text-slate-700 group-hover:text-slate-900">{service.duration} min</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                      <div className="flex items-center gap-2">
                        {service.status === 'active' ? (
                          <FaCheckCircle className="text-green-600" />
                        ) : (
                          <FaTimesCircle className="text-red-600" />
                        )}
                        <span className={`capitalize font-medium ${service.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                          {service.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => openDrawer(service)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(service.id!)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setModalData(service);
                            setModalOpen(true);
                          }}
                        >
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'heads' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Service</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Head</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Assigned</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {serviceHeads.map((head) => {
                  const service = services.find(s => s.id === head.serviceId);
                  return (
                    <tr key={head.id} className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaTools className="text-blue-600" />
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">{service?.name || 'Unknown Service'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-purple-600" />
                          <span className="text-slate-700 group-hover:text-slate-900">{head.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-600" />
                          <span className="text-slate-700 group-hover:text-slate-900">{head.assignedAt.toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          {head.status === 'active' ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <FaTimesCircle className="text-red-600" />
                          )}
                          <span className={`capitalize font-medium ${head.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {head.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            iconOnly
                            variant="secondary"
                            aria-label="Edit service head"
                            onClick={() => openDrawer(head)}
                          >
                            <FaEdit className="text-lg" />
                          </Button>
                          <Button
                            iconOnly
                            variant="danger"
                            aria-label="Remove service head"
                            onClick={() => handleDelete(head.id!)}
                          >
                            <FaTrash className="text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'laborers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Service</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Laborer</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Role</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Assigned</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider border-r border-slate-200">Status</th>
                  <th className="px-6 py-4 text-left font-bold text-slate-700 text-sm uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {serviceLaborers.map((laborer) => {
                  const service = services.find(s => s.id === laborer.serviceId);
                  return (
                    <tr key={laborer.id} className="bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group border-l-4 border-l-transparent hover:border-l-blue-500">
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaTools className="text-blue-600" />
                          <span className="font-medium text-slate-700 group-hover:text-slate-900">{service?.name || 'Unknown Service'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-indigo-600" />
                          <span className="text-slate-700 group-hover:text-slate-900">{laborer.employeeName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaCog className="text-orange-600" />
                          <span className="text-slate-700 group-hover:text-slate-900">{laborer.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-green-600" />
                          <span className="text-slate-700 group-hover:text-slate-900">{laborer.assignedAt.toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          {laborer.status === 'active' ? (
                            <FaCheckCircle className="text-green-600" />
                          ) : (
                            <FaTimesCircle className="text-red-600" />
                          )}
                          <span className={`capitalize font-medium ${laborer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                            {laborer.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            iconOnly
                            variant="secondary"
                            aria-label="Edit service laborer"
                            onClick={() => openDrawer(laborer)}
                          >
                            <FaEdit className="text-lg" />
                          </Button>
                          <Button
                            iconOnly
                            variant="danger"
                            aria-label="Remove service laborer"
                            onClick={() => handleDelete(laborer.id!)}
                          >
                            <FaTrash className="text-sm" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={`${editId ? 'Edit' : 'Add'} ${
          activeTab === 'services' ? 'Service' : 
          activeTab === 'heads' ? 'Service Head' : 'Service Laborer'
        }`}
      >
        <AtomicForm
          fields={
            activeTab === 'services' ? getServiceFields() :
            activeTab === 'heads' ? getServiceHeadFields() :
            getServiceLaborerFields()
          }
          onSubmit={handleSubmit}
          error={formError}
          loading={formLoading}
          submitLabel={editId ? 'Update' : 'Create'}
        />
      </Drawer>

      {/* Delete Confirmation */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${
          activeTab === 'services' ? 'service' : 
          activeTab === 'heads' ? 'service head assignment' : 'service laborer assignment'
        }?`}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Details Modal */}
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        title="Details"
        message=""
      >
        {modalData && (
          <div className="space-y-4">
            {activeTab === 'services' && (
              <div>
                <h3 className="font-semibold text-lg">{modalData.name}</h3>
                <p className="text-gray-600">{modalData.description}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Category:</span>
                    <span>{modalData.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Price:</span>
                    <span>${modalData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Duration:</span>
                    <span>{modalData.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className={`capitalize ${modalData.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {modalData.status}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
} 
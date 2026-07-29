import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import SupplierForm from "../components/suppliers/SupplierForm";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
} from "../services/supplierService";

import type { Supplier } from "../models/Supplier";
import type { CreateSupplierRequest } from "../models/CreateSupplierRequest";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  const [editingSupplier, setEditingSupplier] =
    useState<Supplier | null>(null);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "success"
    );

  const [search, setSearch] =
    useState("");

  async function loadSuppliers() {
    try {
      const result = await getSuppliers();
      setSuppliers(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  function closeModal() {
    setShowModal(false);
    setEditingSupplier(null);
  }

  function showToast(
    message: string,
    type: "success" | "error"
  ) {
    setToastMessage(message);
    setToastType(type);

    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  }

  async function handleCreate(
    supplier: CreateSupplierRequest
  ) {
    try {
      await createSupplier(supplier);

      await loadSuppliers();

      closeModal();

      showToast(
        "Supplier added successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create supplier.",
        "error"
      );
    }
  }

  async function handleUpdate(
    supplier: CreateSupplierRequest
  ) {
    if (!editingSupplier) return;

    try {
      await updateSupplier(
        editingSupplier.id,
        supplier
      );

      await loadSuppliers();

      closeModal();

      showToast(
        "Supplier updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to update supplier.",
        "error"
      );
    }
  }

  const filteredSuppliers =
    suppliers.filter((supplier) => {
      const searchText =
        search.toLowerCase();

      return (
        supplier.name
          .toLowerCase()
          .includes(searchText) ||
        supplier.contactInfo
          .toLowerCase()
          .includes(searchText) ||
        supplier.address
          .toLowerCase()
          .includes(searchText) ||
        supplier.email
          .toLowerCase()
          .includes(searchText)
      );
    });

  if (loading) {
    return <p>Loading suppliers...</p>;
  }

  return (
    <>
      <PageHeader
        title="Suppliers"
        subtitle="Manage warehouse suppliers"
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search suppliers..."
        />

        <Button
          onClick={() => {
            setEditingSupplier(null);
            setShowModal(true);
          }}
        >
          + Add Supplier
        </Button>
      </div>

      <Modal
        open={showModal}
        title={
          editingSupplier
            ? "Edit Supplier"
            : "Add Supplier"
        }
        onClose={closeModal}
      >
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={
            editingSupplier
              ? handleUpdate
              : handleCreate
          }
        />
      </Modal>

      <DataTable
        columns={[
          {
            header: "Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Contact",
            accessor: "contactInfo",
            sortable: true,
          },
          {
            header: "Address",
            accessor: "address",
            sortable: true,
          },
          {
            header: "Email",
            accessor: "email",
            sortable: true,
          },
          {
            header: "Actions",
            render: (supplier) => (
              <Button
                onClick={() => {
                  setEditingSupplier(supplier);
                  setShowModal(true);
                }}
              >
                Edit
              </Button>
            ),
          },
        ]}
        data={filteredSuppliers}
        rowKey={(supplier) => supplier.id}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
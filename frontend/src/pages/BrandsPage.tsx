import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import BrandForm from "../components/brands/BrandForm";

import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../services/brandService";

import type { Brand } from "../models/Brand";
import type { CreateBrandRequest } from "../models/CreateBrandRequest";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingBrand, setEditingBrand] =
    useState<Brand | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [brandToDelete, setBrandToDelete] =
    useState<Brand | null>(null);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  async function loadBrands() {
    try {
      const result = await getBrands();
      setBrands(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  function closeModal() {
    setShowModal(false);
    setEditingBrand(null);
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
    brand: CreateBrandRequest
  ) {
    try {
      await createBrand(brand);

      await loadBrands();

      closeModal();

      showToast(
        "Brand created successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create brand.",
        "error"
      );
    }
  }

  async function handleUpdate(
    brand: CreateBrandRequest
  ) {
    if (!editingBrand) return;

    try {
      await updateBrand(
        editingBrand.id,
        brand
      );

      await loadBrands();

      closeModal();

      showToast(
        "Brand updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to update brand.",
        "error"
      );
    }
  }

  function openDeleteDialog(
    brand: Brand
  ) {
    setBrandToDelete(brand);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setBrandToDelete(null);
    setShowDeleteDialog(false);
  }

  async function confirmDelete() {
    if (!brandToDelete) return;

    try {
      await deleteBrand(
        brandToDelete.id
      );

      await loadBrands();

      closeDeleteDialog();

      showToast(
        "Brand deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete brand.",
        "error"
      );
    }
  }

  const filteredBrands = brands.filter((brand) =>
    brand.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p>Loading brands...</p>;
  }

  return (
    <>
      <PageHeader
        title="Brands"
        subtitle="Manage product brands"
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
          placeholder="Search brands..."
        />

        <Button
          onClick={() => {
            setEditingBrand(null);
            setShowModal(true);
          }}
        >
          + Add Brand
        </Button>
      </div>

      <Modal
        open={showModal}
        title={
          editingBrand
            ? "Edit Brand"
            : "Add Brand"
        }
        onClose={closeModal}
      >
        <BrandForm
          brand={editingBrand}
          onSubmit={
            editingBrand
              ? handleUpdate
              : handleCreate
          }
        />
      </Modal>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Brand"
        message={
          brandToDelete
            ? `Are you sure you want to delete "${brandToDelete.name}"?`
            : ""
        }
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

      <DataTable
        columns={[
          {
            header: "Brand",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Status",
            render: (brand) =>
              brand.isActive
                ? "Active"
                : "Inactive",
          },
          {
            header: "Actions",
            render: (brand) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button
                  onClick={() => {
                    setEditingBrand(brand);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    openDeleteDialog(
                      brand
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredBrands}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
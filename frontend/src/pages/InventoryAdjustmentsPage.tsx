import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";

import InventoryAdjustmentForm from "../components/inventoryAdjustments/InventoryAdjustmentForm";
import InventoryAdjustmentDetails from "../components/inventoryAdjustments/InventoryAdjustmentDetails";

import {
  getInventoryAdjustments,
  getInventoryAdjustment,
  createInventoryAdjustment,
  deleteInventoryAdjustment,
} from "../services/inventoryAdjustmentService";

import type { InventoryAdjustment } from "../models/InventoryAdjustment";
import type { CreateInventoryAdjustmentRequest } from "../models/CreateInventoryAdjustmentRequest";

export default function InventoryAdjustmentsPage() {
  const [adjustments, setAdjustments] =
    useState<InventoryAdjustment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedAdjustment, setSelectedAdjustment] =
    useState<InventoryAdjustment | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

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

  async function loadAdjustments() {
    try {
      const result =
        await getInventoryAdjustments();

      setAdjustments(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdjustments();
  }, []);

  async function handleCreate(
    adjustment: CreateInventoryAdjustmentRequest
  ) {
    try {
      await createInventoryAdjustment(adjustment);

      await loadAdjustments();

      setShowModal(false);

      showToast(
        "Inventory adjustment created successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create inventory adjustment.",
        "error"
      );
    }
  }

  async function handleView(id: number) {
    try {
      const adjustment =
        await getInventoryAdjustment(id);

      setSelectedAdjustment(adjustment);

      setShowDetails(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete() {
    if (!selectedAdjustment) return;

    try {
      await deleteInventoryAdjustment(
        selectedAdjustment.id
      );

      await loadAdjustments();

      setShowDeleteDialog(false);

      setSelectedAdjustment(null);

      showToast(
        "Inventory adjustment deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete inventory adjustment.",
        "error"
      );
    }
  }

  const filteredAdjustments =
    adjustments.filter((adjustment) => {
      const text = search.toLowerCase();

      return (
        adjustment.adjustmentReference
          .toLowerCase()
          .includes(text) ||
        adjustment.reason
          .toLowerCase()
          .includes(text)
      );
    });

  if (loading) {
    return (
      <p>Loading inventory adjustments...</p>
    );
  }

  return (
    <>
      <PageHeader
        title="Inventory Adjustments"
        subtitle="Adjust inventory after physical counting"
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
          placeholder="Search adjustments..."
        />

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Adjustment
        </Button>
      </div>

      <Modal
        open={showModal}
        title="Add Inventory Adjustment"
        onClose={() =>
          setShowModal(false)
        }
      >
        <InventoryAdjustmentForm
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={showDetails}
        title="Inventory Adjustment Details"
        onClose={() => {
          setShowDetails(false);
          setSelectedAdjustment(null);
        }}
      >
        {selectedAdjustment && (
          <InventoryAdjustmentDetails
            adjustment={selectedAdjustment}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Inventory Adjustment"
        message="Are you sure you want to delete this adjustment?"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedAdjustment(null);
        }}
      />

      <DataTable
        columns={[
          {
            header: "Reference",
            accessor: "adjustmentReference",
            sortable: true,
          },
          {
            header: "Reason",
            accessor: "reason",
            sortable: true,
          },
          {
            header: "Date",
            render: (adjustment) =>
              new Date(
                adjustment.adjustmentDate
              ).toLocaleDateString(),
          },
          {
            header: "Actions",
            render: (adjustment) => (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() =>
                    handleView(
                      adjustment.id
                    )
                  }
                >
                  View
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedAdjustment(
                      adjustment
                    );

                    setShowDeleteDialog(
                      true
                    );
                  }}
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredAdjustments}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
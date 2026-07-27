import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";

import SupplierDeliveryForm from "../components/supplierDeliveries/SupplierDeliveryForm";
import SupplierDeliveryDetails from "../components/supplierDeliveries/SupplierDeliveryDetails";

import {
  getSupplierDeliveries,
  getSupplierDelivery,
  createSupplierDelivery,
  deleteSupplierDelivery,
} from "../services/supplierDeliveryService";

import type { SupplierDelivery } from "../models/SupplierDelivery";
import type { CreateSupplierDeliveryRequest } from "../models/CreateSupplierDeliveryRequest";

export default function SupplierDeliveriesPage() {
  const [deliveries, setDeliveries] =
    useState<SupplierDelivery[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedDelivery, setSelectedDelivery] =
    useState<SupplierDelivery | null>(null);

  const [showDetails, setShowDetails] =
    useState(false);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "success"
    );

  async function loadDeliveries() {
    try {
      const result =
        await getSupplierDeliveries();

      setDeliveries(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeliveries();
  }, []);

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
    delivery: CreateSupplierDeliveryRequest
  ) {
    try {
      await createSupplierDelivery(delivery);

      await loadDeliveries();

      setShowModal(false);

      showToast(
        "Supplier delivery added successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create supplier delivery.",
        "error"
      );
    }
  }

  async function handleView(id: number) {
    try {
      const delivery =
        await getSupplierDelivery(id);

      setSelectedDelivery(delivery);

      setShowDetails(true);
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to load supplier delivery.",
        "error"
      );
    }
  }

  async function handleDelete() {
    if (!selectedDelivery) return;

    try {
      await deleteSupplierDelivery(
        selectedDelivery.id
      );

      await loadDeliveries();

      setShowDeleteDialog(false);
      setSelectedDelivery(null);

      showToast(
        "Supplier delivery deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete supplier delivery.",
        "error"
      );
    }
  }

  const filteredDeliveries =
    deliveries.filter((delivery) => {
      const searchText =
        search.toLowerCase();

      return (
        delivery.supplierName
          .toLowerCase()
          .includes(searchText) ||

        delivery.deliveryReference
          .toLowerCase()
          .includes(searchText)
      );
    });

  if (loading) {
    return (
      <p>Loading supplier deliveries...</p>
    );
  }

  return (
    <>
      <PageHeader
        title="Supplier Deliveries"
        subtitle="Manage warehouse deliveries"
      />

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search deliveries..."
        />

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Delivery
        </Button>
      </div>

      {/* Add Delivery */}

      <Modal
        open={showModal}
        title="Add Supplier Delivery"
        onClose={() =>
          setShowModal(false)
        }
      >
        <SupplierDeliveryForm
          onSubmit={handleCreate}
        />
      </Modal>

      {/* View Details */}

      <Modal
        open={showDetails}
        title="Supplier Delivery Details"
        onClose={() => {
          setShowDetails(false);
          setSelectedDelivery(null);
        }}
      >
        {selectedDelivery && (
          <SupplierDeliveryDetails
            delivery={selectedDelivery}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Supplier Delivery"
        message="Are you sure you want to delete this supplier delivery? This will also remove all inventory added by this delivery."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedDelivery(null);
        }}
      />

      <DataTable
        columns={[
          {
            header: "ID",
            accessor: "id",
            sortable: true,
          },
          {
            header: "Reference",
            accessor: "deliveryReference",
            sortable: true,
          },
          {
            header: "Supplier",
            accessor: "supplierName",
            sortable: true,
          },
          {
            header: "Date",
            accessor: "deliveryDate",
            sortable: true,
          },
          {
            header: "Grand Total",
            render: (delivery) =>
              `₱${delivery.grandTotal.toLocaleString()}`,
          },
          {
            header: "Actions",
            render: (delivery) => (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() =>
                    handleView(
                      delivery.id
                    )
                  }
                >
                  View
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedDelivery(
                      delivery
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
        data={filteredDeliveries}
        rowKey={(delivery) => delivery.id}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";

import WarehouseReleaseForm from "../components/warehouseReleases/WarehouseReleaseForm";
import WarehouseReleaseDetails from "../components/warehouseReleases/WarehouseReleaseDetails";

import {
  getWarehouseReleases,
  getWarehouseRelease,
  createWarehouseRelease,
  deleteWarehouseRelease,
} from "../services/warehouseReleaseService";

import type { WarehouseRelease } from "../models/WarehouseRelease";
import type { CreateWarehouseReleaseRequest } from "../models/CreateWarehouseReleaseRequest";

export default function WarehouseReleasesPage() {
  const [releases, setReleases] =
    useState<WarehouseRelease[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [selectedRelease, setSelectedRelease] =
    useState<WarehouseRelease | null>(null);

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

  async function loadReleases() {
    try {
      const result =
        await getWarehouseReleases();

      setReleases(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReleases();
  }, []);

  async function handleCreate(
    release: CreateWarehouseReleaseRequest
  ) {
    try {
      await createWarehouseRelease(release);

      await loadReleases();

      setShowModal(false);

      showToast(
        "Warehouse release created successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create warehouse release.",
        "error"
      );
    }
  }

  async function handleView(id: number) {
    try {
      const release =
        await getWarehouseRelease(id);

      setSelectedRelease(release);

      setShowDetails(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete() {
    if (!selectedRelease) return;

    try {
      await deleteWarehouseRelease(
        selectedRelease.id
      );

      await loadReleases();

      setShowDeleteDialog(false);

      setSelectedRelease(null);

      showToast(
        "Warehouse release deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete warehouse release.",
        "error"
      );
    }
  }

  const filteredReleases =
    releases.filter((release) => {
      const searchText =
        search.toLowerCase();

      return (
        release.releaseReference
          .toLowerCase()
          .includes(searchText) ||

        release.destination
          .toLowerCase()
          .includes(searchText)
      );
    });

  if (loading) {
    return (
      <p>Loading warehouse releases...</p>
    );
  }

  return (
    <>
      <PageHeader
        title="Warehouse Releases"
        subtitle="Manage stock released from the warehouse"
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
          placeholder="Search releases..."
        />

        <Button
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Release
        </Button>
      </div>

      <Modal
        open={showModal}
        title="Add Warehouse Release"
        onClose={() =>
          setShowModal(false)
        }
      >
        <WarehouseReleaseForm
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        open={showDetails}
        title="Warehouse Release Details"
        onClose={() => {
          setShowDetails(false);
          setSelectedRelease(null);
        }}
      >
        {selectedRelease && (
          <WarehouseReleaseDetails
            release={selectedRelease}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Warehouse Release"
        message="Are you sure you want to delete this warehouse release? This will restore all released inventory."
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteDialog(false);
          setSelectedRelease(null);
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
            accessor: "releaseReference",
            sortable: true,
          },
          {
            header: "Destination",
            accessor: "destination",
            sortable: true,
          },
          {
            header: "Date",
            render: (release) =>
              new Date(release.releaseDate)
                .toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }),
          },
          {
            header: "Grand Total",
            render: (release) =>
              `₱${release.grandTotal.toLocaleString()}`,
          },
          {
            header: "Actions",
            render: (release) => (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <Button
                  onClick={() =>
                    handleView(release.id)
                  }
                >
                  View
                </Button>

                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedRelease(
                      release
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
        data={filteredReleases}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
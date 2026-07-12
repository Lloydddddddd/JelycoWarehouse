import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import SupplierDeliveryForm from "../components/supplierDeliveries/SupplierDeliveryForm";

import {
  getSupplierDeliveries,
  createSupplierDelivery,
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

  async function handleCreate(
    delivery: CreateSupplierDeliveryRequest
  ) {
    try {
      await createSupplierDelivery(delivery);

      await loadDeliveries();

      setShowModal(false);
    } catch (error) {
      console.error(error);
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
          justifyContent: "space-between",
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
        ]}
        data={filteredDeliveries}
      />
    </>
  );
}
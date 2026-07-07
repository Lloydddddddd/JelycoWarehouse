import React, { useEffect, useState } from "react";
import { getSuppliers, deleteSupplier } from "../../../api/suppliers";
import Button from "../../../Core/Components/Button";
import SupplierFormModal from "../Components/SupplierFormModal";
import Table from "../../../Core/Components/Table";
import Layout from "../../../Core/Pages/Layout";
import { exportToCSV } from "../../../Core/Utils/exportUtils";

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers", error);
    }
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      loadSuppliers();
    } catch (error) {
      console.error("Error deleting supplier", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteSupplier(id);
      }
      setSelectedIds([]);
      loadSuppliers();
    } catch (error) {
      console.error("Error deleting selected suppliers", error);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Suppliers</h2>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => {
                  const selectedRows = suppliers.filter(s => selectedIds.includes(s.id));
                  exportToCSV("suppliers_export.csv", selectedRows);
                }}
              >
                Export Selected ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => {
                setSelectedSupplier(null);
                setModalOpen(true);
              }}
            >
              Add Supplier
            </Button>
            {selectedIds.length > 0 && (
              <Button variant="danger" onClick={handleBulkDelete}>
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <Table
            columns={[
              { label: "Name", accessor: "name", width: "40%" },
              { 
                label: "Email", accessor: "email", width: "40%", 
                render: (val) => (
                  <a href={`mailto:${val}`} className="text-blue-600 hover:underline">{val}</a>
                )
              },
            ]}
            data={suppliers.map((s) => ({
              id: s.id,
              name: s.name,
              email: s.email,
              status: s.status,
            }))}
            actions={(s) => (
              <div className="flex gap-2">
                <Button variant="danger" onClick={() => handleDelete(s.id)}>Delete</Button>
                <Button variant="primary" onClick={() => handleEdit(s)}>Edit</Button>
              </div>
            )}
            pageSize={5}
            rowClassName={(row) => row.status === "Inactive" ? "bg-red-50" : ""}
            onSelectionChange={setSelectedIds}
          />
        </div>

        <SupplierFormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          supplier={selectedSupplier}
          onSaved={loadSuppliers}
        />
      </div>
    </Layout>
  );
};

export default SuppliersPage;
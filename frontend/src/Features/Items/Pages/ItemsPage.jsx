import React, { useEffect, useState } from "react";
import { getItems, deleteItem } from "../Services/itemsApi";
import { getUserRoles } from "../../Auth/Services/authApi";
import Button from "../../../Core/Components/Button";
import ItemFormModal from "../Components/ItemFormModal";
import Table from "../../../Core/Components/Table";
import Layout from "../../../Core/Pages/Layout";
import { exportToCSV } from "../../../Core/Utils/exportUtils";

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const roles = getUserRoles();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await getItems();
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      loadItems();
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteItem(id);
      }
      setSelectedIds([]);
      loadItems();
    } catch (error) {
      console.error("Error deleting selected items", error);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Items</h2>
          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => {
                  const selectedRows = items.filter((i) =>
                    selectedIds.includes(i.id)
                  );
                  exportToCSV("items_export.csv", selectedRows);
                }}
              >
                Export Selected ({selectedIds.length})
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => {
                setSelectedItem(null);
                setModalOpen(true);
              }}
            >
              Add Item
            </Button>
            {roles.includes("Admin") && selectedIds.length > 0 && (
              <Button variant="danger" onClick={handleBulkDelete}>
                Delete Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div>
          <input
            type="text"
            placeholder="Search items..."
            className="w-full max-w-sm px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <Table
            columns={[
              { label: "Name", accessor: "name", width: "40%" },
              {
                label: "Category",
                accessor: "category",
                width: "30%",
                render: (val) => (
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                    {val}
                  </span>
                ),
              },
              {
                label: "Quantity",
                accessor: "quantity",
                align: "right",
                width: "15%",
                render: (val) => (
                  <span
                    className={`font-semibold ${
                      val < 10 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {val.toLocaleString()}
                  </span>
                ),
              },
            ]}
            data={items.map((i) => ({
              id: i.id,
              name: i.name,
              category: i.category,
              quantity: i.quantity,
              isActive: i.isActive,
            }))}
            actions={(i) => (
              <div className="flex gap-2">
                {roles.includes("Admin") && (
                  <Button variant="danger" onClick={() => handleDelete(i.id)}>
                    Delete
                  </Button>
                )}
                {(roles.includes("Admin") || roles.includes("Manager")) && (
                  <Button variant="primary" onClick={() => handleEdit(i)}>
                    Edit
                  </Button>
                )}
              </div>
            )}
            pageSize={5}
            rowClassName={(row) => (!row.isActive ? "opacity-50" : "")}
            onSelectionChange={setSelectedIds}
          />
        </div>

        <ItemFormModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          item={selectedItem}
          onSaved={loadItems}
        />
      </div>
    </Layout>
  );
};

export default ItemsPage;
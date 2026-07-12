import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import ItemForm from "../components/items/ItemForm";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../services/itemService";

import { getSuppliers } from "../services/supplierService";

import type { Item } from "../models/Item";
import type { Supplier } from "../models/Supplier";
import type { CreateItemRequest } from "../models/CreateItemRequest";

import styles from "./ItemsPage.module.css";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] =
    useState<Item | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [itemToDelete, setItemToDelete] =
    useState<Item | null>(null);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "success"
    );

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  async function loadItems() {
    try {
      const [itemsResult, suppliersResult] =
        await Promise.all([
          getItems(),
          getSuppliers(),
        ]);

      setItems(itemsResult);
      setSuppliers(suppliersResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function closeModal() {
    setShowModal(false);
    setEditingItem(null);
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
    item: CreateItemRequest
  ) {
    try {
      await createItem(item);

      await loadItems();

      closeModal();

      showToast(
        "Item added successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create item.",
        "error"
      );
    }
  }

  async function handleUpdate(
    item: CreateItemRequest
  ) {
    if (!editingItem) return;

    try {
      await updateItem(editingItem.id, item);

      await loadItems();

      closeModal();

      showToast(
        "Item updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to update item.",
        "error"
      );
    }
  }

  function openDeleteDialog(item: Item) {
    setItemToDelete(item);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setItemToDelete(null);
    setShowDeleteDialog(false);
  }

  async function confirmDelete() {
    if (!itemToDelete) return;

    try {
      await deleteItem(itemToDelete.id);

      await loadItems();

      closeDeleteDialog();

      showToast(
        "Item deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete item.",
        "error"
      );
    }
  }

  const categories = [
    "All",
    ...new Set(
      items
        .map((item) => item.category)
        .filter((category) => category !== "")
    ),
  ];

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(searchText) ||
      item.brand
        .toLowerCase()
        .includes(searchText) ||
      item.category
        .toLowerCase()
        .includes(searchText) ||
      item.supplierName
        .toLowerCase()
        .includes(searchText);

    const matchesCategory =
      category === "All" ||
      item.category === category;

    return (
      matchesSearch &&
      matchesCategory
    );
  });

  if (loading) {
    return <p>Loading items...</p>;
  }

  return (
    <>
      <PageHeader
        title="Items"
        subtitle="Manage warehouse inventory"
      />

      <div className={styles.toolbar}>

        <div className={styles.filters}>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search items..."
          />

          <select
            className={styles.categoryFilter}
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

        </div>

        <Button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
        >
          + Add Item
        </Button>

      </div>

      <Modal
        open={showModal}
        title={
          editingItem
            ? "Edit Item"
            : "Add Item"
        }
        onClose={closeModal}
      >
        <ItemForm
          suppliers={suppliers}
          item={editingItem}
          onSubmit={
            editingItem
              ? handleUpdate
              : handleCreate
          }
        />
      </Modal>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Item"
        message={
          itemToDelete
            ? `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`
            : ""
        }
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

      <DataTable
        columns={[
          {
            header: "ID",
            accessor: "id",
            sortable: true,
          },
          {
            header: "Name",
            accessor: "name",
            sortable: true,
          },
          {
            header: "Brand",
            accessor: "brand",
            sortable: true,
          },
          {
            header: "Category",
            accessor: "category",
            sortable: true,
          },
          {
            header: "Quantity",
            accessor: "quantity",
            sortable: true,
          },
          {
            header: "Supplier",
            accessor: "supplierName",
            sortable: true,
          },
          {
            header: "Actions",
            render: (item) => (
              <div className={styles.actions}>
                <Button
                  onClick={() => {
                    setEditingItem(item);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    openDeleteDialog(item)
                  }
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredItems}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
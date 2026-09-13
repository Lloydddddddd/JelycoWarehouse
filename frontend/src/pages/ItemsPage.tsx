import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import ConfirmDialog from "../components/common/ConfirmDialog";

import Button from "../components/ui/Button";
import ItemForm from "../components/items/ItemForm";

import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  activateItem,
} from "../services/itemService";

import { getBrands } from "../services/brandService";

import type { Item } from "../models/Item";
import type { Brand } from "../models/Brand";
import type { CreateItemRequest } from "../models/CreateItemRequest";

import styles from "./ItemsPage.module.css";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [deletingItem, setDeletingItem] =
    useState<Item | null>(null);

  const [activatingItem, setActivatingItem] =
    useState<Item | null>(null);

  const [toastMessage, setToastMessage] = useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [status, setStatus] = useState("All");


  async function loadItems() {
    try {
      const [itemsResult, brandsResult] =
        await Promise.all([
          getItems(),
          getBrands(),
        ]);

      setItems(itemsResult);
      setBrands(brandsResult);

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

    } catch {
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

    } catch {
      showToast(
        "Failed to update item.",
        "error"
      );
    }
  }


  async function handleDelete() {
    if (!deletingItem) return;

    try {
      await deleteItem(deletingItem.id);

      await loadItems();

      setDeletingItem(null);

      showToast(
        "Item deactivated successfully!",
        "success"
      );

    } catch {
      showToast(
        "Failed to deactivate item.",
        "error"
      );
    }
  }

  async function handleActivate() {
    if (!activatingItem) return;

    try {
      await activateItem(
        activatingItem.id
      );

      await loadItems();

      setActivatingItem(null);

      showToast(
        "Item activated successfully!",
        "success"
      );

    } catch (error) {
      console.error(error);

      showToast(
        "Failed to activate item.",
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
      item.name.toLowerCase().includes(searchText) ||
      item.brand.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText);


    const matchesCategory =
      category === "All" ||
      item.category === category;


    const matchesStatus =
      status === "All" ||
      (status === "Active" && item.isActive) ||
      (status === "Inactive" && !item.isActive);


    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
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


          <select
            className={styles.categoryFilter}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

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
          brands={brands}
          initialData={
            editingItem
              ? {
                  name: editingItem.name,
                  brandId: editingItem.brandId,
                  category: editingItem.category,
                  kind: editingItem.kind,
                  size: editingItem.size,
                  color: editingItem.color,
                  reorderLevel:
                    editingItem.reorderLevel,
                }
              : undefined
          }
          onSubmit={
            editingItem
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
            header: "Kind",
            accessor: "kind",
            sortable: true,
          },

          {
            header: "Size",
            accessor: "size",
            sortable: true,
          },

          {
            header: "Color",
            accessor: "color",
            sortable: true,
          },

          {
            header: "Stock",
            accessor: "quantity",
            sortable: true,
          },

          {
            header: "Status",
            render: (item: Item) => (
              <span
                style={{
                  color: item.isActive
                    ? "#16a34a"
                    : "#dc2626",
                  fontWeight: 600,
                }}
              >
                {item.isActive
                  ? "● Active"
                  : "● Inactive"}
              </span>
            ),
          },


          {
            header: "Actions",

            render: (item: Item) => (

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >

                <Button
                  disabled={!item.isActive}
                  onClick={() => {
                    setEditingItem(item);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>


                {item.isActive ? (

                  <Button
                    variant="danger"
                    onClick={() =>
                      setDeletingItem(item)
                    }
                  >
                    Deactivate
                  </Button>

                ) : (

                  <Button
                    onClick={() =>
                      setActivatingItem(item)
                    }
                  >
                    Activate
                  </Button>

                )}

              </div>

            ),
          },

        ]}

        data={filteredItems}

        rowKey={(item) => item.id}

      />


      <ConfirmDialog
        open={deletingItem !== null}
        title="Deactivate Item"
        message={
          deletingItem
            ? `Are you sure you want to deactivate "${deletingItem.name}"? The item will remain in the records but will be marked as inactive.`
            : ""
        }
        confirmText="Deactivate"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeletingItem(null)
        }
      />

      <ConfirmDialog
        open={
          activatingItem !== null
        }

        title="Activate Item"

        message={
          activatingItem
            ? `Are you sure you want to activate "${activatingItem.name}"? This item will become available again in inventory.`
            : ""
        }

        confirmText="Activate"

        onConfirm={handleActivate}

        onCancel={() =>
          setActivatingItem(null)
        }
      />


      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />

    </>
  );
}
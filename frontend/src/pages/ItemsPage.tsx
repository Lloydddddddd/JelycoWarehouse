import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import ItemForm from "../components/items/ItemForm";

import {
  getItems,
  createItem,
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

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("All");

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

  const categories = [
    "All",
    ...new Set(
      items
        .map((item) => item.category)
        .filter(
          (category) => category !== ""
        )
    ),
  ];

  const filteredItems = items.filter(
    (item) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        item.name
          .toLowerCase()
          .includes(searchText) ||
        item.brand
          .toLowerCase()
          .includes(searchText) ||
        item.category
          .toLowerCase()
          .includes(searchText);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

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
            className={
              styles.categoryFilter
            }
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
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
          onClick={() =>
            setShowModal(true)
          }
        >
          + Add Item
        </Button>
      </div>

      <Modal
        open={showModal}
        title="Add Item"
        onClose={closeModal}
      >
        <ItemForm
          brands={brands}
          onSubmit={handleCreate}
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
            header: "Stock",
            accessor: "quantity",
            sortable: true,
          },
          {
            header: "Cost Price",
            accessor: "costPrice",
            sortable: true,
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
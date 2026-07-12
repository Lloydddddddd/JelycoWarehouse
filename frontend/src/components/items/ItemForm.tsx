import { useEffect, useState } from "react";

import type { Supplier } from "../../models/Supplier";
import type { Item } from "../../models/Item";
import type { CreateItemRequest } from "../../models/CreateItemRequest";

import styles from "./ItemForm.module.css";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface ItemFormProps {
  suppliers: Supplier[];

  item?: Item | null;

  onSubmit: (
    item: CreateItemRequest
  ) => Promise<void>;
}

const initialForm: CreateItemRequest = {
  name: "",
  brand: "",
  kind: "",
  size: "",
  color: "",
  category: "",
  quantity: 0,
  costPrice: 0,
  reorderLevel: 0,
  expiryDate: null,
  supplierId: 0,
};

export default function ItemForm({
  suppliers,
  item,
  onSubmit,
}: ItemFormProps) {
  const [form, setForm] =
    useState<CreateItemRequest>(initialForm);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        brand: item.brand,
        kind: item.kind,
        size: item.size,
        color: item.color,
        category: item.category,
        quantity: item.quantity,
        costPrice: item.costPrice,
        reorderLevel: item.reorderLevel,
        expiryDate: item.expiryDate,
        supplierId: item.supplierId,
      });
    } else {
      setForm(initialForm);
    }
  }, [item]);

  function update<K extends keyof CreateItemRequest>(
    key: K,
    value: CreateItemRequest[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await onSubmit(form);

    setForm(initialForm);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <h3>Item Information</h3>

      <div className={styles.grid}>
        <Input
          label="Name"
          value={form.name}
          onChange={(e) =>
            update("name", e.target.value)
          }
        />

        <Input
          label="Brand"
          value={form.brand}
          onChange={(e) =>
            update("brand", e.target.value)
          }
        />

        <Input
          label="Category"
          value={form.category}
          onChange={(e) =>
            update("category", e.target.value)
          }
        />

        <Input
          label="Kind"
          value={form.kind}
          onChange={(e) =>
            update("kind", e.target.value)
          }
        />

        <Input
          label="Size"
          value={form.size}
          onChange={(e) =>
            update("size", e.target.value)
          }
        />

        <Input
          label="Color"
          value={form.color}
          onChange={(e) =>
            update("color", e.target.value)
          }
        />
      </div>

      <h3>Inventory</h3>

      <div className={styles.grid}>
        <Input
          label="Quantity"
          type="number"
          value={form.quantity}
          onChange={(e) =>
            update("quantity", Number(e.target.value))
          }
        />

        <Input
          label="Cost Price"
          type="number"
          step="0.01"
          value={form.costPrice}
          onChange={(e) =>
            update("costPrice", Number(e.target.value))
          }
        />

        <Input
          label="Reorder Level"
          type="number"
          value={form.reorderLevel}
          onChange={(e) =>
            update(
              "reorderLevel",
              Number(e.target.value)
            )
          }
        />

        <Select
          label="Supplier"
          value={form.supplierId}
          onChange={(e) =>
            update(
              "supplierId",
              Number(e.target.value)
            )
          }
        >
          <option value={0}>
            Select Supplier
          </option>

          {suppliers.map((supplier) => (
            <option
              key={supplier.id}
              value={supplier.id}
            >
              {supplier.name}
            </option>
          ))}
        </Select>

        <Input
          label="Expiry Date"
          type="date"
          value={form.expiryDate ?? ""}
          onChange={(e) =>
            update(
              "expiryDate",
              e.target.value || null
            )
          }
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit">
          {item ? "Update Item" : "Save Item"}
        </Button>
      </div>
    </form>
  );
}
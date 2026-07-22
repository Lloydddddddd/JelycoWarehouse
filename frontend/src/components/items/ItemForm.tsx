import { useState } from "react";

import type { Brand } from "../../models/Brand";
import type { CreateItemRequest } from "../../models/CreateItemRequest";

import styles from "./ItemForm.module.css";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Toggle from "../ui/Toggle";

interface ItemFormProps {
  brands: Brand[];

  onSubmit: (
    item: CreateItemRequest
  ) => Promise<void>;
}

const initialForm: CreateItemRequest = {
  name: "",
  brandId: 0,
  kind: "",
  size: "",
  color: "",
  category: "",
  costPrice: 0,
  expiryDate: null,
};

export default function ItemForm({
  brands,
  onSubmit,
}: ItemFormProps) {
  const [form, setForm] =
    useState<CreateItemRequest>(initialForm);

  const [noExpiry, setNoExpiry] =
    useState(false);

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
    setNoExpiry(false);
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

        <Select
          label="Brand"
          value={form.brandId}
          onChange={(e) =>
            update(
              "brandId",
              Number(e.target.value)
            )
          }
        >
          <option value={0}>
            Select Brand
          </option>

          {brands.map((brand) => (
            <option
              key={brand.id}
              value={brand.id}
            >
              {brand.name}
            </option>
          ))}
        </Select>

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

        <Input
          label="Cost Price"
          type="number"
          step="0.01"
          value={form.costPrice}
          onChange={(e) =>
            update(
              "costPrice",
              Number(e.target.value)
            )
          }
        />

        <div>
          <Toggle
            label="No Expiry Date"
            checked={noExpiry}
            onChange={(checked) => {
              setNoExpiry(checked);

              if (checked) {
                update("expiryDate", null);
              }
            }}
          />

          {noExpiry ? (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#f3f8ff",
                border: "1px solid #c7ddff",
                borderRadius: "8px",
                color: "#2563eb",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              ✓ This item does not expire.
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit">
          Save Item
        </Button>
      </div>
    </form>
  );
}
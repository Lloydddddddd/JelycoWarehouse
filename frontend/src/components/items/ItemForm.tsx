import { useEffect, useState } from "react";

import type { Brand } from "../../models/Brand";
import type { CreateItemRequest } from "../../models/CreateItemRequest";

import styles from "./ItemForm.module.css";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

interface ItemFormProps {
  brands: Brand[];

  initialData?: CreateItemRequest;

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
  reorderLevel: 10,
};

export default function ItemForm({
  brands,
  initialData,
  onSubmit,
}: ItemFormProps) {
  const [form, setForm] =
    useState<CreateItemRequest>(
      initialData ?? initialForm
    );

  useEffect(() => {
    setForm(initialData ?? initialForm);
  }, [initialData]);

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
          label="Reorder Level"
          type="number"
          min={0}
          value={form.reorderLevel}
          onChange={(e) =>
            update(
              "reorderLevel",
              Number(e.target.value)
            )
          }
        />
      </div>

      <div className={styles.actions}>
        <Button type="submit">
          Save Item
        </Button>
      </div>
    </form>
  );
}
import { useEffect, useState } from "react";

import type { Supplier } from "../../models/Supplier";
import type { CreateSupplierRequest } from "../../models/CreateSupplierRequest";

import styles from "./SupplierForm.module.css";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface SupplierFormProps {
  supplier?: Supplier | null;

  onSubmit: (
    supplier: CreateSupplierRequest
  ) => Promise<void>;
}

const initialForm: CreateSupplierRequest = {
  name: "",
  contactInfo: "",
  address: "",
  email: "",
};

export default function SupplierForm({
  supplier,
  onSubmit,
}: SupplierFormProps) {
  const [form, setForm] =
    useState<CreateSupplierRequest>(initialForm);

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        contactInfo: supplier.contactInfo,
        address: supplier.address,
        email: supplier.email,
      });
    } else {
      setForm(initialForm);
    }
  }, [supplier]);

  function update<
    K extends keyof CreateSupplierRequest
  >(
    key: K,
    value: CreateSupplierRequest[K]
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
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <Input
        label="Supplier Name"
        value={form.name}
        onChange={(e) =>
          update("name", e.target.value)
        }
      />

      <Input
        label="Contact Info"
        value={form.contactInfo}
        onChange={(e) =>
          update("contactInfo", e.target.value)
        }
      />

      <Input
        label="Address"
        value={form.address}
        onChange={(e) =>
          update("address", e.target.value)
        }
      />

      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) =>
          update("email", e.target.value)
        }
      />

      <div className={styles.actions}>
        <Button type="submit">
          Save Supplier
        </Button>
      </div>
    </form>
  );
}
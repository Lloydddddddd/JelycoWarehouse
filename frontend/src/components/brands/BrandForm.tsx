import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

import type { Brand } from "../../models/Brand";
import type { CreateBrandRequest } from "../../models/CreateBrandRequest";

interface BrandFormProps {
  brand?: Brand | null;

  onSubmit: (brand: CreateBrandRequest) => Promise<void>;
}

export default function BrandForm({
  brand,
  onSubmit,
}: BrandFormProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(brand?.name ?? "");
  }, [brand]);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    await onSubmit({
        name,
    });

    setName("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Brand Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="submit">
          {brand
            ? "Update Brand"
            : "Save Brand"}
        </Button>
      </div>
    </form>
  );
}
import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

import { getItems } from "../../services/itemService";

import type { Item } from "../../models/Item";
import type { CreateTransactionRequest } from "../../models/CreateTransactionRequest";
import type { Transaction } from "../../models/Transaction";

interface TransactionFormProps {
  transaction?: Transaction | null;

  onSubmit: (
    transaction: CreateTransactionRequest
  ) => Promise<void>;
}

const initialForm: CreateTransactionRequest = {
  itemId: 0,
  quantity: 0,
  type: "IN",
};

export default function TransactionForm({
  transaction,
  onSubmit,
}: TransactionFormProps) {
  const [items, setItems] = useState<Item[]>([]);

  const [form, setForm] =
    useState<CreateTransactionRequest>(initialForm);

  useEffect(() => {
    async function loadData() {
      const itemData = await getItems();
      setItems(itemData);
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!transaction) {
      setForm(initialForm);
      return;
    }

    setForm({
      itemId: transaction.itemId,
      quantity: transaction.quantity,
      type: transaction.type,
    });
  }, [transaction]);

  function update<
    K extends keyof CreateTransactionRequest
  >(
    key: K,
    value: CreateTransactionRequest[K]
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
    <form onSubmit={handleSubmit}>
      <Select
        label="Item"
        value={form.itemId}
        onChange={(e) =>
          update(
            "itemId",
            Number(e.target.value)
          )
        }
      >
        <option value={0}>Select Item</option>

        {items.map((item) => (
          <option
            key={item.id}
            value={item.id}
          >
            {item.name}
          </option>
        ))}
      </Select>

      <Select
        label="Transaction Type"
        value={form.type}
        onChange={(e) =>
          update(
            "type",
            e.target.value as "IN" | "OUT"
          )
        }
      >
        <option value="IN">IN</option>
        <option value="OUT">OUT</option>
      </Select>

      <Input
        label="Quantity"
        type="number"
        value={form.quantity}
        onChange={(e) =>
          update(
            "quantity",
            Number(e.target.value)
          )
        }
      />

      <div style={{ marginTop: "24px" }}>
        <Button type="submit">
          Save Transaction
        </Button>
      </div>
    </form>
  );
}
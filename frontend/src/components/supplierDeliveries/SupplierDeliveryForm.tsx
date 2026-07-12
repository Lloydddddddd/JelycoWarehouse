import { useEffect, useState } from "react";

import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

import { getSuppliers } from "../../services/supplierService";
import { getItems } from "../../services/itemService";

import type { Supplier } from "../../models/Supplier";
import type { Item } from "../../models/Item";
import type { CreateSupplierDeliveryRequest } from "../../models/CreateSupplierDeliveryRequest";
import type { CreateSupplierDeliveryItemRequest } from "../../models/CreateSupplierDeliveryItemRequest";

interface Props {
  onSubmit: (
    delivery: CreateSupplierDeliveryRequest
  ) => Promise<void>;
}

const initialItem: CreateSupplierDeliveryItemRequest = {
  itemId: 0,
  quantity: 0,
  unitCost: 0,
  totalCost: 0,
};

const initialForm: CreateSupplierDeliveryRequest = {
  supplierId: 0,
  deliveryReference: "",
  deliveryDate: new Date()
    .toISOString()
    .split("T")[0],
  grandTotal: 0,
  items: [initialItem],
};

export default function SupplierDeliveryForm({
  onSubmit,
}: Props) {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>([]);

  const [items, setItems] =
    useState<Item[]>([]);

  const [form, setForm] =
    useState(initialForm);

  useEffect(() => {
    async function loadData() {
      const [supplierData, itemData] =
        await Promise.all([
          getSuppliers(),
          getItems(),
        ]);

      setSuppliers(supplierData);
      setItems(itemData);
    }

    loadData();
  }, []);

  function update<
    K extends keyof CreateSupplierDeliveryRequest
  >(
    key: K,
    value: CreateSupplierDeliveryRequest[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateItem<
    K extends keyof CreateSupplierDeliveryItemRequest
  >(
    index: number,
    key: K,
    value: CreateSupplierDeliveryItemRequest[K]
  ) {
    const updatedItems = [...form.items];

    updatedItems[index] = {
      ...updatedItems[index],
      [key]: value,
    };

    updatedItems[index].totalCost =
      updatedItems[index].quantity *
      updatedItems[index].unitCost;

    const grandTotal = updatedItems.reduce(
      (sum, item) => sum + item.totalCost,
      0
    );

    setForm((prev) => ({
      ...prev,
      items: updatedItems,
      grandTotal,
    }));
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemId: 0,
          quantity: 0,
          unitCost: 0,
          totalCost: 0,
        },
      ],
    }));
  }

  function removeItem(index: number) {
    const updatedItems =
      form.items.filter((_, i) => i !== index);

    const grandTotal = updatedItems.reduce(
      (sum, item) => sum + item.totalCost,
      0
    );

    setForm((prev) => ({
      ...prev,
      items: updatedItems,
      grandTotal,
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
        label="Delivery Reference"
        value={form.deliveryReference}
        onChange={(e) =>
          update(
            "deliveryReference",
            e.target.value
          )
        }
      />

      <Input
        label="Delivery Date"
        type="date"
        value={form.deliveryDate}
        onChange={(e) =>
          update(
            "deliveryDate",
            e.target.value
          )
        }
      />

      <hr
        style={{
          margin: "24px 0",
        }}
      />

      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        Delivery Items
      </h3>

      {form.items.map((deliveryItem, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "18px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h4
              style={{
                margin: 0,
              }}
            >
              Item #{index + 1}
            </h4>

            {form.items.length > 1 && (
              <Button
                type="button"
                variant="danger"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            )}
          </div>

          {/* Row 1 */}

          <Select
            label="Item"
            value={deliveryItem.itemId}
            onChange={(e) =>
              updateItem(
                index,
                "itemId",
                Number(e.target.value)
              )
            }
          >
            <option value={0}>
              Select Item
            </option>

            {items.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </Select>

          {/* Row 2 */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginTop: "16px",
            }}
          >
            <Input
              label="Quantity"
              type="number"
              value={deliveryItem.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  Number(e.target.value)
                )
              }
            />

            <Input
              label="Unit Cost"
              type="number"
              value={deliveryItem.unitCost}
              onChange={(e) =>
                updateItem(
                  index,
                  "unitCost",
                  Number(e.target.value)
                )
              }
            />

            <Input
              label="Total Cost"
              type="number"
              value={deliveryItem.totalCost}
              readOnly
            />
          </div>
        </div>
      ))}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginTop: "8px",
        }}
      >
        <Button
          type="button"
          onClick={addItem}
        >
          + Add Another Item
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            width: "250px",
          }}
        >
          <Input
            label="Grand Total"
            type="number"
            value={form.grandTotal}
            readOnly
          />
        </div>

        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
}
import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Toast from "../common/Toast";

import { getItems } from "../../services/itemService";

import type { Item } from "../../models/Item";
import type { CreateWarehouseReleaseRequest } from "../../models/CreateWarehouseReleaseRequest";
import type { CreateWarehouseReleaseItemRequest } from "../../models/CreateWarehouseReleaseItemRequest";

interface Props {
  onSubmit: (
    release: CreateWarehouseReleaseRequest
  ) => void;
}

export default function WarehouseReleaseForm({
  onSubmit,
}: Props) {
  const [items, setItems] = useState<Item[]>([]);

  const [releaseDate, setReleaseDate] =
    useState("");

  const [destination, setDestination] =
    useState("");

  const [selectedItemId, setSelectedItemId] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [selectedItems, setSelectedItems] =
    useState<CreateWarehouseReleaseItemRequest[]>([]);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "success"
    );

  useEffect(() => {
    async function loadItems() {
      const result = await getItems();

      setItems(result.filter((i) => i.quantity > 0));
    }

    loadItems();
  }, []);

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

  function addItem() {
    if (!selectedItemId) return;

    const item = items.find(
      (i) => i.id === selectedItemId
    );

    if (!item) return;

    const existingItem =
      selectedItems.find(
        (i) => i.itemId === item.id
      );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity + quantity;

      if (newQuantity > item.quantity) {
        showToast(
          `Only ${item.quantity} units are available in stock.`,
          "error"
        );
        return;
      }

      setSelectedItems(
        selectedItems.map((i) =>
          i.itemId === item.id
            ? {
                ...i,
                quantity: newQuantity,
              }
            : i
        )
      );
    } else {
      if (quantity > item.quantity) {
        showToast(
          `Only ${item.quantity} units are available in stock.`,
          "error"
        );
        return;
      }

      setSelectedItems([
        ...selectedItems,
        {
          itemId: item.id,
          quantity,
          unitCost: item.costPrice,
        },
      ]);
    }

    setSelectedItemId(0);
    setQuantity(1);
  }

  function removeItem(index: number) {
    setSelectedItems(
      selectedItems.filter((_, i) => i !== index)
    );
  }

  function updateQuantity(
    index: number,
    quantity: number
  ) {
    const selectedItem =
      selectedItems[index];

    const item = items.find(
      (i) => i.id === selectedItem.itemId
    );

    if (!item) return;

    const newQuantity = Math.min(
      Math.max(quantity, 1),
      item.quantity
    );

    setSelectedItems(
      selectedItems.map((i, idx) =>
        idx === index
          ? {
              ...i,
              quantity: newQuantity,
            }
          : i
      )
    );
  }

  const isFormValid =
    releaseDate !== "" &&
    destination.trim() !== "" &&
    selectedItems.length > 0;

  const grandTotal = selectedItems.reduce(
    (sum, item) =>
      sum +
      item.quantity * item.unitCost,
    0
  );

  function submit() {
    if (!isFormValid) return;

    showToast(
      "Warehouse release is being saved...",
      "success"
    );

    onSubmit({
      releaseDate,
      destination,
      items: selectedItems,
    });
  }

  return (
    <>
      <Input
        type="date"
        label="Release Date"
        value={releaseDate}
        onChange={(e) =>
          setReleaseDate(e.target.value)
        }
      />

      <Input
        label="Destination"
        value={destination}
        onChange={(e) =>
          setDestination(e.target.value)
        }
      />

      <div
        style={{
          marginTop: 24,
          marginBottom: 24,
        }}
      >
        <select
          value={selectedItemId}
          onChange={(e) =>
            setSelectedItemId(Number(e.target.value))
          }
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
          }}
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
              {" • "}
              {item.category}
              {" • Stock: "}
              {item.quantity}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-end",
            marginTop: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <Input
              type="number"
              label="Quantity"
              min={1}
              max={
                items.find(
                  (i) =>
                    i.id === selectedItemId
                )?.quantity ?? 1
              }
              value={quantity}
              onChange={(e) => {
                const value = Number(
                  e.target.value
                );

                const max =
                  items.find(
                    (i) =>
                      i.id === selectedItemId
                  )?.quantity ?? 1;

                setQuantity(
                  Math.min(
                    Math.max(value, 1),
                    max
                  )
                );
              }}
            />
          </div>

          <Button
            onClick={addItem}
            disabled={!selectedItemId}
          >
            Add Item
          </Button>
        </div>
      </div>

      {selectedItems.length === 0 && (
        <div
          style={{
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            padding: "24px",
            textAlign: "center",
            color: "#64748b",
            marginBottom: "20px",
          }}
        >
          No items have been added yet.
        </div>
      )}

      {selectedItems.length > 0 && (
        <>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={headerStyle} align="left">
                  Item
                </th>

                <th style={headerStyle}>
                  Current Stock
                </th>

                <th style={headerStyle}>
                  Release Qty
                </th>

                <th style={headerStyle}>
                  Remaining
                </th>

                <th style={headerStyle}>
                  Unit Cost
                </th>

                <th style={headerStyle}>
                  Total
                </th>

                <th style={headerStyle}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {selectedItems.map(
                (selectedItem, index) => {
                  const item = items.find(
                    (i) =>
                      i.id ===
                      selectedItem.itemId
                  );

                  const remaining =
                    (item?.quantity ?? 0) -
                    selectedItem.quantity;

                  return (
                    <tr key={index}>
                      <td style={cellStyle}>
                        {item?.name}
                      </td>

                      <td align="center" style={cellStyle}>
                        {item?.quantity}
                      </td>

                      <td align="center" style={cellStyle}>
                        <input
                          type="number"
                          min={1}
                          max={item?.quantity}
                          value={selectedItem.quantity}
                          onChange={(e) =>
                            updateQuantity(
                              index,
                              Number(e.target.value)
                            )
                          }
                          style={{
                            width: "70px",
                            padding: "6px",
                            textAlign: "center",
                            border:
                              "1px solid #d1d5db",
                            borderRadius: "6px",
                          }}
                        />
                      </td>

                      <td
                        align="center"
                        style={{
                          ...cellStyle,
                          fontWeight: 700,
                          color:
                            remaining <= 5
                              ? "#dc2626"
                              : "#059669",
                        }}
                      >
                        {remaining}
                      </td>

                      <td align="center" style={cellStyle}>
                        ₱
                        {selectedItem.unitCost.toLocaleString()}
                      </td>

                      <td align="center" style={cellStyle}>
                        ₱
                        {(
                          selectedItem.quantity *
                          selectedItem.unitCost
                        ).toLocaleString()}
                      </td>

                      <td align="center" style={cellStyle}>
                        <Button
                          variant="danger"
                          onClick={() =>
                            removeItem(index)
                          }
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>

          <div
            style={{
              borderTop:
                "2px solid #e5e7eb",
              paddingTop: "16px",
              textAlign: "right",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              Grand Total
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              ₱{grandTotal.toLocaleString()}
            </div>
          </div>
        </>
      )}

      <div
        style={{
          marginTop: "24px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={submit}
          disabled={!isFormValid}
        >
          Save Release
        </Button>
      </div>

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}

const headerStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #f1f5f9",
};
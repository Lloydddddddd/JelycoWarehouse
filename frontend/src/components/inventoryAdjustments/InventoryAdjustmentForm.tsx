import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";
import Toast from "../common/Toast";

import { getItems } from "../../services/itemService";

import type { Item } from "../../models/Item";
import type { CreateInventoryAdjustmentRequest } from "../../models/CreateInventoryAdjustmentRequest";
import type { CreateInventoryAdjustmentItemRequest } from "../../models/CreateInventoryAdjustmentItemRequest";

interface Props {
  onSubmit: (
    adjustment: CreateInventoryAdjustmentRequest
  ) => void;
}

export default function InventoryAdjustmentForm({
  onSubmit,
}: Props) {
  const [items, setItems] =
    useState<Item[]>([]);

  const [adjustmentDate, setAdjustmentDate] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [selectedItemId, setSelectedItemId] =
    useState(0);

  const [actualQuantity, setActualQuantity] =
    useState(0);

  const [selectedItems, setSelectedItems] =
    useState<CreateInventoryAdjustmentItemRequest[]>([]);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">(
      "success"
    );

  useEffect(() => {
    async function loadItems() {
      const result = await getItems();

      setItems(result);
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

    const existing =
      selectedItems.find(
        (i) => i.itemId === selectedItemId
      );

    if (existing) {
      showToast(
        "Item already added.",
        "error"
      );
      return;
    }

    setSelectedItems([
      ...selectedItems,
      {
        itemId: selectedItemId,
        actualQuantity,
      },
    ]);

    setSelectedItemId(0);
    setActualQuantity(0);
  }

  function removeItem(index: number) {
    setSelectedItems(
      selectedItems.filter(
        (_, i) => i !== index
      )
    );
  }

  function updateActualQuantity(
    index: number,
    quantity: number
  ) {
    setSelectedItems(
      selectedItems.map((item, i) =>
        i === index
          ? {
              ...item,
              actualQuantity: Math.max(
                quantity,
                0
              ),
            }
          : item
      )
    );
  }

  const isFormValid =
    adjustmentDate !== "" &&
    reason.trim() !== "" &&
    selectedItems.length > 0;

  function submit() {
    if (!isFormValid) return;

    onSubmit({
      adjustmentDate,
      reason,
      items: selectedItems,
    });
  }

  return (
    <>
      <Input
        type="date"
        label="Adjustment Date"
        value={adjustmentDate}
        onChange={(e) =>
          setAdjustmentDate(e.target.value)
        }
      />

      <Input
        label="Reason"
        value={reason}
        onChange={(e) =>
          setReason(e.target.value)
        }
      />

      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <select
          value={selectedItemId}
          onChange={(e) =>
            setSelectedItemId(
              Number(e.target.value)
            )
          }
          style={{
            width: "100%",
            padding: "10px",
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
              Stock:
              {" "}
              {item.quantity}
            </option>
          ))}
        </select>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 10,
          }}
        >
          <Input
            type="number"
            label="Actual Quantity"
            min={0}
            value={actualQuantity}
            onChange={(e) =>
              setActualQuantity(
                Number(e.target.value)
              )
            }
          />

          <Button onClick={addItem}>
            Add Item
          </Button>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th align="left">
                Item
              </th>

              <th>
                Actual Qty
              </th>

              <th></th>
            </tr>
          </thead>

          <tbody>
            {selectedItems.map(
              (selectedItem, index) => {
                const item =
                  items.find(
                    (i) =>
                      i.id ===
                      selectedItem.itemId
                  );

                return (
                  <tr key={index}>
                    <td>
                      {item?.name}
                    </td>

                    <td align="center">
                      <input
                        type="number"
                        min={0}
                        value={
                          selectedItem.actualQuantity
                        }
                        onChange={(e) =>
                          updateActualQuantity(
                            index,
                            Number(
                              e.target.value
                            )
                          )
                        }
                        style={{
                          width: "70px",
                          padding: "6px",
                          textAlign:
                            "center",
                        }}
                      />
                    </td>

                    <td align="center">
                      <Button
                        variant="danger"
                        onClick={() =>
                          removeItem(
                            index
                          )
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
      )}

      <Button
        onClick={submit}
        disabled={!isFormValid}
      >
        Save Adjustment
      </Button>

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
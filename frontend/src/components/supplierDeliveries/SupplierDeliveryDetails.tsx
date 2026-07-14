import type { SupplierDelivery } from "../../models/SupplierDelivery";

interface Props {
  delivery: SupplierDelivery;
}

export default function SupplierDeliveryDetails({
  delivery,
}: Props) {
  return (
    <div>
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
        }}
      >
        Delivery Information
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr",
          rowGap: "14px",
          marginBottom: "32px",
        }}
      >
        <strong>Reference</strong>

        <span>
          {delivery.deliveryReference}
        </span>

        <strong>Supplier</strong>

        <span>
          {delivery.supplierName}
        </span>

        <strong>Date</strong>

        <span>
          {new Date(
            delivery.deliveryDate
          ).toLocaleDateString(
            "en-PH",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}
        </span>

        <strong>Grand Total</strong>

        <span
          style={{
            color: "#2563eb",
            fontWeight: 700,
            fontSize: "18px",
          }}
        >
          {delivery.grandTotal.toLocaleString(
            "en-PH",
            {
              style: "currency",
              currency: "PHP",
            }
          )}
        </span>
      </div>

      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        Items
      </h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #e5e7eb",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f8fafc",
            }}
          >
            <th
              style={{
                textAlign: "left",
                padding: "14px",
              }}
            >
              Item
            </th>

            <th
              style={{
                padding: "14px",
              }}
            >
              Qty
            </th>

            <th
              style={{
                padding: "14px",
              }}
            >
              Unit Cost
            </th>

            <th
              style={{
                padding: "14px",
              }}
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {delivery.items.map(
            (item, index) => (
              <tr
                key={index}
                style={{
                  borderTop:
                    "1px solid #e5e7eb",
                }}
              >
                <td
                  style={{
                    padding: "14px",
                  }}
                >
                  {item.itemName}
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </td>

                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.unitCost.toLocaleString(
                    "en-PH",
                    {
                      style:
                        "currency",
                      currency:
                        "PHP",
                    }
                  )}
                </td>

                <td
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {item.totalCost.toLocaleString(
                    "en-PH",
                    {
                      style:
                        "currency",
                      currency:
                        "PHP",
                    }
                  )}
                </td>
              </tr>
            )
          )}

          <tr
            style={{
              borderTop:
                "2px solid #d1d5db",
              background:
                "#f9fafb",
            }}
          >
            <td
              colSpan={3}
              style={{
                padding: "14px",
                textAlign: "right",
                fontWeight: 700,
              }}
            >
              Grand Total
            </td>

            <td
              style={{
                textAlign: "center",
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              {delivery.grandTotal.toLocaleString(
                "en-PH",
                {
                  style: "currency",
                  currency: "PHP",
                }
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
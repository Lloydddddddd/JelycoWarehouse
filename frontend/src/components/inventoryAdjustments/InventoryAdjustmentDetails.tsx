import type { InventoryAdjustment } from "../../models/InventoryAdjustment";

interface Props {
  adjustment: InventoryAdjustment;
}

export default function InventoryAdjustmentDetails({
  adjustment,
}: Props) {
  return (
    <div>
      <h3>Adjustment Information</h3>

      <table
        style={{
          width: "100%",
          marginBottom: "24px",
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong>Reference</strong>
            </td>

            <td>
              {adjustment.adjustmentReference}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Date</strong>
            </td>

            <td>
              {new Date(
                adjustment.adjustmentDate
              ).toLocaleDateString()}
            </td>
          </tr>

          <tr>
            <td>
              <strong>Reason</strong>
            </td>

            <td>
              {adjustment.reason}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Adjusted Items</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th align="left">Item</th>
            <th>System Qty</th>
            <th>Actual Qty</th>
            <th>Difference</th>
          </tr>
        </thead>

        <tbody>
          {adjustment.items.map(
            (item, index) => (
              <tr key={index}>
                <td>{item.itemName}</td>

                <td align="center">
                  {item.systemQuantity}
                </td>

                <td align="center">
                  {item.actualQuantity}
                </td>

                <td
                  align="center"
                  style={{
                    color:
                      item.difference < 0
                        ? "#dc2626"
                        : item.difference > 0
                        ? "#059669"
                        : "#64748b",
                    fontWeight: "bold",
                  }}
                >
                  {item.difference > 0
                    ? `+${item.difference}`
                    : item.difference}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
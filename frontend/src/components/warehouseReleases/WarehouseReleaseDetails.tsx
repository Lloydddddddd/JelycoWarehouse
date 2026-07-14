import Button from "../ui/Button";

import type { WarehouseRelease } from "../../models/WarehouseRelease";

interface Props {
  release: WarehouseRelease;
}

export default function WarehouseReleaseDetails({
  release,
}: Props) {
  return (
    <div>

      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#1e293b",
            }}
          >
            Warehouse Release
          </h2>

          <p
            style={{
              margin: "6px 0 0",
              color: "#64748b",
            }}
          >
            Release Summary
          </p>
        </div>

        <Button
          onClick={() => window.print()}
        >
          Print
        </Button>
      </div>

      {/* Information */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "30px",
        }}
      >
        <InfoCard
          title="Reference"
          value={release.releaseReference}
        />

        <InfoCard
          title="Destination"
          value={release.destination}
        />

        <InfoCard
          title="Release Date"
          value={new Date(
            release.releaseDate
          ).toLocaleDateString()}
        />

        <InfoCard
          title="Grand Total"
          value={`₱${release.grandTotal.toLocaleString()}`}
        />
      </div>

      {/* Items */}

      <h3
        style={{
          marginBottom: "16px",
          color: "#1e293b",
        }}
      >
        Released Items
      </h3>

      {release.items.length === 0 ? (
        <div
          style={{
            padding: "30px",
            textAlign: "center",
            color: "#64748b",
            border: "1px dashed #d1d5db",
            borderRadius: "8px",
          }}
        >
          No released items.
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f8fafc",
              }}
            >
              <th
                align="left"
                style={headerStyle}
              >
                Item
              </th>

              <th
                style={headerStyle}
              >
                Quantity
              </th>

              <th
                style={headerStyle}
              >
                Unit Cost
              </th>

              <th
                style={headerStyle}
              >
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            {release.items.map(
              (item, index) => (
                <tr key={index}>
                  <td style={cellStyle}>
                    {item.itemName}
                  </td>

                  <td
                    align="center"
                    style={cellStyle}
                  >
                    {item.quantity}
                  </td>

                  <td
                    align="center"
                    style={cellStyle}
                  >
                    ₱
                    {item.unitCost.toLocaleString()}
                  </td>

                  <td
                    align="center"
                    style={cellStyle}
                  >
                    ₱
                    {item.totalCost.toLocaleString()}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}

      <div
        style={{
          marginTop: "24px",
          textAlign: "right",
          borderTop: "2px solid #e5e7eb",
          paddingTop: "16px",
        }}
      >
        <div
          style={{
            color: "#64748b",
            fontSize: "14px",
          }}
        >
          Grand Total
        </div>

        <div
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            color: "#0f172a",
          }}
        >
          ₱{release.grandTotal.toLocaleString()}
        </div>
      </div>

    </div>
  );
}

function InfoCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          fontSize: "13px",
          color: "#64748b",
          marginBottom: "6px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        {value}
      </div>
    </div>
  );
}

const headerStyle = {
  padding: "12px",
  borderBottom: "2px solid #e5e7eb",
};

const cellStyle = {
  padding: "12px",
  borderBottom: "1px solid #f1f5f9",
};
import type { IconType } from "react-icons";

import {
  FiPackage,
  FiBarChart2,
  FiAlertTriangle,
  FiClock,
  FiTruck,
  FiUpload,
} from "react-icons/fi";

import type { Column } from "../components/common/DataTable";

import {
  getInventoryReport,
  getTransactionReport,
  getLowStockReport,
  getExpiringItemsReport,
  getSupplierDeliveryReport,
  getWarehouseReleaseReport,
} from "../services/reportService";

export type ReportType =
  | "inventory"
  | "transactions"
  | "lowStock"
  | "expiring"
  | "deliveries"
  | "releases";

export interface ReportConfig {
  title: string;
  description: string;
  icon: IconType;
  loader: () => Promise<any[]>;
  rowKey: (row: any) => React.Key;
  columns: Column<any>[];
}

export const reportConfigs: Record<ReportType, ReportConfig> = {
  inventory: {
    title: "Inventory Report",
    description: "Current warehouse stock",

    icon: FiPackage,

    loader: getInventoryReport,

    rowKey: (row) => row.itemId,

    columns: [
      {
        header: "Item",
        accessor: "itemName",
        sortable: true,
      },
      {
        header: "Brand",
        accessor: "brand",
        sortable: true,
      },
      {
        header: "Category",
        accessor: "category",
        sortable: true,
      },
      {
        header: "Stock",
        accessor: "currentStock",
        sortable: true,
      },
      {
        header: "Reorder Level",
        accessor: "reorderLevel",
        sortable: true,
      },
      {
        header: "Unit Cost",
        render: (item: any) =>
          `₱${Number(item.unitCost).toFixed(2)}`,
      },
      {
        header: "Stock Value",
        render: (item: any) =>
          `₱${Number(item.stockValue).toFixed(2)}`,
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
      },
    ],
  },

  transactions: {
    title: "Transaction Report",
    description: "Stock movement history",

    icon: FiBarChart2,

    loader: getTransactionReport,

    rowKey: (row) => row.transactionId,

    columns: [
      {
        header: "Date",
        sortable: true,
        render: (row: any) =>
          new Date(row.date).toLocaleDateString(
            "en-PH",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
      },
      {
        header: "Item",
        accessor: "itemName",
        sortable: true,
      },
      {
        header: "Brand",
        accessor: "brand",
        sortable: true,
      },
      {
        header: "Transaction",
        accessor: "transactionType",
        sortable: true,
      },
      {
        header: "Quantity",
        accessor: "quantity",
        sortable: true,
      },
      {
        header: "Reference",
        accessor: "reference",
        sortable: true,
      },
    ],
  },

  lowStock: {
    title: "Low Stock Report",
    description: "Items needing reorder",

    icon: FiAlertTriangle,

    loader: getLowStockReport,

    rowKey: (row) => row.itemId,

    columns: [
      {
        header: "Item",
        accessor: "itemName",
        sortable: true,
      },
      {
        header: "Brand",
        accessor: "brand",
        sortable: true,
      },
      {
        header: "Category",
        accessor: "category",
        sortable: true,
      },
      {
        header: "Current Stock",
        accessor: "currentStock",
        sortable: true,
      },
      {
        header: "Reorder Level",
        accessor: "reorderLevel",
        sortable: true,
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
      },
    ],
  },

  expiring: {
    title: "Expiring Items",
    description: "Items nearing expiry",

    icon: FiClock,

    loader: getExpiringItemsReport,

    rowKey: (row) => row.itemId,

    columns: [
      {
        header: "Item",
        accessor: "itemName",
        sortable: true,
      },
      {
        header: "Brand",
        accessor: "brand",
        sortable: true,
      },
      {
        header: "Category",
        accessor: "category",
        sortable: true,
      },
      {
        header: "Expiry Date",
        sortable: true,
        render: (row: any) =>
          row.expiryDate
            ? new Date(row.expiryDate).toLocaleDateString(
                "en-PH",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              )
            : "-",
      },
      {
        header: "Days Remaining",
        sortable: true,
        render: (row: any) => {
          if (row.daysRemaining < 0) {
            return `${Math.abs(row.daysRemaining)} days ago`;
          }

          return `${row.daysRemaining} days`;
        },
      },
      {
        header: "Status",
        accessor: "status",
        sortable: true,
      },
    ],
  },

  deliveries: {
    title: "Supplier Deliveries",
    description: "Delivery history",

    icon: FiTruck,

    loader: getSupplierDeliveryReport,

    rowKey: (row) => row.deliveryId,

    columns: [
      {
        header: "Reference",
        accessor: "deliveryReference",
        sortable: true,
      },
      {
        header: "Supplier",
        accessor: "supplierName",
        sortable: true,
      },
      {
        header: "Delivery Date",
        sortable: true,
        render: (row: any) =>
          new Date(row.deliveryDate).toLocaleDateString(
            "en-PH",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
      },
      {
        header: "Total Quantity",
        accessor: "totalQuantity",
        sortable: true,
      },
      {
        header: "Grand Total",
        render: (row: any) =>
          `₱${Number(row.grandTotal).toFixed(2)}`,
      },
    ],
  },

  releases: {
    title: "Warehouse Releases",
    description: "Release history",

    icon: FiUpload,

    loader: getWarehouseReleaseReport,

    rowKey: (row) => row.releaseId,

    columns: [
      {
        header: "Reference",
        accessor: "releaseReference",
        sortable: true,
      },
      {
        header: "Release Date",
        sortable: true,
        render: (row: any) =>
          new Date(row.releaseDate).toLocaleDateString(
            "en-PH",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          ),
      },
      {
        header: "Destination",
        accessor: "destination",
        sortable: true,
      },
      {
        header: "Total Quantity",
        accessor: "totalQuantity",
        sortable: true,
      },
      {
        header: "Grand Total",
        render: (row: any) =>
          `₱${Number(row.grandTotal).toFixed(2)}`,
      },
    ],
  },
};
import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import { getItems } from "../services/itemService";
import type { Item } from "../models/Item";

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getItems()
      .then((result) => {
        setItems(result);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return <p>Loading items...</p>;

  return (
    <>
      <PageHeader
        title="Items"
        subtitle="Manage warehouse inventory"
      />

      <DataTable
        columns={[
          {
            header: "ID",
            accessor: "id",
          },
          {
            header: "Name",
            accessor: "name",
          },
          {
            header: "Brand",
            accessor: "brand",
          },
          {
            header: "Category",
            accessor: "category",
          },
          {
            header: "Quantity",
            accessor: "quantity",
          },
          {
            header: "Supplier",
            accessor: "supplierName",
          },
        ]}
        data={items}
      />
    </>
  );
}
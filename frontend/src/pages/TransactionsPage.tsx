import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import SearchBar from "../components/common/SearchBar";

import { getTransactions } from "../services/transactionService";

import type { Transaction } from "../models/Transaction";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  async function loadTransactions() {
    try {
      const result = await getTransactions();
      setTransactions(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions =
    transactions.filter((transaction) => {
      const searchText =
        search.toLowerCase();

      return (
        transaction.itemName
          .toLowerCase()
          .includes(searchText) ||
        transaction.type
          .toLowerCase()
          .includes(searchText)
      );
    });

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  return (
    <>
      <PageHeader
        title="Transactions"
        subtitle="View warehouse stock movements"
      />

      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search transactions..."
        />
      </div>

      <DataTable
        columns={[
          {
            header: "Item",
            accessor: "itemName",
            sortable: true,
          },
          {
            header: "Type",
            accessor: "type",
            sortable: true,
          },
          {
            header: "Quantity",
            accessor: "quantity",
            sortable: true,
          },
          {
            header: "Date",
            render: (transaction) =>
              new Date(
                transaction.date
              ).toLocaleDateString(
                "en-PH",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              ),
            sortable: true,
          },
        ]}
        data={filteredTransactions}
        rowKey={(transaction) => transaction.id}
      />
    </>
  );
}
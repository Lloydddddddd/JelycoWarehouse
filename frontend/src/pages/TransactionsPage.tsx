import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import DataTable from "../components/common/DataTable";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Toast from "../components/common/Toast";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";
import TransactionForm from "../components/transactions/TransactionForm";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";

import type { Transaction } from "../models/Transaction";
import type { CreateTransactionRequest } from "../models/CreateTransactionRequest";

export default function TransactionsPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);

  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);

  const [toastMessage, setToastMessage] =
    useState("");

  const [toastType, setToastType] =
    useState<"success" | "error">("success");

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

  function closeModal() {
    setShowModal(false);
    setEditingTransaction(null);
  }

  function openDeleteDialog(
    transaction: Transaction
  ) {
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  }

  function closeDeleteDialog() {
    setTransactionToDelete(null);
    setShowDeleteDialog(false);
  }

  async function handleCreate(
    transaction: CreateTransactionRequest
  ) {
    try {
      await createTransaction(transaction);

      await loadTransactions();

      closeModal();

      showToast(
        "Transaction added successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to create transaction.",
        "error"
      );
    }
  }

  async function handleUpdate(
    transaction: CreateTransactionRequest
  ) {
    if (!editingTransaction) return;

    try {
      await updateTransaction(
        editingTransaction.id,
        transaction
      );

      await loadTransactions();

      closeModal();

      showToast(
        "Transaction updated successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to update transaction.",
        "error"
      );
    }
  }

  async function confirmDelete() {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(
        transactionToDelete.id
      );

      await loadTransactions();

      closeDeleteDialog();

      showToast(
        "Transaction deleted successfully!",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Failed to delete transaction.",
        "error"
      );
    }
  }

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search transactions..."
        />

        <Button
          onClick={() => {
            setEditingTransaction(null);
            setShowModal(true);
          }}
        >
          + Add Transaction
        </Button>
      </div>

      <Modal
        open={showModal}
        title={
          editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"
        }
        onClose={closeModal}
      >
        <TransactionForm
          transaction={editingTransaction}
          onSubmit={
            editingTransaction
              ? handleUpdate
              : handleCreate
          }
        />
      </Modal>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Transaction"
        message={
          transactionToDelete
            ? `Delete transaction #${transactionToDelete.id}?`
            : ""
        }
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />

      <DataTable
        columns={[
          {
            header: "ID",
            accessor: "id",
            sortable: true,
          },
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
            accessor: "date",
            sortable: true,
          },
          {
            header: "Actions",
            render: (transaction) => (
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <Button
                  onClick={() => {
                    setEditingTransaction(
                      transaction
                    );
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="danger"
                  onClick={() =>
                    openDeleteDialog(
                      transaction
                    )
                  }
                >
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
        data={filteredTransactions}
      />

      <Toast
        visible={toastMessage !== ""}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
}
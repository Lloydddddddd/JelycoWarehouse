import React, { useState } from "react";
import Modal from "../../../Core/Components/Modal";
import Button from "../../../Core/Components/Button";
import Input from "../../../Core/Components/Input";

export default function SupplierFormModal({ isOpen, onClose, supplier, onSaved }) {
  const [formData, setFormData] = useState(supplier || { name: "", email: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill in all required fields.");
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={supplier ? "Edit Supplier" : "Add Supplier"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter supplier name"
        />
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter supplier email"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">{supplier ? "Save Changes" : "Add Supplier"}</Button>
        </div>
      </form>
    </Modal>
  );
}
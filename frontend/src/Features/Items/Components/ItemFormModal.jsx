import React, { useState } from "react";
import Modal from "../../../Core/Components/Modal";
import Button from "../../../Core/Components/Button";
import Input from "../../../Core/Components/Input";

export default function ItemFormModal({ isOpen, onClose, item, onSaved }) {
  const [formData, setFormData] = useState(item || { name: "", category: "", quantity: 0 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.quantity <= 0) {
      alert("Please fill in all required fields with valid values.");
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={item ? "Edit Item" : "Add Item"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter item name"
        />
        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Enter category"
        />
        <Input
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">{item ? "Save Changes" : "Add Item"}</Button>
        </div>
      </form>
    </Modal>
  );
}
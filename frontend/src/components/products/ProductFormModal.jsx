import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
  defaultThreshold = 5,
}) => {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantityOnHand: 0,
    costPrice: '',
    sellingPrice: '',
    lowStockThreshold: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || '',
        description: initialData.description || '',
        quantityOnHand: initialData.quantityOnHand ?? 0,
        costPrice: initialData.costPrice !== undefined ? initialData.costPrice : '',
        sellingPrice: initialData.sellingPrice !== undefined ? initialData.sellingPrice : '',
        lowStockThreshold:
          initialData.lowStockThreshold !== null &&
          initialData.lowStockThreshold !== undefined
            ? initialData.lowStockThreshold
            : '',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        quantityOnHand: 0,
        costPrice: '',
        sellingPrice: '',
        lowStockThreshold: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.sku.trim()) errs.sku = 'SKU is required';

    const qty = Number(formData.quantityOnHand);
    if (formData.quantityOnHand === '' || isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
      errs.quantityOnHand = 'Quantity must be a non-negative integer';
    }

    if (formData.costPrice !== '' && (isNaN(Number(formData.costPrice)) || Number(formData.costPrice) < 0)) {
      errs.costPrice = 'Cost price cannot be negative';
    }

    if (formData.sellingPrice !== '' && (isNaN(Number(formData.sellingPrice)) || Number(formData.sellingPrice) < 0)) {
      errs.sellingPrice = 'Selling price cannot be negative';
    }

    if (
      formData.lowStockThreshold !== '' &&
      (isNaN(Number(formData.lowStockThreshold)) ||
        !Number.isInteger(Number(formData.lowStockThreshold)) ||
        Number(formData.lowStockThreshold) < 0)
    ) {
      errs.lowStockThreshold = 'Threshold must be a non-negative integer';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      description: formData.description.trim(),
      quantityOnHand: Number(formData.quantityOnHand),
      costPrice: formData.costPrice !== '' ? Number(formData.costPrice) : 0,
      sellingPrice: formData.sellingPrice !== '' ? Number(formData.sellingPrice) : 0,
      lowStockThreshold:
        formData.lowStockThreshold !== '' ? Number(formData.lowStockThreshold) : null,
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      description={
        isEditing
          ? 'Update the product details and stock information.'
          : 'Enter product details to add it to your organization inventory.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wireless Mouse"
            required
            error={errors.name}
          />
          <Input
            label="SKU"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g. WM-100"
            required
            error={errors.sku}
            helperText="Unique identifier for this item"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Description <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add brief details or notes about the product..."
            className="block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Quantity on Hand"
            name="quantityOnHand"
            type="number"
            min="0"
            step="1"
            value={formData.quantityOnHand}
            onChange={handleChange}
            required
            error={errors.quantityOnHand}
          />
          <Input
            label="Cost Price ($)"
            name="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.costPrice}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.costPrice}
          />
          <Input
            label="Selling Price ($)"
            name="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={formData.sellingPrice}
            onChange={handleChange}
            placeholder="0.00"
            error={errors.sellingPrice}
          />
        </div>

        <div>
          <Input
            label="Low Stock Alert Threshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            step="1"
            value={formData.lowStockThreshold}
            onChange={handleChange}
            placeholder={`Global default (${defaultThreshold})`}
            helperText={`Leave blank to inherit the organization default (${defaultThreshold} units)`}
            error={errors.lowStockThreshold}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

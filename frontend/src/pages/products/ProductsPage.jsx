import React, { useState, useEffect, useCallback } from 'react';
import { productService } from '../../services/productService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { useDebounce } from '../../hooks/useDebounce';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ProductFilterBar } from '../../components/products/ProductFilterBar';
import { ProductFormModal } from '../../components/products/ProductFormModal';
import { StockAdjustModal } from '../../components/products/StockAdjustModal';
import { Edit2, Trash2, Sliders, AlertCircle, Plus, PackageX } from 'lucide-react';

export const ProductsPage = () => {
  const { organization } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (debouncedSearch.trim()) {
        params.q = debouncedSearch.trim();
      }
      const res = await productService.getProducts(params);
      if (res.success && res.data) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, showError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle Create / Edit
  const handleFormSubmit = async (formData) => {
    try {
      setActionLoading(true);
      if (editingProduct) {
        const res = await productService.updateProduct(editingProduct._id, formData);
        if (res.success) {
          showSuccess(`Product "${formData.name}" updated successfully`);
          setIsFormModalOpen(false);
          setEditingProduct(null);
          await fetchProducts();
        }
      } else {
        const res = await productService.createProduct(formData);
        if (res.success) {
          showSuccess(`Product "${formData.name}" created successfully`);
          setIsFormModalOpen(false);
          await fetchProducts();
        }
      }
    } catch (err) {
      showError(err.message || 'Failed to save product');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Stock Adjust
  const handleAdjustStock = async (productId, deltaUnits, note) => {
    try {
      setActionLoading(true);
      const res = await productService.adjustStock(productId, deltaUnits, note);
      if (res.success) {
        showSuccess(res.message || 'Stock updated');
        setAdjustingProduct(null);
        await fetchProducts();
      }
    } catch (err) {
      showError(err.message || 'Failed to adjust stock');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    try {
      setActionLoading(true);
      const res = await productService.deleteProduct(deletingProduct._id);
      if (res.success) {
        showSuccess(`Product "${deletingProduct.name}" deleted successfully`);
        setDeletingProduct(null);
        await fetchProducts();
      }
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const tableHeaders = [
    { label: 'Name & Details', className: 'w-1/3' },
    { label: 'SKU', className: 'w-1/6' },
    { label: 'Stock on Hand', className: 'w-1/6 text-center' },
    { label: 'Status', className: 'w-1/6 text-center' },
    { label: 'Selling Price', className: 'w-1/6 text-right' },
    { label: 'Actions', className: 'w-1/6 text-right' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Title Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Products & Inventory
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage product catalog, monitor stock availability, and adjust quantities
        </p>
      </div>

      {/* Filter and Action Bar */}
      <ProductFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={products.length}
        onAddClick={() => {
          setEditingProduct(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* Main Table Content */}
      {loading ? (
        <Spinner size="lg" className="h-64" />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            {searchQuery ? <PackageX className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            {searchQuery ? 'No products match your search' : 'No products in inventory yet'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No items found matching "${searchQuery}". Try searching by another keyword or SKU.`
              : 'Add your first product to begin tracking quantities, prices, and low-stock indicators.'}
          </p>
          <div className="mt-5">
            {searchQuery ? (
              <Button variant="secondary" onClick={() => setSearchQuery('')}>
                Clear Search Filter
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={Plus}
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormModalOpen(true);
                }}
              >
                Add Your First Product
              </Button>
            )}
          </div>
        </div>
      ) : (
        <Table headers={tableHeaders}>
          {products.map((prod) => (
            <tr key={prod._id} className="hover:bg-slate-50/70 transition-colors">
              {/* Name & Description */}
              <td className="px-5 py-4">
                <div className="font-semibold text-slate-900">{prod.name}</div>
                {prod.description && (
                  <div className="text-xs text-slate-500 truncate max-w-xs mt-0.5">
                    {prod.description}
                  </div>
                )}
              </td>

              {/* SKU */}
              <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-700">
                {prod.sku}
              </td>

              {/* Quantity */}
              <td className="px-5 py-4 text-center">
                <span className="font-bold text-sm text-slate-900">
                  {prod.quantityOnHand}
                </span>{' '}
                <span className="text-xs text-slate-500">units</span>
              </td>

              {/* Status Badge */}
              <td className="px-5 py-4 text-center">
                {prod.isLowStock ? (
                  <Badge variant="danger" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Low Stock (≤ {prod.effectiveThreshold})
                  </Badge>
                ) : (
                  <Badge variant="success">In Stock</Badge>
                )}
              </td>

              {/* Selling Price */}
              <td className="px-5 py-4 text-right font-medium text-slate-900">
                ${Number(prod.sellingPrice || 0).toFixed(2)}
              </td>

              {/* Actions */}
              <td className="px-5 py-4 text-right">
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <button
                    title="Quick Adjust Stock"
                    onClick={() => setAdjustingProduct(prod)}
                    className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                  <button
                    title="Edit Product"
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsFormModalOpen(true);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    title="Delete Product"
                    onClick={() => setDeletingProduct(prod)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}

      {/* Product Create / Edit Modal */}
      {isFormModalOpen && (
        <ProductFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingProduct}
          isLoading={actionLoading}
          defaultThreshold={organization?.defaultLowStockThreshold || 5}
        />
      )}

      {/* Quick Stock Adjust Modal */}
      {adjustingProduct && (
        <StockAdjustModal
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          product={adjustingProduct}
          onConfirm={handleAdjustStock}
          isLoading={actionLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingProduct && (
        <ConfirmDialog
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete ${deletingProduct.name}?`}
          message={`Are you sure you want to delete product "${deletingProduct.name}" (SKU: ${deletingProduct.sku})? This cannot be undone.`}
          confirmText="Yes, Delete Product"
          isLoading={actionLoading}
          variant="danger"
        />
      )}
    </div>
  );
};

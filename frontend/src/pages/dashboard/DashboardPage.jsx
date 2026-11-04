import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { productService } from '../../services/productService';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Table } from '../../components/common/Table';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { StockAdjustModal } from '../../components/products/StockAdjustModal';
import {
  Package,
  Layers,
  AlertTriangle,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProductForAdjust, setSelectedProductForAdjust] = useState(null);
  const [adjusting, setAdjusting] = useState(false);

  const { showError, showSuccess } = useNotification();

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getOverview();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      showError(err.message || 'Failed to load dashboard overview');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStockAdjustment = async (productId, deltaUnits, note) => {
    try {
      setAdjusting(true);
      const res = await productService.adjustStock(productId, deltaUnits, note);
      if (res.success) {
        showSuccess(res.message || 'Stock adjusted successfully');
        setSelectedProductForAdjust(null);
        await fetchDashboardData();
      }
    } catch (err) {
      showError(err.message || 'Failed to adjust stock');
    } finally {
      setAdjusting(false);
    }
  };

  if (loading && !data) {
    return <Spinner size="lg" className="h-96" />;
  }

  const { summary, lowStockProducts = [] } = data || {
    summary: { totalProducts: 0, totalStock: 0, lowStockCount: 0, defaultLowStockThreshold: 5 },
    lowStockProducts: [],
  };

  const tableHeaders = [
    { label: 'Product Name', className: 'w-2/5' },
    { label: 'SKU', className: 'w-1/5' },
    { label: 'Qty on Hand', className: 'w-1/6 text-center' },
    { label: 'Alert Threshold', className: 'w-1/6 text-center' },
    { label: 'Action', className: 'w-1/6 text-right' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Live overview of current stock levels and inventory health
          </p>
        </div>
        <Link to="/products">
          <Button variant="secondary" icon={ArrowUpRight}>
            View All Products
          </Button>
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Products */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Products
            </span>
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{summary.totalProducts}</div>
            <p className="mt-1 text-xs text-slate-500">Distinct catalog items</p>
          </div>
        </div>

        {/* Total Units on Hand */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Units on Hand
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-bold text-slate-900">{summary.totalStock}</div>
            <p className="mt-1 text-xs text-slate-500">Total units in stock</p>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          className={`rounded-xl border p-5 shadow-sm transition-colors ${
            summary.lowStockCount > 0
              ? 'bg-rose-50/50 border-rose-200/80'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                summary.lowStockCount > 0 ? 'text-rose-700' : 'text-slate-500'
              }`}
            >
              Low Stock Items
            </span>
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                summary.lowStockCount > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div
              className={`text-3xl font-bold ${
                summary.lowStockCount > 0 ? 'text-rose-900' : 'text-slate-900'
              }`}
            >
              {summary.lowStockCount}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Needs restock (Threshold: ≤ {summary.defaultLowStockThreshold} default)
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert Section */}
      <Card
        title="Low Stock Items"
        subtitle="Products that have reached or dropped below their stock reorder threshold"
        action={
          <Badge
            variant={lowStockProducts.length > 0 ? 'danger' : 'success'}
            className="text-xs"
          >
            {lowStockProducts.length > 0
              ? `${lowStockProducts.length} Items Require Attention`
              : 'Inventory Healthy'}
          </Badge>
        }
      >
        {lowStockProducts.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">
              All inventory levels are sufficient!
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              None of your products are currently below their low stock threshold.
            </p>
          </div>
        ) : (
          <Table headers={tableHeaders}>
            {lowStockProducts.map((prod) => (
              <tr key={prod._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-900">{prod.name}</td>
                <td className="px-5 py-3.5 font-mono text-xs text-slate-600 font-semibold">
                  {prod.sku}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded font-bold text-xs bg-rose-100 text-rose-800">
                    {prod.quantityOnHand} units
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center text-xs text-slate-500">
                  ≤ {prod.effectiveThreshold}{' '}
                  {prod.lowStockThreshold === null ? (
                    <span className="text-[10px] text-slate-400 font-normal">(org default)</span>
                  ) : (
                    <span className="text-[10px] text-brand-600 font-normal">(custom)</span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={Sliders}
                    onClick={() => setSelectedProductForAdjust(prod)}
                  >
                    Adjust
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Stock Adjust Modal */}
      {selectedProductForAdjust && (
        <StockAdjustModal
          isOpen={!!selectedProductForAdjust}
          onClose={() => setSelectedProductForAdjust(null)}
          product={selectedProductForAdjust}
          onConfirm={handleStockAdjustment}
          isLoading={adjusting}
        />
      )}
    </div>
  );
};

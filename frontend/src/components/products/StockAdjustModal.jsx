import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PlusCircle, MinusCircle } from 'lucide-react';

export const StockAdjustModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
  isLoading = false,
}) => {
  const [deltaUnits, setDeltaUnits] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDeltaUnits('');
    setNote('');
    setError('');
  }, [isOpen]);

  if (!product) return null;

  const currentQty = product.quantityOnHand ?? 0;
  const deltaNum = Number(deltaUnits) || 0;
  const projectedQty = currentQty + deltaNum;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deltaUnits || deltaNum === 0) {
      setError('Please enter a non-zero adjustment amount (e.g. +5 or -2)');
      return;
    }
    if (projectedQty < 0) {
      setError(`Cannot reduce below 0. Maximum reduction possible is -${currentQty}.`);
      return;
    }

    onConfirm(product._id, deltaNum, note);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Adjust Stock: ${product.name}`}
      description={`SKU: ${product.sku} | Current Quantity: ${currentQty} units`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDeltaUnits('-1');
              setError('');
            }}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-1"
          >
            <MinusCircle className="w-3.5 h-3.5 text-rose-500" /> -1 Unit
          </button>
          <button
            type="button"
            onClick={() => {
              setDeltaUnits('+5');
              setError('');
            }}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> +5 Units
          </button>
          <button
            type="button"
            onClick={() => {
              setDeltaUnits('+10');
              setError('');
            }}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 flex items-center justify-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-emerald-500" /> +10 Units
          </button>
        </div>

        <Input
          label="Adjustment Amount (+/-)"
          type="number"
          step="1"
          value={deltaUnits}
          onChange={(e) => {
            setDeltaUnits(e.target.value);
            setError('');
          }}
          placeholder="e.g. 5 or -3"
          required
          error={error}
        />

        {deltaUnits !== '' && !error && (
          <div
            className={`p-3 rounded-lg text-xs font-medium border ${
              projectedQty < 0
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            Projected stock: <span className="font-bold">{projectedQty} units</span> (was {currentQty})
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Reason / Note <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Restock shipment or damaged item returned"
            className="block w-full rounded-lg border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={projectedQty < 0 || deltaNum === 0}
          >
            Update Stock
          </Button>
        </div>
      </form>
    </Modal>
  );
};

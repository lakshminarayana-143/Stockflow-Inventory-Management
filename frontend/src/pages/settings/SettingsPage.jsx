import React, { useState, useEffect, useCallback } from 'react';
import { settingsService } from '../../services/settingsService';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Sliders, Save, Building } from 'lucide-react';

export const SettingsPage = () => {
  const { updateOrganizationState } = useAuth();
  const { showError, showSuccess } = useNotification();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [defaultThreshold, setDefaultThreshold] = useState('5');
  const [error, setError] = useState('');

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await settingsService.getSettings();
      if (res.success && res.data) {
        setName(res.data.name || '');
        setDefaultThreshold(
          res.data.defaultLowStockThreshold !== undefined
            ? String(res.data.defaultLowStockThreshold)
            : '5'
        );
      }
    } catch (err) {
      showError(err.message || 'Failed to load organization settings');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const thresholdNum = Number(defaultThreshold);
    if (defaultThreshold === '' || isNaN(thresholdNum) || !Number.isInteger(thresholdNum) || thresholdNum < 0) {
      setError('Threshold must be a non-negative integer (e.g. 5)');
      return;
    }

    try {
      setSaving(true);
      const res = await settingsService.updateSettings({
        name: name.trim(),
        defaultLowStockThreshold: thresholdNum,
      });

      if (res.success && res.data) {
        showSuccess('Settings updated successfully');
        updateOrganizationState(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="h-64" />;
  }

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Organization Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your organization name and global low-stock inventory thresholds
        </p>
      </div>

      <Card
        title="Global Thresholds & Profile"
        subtitle="Configure the system baseline for stock alerts across your inventory"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <Input
            label="Organization Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Store / Acme Corp"
            required
            helperText="The business name displayed on your dashboard and headers"
          />

          <Input
            label="Default Low Stock Threshold"
            name="defaultLowStockThreshold"
            type="number"
            min="0"
            step="1"
            value={defaultThreshold}
            onChange={(e) => {
              setDefaultThreshold(e.target.value);
              setError('');
            }}
            required
            error={error}
            helperText="If a product does not specify its own custom threshold, this value triggers low-stock alerts on the dashboard and product catalog (PRD FR-7)."
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={saving}
              icon={Save}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


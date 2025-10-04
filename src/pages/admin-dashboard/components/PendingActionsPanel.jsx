import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getTechnicians, approveTechnician, rejectTechnician } from '../../../utils/api';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from '../../../features/notifications/notificationsSlice';

const PendingActionsPanel = () => {
  const notify = useDispatch();
  const [loading, setLoading] = useState(false);
  const [pendingTechs, setPendingTechs] = useState([]);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const data = await getTechnicians({ status: 'pending' });
      setPendingTechs(data || []);
    } catch (e) {
      setPendingTechs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const onApprove = async (id) => {
    try {
      await approveTechnician(id);
      notify(showSuccess('Technician approved'));
      fetchPending();
    } catch (e) {
      notify(showError('Failed to approve technician'));
    }
  };

  const onReject = async (id) => {
    try {
      await rejectTechnician(id);
      notify(showSuccess('Technician rejected'));
      fetchPending();
    } catch (e) {
      notify(showError('Failed to reject technician'));
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-subtle">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pending Technician Approvals</h3>
          <span className="text-sm text-muted-foreground">
            {pendingTechs?.length} pending
          </span>
        </div>
      </div>
      <div className="p-6">
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {pendingTechs?.map((t) => (
            <div key={t.id} className="flex items-center justify-between rounded-md border bg-white p-3">
              <div>
                <div className="font-medium text-foreground">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.service}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="xs" onClick={() => onReject(t.id)} iconName="X" iconPosition="left">Reject</Button>
                <Button variant="default" size="xs" onClick={() => onApprove(t.id)} iconName="Check" iconPosition="left">Approve</Button>
              </div>
            </div>
          ))}
          {!loading && pendingTechs?.length === 0 && (
            <div className="rounded-md border bg-white p-4 text-sm text-slate-600">No pending technicians.</div>
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" fullWidth onClick={fetchPending} iconName="RefreshCw" iconPosition="left">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PendingActionsPanel;
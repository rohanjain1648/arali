import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Company, Contact, User } from '../types';
import { api } from '../services/api';
import { X, Sparkles, Building2, UserPlus, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialCompanyId?: string;
  initialContactId?: string;
}

export const AssignModal: React.FC<AssignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCompanyId,
  initialContactId,
}) => {
  const { users, activeUser } = useUser();

  const [entityType, setEntityType] = useState<'company' | 'contact'>(
    initialContactId ? 'contact' : 'company'
  );
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(initialCompanyId || '');
  const [selectedContactId, setSelectedContactId] = useState<string>(initialContactId || '');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [role, setRole] = useState<string>('Account Owner');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccessMessage(null);
      
      // Pre-select defaults
      if (initialCompanyId) {
        setEntityType('company');
        setSelectedCompanyId(initialCompanyId);
      } else if (initialContactId) {
        setEntityType('contact');
        setSelectedContactId(initialContactId);
      }

      // Fetch options
      api.getCompanies().then(setCompanies).catch(console.error);
      api.getContacts().then(setContacts).catch(console.error);
    }
  }, [isOpen, initialCompanyId, initialContactId]);

  // Set default target user if none selected
  useEffect(() => {
    if (users.length > 0 && !selectedUserId) {
      // Pick first non-admin or first user
      const defaultAssignee = users.find((u) => u.id !== activeUser?.id) || users[0];
      setSelectedUserId(defaultAssignee.id);
    }
  }, [users, activeUser, selectedUserId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;
    if (!selectedUserId) {
      setError('Please select a user to assign.');
      return;
    }
    if (entityType === 'company' && !selectedCompanyId) {
      setError('Please select a company.');
      return;
    }
    if (entityType === 'contact' && !selectedContactId) {
      setError('Please select a contact.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const assignedTargetUser = users.find((u) => u.id === selectedUserId);

      await api.createAssignment({
        userId: selectedUserId,
        assignedByUserId: activeUser.id,
        role: role.trim() || 'Account Executive',
        companyId: entityType === 'company' ? selectedCompanyId : undefined,
        contactId: entityType === 'contact' ? selectedContactId : undefined,
      });

      setSuccessMessage(
        `Assignment created! Live notification dispatched instantly to ${assignedTargetUser?.name}.`
      );

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  const presetRoles = [
    'Account Owner',
    'Lead Account Manager',
    'Technical Account Manager',
    'Customer Success Lead',
    'Sales Representative',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Create CRM Assignment</h3>
              <p className="text-xs text-slate-400">Assign company/contact & trigger live notification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Entity Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Select Entity Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEntityType('company')}
                className={`p-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                  entityType === 'company'
                    ? 'bg-brand-600/30 border-brand-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Company
              </button>

              <button
                type="button"
                onClick={() => setEntityType('contact')}
                className={`p-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                  entityType === 'contact'
                    ? 'bg-brand-600/30 border-brand-500 text-white shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                Contact
              </button>
            </div>
          </div>

          {/* Select Specific Company or Contact */}
          {entityType === 'company' ? (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Choose Company
              </label>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.industry})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Choose Contact
              </label>
              <select
                value={selectedContactId}
                onChange={(e) => setSelectedContactId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              >
                <option value="">-- Select Contact --</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.firstName} {c.lastName} ({c.title || 'Contact'}) {c.company ? `• ${c.company.name}` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Assignee Target User */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              3. Assign to User (Target Recipient)
            </label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            >
              <option value="">-- Select Target User --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role} - {u.email})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-brand-400 mt-1 font-medium">
              ⚡ This user will receive a real-time targeted Socket.IO notification immediately.
            </p>
          </div>

          {/* Role Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              4. Assignment Role / Ownership Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Account Executive"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none mb-2"
            />
            <div className="flex flex-wrap gap-1.5">
              {presetRoles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-[11px] font-medium text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {loading ? 'Creating & Dispatching...' : 'Assign & Dispatch Notification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Contact, Company } from '../types';
import { api } from '../services/api';
import {
  Users,
  Sparkles,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  UserCheck,
} from 'lucide-react';

interface ContactsPageProps {
  onOpenAssignModal: (companyId?: string, contactId?: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onOpenAssignModal }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create Contact modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContact, setNewContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    companyId: '',
  });

  const loadData = async () => {
    try {
      const [contData, compData] = await Promise.all([
        api.getContacts(),
        api.getCompanies(),
      ]);
      setContacts(contData);
      setCompanies(compData);
    } catch (err) {
      console.error('Failed to load contacts data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.firstName || !newContact.email) return;
    try {
      await api.createContact({
        ...newContact,
        companyId: newContact.companyId || undefined,
      });
      setShowCreateModal(false);
      setNewContact({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        title: '',
        companyId: '',
      });
      loadData();
    } catch (err) {
      console.error('Failed to create contact:', err);
    }
  };

  const filteredContacts = contacts.filter(
    (c) =>
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.title && c.title.toLowerCase().includes(search.toLowerCase())) ||
      (c.company && c.company.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-400" />
            Contact Directory & Relations
          </h2>
          <p className="text-xs text-slate-400">Manage individual contacts and assign dedicated account specialists</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, title, company..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-brand-500 outline-none"
        />
      </div>

      {/* Contacts List Table / Grid */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60">
        {filteredContacts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No contacts match your query</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
            >
              {/* Contact Info */}
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-sm shrink-0">
                  {contact.firstName.charAt(0)}
                  {contact.lastName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">
                      {contact.firstName} {contact.lastName}
                    </h3>
                    {contact.title && (
                      <span className="text-[10px] px-2 py-0.5 font-bold rounded bg-slate-800 text-slate-300">
                        {contact.title}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {contact.phone}
                      </span>
                    )}
                    {contact.company && (
                      <span className="flex items-center gap-1 text-brand-400 font-medium">
                        <Building2 className="w-3.5 h-3.5" />
                        {contact.company.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Assignment Badge & Button */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                {contact.assignments && contact.assignments.length > 0 ? (
                  <div className="flex items-center gap-1.5">
                    {contact.assignments.map((a) => (
                      <div
                        key={a.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] flex items-center gap-1.5"
                        title={`Assigned to ${a.user.name} as ${a.role}`}
                      >
                        <UserCheck className="w-3 h-3 text-emerald-400" />
                        <span className="font-semibold text-slate-200">{a.user.name}</span>
                        <span className="text-[10px] text-brand-400 font-bold">({a.role})</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 italic hidden sm:inline">Unassigned</span>
                )}

                <button
                  onClick={() => onOpenAssignModal(undefined, contact.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Assign User
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Contact Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-700">
            <h3 className="text-base font-bold text-white mb-4">Add New Contact</h3>
            <form onSubmit={handleCreateContact} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newContact.firstName}
                    onChange={(e) => setNewContact({ ...newContact, firstName: e.target.value })}
                    placeholder="John"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newContact.lastName}
                    onChange={(e) => setNewContact({ ...newContact, lastName: e.target.value })}
                    placeholder="Doe"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="john.doe@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={newContact.title}
                    onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                    placeholder="e.g. VP of Ops"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Company</label>
                  <select
                    value={newContact.companyId}
                    onChange={(e) => setNewContact({ ...newContact, companyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  >
                    <option value="">-- None --</option>
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 font-bold text-white shadow-md shadow-brand-600/30"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Company } from '../types';
import { api } from '../services/api';
import {
  Building2,
  Sparkles,
  Search,
  Plus,
  Globe,
  Phone,
  UserCheck,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface CompaniesPageProps {
  onOpenAssignModal: (companyId: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ onOpenAssignModal }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Create Company modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompany, setNewCompany] = useState<{
    name: string;
    industry: string;
    annualRevenue: number;
    status: 'LEAD' | 'PROSPECT' | 'CUSTOMER' | 'CHURNED';
    website: string;
    phone: string;
  }>({
    name: '',
    industry: 'Enterprise Software',
    annualRevenue: 5000000,
    status: 'PROSPECT',
    website: '',
    phone: '',
  });

  const loadCompanies = async () => {
    try {
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name) return;
    try {
      await api.createCompany(newCompany);
      setShowCreateModal(false);
      setNewCompany({
        name: '',
        industry: 'Enterprise Software',
        annualRevenue: 5000000,
        status: 'PROSPECT',
        website: '',
        phone: '',
      });
      loadCompanies();
    } catch (err) {
      console.error('Error creating company:', err);
    }
  };

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-brand-400" />
            Company Directory & Ownership
          </h2>
          <p className="text-xs text-slate-400">Manage accounts and assign team members with specific roles</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Company
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
          placeholder="Search by company name, industry, status..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:border-brand-500 outline-none"
        />
      </div>

      {/* Companies Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white group-hover:text-brand-300 transition-colors">
                      {company.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{company.industry}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-0.5 font-extrabold uppercase rounded-full border ${
                    company.status === 'CUSTOMER'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : company.status === 'PROSPECT'
                      ? 'bg-brand-500/10 text-brand-400 border-brand-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {company.status}
                </span>
              </div>

              {/* Company Metrics */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/40 border border-slate-900 mb-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Annual Revenue</span>
                  <span className="font-bold text-slate-200">
                    ${company.annualRevenue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Contacts Count</span>
                  <span className="font-bold text-slate-200">
                    {company.contacts?.length || 0} Contacts
                  </span>
                </div>
              </div>

              {/* Assigned Users Section */}
              <div className="mb-4">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-brand-400" />
                  Assigned Team Members ({company.assignments?.length || 0})
                </span>

                {company.assignments && company.assignments.length > 0 ? (
                  <div className="space-y-1.5">
                    {company.assignments.map((assign) => (
                      <div
                        key={assign.id}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={assign.user.avatarUrl || 'https://via.placeholder.com/24'}
                            alt={assign.user.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="font-semibold text-slate-200">{assign.user.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 font-medium rounded bg-brand-500/10 text-brand-300 border border-brand-500/30">
                          {assign.role}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No assigned owners yet</p>
                )}
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </a>
              ) : (
                <span />
              )}

              <button
                onClick={() => onOpenAssignModal(company.id)}
                className="px-3 py-1.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Assign User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-slate-700">
            <h3 className="text-base font-bold text-white mb-4">Add New Company</h3>
            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="e.g. Nexus Innovations"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Annual Revenue ($)</label>
                  <input
                    type="number"
                    value={newCompany.annualRevenue}
                    onChange={(e) => setNewCompany({ ...newCompany, annualRevenue: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={newCompany.status}
                    onChange={(e) => setNewCompany({ ...newCompany, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-brand-500"
                  >
                    <option value="LEAD">LEAD</option>
                    <option value="PROSPECT">PROSPECT</option>
                    <option value="CUSTOMER">CUSTOMER</option>
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

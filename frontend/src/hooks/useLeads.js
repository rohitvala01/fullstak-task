import { useCallback, useEffect, useState } from 'react';
import * as leadApi from '../api/leadApi';

const EMPTY_PAGINATION = { page: 1, limit: 10, total: 0, totalPages: 1 };
const DEFAULT_LIMIT = 10;
const STATUSES = ['New', 'Contacted', 'Converted'];

const readFiltersFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const status = params.get('status');
  const page = parseInt(params.get('page'), 10);
  const limit = parseInt(params.get('limit'), 10);
  return {
    search: params.get('search') || '',
    status: STATUSES.includes(status) ? status : '',
    page: page > 0 ? page : 1,
    limit: limit > 0 ? Math.min(limit, 100) : DEFAULT_LIMIT,
  };
};

const writeFiltersToUrl = (filters, mode) => {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set('search', filters.search.trim());
  if (filters.status) params.set('status', filters.status);
  if (filters.page > 1) params.set('page', filters.page);
  if (filters.limit !== DEFAULT_LIMIT) params.set('limit', filters.limit);
  const query = params.toString();
  const url = window.location.pathname + (query ? `?${query}` : '');
  window.history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
};

export default function useLeads() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [filters, setFilters] = useState(readFiltersFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        ...(filters.search.trim() && { search: filters.search.trim() }),
        ...(filters.status && { status: filters.status }),
      };
      const { data, pagination: p } = await leadApi.fetchLeads(params);
      setLeads(data);
      setPagination(p);
    } catch (err) {
      setError(leadApi.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(loadLeads, 300);
    return () => clearTimeout(timer);
  }, [loadLeads]);

  useEffect(() => {
    const onPopState = () => setFilters(readFiltersFromUrl());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const applyFilters = (next, mode) => {
    writeFiltersToUrl(next, mode);
    setFilters(next);
  };

  const updateFilters = (changes) =>
    applyFilters({ ...filters, page: 1, ...changes }, 'search' in changes ? 'replace' : 'push');
  const setPage = (page) => applyFilters({ ...filters, page }, 'push');

  const addLead = async (lead) => {
    setError('');
    try {
      await leadApi.createLead(lead);
      if (filters.page !== 1) setPage(1);
      else await loadLeads();
      return true;
    } catch (err) {
      setError(leadApi.getErrorMessage(err));
      return false;
    }
  };

  const changeStatus = async (id, status) => {
    setError('');
    try {
      const updated = await leadApi.updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l._id === id ? updated : l)));
    } catch (err) {
      setError(leadApi.getErrorMessage(err));
    }
  };

  const removeLead = async (id) => {
    setError('');
    try {
      await leadApi.deleteLead(id);
      if (leads.length === 1 && filters.page > 1) setPage(filters.page - 1);
      else await loadLeads();
    } catch (err) {
      setError(leadApi.getErrorMessage(err));
    }
  };

  return {
    leads,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    setPage,
    addLead,
    changeStatus,
    removeLead,
  };
}

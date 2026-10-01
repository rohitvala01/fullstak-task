import useLeads from './hooks/useLeads';
import LeadForm from './components/LeadForm';
import Filters from './components/Filters';
import LeadTable from './components/LeadTable';
import Pagination from './components/Pagination';

export default function App() {
  const {
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
  } = useLeads();

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-center text-2xl font-bold">Lead Management</h1>

      <LeadForm onAdd={addLead} />

      {error && (
        <div className="mb-4 rounded bg-red-100 p-2 text-red-700" role="alert">
          {error}
        </div>
      )}

      <Filters filters={filters} onChange={updateFilters} />

      {loading ? (
        <p className="py-6 text-center text-gray-500">Loading leads...</p>
      ) : (
        <LeadTable leads={leads} onStatusChange={changeStatus} onDelete={removeLead} />
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />
    </main>
  );
}

export default function Filters({ filters, onChange }) {
  return (
    <div className="mb-4 flex gap-2">
      <input
        type="search"
        placeholder="Search name, email or phone"
        value={filters.search}
        onChange={(e) => onChange({ search: e.target.value })}
        className="flex-1 rounded border border-gray-300 p-2"
      />
      <select
        value={filters.status}
        onChange={(e) => onChange({ status: e.target.value })}
        className="rounded border border-gray-300 p-2"
      >
        <option value="">All statuses</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Converted">Converted</option>
      </select>
    </div>
  );
}

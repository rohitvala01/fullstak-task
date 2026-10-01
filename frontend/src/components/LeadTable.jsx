const NEXT_STATUS = { New: 'Contacted', Contacted: 'Converted' };

export default function LeadTable({ leads, onStatusChange, onDelete }) {
  if (leads.length === 0) return <p className="py-6 text-center text-gray-500">No leads found.</p>;

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b bg-gray-100">
          <th className="p-2">Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Status</th>
          <th className="p-2">Action</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => {
          const next = NEXT_STATUS[lead.status];
          return (
            <tr key={lead._id} className="border-b">
              <td className="p-2">{lead.name}</td>
              <td className="p-2">{lead.email}</td>
              <td className="p-2">{lead.status}</td>
              <td className="flex gap-2 p-2">
                {next && (
                  <button
                    onClick={() => onStatusChange(lead._id, next)}
                    className="rounded border border-gray-300 px-2 py-1"
                  >
                    {next}
                  </button>
                )}
                <button
                  onClick={() => onDelete(lead._id)}
                  className="rounded bg-red-600 px-2 py-1 text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages, total } = pagination;
  if (total === 0) return null;

  const btn = 'rounded border border-gray-300 px-3 py-1 disabled:opacity-50';

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <button className={btn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <span>
        Page {page} of {totalPages} ({total} leads)
      </span>
      <button className={btn} disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

import React from "react";

export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {totalPages} • {total} items
      </div>
      <div className="flex gap-2">
        <button className="btn" onClick={() => onPageChange(1)} disabled={page === 1}>First</button>
        <button className="btn" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</button>
        <button className="btn" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</button>
        <button className="btn" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>Last</button>
      </div>
    </div>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";

export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {totalPages} • {total} items
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page === 1}>First</Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page === 1}>Prev</Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>Next</Button>
        <Button variant="outline" size="sm" onClick={() => onPageChange(totalPages)} disabled={page === totalPages}>Last</Button>
      </div>
    </div>
  );
}

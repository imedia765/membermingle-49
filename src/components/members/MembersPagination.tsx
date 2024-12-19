import { Button } from "@/components/ui/button";

interface MembersPaginationProps {
  page: number;
  totalPages: number;
  isLoading: boolean;
  setPage: (page: number) => void;
}

export function MembersPagination({ page, totalPages, isLoading, setPage }: MembersPaginationProps) {
  return (
    <div className="flex justify-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={() => setPage(Math.max(0, page - 1))}
        disabled={page === 0 || isLoading}
      >
        Previous
      </Button>
      <span className="flex items-center px-4">
        Page {page + 1} of {totalPages || 1}
      </span>
      <Button
        variant="outline"
        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
        disabled={page >= (totalPages - 1) || isLoading}
      >
        Next
      </Button>
    </div>
  );
}
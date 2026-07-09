interface PaginationProps {
  page: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, totalPages, isFirst, isLast, onPrevious, onNext }: PaginationProps) {
  return (
    <div className="pagination">
      <button type="button" onClick={onPrevious} disabled={isFirst}>
        Anterior
      </button>
      <span>
        Pagina {totalPages === 0 ? 0 : page + 1} de {totalPages}
      </span>
      <button type="button" onClick={onNext} disabled={isLast}>
        Siguiente
      </button>
    </div>
  );
}

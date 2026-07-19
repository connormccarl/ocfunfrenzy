import { getClasses } from "../";

type PaginationProps = {
    isLoading: boolean;
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
    line?: boolean;
    top?: boolean;
};

export default function Pagination({ isLoading, page, totalPages, total, onPageChange, line = false, top = false }: PaginationProps) {
    if (isLoading || total === 0 || total === null || total === undefined) {
        return null;
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={getClasses(["flex flex-col items-center justify-between gap-3 border-gray-200 sm:flex-row", line ? top ? "border-b pb-3" : "border-t pt-3" : ""])}>
            <div className={getClasses(["text-sm text-gray-600", top ? "mt-1" : ""])}>
                Page <select
                        value={page}
                        onChange={(event) => onPageChange(Number(event.target.value))}
                     >
                        {pages.map((curr) => (
                            <option key={curr} value={curr}>
                                {curr}
                            </option>
                        ))}
                     </select> of {totalPages} ({total} total)
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
                <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    className="h-10 flex-1 rounded border border-gray-300 px-4 text-sm font-medium disabled:opacity-40 sm:flex-none"
                >
                    Previous
                </button>
                <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className="h-10 flex-1 rounded border border-gray-300 px-4 text-sm font-medium disabled:opacity-40 sm:flex-none"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

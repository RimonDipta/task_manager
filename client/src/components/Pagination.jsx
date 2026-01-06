import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

const Pagination = () => {
  const { page, pages, setPage } = useContext(TaskContext);

  if (pages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      <span className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-900">{page}</span> of <span className="font-medium text-slate-900">{pages}</span>
      </span>

      <button
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;

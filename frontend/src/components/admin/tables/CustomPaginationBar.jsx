import React from "react"

const CustomPaginationBar = ({ events }) => {
  const { page, totalPages, setPage, limit, setLimit } = events

  return (
    <div className="flex justify-between items-center mt-3">
      <div className="flex gap-2">
        <button className="btn btn-sm" onClick={() => setPage(1)}>
          First
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}>
          Prev
        </button>
        <button
          className="btn btn-sm"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}>
          Next
        </button>
        <button className="btn btn-sm" onClick={() => setPage(totalPages)}>
          Last
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span>
          Page {page} / {totalPages}
        </span>

        <select
          className="select select-sm"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value))
            setPage(1)
          }}>
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default CustomPaginationBar

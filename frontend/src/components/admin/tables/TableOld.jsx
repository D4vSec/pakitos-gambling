import React from "react"
import TableRow from "./TableRow"

const TableOld = ({ data = [], columns = [], renderActions }) => {
  return (
    <div className="overflow-x-auto bg-base-200 p-2 rounded-lg">
      <table className="table table-zebra">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {renderActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                columns={columns}
                renderActions={renderActions}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableOld

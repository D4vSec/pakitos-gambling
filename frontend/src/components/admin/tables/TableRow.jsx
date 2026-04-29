import React from "react"

const TableRow = ({ item, columns, renderActions }) => {
  return (
    <tr>
      {columns.map((col) => (
        <td key={col.key}>{col.render ? col.render(item) : item[col.key]}</td>
      ))}

      {renderActions && <td>{renderActions(item)}</td>}
    </tr>
  )
}

export default TableRow

import React from "react"
import Actions from "./Actions"

const UserTableRow = ({ user }) => {
  return (
    <tr>
      <th>{user.username}</th>
      <td>{user.email}</td>
      <td>{user.balance}</td>
      <td>{user.role}</td>
      <td>
        <Actions id={user.id} />
      </td>
    </tr>
  )
}

export default UserTableRow

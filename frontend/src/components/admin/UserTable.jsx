import React from "react"
import UserTableRow from "./UserTableRow"

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-base-200 p-2 rounded-lg">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => <UserTableRow key={user.id} user={user} />)
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable

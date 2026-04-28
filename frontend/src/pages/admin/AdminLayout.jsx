import { Outlet } from "react-router-dom"
import AdminProvider from "@/providers/AdminProvider"

const AdminLayout = () => {
  return (
    <AdminProvider>
      <div>
        <Outlet />
      </div>
    </AdminProvider>
  )
}

export default AdminLayout

import { Outlet } from "react-router-dom"
import AdminProvider from "@/providers/AdminProvider"
import AdminSectionNav from "@/components/admin/components/AdminSectionNav"
import GradientBg from "@/components/layout/GradientBg"

const AdminLayout = () => {
  return (
    <AdminProvider>
      <GradientBg>
        <div className="flex w-full min-w-0 flex-col gap-12">
          <AdminSectionNav />
          <Outlet />
        </div>
      </GradientBg>
    </AdminProvider>
  )
}

export default AdminLayout

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";

const AdminLayout = () => {
  return (
    <SidebarProvider>
      <ScrollToTop />
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          <SidebarTrigger />
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;

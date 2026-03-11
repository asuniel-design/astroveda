import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-[260px] max-w-7xl mx-auto px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}

import { AdminSidebar } from "./sidebar";

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#F0E6D8] ${className ?? ""}`}
    />
  );
}

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FAF6F0] border-b border-[#DCC8B0] px-6 py-3 flex items-center justify-between">
          <div />
          <Shimmer className="h-4 w-40" />
        </header>
        <main className="flex-1 p-6 bg-[#FAF6F0]">
          <Shimmer className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Shimmer className="h-24 rounded-2xl" />
            <Shimmer className="h-24 rounded-2xl" />
            <Shimmer className="h-24 rounded-2xl" />
          </div>
          <Shimmer className="h-64 rounded-2xl" />
        </main>
      </div>
    </div>
  );
}

export function TablePageSkeleton() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-[#FAF6F0] border-b border-[#DCC8B0] px-6 py-3 flex items-center justify-between">
          <div />
          <Shimmer className="h-4 w-40" />
        </header>
        <main className="flex-1 p-6 bg-[#FAF6F0]">
          <Shimmer className="h-8 w-36 mb-6" />
          <div className="rounded-2xl border border-[#DCC8B0] overflow-hidden">
            <Shimmer className="h-10 rounded-none" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-t border-[#F0E6D8]">
                <Shimmer className="h-4 w-32" />
                <Shimmer className="h-4 w-24" />
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-4 w-16 ml-auto" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

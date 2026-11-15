export default function AdminLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="space-y-4">
      <div className="adm-skeleton h-9 w-56" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="adm-skeleton h-20" />
        ))}
      </div>
      <div className="adm-skeleton h-40" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="adm-skeleton h-64" />
        <div className="adm-skeleton h-64" />
      </div>
    </div>
  );
}

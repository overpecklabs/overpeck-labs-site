import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="adm-card mx-auto mt-10 max-w-lg p-6 text-center">
      <p className="font-display text-xl font-bold">Not found</p>
      <p className="mt-2 text-sm text-ink/70">This record doesn&apos;t exist, or it was deleted.</p>
      <Link href="/admin" className="adm-btn mt-4">
        Back to dashboard
      </Link>
    </div>
  );
}

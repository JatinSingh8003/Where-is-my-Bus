export function AdminDashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl p-6">
      <section className="glass rounded-2xl p-5">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-slate-300">Manage buses, routes, trips, schedules, and live operations.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ['Active Buses', '12'],
            ['Live Trips', '9'],
            ['Routes', '24'],
            ['Delayed Buses', '3']
          ].map(([label, value]) => (
            <article key={label} className="rounded-xl border border-slate-600 p-4">
              <p className="text-sm text-slate-300">{label}</p>
              <p className="text-2xl font-semibold">{value}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <button className="rounded-lg bg-blue-600 p-3">Add Bus</button>
          <button className="rounded-lg bg-blue-600 p-3">Add Route</button>
          <button className="rounded-lg bg-blue-600 p-3">Create Trip</button>
          <button className="rounded-lg bg-blue-600 p-3">Manage Schedules</button>
        </div>
      </section>
    </main>
  )
}

/* Reusable skeleton loading patterns matching the actual content layout */

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome bar */}
      <div className="flex items-end justify-between">
        <div>
          <div className="skeleton h-7 w-48 mb-2" />
          <div className="skeleton h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <div className="skeleton h-10 w-32 rounded-lg" />
          <div className="skeleton h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="skeleton w-9 h-9 rounded-lg mb-3" />
            <div className="skeleton h-7 w-16 mb-2" />
            <div className="skeleton h-3 w-24 mb-2" />
            <div className="skeleton h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Contest cards */}
      <div className="space-y-3">
        <div className="skeleton h-5 w-36 mb-1" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="skeleton h-3 w-20 mb-2" />
                <div className="skeleton h-4 w-52" />
              </div>
              <div className="skeleton h-7 w-14" />
            </div>
            <div className="flex gap-4">
              <div className="skeleton h-3 w-24" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ContestsListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="skeleton h-7 w-32 mb-1" />
      <div className="skeleton h-4 w-48" />
      <div className="flex gap-1 p-1 bg-bg-card border border-border rounded-xl w-fit">
        <div className="skeleton h-10 w-24 rounded-lg" />
        <div className="skeleton h-10 w-16 rounded-lg" />
        <div className="skeleton h-10 w-24 rounded-lg" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-10 flex-1 max-w-sm rounded-lg" />
        <div className="skeleton h-10 w-20 rounded-lg" />
        <div className="skeleton h-10 w-20 rounded-lg" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <div className="skeleton h-4 w-20 rounded-full" />
                  <div className="skeleton h-4 w-24 rounded-full" />
                </div>
                <div className="skeleton h-4 w-56 mb-3" />
                <div className="flex gap-4">
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-24" />
                  <div className="skeleton h-3 w-16" />
                </div>
                <div className="skeleton h-1.5 w-48 rounded-full mt-3" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="skeleton h-6 w-16" />
                <div className="skeleton h-9 w-20 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PlayersListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="skeleton h-7 w-24" />
      <div className="skeleton h-10 w-full max-w-md rounded-lg" />
      <div className="flex gap-1 p-0.5 bg-bg-card border border-border rounded-lg w-fit">
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-7 w-10 rounded-md" />)}
      </div>
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1">
              <div className="skeleton h-4 w-36 mb-1.5" />
              <div className="flex gap-2">
                <div className="skeleton h-3 w-10 rounded" />
                <div className="skeleton h-3 w-8 rounded" />
              </div>
            </div>
            <div className="skeleton h-5 w-10" />
            <div className="skeleton h-4 w-8" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function LeaguesListSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <div className="skeleton h-7 w-32 mb-2" />
          <div className="skeleton h-4 w-40" />
        </div>
        <div className="skeleton h-10 w-36 rounded-lg" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <div className="skeleton h-4 w-16 rounded-full" />
                  <div className="skeleton h-4 w-24" />
                </div>
                <div className="skeleton h-4 w-40 mb-3" />
                <div className="flex gap-4">
                  <div className="skeleton h-3 w-16" />
                  <div className="skeleton h-3 w-20" />
                  <div className="skeleton h-3 w-24" />
                </div>
              </div>
              <div className="skeleton h-7 w-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="skeleton w-16 h-16 rounded-full" />
        <div>
          <div className="skeleton h-6 w-32 mb-2" />
          <div className="skeleton h-3 w-48 mb-1" />
          <div className="skeleton h-3 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-4">
            <div className="skeleton w-8 h-8 rounded-lg mb-3" />
            <div className="skeleton h-6 w-12 mb-2" />
            <div className="skeleton h-3 w-24" />
          </div>
        ))}
      </div>
      <div>
        <div className="skeleton h-5 w-28 mb-3" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col items-center p-3 bg-bg-card border border-border rounded-xl">
              <div className="skeleton w-10 h-10 rounded-full mb-2" />
              <div className="skeleton h-3 w-14 mb-1" />
              <div className="skeleton h-2 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function WalletSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-7 w-20" />
      <div className="bg-bg-card border border-border rounded-2xl p-6">
        <div className="skeleton h-4 w-28 mb-2" />
        <div className="skeleton h-10 w-40 mb-5" />
        <div className="flex gap-3">
          <div className="skeleton h-10 w-28 rounded-xl" />
          <div className="skeleton h-10 w-28 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <div className="skeleton h-7 w-7 rounded-lg mb-2" />
          <div className="skeleton h-6 w-16" />
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-4">
          <div className="skeleton h-7 w-7 rounded-lg mb-2" />
          <div className="skeleton h-6 w-16" />
        </div>
      </div>
      <div>
        <div className="skeleton h-5 w-40 mb-3" />
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
              <div className="skeleton w-8 h-8 rounded-lg" />
              <div className="flex-1">
                <div className="skeleton h-4 w-48 mb-1" />
                <div className="skeleton h-3 w-28" />
              </div>
              <div className="skeleton h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PageHeaderSkeleton() {
  return (
    <div className="admin-page-header">
      <div>
        <div className="admin-skeleton admin-skeleton-title" />
        <div className="admin-skeleton admin-skeleton-subtitle" />
      </div>
    </div>
  );
}

export function StatGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="admin-stat-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="admin-stat-card" key={i}>
          <div className="admin-skeleton admin-skeleton-stat-value" />
          <div className="admin-skeleton admin-skeleton-stat-label" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: columns }).map((_, c) => (
                <td key={c}>
                  <div
                    className="admin-skeleton admin-skeleton-text"
                    style={{ width: c === 0 ? "70%" : "50%" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="admin-card">
      <div
        className="admin-skeleton admin-skeleton-text"
        style={{ width: 140, height: 16, marginBottom: 16 }}
      />
      <div className="admin-detail-grid">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i}>
            <div
              className="admin-skeleton admin-skeleton-text"
              style={{ width: "60%", height: 11, marginBottom: 8 }}
            />
            <div
              className="admin-skeleton admin-skeleton-text"
              style={{ width: "80%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

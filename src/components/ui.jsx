export function Stat({ label, value }) {
  return (
    <div className="card stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export function Progress({ value, max }) {
  const percent = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div style={{ width: `${Math.min(percent, 100)}%` }} />
    </div>
  );
}

// Used by the Topics and Companies pages. rows = [{ name, total, solved }]
export function ProgressTable({ heading, rows }) {
  return (
    <div className="card table-wrap">
      <table>
        <thead>
          <tr><th>{heading}</th><th>Total</th><th>Solved</th><th>Remaining</th><th>Progress</th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td><b>{row.name}</b></td>
              <td>{row.total}</td>
              <td>{row.solved}</td>
              <td>{row.total - row.solved}</td>
              <td className="progress-cell">
                <Progress value={row.solved} max={row.total} />
                {row.total ? Math.round((row.solved / row.total) * 100) : 0}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

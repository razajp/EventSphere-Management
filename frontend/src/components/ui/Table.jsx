export default function Table({ columns, data, actions }) {
  return (
    <table className="min-w-full bg-white rounded-xl overflow-hidden shadow">
      <thead>
        <tr className="bg-[#302f2c] text-[#efede3]">
          {columns.map((col) => (
            <th key={col.key} className="py-2 px-4 text-left">{col.label}</th>
          ))}
          {actions && <th className="py-2 px-4 text-right">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row._id} className="border-b border-gray-300 last:border-b-0 hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="py-2 px-4">{row[col.key]}</td>
            ))}
            {actions && (
              <td className="py-2 px-4 text-right flex gap-2 justify-end">
                {actions(row)}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

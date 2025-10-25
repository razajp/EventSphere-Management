import ExpoCard from "./ExpoCard";

export default function ExpoList({ expos, refreshExpos }) {
  if (!expos?.length)
    return (
      <p className="text-center text-gray-600 mt-4">
        No active expos available.
      </p>
    );

  return (
    <div className="space-y-4">
      {expos.map((expo) => (
        <ExpoCard key={expo._id} expo={expo} refreshExpos={refreshExpos} />
      ))}
    </div>
  );
}

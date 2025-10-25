import JoinedExpoCard from "./JoinedExpoCard";

export default function JoinedExpoList({ expos = [], refreshExpos }) {
  if (!expos || expos.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-8">
        You haven't joined any expos yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expos.map((expo) => (
        <JoinedExpoCard key={expo._id} expo={expo} refreshExpos={refreshExpos} />
      ))}
    </div>
  );
}

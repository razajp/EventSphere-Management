import ExpoCard from "./ExpoCard";

export default function ExpoList({ expos, refreshExpos }) {
  return (
    <div className="space-y-4">
      {expos.map((expo) => (
        <ExpoCard key={expo._id} expo={expo} refreshExpos={refreshExpos} />
      ))}
    </div>
  );
}

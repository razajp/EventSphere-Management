export default function Button({ children, onClick, type = "button", variant = "dark" }) {
  const base = "px-4 py-2 rounded-lg font-medium transition";
  const styles =
    variant === "dark"
      ? "bg-[#302f2c] text-[#efede3] hover:opacity-90"
      : "bg-[#efede3] text-[#302f2c] hover:bg-[#302f2c]/10";

  return (
    <button onClick={onClick} type={type} className={`${base} ${styles} cursor-pointer`}>
      {children}
    </button>
  );
}

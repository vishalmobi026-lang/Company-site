function Civil({ setPage }) {
  return (
    <div
      onClick={() => setPage("Civil")}
      className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <h3 className="font-semibold text-sm">Civil</h3>
      <p className="text-xs text-gray-400">
        Construction & engineering skills
      </p>
    </div>
  );
}

export default Civil;
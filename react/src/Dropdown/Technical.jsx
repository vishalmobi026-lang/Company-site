function Technical({ setPage }) {
  return (
    <div
      onClick={() => setPage("It/Technical")}
      className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <h3 className="font-semibold text-sm">IT / Technical</h3>
      <p className="text-xs text-gray-400">
        Learn programming, development & IT skills
      </p>
    </div>
  );
}

export default Technical;
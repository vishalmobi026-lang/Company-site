function Accounting({ setPage }) {
  return (
    <div
      onClick={() => setPage("Accounting")}
      className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <h3 className="font-semibold text-sm">Accounting</h3>
      <p className="text-xs text-gray-400">
        Finance, Tally & business accounting
      </p>
    </div>
  );
}

export default Accounting;
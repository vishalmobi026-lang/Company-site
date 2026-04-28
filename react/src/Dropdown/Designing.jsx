function Designing({ setPage }) {
  return (
    <div
      onClick={() => setPage("Designing")}
      className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <h3 className="font-semibold text-sm">Designing</h3>
      <p className="text-xs text-gray-400">
        UI/UX, graphic & creative design
      </p>
    </div>
  );
}

export default Designing;
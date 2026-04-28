function NonTechnical({ setPage }) {
  return (
    <div
      onClick={() => setPage("NonTechnical")}
      className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      <h3 className="font-semibold text-sm">Non Technical</h3>
      <p className="text-xs text-gray-400">
        Business, management & soft skills
      </p>
    </div>
  );
}

export default NonTechnical;
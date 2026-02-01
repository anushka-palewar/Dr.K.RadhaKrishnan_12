const Navbar = ({ onOpenAI, onAddRequest }) => {
  return (
    <nav className="w-full bg-gradient-to-r from-gray-900 via-slate-900 to-gray-800 px-6 py-4 flex items-center justify-between shadow-md">
      
      {/* Left Section: Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Service Operations Analytics
        </h1>
        <p className="text-sm text-gray-400">
          Monitor service efficiency, workload distribution, and SLA adherence
        </p>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-4">
        {/* AI Assistance Button */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
        >
          🤖 AI Assistance
        </button>

        {/* Add Request Button */}
        <button
          onClick={onAddRequest}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
        >
          ➕ Add Request
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
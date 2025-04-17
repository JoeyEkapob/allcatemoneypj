export default function Navbar({ onToggle }: { onToggle: () => void }) {
    return (
      <div className="bg-white shadow p-4 flex items-center justify-between">
        <button onClick={onToggle} className="text-xl">
          ☰
        </button>
        <div className="font-bold">My App</div>
      </div>
    );
  }
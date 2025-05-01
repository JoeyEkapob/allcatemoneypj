export default function Sidebar({ isOpen }: { isOpen: boolean }) {
    return (
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 z-50 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="p-4">{isOpen ? "เมนูเต็ม" : "≡"}</div>
      </div>
    );
  }
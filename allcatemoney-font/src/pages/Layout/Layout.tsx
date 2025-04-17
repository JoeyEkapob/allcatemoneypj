import { useState } from "react";
import Sidebar from "./Sildebar";
import Navbar from "./Navbart";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Content + Navbar */}
      <div
        className={`min-h-screen w-full transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar onToggle={() => setIsOpen(!isOpen)} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}

import { Bell, CircleQuestionMark, Home, Mail } from "lucide-react";
export default function Navbar() {
  return (
    <nav className="w-[90%] max-w-[900px] mx-auto my-5 bg-white/70 backdrop-blur-lg border border-green-700/20 rounded-full flex justify-between items-center pl-6 pr-2 py-2 shadow-sm">
      
      {/* Brand */}
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <div className="w-9 h-9 bg-green-800 rounded-full flex items-center justify-center flex-shrink-0">
          <Home size={16} color="white" />
        </div>
        <span className="font-serif text-xl font-semibold text-green-900 tracking-tight">
          urban <span className="text-green-600">s</span>tayr
        </span>
      </a>
      <div className="flex items-center gap-1">
       
          <button
            className="relative group text-sm text-gray-600 hover:text-green-900 hover:bg-green-600/10 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-4 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Messages</span>
            <Bell/>
          </button>
          <button
            className="relative group text-sm text-gray-600 hover:text-green-900 hover:bg-green-600/10 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-4 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Messages</span>
            <Mail/>
          </button>
          <button
            className="relative group text-sm text-gray-600 hover:text-green-900 hover:bg-green-600/10 px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-green-800 px-4 py-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">Messages</span>
           <CircleQuestionMark/>
          </button>
        <button className="text-sm font-medium text-green-800 border border-green-700/40 hover:bg-green-600/10 px-5 py-1.5 rounded-full transition-colors ml-1 cursor-pointer">
          Login
        </button>

        <button className="text-sm font-medium text-white bg-green-800 hover:bg-green-900 px-5 py-1.5 rounded-full transition-colors ml-0.5 cursor-pointer">
          Register
        </button>
      </div>
    </nav>
  );
}
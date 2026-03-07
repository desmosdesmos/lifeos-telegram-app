import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, LineChart, Plus, Sparkles, User } from "lucide-react";

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/app", icon: Home, label: "Home" },
    { path: "/app/analysis", icon: LineChart, label: "Analysis" },
    { path: "/app/nutrition", icon: Plus, label: "Add" },
    { path: "/app/chat", icon: Sparkles, label: "AI" },
    { path: "/app/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="relative w-full min-h-screen bg-[#0B0B0F] overflow-x-hidden">
      <div className="pb-24">
        <Outlet />
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-[390px]">
        <div className="glass-card rounded-[24px] px-4 py-3 flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-[#4DA3FF]" : "text-white/60"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
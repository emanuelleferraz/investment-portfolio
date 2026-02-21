import { LayoutDashboard, Briefcase, Info, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SidebarProps {
    activePage: 'dashboard' | 'ativos' | 'sobre';
}

const Sidebar = ({ activePage }: SidebarProps) => {
    return (
        <aside className="w-64 border-r border-zinc-800 flex flex-col bg-[#0a0a0a] shrink-0">
            <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
                <div className="bg-gradient-to-br from-pink-500 to-violet-600 p-2 rounded-lg shadow-lg">
                    <Wallet size={22} className="text-white" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-white">WalletWise</span>
            </div>
            <nav className="flex-1 px-4 space-y-2 mt-4">
                <Link to="/">
                    <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activePage === 'dashboard'} />
                </Link>
                <Link to="/assets">
                    <NavItem icon={<Briefcase size={20}/>} label="Ativos" active={activePage === 'ativos'} />
                </Link>
                <Link to="/sobre">
                    <NavItem icon={<Info size={20}/>} label="Sobre" active={activePage === 'sobre'} />
                </Link>
            </nav>
        </aside>
    );
};

const NavItem = ({ icon, label, active = false }: any) => (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-pink-500/10 text-pink-500 border-r-4 border-pink-500 rounded-r-none' : 'text-zinc-500 hover:text-white'
    }`}>
        {icon}
        <span className="text-sm font-bold">{label}</span>
    </div>
);

export default Sidebar;
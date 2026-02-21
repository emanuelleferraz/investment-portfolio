import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "@/components/Dashboard.tsx";
import Assets from "@/components/Assets.tsx";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Rota principal (Dashboard) */}
                <Route path="/" element={<Dashboard />} />

                {/* Rota para a página de gestão de ativos */}
                <Route path="/assets" element={<Assets />} />

                {/* Rota de fallback */}
                <Route path="*" element={<Dashboard />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
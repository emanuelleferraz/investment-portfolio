import { useEffect, useState } from 'react';
import { investmentService, type Investment, type InvestmentSummary } from '@/service/api';
import { Bell, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';
import Sidebar from "@/components/SideBar.tsx";

const assetIcons = { ACAO: "📈", CRIPTO: "₿", FUNDO: "🏢", RENDA_FIXA: "💵", OUTRO: "📦" };

const Dashboard = () => {
    const [summary, setSummary] = useState<InvestmentSummary | null>(null);
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [marketData, setMarketData] = useState<any[]>([]);

    useEffect(() => {
        loadData();
        fetchMarketData();
    }, []);

    const loadData = async () => {
        try {
            const [s, i] = await Promise.all([investmentService.getSummary(), investmentService.getAll()]);
            setSummary(s);
            setInvestments(i);
        } catch (err) { console.error(err); }
    };

    // LÓGICA DO GRÁFICO: Total acumulado investido por mês
    const chartData = investments.reduce((acc: any[], inv) => {
        const date = new Date(inv.purchaseDate);
        const monthYear = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
        const totalValue = inv.quantity * inv.purchasePrice;

        const existingMonth = acc.find(item => item.name === monthYear);
        if (existingMonth) {
            existingMonth.total += totalValue;
        } else {
            acc.push({ name: monthYear, total: totalValue, rawDate: date });
        }
        return acc;
    }, [])
        .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime()) // Ordena por data real
        .map(({ name, total }) => ({ name, total }));

    const fetchMarketData = async () => {
        try {
            const TOKEN = "qGFQ3NJuiLWkDwbDa4kpEk";
            const res = await axios.get(`https://brapi.dev/api/quote/PETR4,VALE3,ITUB4,BTC?token=${TOKEN}`);
            setMarketData(res.data.results || []);
        } catch (err) {
            console.error("Erro ao buscar dados da API:", err);
            setMarketData([
                { symbol: 'PETR4', regularMarketPrice: 0, regularMarketChangePercent: 0 },
                { symbol: 'VALE3', regularMarketPrice: 0, regularMarketChangePercent: 0 },
                { symbol: 'ITUB4', regularMarketPrice: 0, regularMarketChangePercent: 0 },
                { symbol: 'BTC', regularMarketPrice: 0, regularMarketChangePercent: 0 },
            ]);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">

            <Sidebar activePage="dashboard" />

            {/* CONTEÚDO */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
                    <h1 className="text-[5px] font-bold tracking-[0.2em] text-zinc-500">Carteira de Investimentos</h1>
                    <div className="flex items-center gap-6">
                        <Search size={18} className="text-zinc-400" />
                        <Bell size={18} className="text-zinc-400" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 border border-zinc-700" />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">

                    {/* TOP: SUMMARY CARDS + MARKET MONITOR AGREGADO */}
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4 grid grid-cols-2 gap-4">
                            <SummaryCard title="Total Investido" value={`R$ ${summary?.totalInvested.toLocaleString('pt-BR') || '0,00'}`} color="text-white" />
                            <SummaryCard title="Ativos Totais" value={summary?.assetCount || 0} color="text-white" />
                        </div>

                        {/* Monitor de Mercado Agrupado com Dados Reais */}
                        <Card className="col-span-8 bg-[#111] border-zinc-800">
                            <div className="grid grid-cols-4 divide-x divide-zinc-800 h-full">
                                {marketData.map((data, idx) => (
                                    <div key={idx} className="p-4 flex flex-col justify-center">
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase">{data.symbol}</span>
                                        <span className="text-md font-black text-white">
                                            R$ {data.regularMarketPrice?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </span>
                                        <span className={`text-[10px] font-bold ${data.regularMarketChangePercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {data.regularMarketChangePercent > 0 ? '+' : ''}{data.regularMarketChangePercent?.toFixed(2)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* MIDDLE: GRÁFICO + TABELA POR TIPO */}
                    <div className="grid grid-cols-12 gap-6">
                        <Card className="col-span-7 bg-[#111] border-zinc-800 p-4">
                            <CardTitle className="text-[10px] text-zinc-400 uppercase mb-4 tracking-wider">Evolução de Aportes por Mês</CardTitle>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                                        <XAxis dataKey="name" stroke="#fff" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#fff" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `R$${v}`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333', color: '#fff' }} />
                                        <Area type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={3} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card className="col-span-5 bg-[#111] border-zinc-800">
                            <CardHeader><CardTitle className="text-[10px] text-zinc-400 uppercase tracking-wider">Distribuição por Tipo</CardTitle></CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader><TableRow className="border-zinc-800 hover:bg-transparent"><TableHead className="text-white text-[10px]">TIPO</TableHead><TableHead className="text-right text-white text-[10px]">TOTAL</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {summary?.totalByType && Object.entries(summary.totalByType).map(([tipo, valor]) => (
                                            <TableRow key={tipo} className="border-zinc-800 hover:bg-zinc-900/20">
                                                <TableCell className="text-white font-medium text-xs">{assetIcons[tipo as keyof typeof assetIcons] || '💰'} {tipo}</TableCell>
                                                <TableCell className="text-right text-white font-mono text-xs font-bold">R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    {/* BOTTOM: TABELA UNITÁRIA */}
                    <Card className="bg-[#111] border-zinc-800">
                        <CardHeader><CardTitle className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Detalhamento de Ativos</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-zinc-900/50">
                                    <TableRow className="border-zinc-800 hover:bg-transparent">
                                        <TableHead className="text-white text-[10px]">SÍMBOLO</TableHead>
                                        <TableHead className="text-white text-[10px]">TIPO</TableHead>
                                        <TableHead className="text-center text-white text-[10px]">QTD</TableHead>
                                        <TableHead className="text-right text-white text-[10px]">PREÇO MÉDIO</TableHead>
                                        <TableHead className="text-right text-white text-[10px]">TOTAL ACUMULADO</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {investments.map((inv) => (
                                        <TableRow key={inv.id} className="border-zinc-800 hover:bg-zinc-900/40 transition-colors">
                                            <TableCell className="font-black text-pink-500 text-sm">{inv.symbol}</TableCell>
                                            <TableCell className="text-zinc-300 text-[11px] font-bold">{inv.type}</TableCell>
                                            <TableCell className="text-center text-white text-sm">{inv.quantity}</TableCell>
                                            <TableCell className="text-right text-white text-sm font-mono">R$ {inv.purchasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                            <TableCell className="text-right text-white font-black text-sm font-mono">R$ {(inv.quantity * inv.purchasePrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

const SummaryCard = ({ title, value, color }: any) => (
    <Card className="bg-[#111] border-zinc-800">
        <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className={`text-xl font-black ${color}`}>{value}</div>
        </CardContent>
    </Card>
);

export default Dashboard;
import { useEffect, useState } from 'react';
import { investmentService, type Investment, type AssetType } from '@/service/api';
import { Bell, Search, Plus, Trash2, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/SideBar.tsx";
import AssetForm from "@/components/AssetForm";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";

const Ativos = () => {
    const [investments, setInvestments] = useState<Investment[]>([]);
    const [filterType, setFilterType] = useState<AssetType | 'TODOS'>('TODOS'); // Novo estado de filtro

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<Investment | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState<Investment | null>(null);

    useEffect(() => {
        loadInvestments();
    }, []);

    const loadInvestments = async () => {
        try {
            const data = await investmentService.getAll();
            setInvestments(data);
        } catch (err) {
            console.error("Erro ao carregar ativos:", err);
        }
    };

    // Lógica de filtragem
    const filteredInvestments = filterType === 'TODOS'
        ? investments
        : investments.filter(inv => inv.type === filterType);

    const handleDeleteClick = (inv: Investment) => {
        setAssetToDelete(inv);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!assetToDelete?.id) return;
        try {
            await investmentService.delete(assetToDelete.id);
            loadInvestments();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error("Erro ao deletar:", err);
        }
    };

    const handleAddNew = () => {
        setSelectedAsset(null);
        setIsModalOpen(true);
    };

    const handleEdit = (asset: Investment) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    return (
        <div className="flex h-screen w-screen bg-[#0a0a0a] text-white overflow-hidden">
            <Sidebar activePage="ativos" />

            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8">
                    <h1 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500">Gestão de Portfólio</h1>
                    <div className="flex items-center gap-6">
                        <Search size={18} className="text-zinc-400" />
                        <Bell size={18} className="text-zinc-400" />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-violet-500 border border-zinc-700" />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-black">Meus Ativos</h2>
                            <p className="text-zinc-500 text-xs">Gerencie suas posições e histórico</p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-pink-500/20"
                        >
                            <Plus size={18} /> Novo Ativo
                        </button>
                    </div>

                    {/* Filtros por Tipo */}
                    <div className="flex gap-2">
                        {['TODOS', 'ACAO', 'CRIPTO', 'FUNDO', 'RENDA_FIXA', 'OUTRO'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${
                                    filterType === type
                                        ? 'bg-pink-600 border-pink-600 text-white'
                                        : 'border-zinc-800 text-zinc-500 hover:border-zinc-600'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <Card className="bg-[#111] border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Listagem Detalhada</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader className="bg-zinc-900/50">
                                    <TableRow className="border-zinc-800 hover:bg-transparent">
                                        <TableHead className="text-white text-[10px]">SÍMBOLO</TableHead>
                                        <TableHead className="text-white text-[10px]">TIPO</TableHead>
                                        <TableHead className="text-center text-white text-[10px]">QTD</TableHead>
                                        <TableHead className="text-right text-white text-[10px]">PREÇO MÉDIO</TableHead>
                                        <TableHead className="text-right text-white text-[10px]">TOTAL</TableHead>
                                        <TableHead className="text-right text-white text-[10px]">AÇÕES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredInvestments.map((inv) => (
                                        <TableRow key={inv.id} className="border-zinc-800 hover:bg-zinc-900/40 transition-colors">
                                            <TableCell className="font-black text-pink-500 text-sm">{inv.symbol}</TableCell>
                                            <TableCell className="text-zinc-300 text-[11px] font-bold">{inv.type}</TableCell>
                                            <TableCell className="text-center text-white text-sm">{inv.quantity}</TableCell>
                                            <TableCell className="text-right text-white text-sm font-mono">
                                                R$ {inv.purchasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right text-white font-black text-sm font-mono">
                                                R$ {(inv.quantity * inv.purchasePrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(inv)}
                                                        className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(inv)}
                                                        className="p-2 hover:bg-red-500/10 rounded-md text-zinc-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredInvestments.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-zinc-500 italic text-sm border-none">
                                                Nenhum ativo encontrado para este filtro.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <AssetForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadInvestments}
                editingInvestment={selectedAsset}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                assetSymbol={assetToDelete?.symbol || ""}
            />
        </div>
    );
};

export default Ativos;
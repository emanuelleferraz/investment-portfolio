import { useEffect, useState } from 'react';
import { investmentService, type Investment, type AssetType } from '@/service/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

interface AssetFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingInvestment?: Investment | null;
}

const AssetForm = ({ isOpen, onClose, onSuccess, editingInvestment }: AssetFormProps) => {
    const [formData, setFormData] = useState<Investment>({
        symbol: '',
        type: 'ACAO',
        quantity: 0,
        purchasePrice: 0,
        purchaseDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (editingInvestment) {
            setFormData(editingInvestment);
        } else {
            setFormData({
                symbol: '',
                type: 'ACAO',
                quantity: 0,
                purchasePrice: 0,
                purchaseDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [editingInvestment, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingInvestment?.id) {
                await investmentService.update(editingInvestment.id, formData);
            } else {
                await investmentService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Erro ao salvar ativo:", err);
        }
    };

    const handleNumberChange = (field: keyof Investment, value: string) => {
        const numValue = value === '' ? 0 : Number(value);
        setFormData({ ...formData, [field]: numValue });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#111] border-zinc-800 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-pink-500">
                        {editingInvestment ? 'Editar Ativo' : 'Novo Ativo'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Símbolo (Ex: PETR4)</Label>
                            <Input
                                value={formData.symbol}
                                onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                                className="bg-zinc-900 border-zinc-800 uppercase"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tipo</Label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as AssetType})}
                                className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-md px-3 text-sm"
                            >
                                <option value="ACAO">Ação</option>
                                <option value="CRIPTO">Cripto</option>
                                <option value="FUNDO">FII</option>
                                <option value="RENDA_FIXA">Renda Fixa</option>
                                <option value="OUTRO">Outro</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Quantidade</Label>
                            <Input
                                type="number"
                                value={formData.quantity === 0 ? '' : formData.quantity}
                                onChange={e => handleNumberChange('quantity', e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Preço de Compra</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.purchasePrice === 0 ? '' : formData.purchasePrice}
                                onChange={e => handleNumberChange('purchasePrice', e.target.value)}
                                className="bg-zinc-900 border-zinc-800"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Data da Compra</Label>
                        <Input
                            type="date"
                            value={formData.purchaseDate}
                            onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                            className="bg-zinc-900 border-zinc-800"
                            required
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white">
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                            {editingInvestment ? 'Atualizar Ativo' : 'Salvar Ativo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AssetForm;
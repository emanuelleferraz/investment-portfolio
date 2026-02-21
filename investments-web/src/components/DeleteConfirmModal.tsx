import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    assetSymbol: string;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, assetSymbol }: DeleteConfirmModalProps) => {
    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="bg-[#111] border-zinc-800 text-white">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-black">
                        Excluir Ativo
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400 text-sm">
                        Você tem certeza que deseja remover <span className="text-pink-500 font-bold">{assetSymbol}</span> da sua carteira?
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                        onClick={onClose}
                        className="bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20"
                    >
                        Confirmar Exclusão
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmModal;
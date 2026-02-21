// @ts-ignore
import axios from 'axios';

export type AssetType = 'ACAO' | 'CRIPTO' | 'FUNDO' | 'RENDA_FIXA' | 'OUTRO';

export interface Investment {
    id?: string;
    type: AssetType;
    symbol: string;
    quantity: number;
    purchasePrice: number;
    purchaseDate: string;
}

export interface InvestmentSummary {
    totalInvested: number;
    assetCount: number;
    totalByType: Record<AssetType, number>;
}

const api = axios.create({
    baseURL: 'http://localhost:5000',
});

export const investmentService = {
    // GET /investments
    getAll: async (): Promise<Investment[]> => {
        const response = await api.get<Investment[]>('/investments');
        return response.data;
    },

    // GET /investments/summary
    getSummary: async (): Promise<InvestmentSummary> => {
        const response = await api.get<InvestmentSummary>('/investments/summary');
        return response.data;
    },

    // POST /investments
    create: async (data: Investment): Promise<Investment> => {
        const response = await api.post<Investment>('/investments', data);
        return response.data;
    },

    // PUT /investments
    update: async (id: string, data: Investment): Promise<Investment> => {
        const response = await api.put<Investment>(`/investments/${id}`, data);
        return response.data;
    },

    // DELETE /investments/{id}
    delete: async (id: string): Promise<void> => {
        await api.delete(`/investments/${id}`);
    }
};

export default api;
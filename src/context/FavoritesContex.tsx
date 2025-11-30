import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Assumindo que você tem um arquivo de configuração de API
import { useAuth } from './AuthContext'; // Assumindo que você tem um AuthContext para pegar o token/usuário

// O ENDPOINT é mantido, mas a API_BASE_URL é removida, pois o objeto 'api' já a contém.
const FAVORITES_ENDPOINT = '/user/favorites';

// Definição de tipos (simplificada)
interface Product {
    id: number;
    // ... outras propriedades do produto que você usa
}

interface FavoritesContextType {
    favorites: Product[];
    isFavorite: (productId: number) => boolean;
    toggleFavorite: (product: Product) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    fetchFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth(); // Assume que useAuth fornece o objeto 'user'

    // Função para buscar os favoritos da API
    const fetchFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // GET /user/favorites
            const response = await api.get(FAVORITES_ENDPOINT); 
            setFavorites(response.data);
        } catch (err) {
            console.error("Erro ao buscar favoritos:", err);
            setError("Não foi possível carregar os favoritos.");
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Carrega os favoritos quando o usuário loga
    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const isFavorite = (productId: number) => {
        return favorites.some(product => product.id === productId);
    };

    // Função para adicionar ou remover um produto dos favoritos
    const toggleFavorite = async (product: Product) => {
        if (!user) {
            alert("Você precisa estar logado para favoritar produtos.");
            return;
        }

        const isCurrentlyFavorite = isFavorite(product.id);
        setError(null);

        try {
            if (isCurrentlyFavorite) {
                // REMOVER: DELETE /user/favorites?ids=1
                await api.delete(`${FAVORITES_ENDPOINT}?ids=${product.id}`);
                
                // Atualiza o estado local
                setFavorites(prev => prev.filter(fav => fav.id !== product.id));
                alert("Produto removido dos favoritos!");

            } else {
                // ADICIONAR: POST /user/favorites com body [3]
                // O objeto 'api' já trata a autenticação e o Content-Type
                await api.post(FAVORITES_ENDPOINT, [product.id]);

                // Atualiza o estado local
                setFavorites(prev => [...prev, product]);
                alert("Produto adicionado aos favoritos!");
            }
        } catch (err) {
            console.error(`Erro ao ${isCurrentlyFavorite ? 'remover' : 'adicionar'} favorito:`, err);
            setError(`Falha ao ${isCurrentlyFavorite ? 'remover' : 'adicionar'} favorito.`);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, isLoading, error, fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
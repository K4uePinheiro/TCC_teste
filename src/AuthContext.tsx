import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    sub?: string;
    name: string;
    email: string;
    picture?: string;
    email_verified?: boolean;
    loginDate?: string;
    cart?: any[];
    favorites?: any[];
    orders?: any[];
}

interface AuthContextType {
    user: User | null;
    login: (emailOrUser: string | User, senha?: string) => boolean;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);


// Usuários mockados para teste (remova em produção)
const mockUsers = [
    { email: "samuel@example.com", senha: "123456", name: "Samuel", picture: "https://ui-avatars.com/api/?name=Samuel&background=FF6B35&color=fff" },
    { email: "teste@teste.com", senha: "teste123", name: "Usuário Teste", picture: "https://ui-avatars.com/api/?name=Teste&background=FF6B35&color=fff" }
];

const saveUserToStorage = (userData: User) => {
    const dataToSave = {
        ...userData,
        loginDate: new Date().toISOString(),
        cart: userData.cart || [],
        favorites: userData.favorites || [],
        orders: userData.orders || [],
    };
    localStorage.setItem("user", JSON.stringify(dataToSave));
};

const getUserFromStorage = (): User | null => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
};

const clearUserFromStorage = () => {
    localStorage.removeItem("user");
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = getUserFromStorage();
        if (savedUser) setUser(savedUser);
        setLoading(false);
    }, []);

    // Login pode receber email+senha OU objeto do Google
    const login = (emailOrUser: string | User, senha?: string): boolean => {
        // Login com Google (recebe objeto User)
        if (typeof emailOrUser === 'object') {
            const userData = emailOrUser;
            setUser(userData);
            saveUserToStorage(userData);
            return true;
        }

        // Login tradicional (recebe email e senha)
        const email = emailOrUser as string;

        // Validação com usuários mockados
        const foundUser = mockUsers.find(
            u => u.email === email && u.senha === senha
        );

        if (foundUser) {
            const userData: User = {
                email: foundUser.email,
                name: foundUser.name,
                picture: foundUser.picture,
                email_verified: true
            };
            setUser(userData);
            saveUserToStorage(userData);
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        clearUserFromStorage();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};
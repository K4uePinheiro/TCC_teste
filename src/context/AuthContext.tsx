import { createContext, useContext, useState } from "react";
import { mockDatabase } from "../services/mockDatabase";

interface AutoContextType {
    user: any;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    register: (name: string, email: string, password: string) => void;

}

const AuthContext = createContext<AutoContextType>({} as AutoContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const[user, setUser] = useState<any>(() => {
        const saved = localStorage.getItem('logged_user');
        return saved ? JSON.parse(saved) : null;
    });
    const login = (email: string, password: string) => {
        const found = mockDatabase.findUser(email, password);
        if (found) {
            setUser(found);
            localStorage.setItem('logged_user', JSON.stringify(found));
            return true;
        }
        return false;
    };

    const register = (name: string, email: string, password: string) => {
        const newUser = mockDatabase.addUser({ name, email, password });
        setUser(newUser);
        localStorage.setItem('logged_user', JSON.stringify(newUser));
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem('logged_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
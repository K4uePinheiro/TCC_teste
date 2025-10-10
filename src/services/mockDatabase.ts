interface user {
    id:number;
    name:string;
    email:string;
    password:string;
}

const USERS_KEY = 'mock_users';

export const mockDatabase = {

    // Recupera todos os usuários do localStorage
    getUsers: (): user[] => {
        try {
            const users = localStorage.getItem(USERS_KEY);
            return users ? JSON.parse(users) : [];
        } catch (error) {
            // Em caso de erro ao ler ou parsear, retorna array vazio
            console.error('Erro ao recuperar usuários:', error);
            return [];
        }
    },


    // Adiciona um novo usuário após validação básica
    addUser(user: Omit<user, 'id'>) {
        // Validação simples dos campos obrigatórios
        if (!user.name || !user.email || !user.password) {
            // Retorna erro se faltar algum campo
            throw new Error('Todos os campos (name, email, password) são obrigatórios.');
        }
        // Verifica se o email já está cadastrado
        const users = this.getUsers();
        if (users.some(u => u.email === user.email)) {
            throw new Error('Email já cadastrado.');
        }
        const newUser = { id: Date.now(), ...user };
        users.push(newUser);
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
            // Em caso de erro ao salvar
            console.error('Erro ao salvar usuário:', error);
            throw new Error('Erro ao salvar usuário.');
        }
        return newUser;
    },

    // Busca usuário por email e senha, com validação básica
    findUser(email: string, password: string): user | null {
        if (!email || !password) {
            // Retorna null se faltar email ou senha
            return null;
        }
        const users = this.getUsers();
        return users.find(user => user.email === email && user.password === password) || null;
    }
};
   
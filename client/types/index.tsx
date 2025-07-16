interface User {
    _id: string;
    email: string;
    name?: string;
    role?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}
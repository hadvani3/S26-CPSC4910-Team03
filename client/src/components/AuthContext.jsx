import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole =localStorage.getItem("role");
        if (storedToken) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToken(storedToken);
            setRole(storedRole);
        }
    }, []);

    const login = (newToken, userRole) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("role", userRole);
        setToken(newToken);
        setRole(userRole);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
    }
    
    return (
        <AuthContext.Provider value={{ token, role, login, logout }} >
            {children}
        </AuthContext.Provider>
    )
}
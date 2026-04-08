import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    /** False until localStorage has been read once (avoids refresh race on protected routes). */
    const [authReady, setAuthReady] = useState(false);
    const [isImpersonating, setIsImpersonating] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");
        const storedImpersonating = localStorage.getItem("isImpersonating");
        if (storedToken) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToken(storedToken);
            setRole(storedRole);
            setIsImpersonating(storedImpersonating === 'true');
        }
        setAuthReady(true);
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
        localStorage.removeItem("isImpersonating");
        localStorage.removeItem("originalRole");
        localStorage.removeItem("originalToken");
        setToken(null);
        setRole(null);
        setIsImpersonating(false);
    }

    const impersonate = (impersonateToken, impersonationRole) => {
        localStorage.setItem("token", impersonateToken);
        localStorage.setItem("role", impersonationRole);
        localStorage.setItem("isImpersonating", true);
        localStorage.setItem("originalRole", role);
        localStorage.setItem("originalToken", token);
        setToken(impersonateToken);
        setRole(impersonationRole);
        setIsImpersonating(true);
    }

    const stopImpersonation = () => {
        const originalToken = localStorage.getItem("originalToken");
        const originalRole = localStorage.getItem("originalRole");
        localStorage.setItem("token", originalToken);
        localStorage.setItem("role", originalRole);
        localStorage.removeItem("isImpersonating");
        localStorage.removeItem("originalRole");
        localStorage.removeItem("originalToken");
        setToken(originalToken);
        setRole(originalRole);
        setIsImpersonating(false);
    }

    return (
        <AuthContext.Provider value={{ token, role, authReady, login, logout, impersonate, stopImpersonation, isImpersonating}} >
            {children}
        </AuthContext.Provider>
    )
}
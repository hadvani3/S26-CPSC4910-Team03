import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AUTH_KEYS = ["token", "role", "isImpersonating", "originalRole", "originalToken"];

/** Session storage is per browser tab; localStorage is shared across tabs (multi-login would overwrite). */
function migrateLegacyLocalStorage() {
    for (const k of AUTH_KEYS) {
        const v = localStorage.getItem(k);
        if (v != null && sessionStorage.getItem(k) == null) {
            sessionStorage.setItem(k, v);
            localStorage.removeItem(k);
        }
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    /** False until sessionStorage has been read once (avoids refresh race on protected routes). */
    const [authReady, setAuthReady] = useState(false);
    const [isImpersonating, setIsImpersonating] = useState(false);

    useEffect(() => {
        migrateLegacyLocalStorage();
        const storedToken = sessionStorage.getItem("token");
        const storedRole = sessionStorage.getItem("role");
        const storedImpersonating = sessionStorage.getItem("isImpersonating");
        if (storedToken) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToken(storedToken);
            setRole(storedRole);
            setIsImpersonating(storedImpersonating === "true");
        }
        setAuthReady(true);
    }, []);

    const login = (newToken, userRole) => {
        sessionStorage.setItem("token", newToken);
        sessionStorage.setItem("role", userRole);
        setToken(newToken);
        setRole(userRole);
    };

    const logout = () => {
        for (const k of AUTH_KEYS) {
            sessionStorage.removeItem(k);
        }
        setToken(null);
        setRole(null);
        setIsImpersonating(false);
    };

    const impersonate = (impersonateToken, impersonationRole) => {
        sessionStorage.setItem("token", impersonateToken);
        sessionStorage.setItem("role", impersonationRole);
        sessionStorage.setItem("isImpersonating", "true");
        sessionStorage.setItem("originalRole", role ?? "");
        sessionStorage.setItem("originalToken", token ?? "");
        setToken(impersonateToken);
        setRole(impersonationRole);
        setIsImpersonating(true);
    };

    const stopImpersonation = () => {
        const originalToken = sessionStorage.getItem("originalToken");
        const originalRole = sessionStorage.getItem("originalRole");
        if (originalToken != null && originalToken !== "") {
            sessionStorage.setItem("token", originalToken);
        } else {
            sessionStorage.removeItem("token");
        }
        if (originalRole != null && originalRole !== "") {
            sessionStorage.setItem("role", originalRole);
        } else {
            sessionStorage.removeItem("role");
        }
        sessionStorage.removeItem("isImpersonating");
        sessionStorage.removeItem("originalRole");
        sessionStorage.removeItem("originalToken");
        setToken(originalToken || null);
        setRole(originalRole || null);
        setIsImpersonating(false);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                authReady,
                login,
                logout,
                impersonate,
                stopImpersonation,
                isImpersonating,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

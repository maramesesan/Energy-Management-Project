import React, { createContext, useContext, useState  } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialAuthState = JSON.parse(localStorage.getItem('authState')) || { role: null, id: null };

    const [authState, setAuthState] = useState(initialAuthState);

    const setAuthData = (data) => {
        const newAuthState = {
            role: data.role,
            id: data.id,
        };
        setAuthState(newAuthState);
        localStorage.setItem('authState', JSON.stringify(newAuthState)); //saved in local storage to persist through pages
    };


    return (
        <AuthContext.Provider value={{ authState, setAuthData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

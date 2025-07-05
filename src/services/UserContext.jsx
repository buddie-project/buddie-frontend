import {createContext, useContext, useEffect, useState} from "react";
import api from "./api.js";

const UserContext = createContext(null);
export const useUserContext = () => useContext(UserContext);
const UserProvider = ( {children} ) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                let response = await api.get("/api/user/logged");
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
            setLoading(false);
        })();
    }, []);

    const logout = async () => {
        try {
            await api.get("/logout");
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);

        }
    }

    return (
        <UserContext.Provider value={ {user, setUser, loading, logout} }>
            {loading ? <div>Loading</div> : children}
        </UserContext.Provider>
    );
};
export default UserProvider;


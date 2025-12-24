import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState(null);

    const getUser = async() => {
        try{
            const res = await AsyncStorage.getItem("user");
            if(res){
                setUserName(JSON.parse(res));
            }
            else{
                setUserName(null);
            }
        }catch(e){
            console.log('Cant load user',e);
        }
        setIsLoading(false);
    }

    useEffect(()=>{
        getUser();
    },[]);

    return(
        <GlobalContext.Provider value={{isLoading, setIsLoading, userName, setUserName}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;
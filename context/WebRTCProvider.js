import { createContext, useContext, useState } from "react";

const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const [rtc, setRTC] = useState(null);
  return (
    <WebRTCContext.Provider value={{ rtc, setRTC }}>
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTC = () => useContext(WebRTCContext);

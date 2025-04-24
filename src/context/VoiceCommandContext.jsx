import React, { createContext, useContext, useState } from 'react';

const VoiceCommandContext = createContext();

export const VoiceCommandProvider = ({ children }) => {
  const [mode, setMode] = useState("global"); // "global" hoặc "chat"

  return (
    <VoiceCommandContext.Provider value={{ mode, setMode }}>
      {children}
    </VoiceCommandContext.Provider>
  );
};

export const useVoiceCommand = () => useContext(VoiceCommandContext);

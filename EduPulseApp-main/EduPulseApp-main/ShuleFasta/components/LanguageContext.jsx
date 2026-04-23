import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "./translations";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLang = await AsyncStorage.getItem("appLanguage");

    if (savedLang) {
      setLanguage(savedLang);
      i18n.locale = savedLang;
    }
  };

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    i18n.locale = lang;
    await AsyncStorage.setItem("appLanguage", lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t: (key) => i18n.t(key),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
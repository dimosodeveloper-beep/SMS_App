// src/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventRegister } from "react-native-event-listeners";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataJSON = await AsyncStorage.getItem("userData");
        const token = await AsyncStorage.getItem("userToken");
        if (userDataJSON) setUserData(JSON.parse(userDataJSON));
        if (token) setUserToken(token);
      } catch (error) {
        console.error("Failed to fetch user data or token:", error);
      }
    };

    fetchUserData();

    // listen for updates
    const listener = EventRegister.addEventListener(
      "updateUserToken",
      fetchUserData
    );

    return () => EventRegister.removeEventListener(listener);
  }, []);

  return (
    <UserContext.Provider
      value={{ userData, setUserData, userToken, setUserToken }}
    >
      {children}
    </UserContext.Provider>
  );
};
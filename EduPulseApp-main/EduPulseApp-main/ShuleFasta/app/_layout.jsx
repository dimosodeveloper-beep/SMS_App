import { Slot } from "expo-router";
import { UserProvider } from "../components/UserContext";
import { LanguageProvider } from "../components/LanguageContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </UserProvider>
  );
}
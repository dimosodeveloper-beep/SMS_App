// app/_layout.jsx
import { Slot } from "expo-router";
import { UserProvider } from "../components/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
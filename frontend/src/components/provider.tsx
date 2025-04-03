import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}

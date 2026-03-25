import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/components/auth-provider";
import { ProfileProvider } from "@/components/profile-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "InstaSocial",
  description: "Copiloto para operacao de conteudo com IA",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ProfileProvider>
            <AppShell>{children}</AppShell>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { WeatherProvider } from "@/context/WeatherContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartPersistenceNotice } from "@/components/CartPersistenceNotice";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nothobile - Organic Indigenous Medicine",
  description: "Traditional healing products from South Africa's Eastern Cape",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <AdminProvider>
              <WeatherProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CartPersistenceNotice />
                </div>
              </WeatherProvider>
            </AdminProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import AdminGuard from "@/components/AdminGuard";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant" 
});

export const metadata: Metadata = {
  title: "AURA COMMERCE | Admin Portal",
  description: "Admin portal for Aura Commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <Toaster position="bottom-right" toastOptions={{
            className: 'bg-surface text-primary border border-primary/20 rounded-none font-sans text-xs uppercase tracking-widest'
          }} />
          <AdminGuard>
            <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A3D34] via-[#2B2D26] to-[#141512] flex">
              <Sidebar />
              
              {/* Main Content */}
              <main className="flex-1 p-4 pt-24 md:p-12 md:pt-12 overflow-y-auto min-h-screen">
                {children}
              </main>
            </div>
          </AdminGuard>
        </Providers>
      </body>
    </html>
  );
}

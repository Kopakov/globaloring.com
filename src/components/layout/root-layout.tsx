import { Toaster } from "sonner";
import { Header } from "./header";
import { Footer } from "./footer";

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
      <Toaster />
    </>
  );
} 
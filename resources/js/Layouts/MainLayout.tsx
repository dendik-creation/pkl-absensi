import { ReactNode } from "react";
import Header from "@/Partials/Header";
import NavbarFooter from "@/Partials/NavbarFooter";
import { Toaster } from "sonner";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <>
            <div className="max-w-2xl mx-auto w-full h-screen flex flex-col">
                <Toaster position={"top-center"} />
                <Header />
                <main className="flex-1 overflow-y-auto p-4">{children}</main>
                <NavbarFooter />
            </div>
        </>
    );
}

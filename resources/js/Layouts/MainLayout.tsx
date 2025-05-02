import { ReactNode, useEffect } from "react";
import Header from "@/Partials/Header";
import NavbarFooter from "@/Partials/NavbarFooter";
import { Toaster } from "sonner";

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    className?: string;
}

export function MainLayout({ children, title, className }: MainLayoutProps) {
    useEffect(() => {
        document.title = `${title}`;
    }, [title]);

    return (
        <div
            className={`max-w-2xl mx-auto w-full h-screen flex flex-col ${className}`}
        >
            <Toaster position={"top-center"} />
            <Header title={title} />
            <main className="flex-1 overflow-y-auto p-3 mb-20 relative">
                {children}
            </main>
            <NavbarFooter />
        </div>
    );
}

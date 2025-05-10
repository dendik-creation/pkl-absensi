import { Button } from "@/Components/ui/button";
import React, { useState } from "react";
import { FiLoader, FiLogOut } from "react-icons/fi";
import { Link, useForm } from "@inertiajs/react";
import { DrawerConfirmAction } from "@/Components/custom/FormElement";
import { clearLocalStorage } from "@/Services/additionalService";

export default function Header({ title }: { title?: string }) {
    const { post, processing } = useForm();
    const [signoutDrawerOpen, setsignoutDrawerOpen] = useState<boolean>(false);
    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        clearLocalStorage();
        setsignoutDrawerOpen(false);
        post("/auth/signout", {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <header className="bg-white px-5 z-[999] flex items-center justify-between rounded-b-md border-b">
            <Link href="/" className="flex items-center gap-2">
                <img
                    src="/assets/img/favicon.png"
                    alt="Header Image"
                    className="h-16"
                />
            </Link>
            <h4 className="font-semibold">{title}</h4>
            <div>
                <Button
                    variant={"link"}
                    disabled={processing}
                    className="flex font-medium items-center bg-red-200"
                    onClick={(e) => {
                        e.preventDefault();
                        setsignoutDrawerOpen(true);
                    }}
                >
                    {processing ? (
                        <span className="flex items-center gap-2 justify-center">
                            <FiLoader className="animate-spin" size={16} />
                            <span>Logout</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 justify-center">
                            <FiLogOut className="" />
                            <span>Logout</span>
                        </span>
                    )}
                </Button>
                <DrawerConfirmAction
                    title="Konfirmasi Logout"
                    description="Apakah Anda yakin ingin keluar dari aplikasi ini?"
                    confirmAction={handleLogout}
                    isOpen={signoutDrawerOpen}
                    onClose={() => setsignoutDrawerOpen(false)}
                />
            </div>
        </header>
    );
}

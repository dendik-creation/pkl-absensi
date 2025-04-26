import { Button } from "@/Components/ui/button";
import React from "react";
import { FiLoader, FiLogOut } from "react-icons/fi";
import { useForm } from "@inertiajs/react";

export default function Header({ title }: { title?: string }) {
    const { post, processing } = useForm();

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        post("/auth/signout");
    };

    return (
        <header className="bg-white px-5 z-[999] flex items-center justify-between border-b">
            <img
                src="/assets/img/smk-bisa-hebat.png"
                alt="Header Image"
                className="h-16"
            />
            <h4 className="font-semibold">{title}</h4>
            <form onSubmit={handleLogout}>
                <Button
                    type="submit"
                    variant={"link"}
                    disabled={processing}
                    className="flex font-medium items-center bg-red-200"
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
            </form>
        </header>
    );
}

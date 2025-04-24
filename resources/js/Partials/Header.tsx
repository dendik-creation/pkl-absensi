import { Button } from "@/Components/ui/button";
import React from "react";
import { FiLogOut } from "react-icons/fi";

export default function Header() {
    return (
        <header className="bg-white px-5 flex items-center justify-between border">
            <img
                src="/assets/img/smk-bisa-hebat.png"
                alt="Header Image"
                className="h-16"
            />
            <h4 className="font-semibold">PKL Absensi</h4>
            <Button
                variant={"link"}
                className="flex font-medium items-center bg-red-200"
            >
                <FiLogOut className="" />
                <span>Logout</span>
            </Button>
        </header>
    );
}

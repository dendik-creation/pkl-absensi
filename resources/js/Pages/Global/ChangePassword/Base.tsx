import React from "react";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import CheckPassword from "./CheckPassword";
import ChangePasswordAction from "./ChangePasswordAction";

export default function ChangePassword({ title }: { title?: string }) {
    const [step, setStep] = React.useState<number>(1);

    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Ubah password sesuai instruksi"
            />
            {step === 1 && <CheckPassword onSuccess={() => setStep(2)} />}
            {step === 2 && <ChangePasswordAction />}
        </MainLayout>
    );
}

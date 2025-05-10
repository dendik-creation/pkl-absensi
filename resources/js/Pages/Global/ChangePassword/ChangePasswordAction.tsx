import React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    DrawerConfirmAction,
    ErrorInput,
} from "@/Components/custom/FormElement";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { FiKey, FiLoader } from "react-icons/fi";
import { clearLocalStorage } from "@/Services/additionalService";

export default function ChangePasswordAction() {
    const [openConfirmAction, setOpenConfirmAction] = React.useState(false);
    const [onSignOut, setOnSignOut] = React.useState(false);
    const { data, setData, errors, put, setError, processing, post } = useForm({
        new_password: "",
        confirm_password: "",
    });

    const validatePassword = (password: string): boolean => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);

        if (password.length < minLength) {
            setError("new_password", "Password harus minimal 8 karakter");
            return false;
        }
        if (!hasUpperCase) {
            setError(
                "new_password",
                "Password harus mengandung minimal 1 huruf besar"
            );
            return false;
        }
        if (!hasLowerCase) {
            setError(
                "new_password",
                "Password harus mengandung minimal 1 huruf kecil"
            );
            return false;
        }
        return true;
    };

    const validateForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.new_password) {
            setError("new_password", "Password tidak boleh kosong");
            return false;
        }
        if (!validatePassword(data.new_password)) {
            return false;
        }
        if (!data.confirm_password) {
            setError(
                "confirm_password",
                "Konfirmasi password tidak boleh kosong"
            );
            return false;
        }
        if (data.new_password !== data.confirm_password) {
            BlastSonner({
                message: "Password dan konfirmasi password tidak sama",
                type: BlastType.ERROR,
            });
            return false;
        }
        setOpenConfirmAction(true);
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOpenConfirmAction(false);
        put("/profile/change-password", {
            preserveState: true,
            onError: (errors) => {
                BlastSonner({
                    message: errors?.message || "",
                    type: BlastType.ERROR,
                });
            },
            onSuccess: () => {
                BlastSonner({
                    message:
                        "Password berhasil diperbarui. Bersiap untuk logout",
                    type: BlastType.SUCCESS,
                });
                setOnSignOut(true);
                setTimeout(() => {
                    clearLocalStorage();
                    post("/auth/signout", {
                        preserveState: true,
                        replace: true,
                        onSuccess: () => {
                            setOnSignOut(false);
                        },
                    });
                }, 1000);
            },
        });
    };

    return (
        <form onSubmit={validateForm}>
            <div className="mb-3">
                <label className="text-base mb-1">Password Baru</label>
                <Input
                    type="password"
                    placeholder="Masukkan Password Baru"
                    value={data.new_password}
                    onChange={(e) => setData("new_password", e.target.value)}
                    className={`py-6 ${
                        errors.new_password ? "border-red-500" : ""
                    }`}
                />
                {errors.new_password && (
                    <ErrorInput error={errors.new_password} />
                )}
            </div>
            <div className="mb-3">
                <label className="text-base mb-1">Konfirmasi Password</label>
                <Input
                    type="password"
                    placeholder="Masukkan Password Baru"
                    value={data.confirm_password}
                    onChange={(e) =>
                        setData("confirm_password", e.target.value)
                    }
                    className={`py-6 ${
                        errors.confirm_password ? "border-red-500" : ""
                    }`}
                />
                {errors.confirm_password && (
                    <ErrorInput error={errors.confirm_password} />
                )}
            </div>
            <Button
                type="submit"
                className="w-full mt-4 p-6 bg-red-500 hover:bg-red-600"
                disabled={processing || onSignOut}
            >
                {processing || onSignOut ? (
                    <FiLoader className="animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        <FiKey />
                        <span>Ubah Password</span>
                    </span>
                )}
            </Button>
            <DrawerConfirmAction
                title="Ubah Password Sekarang ?"
                description="Anda harus login dengan password baru setelah ini"
                confirmAction={handleSubmit}
                isOpen={openConfirmAction}
                onClose={() => setOpenConfirmAction(false)}
            />
        </form>
    );
}

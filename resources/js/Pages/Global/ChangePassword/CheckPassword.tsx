import React from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { ErrorInput } from "@/Components/custom/FormElement";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { FiLoader } from "react-icons/fi";
import { ShieldEllipsis } from "lucide-react";

export default function CheckPassword({
    onSuccess,
}: {
    onSuccess: () => void;
}) {
    const { data, setData, errors, post, setError, processing } = useForm({
        current_password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.current_password) {
            setError("current_password", "Password tidak boleh kosong");
            return;
        }
        post("/profile/change-password/check", {
            preserveState: true,
            onError: (errors) => {
                BlastSonner({
                    message: errors?.current_password || "",
                    type: BlastType.ERROR,
                });
            },
            onSuccess: () => {
                onSuccess();
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="text-base mb-1">Password Sekarang</label>
                <Input
                    type="password"
                    placeholder="Masukkan Password Sekarang"
                    value={data.current_password}
                    onChange={(e) =>
                        setData("current_password", e.target.value)
                    }
                    className={`py-6 ${
                        errors.current_password ? "border-red-500" : ""
                    }`}
                />
                {errors.current_password && (
                    <ErrorInput error={errors.current_password} />
                )}
            </div>
            <Button
                type="submit"
                className="w-full mt-4 p-6 bg-green-500 hover:bg-green-600"
                disabled={processing}
            >
                {processing ? (
                    <FiLoader className="animate-spin" />
                ) : (
                    <span className="flex items-center gap-2">
                        <ShieldEllipsis />
                        <span>Cek Password</span>
                    </span>
                )}
            </Button>
        </form>
    );
}

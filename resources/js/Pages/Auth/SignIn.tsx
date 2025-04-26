import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { FiKey, FiLoader, FiLogIn, FiUser } from "react-icons/fi";
import { ErrorInput } from "@/Components/custom/FormElement";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Toaster } from "sonner";

export default function SignIn() {
    const { data, setData, post, processing, errors, setError } = useForm({
        username: "",
        password: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.username) setError("username", "Masukkan username");
        if (!data.password) setError("password", "Masukkan password");
        if (!data.username || !data.password) return;
        post("/auth/signin", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                return BlastSonner({
                    type: BlastType.ERROR,
                    message: errors.message,
                });
            },
        });
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-background">
            <Toaster position={"top-center"} />
            <Card className="w-full max-w-xl shadow-md mx-4">
                <CardHeader>
                    <img
                        src="/assets/img/smk-bisa-hebat.png"
                        alt="Icon Image"
                        className="mx-auto bg-cover h-32"
                    />
                    <CardTitle className="text-center text-xl">
                        Masuk ke Akun Anda
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <div className="flex items-center">
                                <span className="absolute left-3 text-gray-500">
                                    <FiUser />
                                </span>
                                <Input
                                    type="text"
                                    placeholder="Username"
                                    value={data.username}
                                    onChange={(e) =>
                                        setData("username", e.target.value)
                                    }
                                    className={`pl-10 py-6 ${
                                        errors.username ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                            {errors.username && (
                                <ErrorInput error={errors.username} />
                            )}
                        </div>
                        <div className="relative">
                            <div className="flex items-center">
                                <span className="absolute left-3 text-gray-500">
                                    <FiKey />
                                </span>
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`pl-10 py-6 ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                            {errors.password && (
                                <ErrorInput error={errors.password} />
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full p-6 bg-blue-500 hover:bg-blue-600"
                            disabled={processing}
                        >
                            {processing ? (
                                <FiLoader className="animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <span>Masuk</span>
                                    <FiLogIn />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

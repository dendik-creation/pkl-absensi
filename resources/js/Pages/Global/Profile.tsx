import { ErrorInput } from "@/Components/custom/FormElement";
import { Input } from "@/Components/ui/input";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { User } from "@/Types/user";
import { Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { FiKey, FiLoader, FiSave } from "react-icons/fi";
import { useState } from "react";
import { Ban, Pencil } from "lucide-react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";

export default function GlobalProfile({
    title,
    user,
}: {
    title: string;
    user: User;
}) {
    const currentRole = user.role.toUpperCase();
    const ProfileAdminForm = () => {
        const [editMode, setEditMode] = useState<boolean>(false);
        const adminForm = useForm({
            username: user.username,
            email: user.email,
        });
        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            adminForm.put("/profile/update", {
                preserveState: true,
                replace: true,
                onError: (errors) => {
                    setEditMode(true);
                    return BlastSonner({
                        message: errors.email || errors.username || "",
                        type: BlastType.ERROR,
                    });
                },
                onSuccess: (page: any) => {
                    setEditMode(false);
                    if (page.props.flash && page.props.flash?.success) {
                        return BlastSonner({
                            message:
                                page.props.flash?.success ?? ("" as string),
                            type: BlastType.SUCCESS,
                        });
                    }
                },
            });
        };
        return (
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Username</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Username"
                            value={adminForm.data.username}
                            disabled={!editMode}
                            onChange={(e) =>
                                adminForm.setData("username", e.target.value)
                            }
                            className={`py-6 ${
                                adminForm.errors.username
                                    ? "border-red-500"
                                    : ""
                            }`}
                        />
                        {adminForm.errors.username && (
                            <ErrorInput error={adminForm.errors.username} />
                        )}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Role</label>
                        <Input
                            type="text"
                            placeholder="Masukkan Role"
                            value={user.role}
                            disabled={true}
                            className={`py-6 ${
                                adminForm.errors.email ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">
                            Email (Opsional)
                        </label>
                        <Input
                            type="text"
                            placeholder="Masukkan Email"
                            disabled={!editMode}
                            value={adminForm.data.email ?? ""}
                            onChange={(e) =>
                                adminForm.setData("email", e.target.value)
                            }
                            className={`py-6 ${
                                adminForm.errors.email ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                </div>
                {editMode ? (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        <Button
                            type="button"
                            onClick={() => {
                                setEditMode(false);
                                adminForm.setData("email", user?.email);
                                adminForm.setData("username", user?.username);
                            }}
                            className="w-full mt-4 p-6 bg-red-500 hover:bg-red-600"
                        >
                            <span className="flex items-center gap-2">
                                <Ban />
                                <span>Batalkan</span>
                            </span>
                        </Button>
                        <Button
                            type="submit"
                            className="w-full mt-4 p-6 col-span-2 bg-blue-500 hover:bg-blue-600"
                            disabled={adminForm.processing}
                        >
                            {adminForm.processing ? (
                                <FiLoader className="animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <FiSave />
                                    <span>Simpan</span>
                                </span>
                            )}
                        </Button>
                    </div>
                ) : (
                    <>
                        <Button
                            type="button"
                            className="w-full mt-4 p-6 bg-blue-200 hover:bg-blue-300"
                            disabled={editMode}
                            onClick={() => setEditMode(true)}
                        >
                            <span className="flex items-center gap-2 text-blue-900">
                                <Pencil />
                                <span>Edit </span>
                            </span>
                        </Button>
                        <Link href={"/profile/change-password"}>
                            <Button
                                type="button"
                                className="w-full mt-4 p-6 bg-yellow-200 hover:bg-yellow-300"
                                disabled={editMode}
                            >
                                <span className="flex items-center gap-2 text-blue-900">
                                    <FiKey />
                                    <span>Ubah Password </span>
                                </span>
                            </Button>
                        </Link>
                    </>
                )}
            </form>
        );
    };
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Anda dapat merubah data diri anda disini"
            />
            {currentRole === "ADMIN" ? <ProfileAdminForm /> : null}
        </MainLayout>
    );
}

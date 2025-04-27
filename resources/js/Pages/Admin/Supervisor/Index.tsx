import { SearchInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Link, router } from "@inertiajs/react";
import { ChevronRight, PlusCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Supervisor } from "@/Types/supervisor";

export type AdminSupervisorIndexProps = {
    title?: string;
    supervisors: Supervisor[];
};

export default function AdminSupervisorIndex({
    title,
    supervisors,
}: AdminSupervisorIndexProps) {
    const { flash } = usePage().props as any;
    const [supervisorsData, setSupervisorsData] =
        useState<Supervisor[]>(supervisors);
    const [searchValue, setSearchValue] = useState<string>("");

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/admin/supervisor",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setSupervisorsData(page.props.supervisors as Supervisor[]);
                },
            }
        );
    });

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    return (
        <MainLayout title="Data Pembimbing">
            <PageTitle
                title={title as string}
                description="Data pembinbing yang bertugas di DuDi"
                backUrl="/admin/dashboard"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari NIP atau nama pembimbing"
            />

            <Link href={"/admin/supervisor/create"}>
                <Button
                    size={"lg"}
                    variant="outline"
                    className="w-full bg-green-200 border mb-5 hover:bg-green-300 flex justify-center items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>Tambah Pembimbing</span>
                </Button>
            </Link>

            <div className="grid grid-cols-1">
                {supervisorsData.length > 0 ? (
                    supervisorsData.map((supervisor, index) => (
                        <Link
                            key={index}
                            href={`/admin/supervisor/${supervisor.id}`}
                        >
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3 className="text-xl font-semibold">
                                        {supervisor.nip ?? "NIP tidak ada"}
                                    </h3>
                                    <p className="text-base">
                                        {supervisor?.full_name}{" "}
                                        <span className="text-sm">
                                            {" - "}
                                            {supervisor?.user?.email ??
                                                "Tanpa email"}
                                        </span>
                                    </p>
                                    {supervisor?.workshop != null ? (
                                        <div className="">
                                            <p className="text-base">
                                                Bertugas di{" "}
                                                <span className="font-medium text-slate-700 hover:text-blue-500">
                                                    <Link
                                                        href={`/admin/workshop/${supervisor?.workshop?.id}`}
                                                    >
                                                        {
                                                            supervisor?.workshop
                                                                ?.name
                                                        }
                                                    </Link>
                                                </span>
                                            </p>
                                            <p className="text-base">
                                                Mendampingi{" "}
                                                <span className="font-medium">
                                                    {
                                                        supervisor?.workshop
                                                            ?.students?.length
                                                    }{" "}
                                                </span>
                                                Siswa
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-base">
                                            Tidak bertugas di DuDi apapun
                                        </p>
                                    )}
                                </div>
                                <ChevronRight
                                    size={28}
                                    className="text-amber-400 z-10"
                                />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-amber-100 to-white rounded-l-md"></div>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <NotFoundInList />
                )}
            </div>
        </MainLayout>
    );
}

import { ImportFileDrawer, SearchInput } from "@/Components/custom/FormElement";
import NotFoundInList from "@/Components/custom/NotFoundInList";
import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { inputDebounce } from "@/Services/additionalService";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowUpFromLine, ChevronRight, PlusCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { usePage } from "@inertiajs/react";
import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import { Workshop } from "@/Types/workshop";

export type AdminWorkshopIndexProps = {
    title?: string;
    workshops: Workshop[];
};

export default function AdminWorkshopIndex({
    title,
    workshops,
}: AdminWorkshopIndexProps) {
    const { flash } = usePage().props as any;
    const [workshopsData, setworkshopsData] = useState<Workshop[]>(workshops);
    const [searchValue, setSearchValue] = useState<string>("");

    const [importDrawerOpen, setImportDrawerOpen] = useState<boolean>(false);
    const [onImport, setOnImport] = useState<boolean>(false);

    const { data, post, setData } = useForm({
        file_excel: null as File | null,
    });
    const handleImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file_excel) return;

        setOnImport(true);

        post(`/admin/workshop/import`, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            preserveScroll: true,
            replace: true,
            onError: (error: any) => {
                setOnImport(false);
                BlastSonner({
                    type: BlastType.ERROR,
                    message: error.message,
                });
            },
            onFinish: () => {
                setOnImport(false);
                setImportDrawerOpen(false);
                setData("file_excel", null);
            },
        });
    };

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/admin/workshop",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setworkshopsData(page.props.workshops as Workshop[]);
                },
                onError: (error) => {
                    BlastSonner({
                        type: BlastType.ERROR,
                        message: error.message,
                    });
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
        <MainLayout title="Data DuDi">
            <PageTitle
                title={title as string}
                description="DuDi yang terdaftar di sistem"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari DuDi atau alamatnya"
            />

            <Link href={"/admin/workshop/create"}>
                <Button
                    size={"lg"}
                    variant="outline"
                    className="w-full bg-green-200 border mb-3 hover:bg-green-300 flex justify-center items-center gap-2"
                >
                    <PlusCircle size={20} />
                    <span>Tambah DuDi</span>
                </Button>
            </Link>

            <div className="w-full">
                <Button
                    size={"lg"}
                    onClick={() => setImportDrawerOpen(true)}
                    variant="outline"
                    className="w-full bg-blue-200 border mb-5 hover:bg-blue-300 flex justify-center items-center gap-2"
                >
                    <ArrowUpFromLine size={20} />
                    <span>Import Data DuDi</span>
                </Button>
                <ImportFileDrawer
                    title="Import Data DuDi"
                    description="Import data DuDi dari file excel"
                    file={data.file_excel}
                    onFileChange={(file: File | null) =>
                        setData("file_excel", file)
                    }
                    submitting={onImport}
                    onSubmit={handleImport}
                    isOpen={importDrawerOpen}
                    templatePath="assets/files/template/import-DuDi-pkl.xlsx"
                    onClose={() => setImportDrawerOpen(false)}
                />
            </div>

            <div className="grid grid-cols-1">
                {workshopsData.length > 0 ? (
                    workshopsData.map((workshop, index) => (
                        <Link
                            key={index}
                            href={`/admin/workshop/${workshop.id}`}
                        >
                            <Card className="shadow-md p-4 mb-3 flex items-center overflow-hidden justify-between relative">
                                <div className="z-10">
                                    <h3 className="text-xl font-semibold">
                                        {workshop.name}
                                    </h3>
                                    <p className="text-base">
                                        {workshop?.owner_name} (Owner) -{" "}
                                        <span className="text-sm">
                                            {workshop?.phone ??
                                                "No telp tidak ada"}
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        {workshop?.address}
                                    </p>
                                </div>
                                <ChevronRight
                                    size={28}
                                    className="text-green-400 z-10"
                                />
                                <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-green-100 to-white rounded-l-md"></div>
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

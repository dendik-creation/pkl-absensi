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
import { Workshop } from "@/Types/workshop";

export type SupervisorWorkshopIndexProps = {
    title?: string;
    workshops: Workshop[];
};

export default function SupervisorWorkshopIndex({
    title,
    workshops,
}: SupervisorWorkshopIndexProps) {
    const { flash } = usePage().props as any;
    const [workshopsData, setworkshopsData] = useState<Workshop[]>(workshops);
    const [searchValue, setSearchValue] = useState<string>("");

    if (flash.success) {
        BlastSonner({
            type: BlastType.SUCCESS,
            message: flash.success,
        });
    }

    const debouncedSearch = inputDebounce(async (value: string) => {
        router.get(
            "/supervisor/workshop",
            { search: value },
            {
                preserveState: true,
                replace: true,
                onSuccess: (page) => {
                    setworkshopsData(page.props.workshops as Workshop[]);
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
                description="DuDi yang ditempati oleh siswa-siswi Anda"
            />

            <SearchInput
                className="mb-5"
                value={searchValue}
                onChange={handleSearch}
                placeholder="Cari DuDi atau alamatnya"
            />

            <div className="grid grid-cols-1">
                {workshopsData.length > 0 ? (
                    workshopsData.map((workshop, index) => (
                        <Link
                            key={index}
                            href={`/supervisor/workshop/${workshop.id}`}
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

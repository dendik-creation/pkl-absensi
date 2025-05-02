import { Button } from "@/Components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { usePage } from "@inertiajs/react";

export const PageTitle = ({
    title,
    description,
}: {
    title: string;
    description: string;
}) => {
    const { url, props } = usePage();

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="flex mt-3 justify-start items-center gap-5 mb-8">
            {!url.split("?")[0].includes("dashboard") && (
                <Button
                    onClick={handleBack}
                    className="h-full py-5"
                    size={"icon"}
                    variant={"outline"}
                >
                    <ChevronLeftIcon className="text-gray-800" />
                </Button>
            )}
            <div className="flex flex-col">
                <h2 className="font-semibold text-2xl">{title}</h2>
                <span className="text-slate-700">{description}</span>
            </div>
        </div>
    );
};

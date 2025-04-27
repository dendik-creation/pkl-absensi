import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { ChevronLeftIcon } from "lucide-react";

export const PageTitle = ({
    title,
    description,
    backUrl,
}: {
    title: string;
    description: string;
    backUrl?: string;
}) => {
    return (
        <div className="flex mt-3 justify-start items-center gap-5 mb-8">
            {backUrl && (
                <Link href={backUrl}>
                    <Button
                        className="h-full py-5"
                        size={"icon"}
                        variant={"outline"}
                    >
                        <ChevronLeftIcon className="text-gray-800" />
                    </Button>
                </Link>
            )}
            <div className="flex flex-col">
                <h2 className="font-semibold text-2xl">{title}</h2>
                <span className="text-slate-700">{description}</span>
            </div>
        </div>
    );
};

import BlastSonner, { BlastType } from "@/Components/custom/BlastSonner";
import RichTextEditorInput, {
    DatePickerInput,
    ErrorInput,
} from "@/Components/custom/FormElement";
import { Button } from "@/Components/ui/button";
import { MainLayout } from "@/Layouts/MainLayout";
import { PageTitle } from "@/Partials/PageTitle";
import { useForm } from "@inertiajs/react";
import React from "react";
import { FiLoader, FiSave } from "react-icons/fi";

type StudentJournalCreateProps = {
    title?: string;
    date: string;
};

export default function StudentJournalCreate({
    title,
    date,
}: StudentJournalCreateProps) {
    const { data, setData, post, processing, errors, setError, clearErrors } =
        useForm({
            date: date,
            activity: "",
        });

    function isRichTextEmpty(html: string): boolean {
        if (!html || html.trim() === "") return true;

        const doc = new DOMParser().parseFromString(html, "text/html");
        const text = doc.body.textContent?.replace(/\u200B/g, "").trim() || "";

        return text === "";
    }

    const handleErrorInput = () => {
        const fields: { key: keyof typeof data; message: string }[] = [
            { key: "date", message: "Tanggal wajib diisi" },
            { key: "activity", message: "Aktivitas wajib diisi" },
        ];

        let hasError = false;

        fields.forEach(({ key, message }) => {
            if (key === "activity" && isRichTextEmpty(data.activity)) {
                setError(key, message);
                hasError = true;
            } else if (!data[key]) {
                setError(key, message);
                hasError = true;
            } else {
                clearErrors(key);
            }
        });

        return hasError;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const hasError = handleErrorInput();

        if (hasError) {
            return;
        }

        clearErrors();

        post("/student/journal", {
            preserveScroll: true,
            replace: true,
            onError: (errors) => {
                return BlastSonner({
                    type: BlastType.ERROR,
                    message: errors.message,
                });
            },
            onFinish: () => {
                clearErrors();
            },
        });
    };
    return (
        <MainLayout title={title as string}>
            <PageTitle
                title={title as string}
                description="Tambahkan aktivitas kamu hari ini"
            />
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Tanggal</label>
                        <DatePickerInput
                            value={data.date}
                            mode="single"
                            placeholder="Pilih Tanggal"
                            onChange={(date) => {
                                setData("date", date?.toString() || "");
                            }}
                            className="mb-5 py-2"
                        />
                        {errors.date && <ErrorInput error={errors.date} />}
                    </div>
                </div>
                <div className="mb-5">
                    <div className="flex flex-col">
                        <label className="text-base mb-1">Aktivitas</label>
                        <RichTextEditorInput
                            content={data.activity}
                            onChange={(val) => setData("activity", val)}
                        />
                        {errors.activity && (
                            <ErrorInput error={errors.activity} />
                        )}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full mt-4 p-6 bg-amber-500 hover:bg-amber-600"
                    disabled={processing}
                >
                    {processing ? (
                        <FiLoader className="animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            <FiSave />
                            <span>Simpan</span>
                        </span>
                    )}
                </Button>
            </form>
        </MainLayout>
    );
}

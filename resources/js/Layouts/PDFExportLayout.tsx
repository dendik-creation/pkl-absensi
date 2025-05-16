import { ymdToIdDate } from "@/Services/additionalService";
import React, { ReactNode, useEffect } from "react";

type PDFExportLayoutProps = {
    children: ReactNode;
    title?: string;
    className?: string;
    withHeader?: boolean;
    appSetting: GlobalSetting;
};

export default function PDFExportLayout({
    children,
    title,
    className,
    withHeader = true,
    appSetting,
}: PDFExportLayoutProps) {
    useEffect(() => {
        document.title = `${title}`;
    }, [title]);

    useEffect(() => {
        const handlePrint = () => {
            window.print();
            window.close();
        };

        const handleBeforePrint = () => {
            window.addEventListener("afterprint", handlePrint);
        };

        const handleAfterPrint = () => {
            window.removeEventListener("afterprint", handlePrint);
            window.close();
        };

        window.addEventListener("beforeprint", handleBeforePrint);
        window.addEventListener("afterprint", handleAfterPrint);

        window.print();

        return () => {
            window.removeEventListener("beforeprint", handleBeforePrint);
            window.removeEventListener("afterprint", handleAfterPrint);
        };
    }, []);

    const PDFHeader = () => {
        return (
            <>
                <header className="flex gap-4 justify-start w-full items-center">
                    {/* Icon */}
                    <div className="flex flex-col justify-center items-center w-[70px] h-[70px]">
                        {/* School Icon */}
                        <img
                            src="/assets/img/school_icon.png"
                            className="object-contain w-full h-full"
                            alt="Logo"
                        />
                    </div>
                    {/* School Name */}
                    <div className="flex flex-col justify-start items-start">
                        <span
                            className="text-xl font-bold"
                            style={{ lineHeight: 1.3 }}
                        >
                            {appSetting.school_name}
                        </span>
                        <span
                            className="text-sm font-normal"
                            style={{ lineHeight: 1.2 }}
                        >
                            {appSetting.school_address ?? <i>Alamat Sekolah</i>}{" "}
                            {", "}{" "}
                            {appSetting.school_phone ? (
                                "Telepon " + appSetting.school_phone
                            ) : (
                                <i>No Telepon</i>
                            )}
                        </span>
                        <div className="flex gap-1">
                            <span
                                className="text-sm font-normal"
                                style={{ lineHeight: 1.2 }}
                            >
                                {appSetting.school_email ?? (
                                    <i>Email Sekolah</i>
                                )}
                            </span>
                            <span className="text-sm font-normal">,</span>
                            <span
                                className="text-sm font-normal"
                                style={{ lineHeight: 1.2 }}
                            >
                                {appSetting.school_website ?? (
                                    <i>Website Sekolah</i>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-[70px] h-[70px]">
                        {/* App Icon */}
                        <img
                            src="/assets/img/favicon.png"
                            className="object-contain w-full h-full"
                            alt="Logo"
                        />
                    </div>
                </header>
                <center className="mb-4">
                    <hr className="border-2 border-black opacity-100 m-0 rounded-lg" />
                </center>
            </>
        );
    };

    const WatermarkFootnote = () => {
        return (
            <div
                className="text-start"
                style={{
                    position: "fixed",
                    bottom: "10px",
                    left: "10px",
                    right: "10px",
                }}
            >
                <span className="text-xs font-normal text-slate-600">
                    {appSetting.app_name} -{" "}
                    {ymdToIdDate(new Date().toDateString())}
                </span>
            </div>
        );
    };

    return (
        <>
            <div style={{ fontFamily: "Calibri", position: "relative" }}>
                {withHeader && <PDFHeader />}
                <main>{children}</main>
                <WatermarkFootnote />
            </div>
        </>
    );
}

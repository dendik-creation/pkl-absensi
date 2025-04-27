import React from "react";
import Chart from "react-apexcharts";
import { Card } from "../ui/card";
import { FileWarning } from "lucide-react";
import { PiEmptyBold } from "react-icons/pi";

interface ApexBarChartProps {
    categories: string[];
    title: string;
    description: string;
    series: { name: string; data: number[] }[];
    colors?: string[];
    height?: number;
}

export const ApexBarChart: React.FC<ApexBarChartProps> = ({
    categories,
    title,
    description,
    series,
    colors = ["#008FFB"],
    height = 350,
}) => {
    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "bar",
            toolbar: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "65%",
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: "Space Grotesk",
            },
        },
        xaxis: {
            categories,
        },
        colors,
    };

    return (
        <Card className="p-4 shadow-md">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-500 mb-4">{description}</p>
            <Chart
                options={options}
                series={series}
                type="bar"
                height={height}
            />
        </Card>
    );
};

export const ChartNoData = ({ title }: { title: string }) => {
    return (
        <Card className="p-5 shadow-md overflow-hidden relative">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm text-gray-500">Data belum tersedia</p>
            <div className="absolute -bottom-5 -right-2">
                <PiEmptyBold size={100} color="#FFCDD2" />
            </div>
        </Card>
    );
};

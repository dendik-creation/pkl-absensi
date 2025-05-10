export type MenuItem = {
    icon: React.ReactNode;
    label: string;
    url: string;
    acceptedRole?: string[] | null | undefined;
    activeOnUrls?: string[] | null | undefined;
};

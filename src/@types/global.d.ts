type Languages = "pt_br" | "en_us";

interface ProgramProperties {
    readonly programRootDir: string;
    destinationPath?: string, 
    lang: Languages
}

interface DatabaseProperties {
    readonly name: string;
    readonly displayName: Record<Languages, string>;
    readonly enabled: boolean;
    readonly prisma?: boolean;
}
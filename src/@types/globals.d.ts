import packageJson from "../../package.json";

type P = typeof packageJson;

interface PackageJson extends P {};

type Languages = "pt_br" | "en_us";

interface ProgramProperties {
    readonly programRootDir: string;
    destinationPath?: string, 
    lang: Languages
}

interface PresetProperties {
    readonly name: string;
    readonly displayName: Record<Languages, string>;
    readonly disabled: boolean
}
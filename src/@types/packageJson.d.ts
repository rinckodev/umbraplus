import packageJson from "../../package.json";

type P = typeof packageJson;

declare interface PackageJson extends P {};
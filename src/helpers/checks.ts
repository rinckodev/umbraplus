import clack from "@clack/prompts";
import { style } from "@opentf/cli-styles";


export function checkCancel<T>(result: T | symbol): T{
	if (clack.isCancel(result)) {
		clack.cancel(style("$hex(#6D83D1){http://discord.gg/tTu8dGN}"));
		process.exit(0)
	}
	return result as T;
}

export function isUnicodeSupported() {
	if (process.platform !== "win32") {
		return process.env.TERM !== "linux"; // Linux console (kernel)
	}
	return Boolean(process.env.CI)
		|| Boolean(process.env.WT_SESSION) // Windows Terminal
		|| Boolean(process.env.TERMINUS_SUBLIME) // Terminus (<0.2.27)
		|| process.env.ConEmuTask === "{cmd::Cmder}" // ConEmu and cmder
		|| process.env.TERM_PROGRAM === "Terminus-Sublime"
		|| process.env.TERM_PROGRAM === "vscode"
		|| process.env.TERM === "xterm-256color"
		|| process.env.TERM === "alacritty"
		|| process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm";
}
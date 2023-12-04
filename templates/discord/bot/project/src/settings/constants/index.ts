import { join } from "node:path";
import { cwd } from "node:process";

// Defaults
global.animated = true; // Animated property
global.fetchReply = true; // Interaction reply/followUp property
global.ephemeral = true; // Interaction reply/followUp property
global.required = true; // Command options, modal inputs property
global.inline = true; // Embed fields property
global.disabled = true; // Button and select menus property
global.dmPermission = false; // Command options property
global.components = []; // Interaction reply/followUp property
global.embeds = []; // Interaction reply/followUp property
global.__rootname = cwd(); // Project root dir
global.rootTo = (...path: string[]) => join(__rootname, ...path); // Create a path from root
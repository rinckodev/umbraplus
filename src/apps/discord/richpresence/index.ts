import { log, text } from "@clack/prompts";

export default async () => {
    const projectName = await text({
        message: "Project name?",
        placeholder: "type \".\" to create using current dir",
        defaultValue: "richpresence-app"
    })

    log.info(String(projectName));
}
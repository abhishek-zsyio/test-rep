import { execAsync } from "astal/gtk3";

export async function sh(cmd: string): Promise<string> {
    try {
        return await execAsync(["bash", "-c", cmd]);
    } catch (err) {
        console.error(`Error executing command '${cmd}':`, err);
        return "";
    }
}

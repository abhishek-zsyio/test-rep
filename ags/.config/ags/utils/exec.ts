import { execAsync } from "astal";

export async function sh(cmd: string): Promise<string> {
  try {
    return await execAsync(["bash", "-c", cmd]);
  } catch (err) {
    console.error(`sh exec error: ${cmd}`, err);
    return "";
  }
}

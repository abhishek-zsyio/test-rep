import { Variable } from "astal";
import { sh } from "../utils/exec";

export const currentTheme = Variable("rose-pine");

export async function switchTheme(name: string) {
  await sh(`theme-switch ${name}`);
  currentTheme.set(name);
}

import { Variable, Binding } from "astal";

export function bindVar<T>(v: Variable<T>): Binding<T> {
  return v.as((val) => val);
}

import { Variable, Binding } from "astal/gtk3";

export function bindVar<T>(v: Variable<T>): Binding<T> {
    return v.as((val) => val);
}

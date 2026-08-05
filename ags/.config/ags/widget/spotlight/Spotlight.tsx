import { Widget, Astal, App } from "astal/gtk3";
import { Variable } from "astal/gtk3";
import { sh } from "../../utils/exec";

export function Spotlight() {
    const query = Variable("");
    const calcResult = Variable("");

    const handleSearch = (text: string) => {
        query.set(text);
        if (/^[0-9+\-*/().\s]+$/.test(text) && text.trim().length > 0) {
            try {
                const res = Function(`"use strict"; return (${text})`)();
                if (typeof res === "number" && !isNaN(res)) {
                    calcResult.set(`= ${res}`);
                    return;
                }
            } catch {}
        }
        calcResult.set("");
    };

    const launchApp = (cmd: string) => {
        sh(cmd);
        App.toggle_window("spotlight");
    };

    return (
        <window
            name="spotlight"
            anchor={Astal.WindowAnchor.CENTER}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.EXCLUSIVE}
            visible={false}
        >
            <box vertical className="spotlight-card">
                <box className="spotlight-search-bar">
                    <label className="search-icon" label="󰍉 " />
                    <entry
                        className="search-input"
                        placeholderText="Spotlight Search: apps, math, files..."
                        text={query()}
                        onChanged={(e) => handleSearch(e.text)}
                        onActivate={() => {
                            if (calcResult.get()) return;
                            sh(`walker --search "${query.get()}"`);
                            App.toggle_window("spotlight");
                        }}
                    />
                </box>

                {/* Math Calculation Result */}
                <box className="calc-result-container">
                    {calcResult().as((res) =>
                        res ? Widget.Label({ className: "calc-result", label: res }) : null
                    )}
                </box>

                {/* Quick App Suggestions */}
                <box vertical className="spotlight-results">
                    <label className="section-title" label="Quick Launch" />
                    <box vertical className="app-list">
                        <button className="app-row" onClicked={() => launchApp("firefox")}>
                            <box className="row-box">
                                <label className="app-icon" label="󰈹 " />
                                <box vertical className="text-box">
                                    <label className="app-name" label="Firefox" />
                                    <label className="app-sub" label="Web Browser" />
                                </box>
                            </box>
                        </button>
                        <button className="app-row" onClicked={() => launchApp("kitty")}>
                            <box className="row-box">
                                <label className="app-icon" label="󰆍 " />
                                <box vertical className="text-box">
                                    <label className="app-name" label="Kitty Terminal" />
                                    <label className="app-sub" label="Command Line" />
                                </box>
                            </box>
                        </button>
                        <button className="app-row" onClicked={() => launchApp("nautilus")}>
                            <box className="row-box">
                                <label className="app-icon" label="󰉋 " />
                                <box vertical className="text-box">
                                    <label className="app-name" label="Nautilus Files" />
                                    <label className="app-sub" label="File Manager" />
                                </box>
                            </box>
                        </button>
                    </box>
                </box>
            </box>
        </window>
    );
}

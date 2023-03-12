import * as pty from "node-pty";
import { IPty } from "node-pty";

export function initProcess(command: string, args: Array<any>) {
    let onData = (data: string) => {};

    const proc: IPty = pty.spawn(command, args, {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env as any 
    });

    proc.onData((data: string) => {
        onData(data);
    });

    return {
        write(data: string) {
            proc.write(data);
        },

        terminate() {
            proc.kill("SIGTERM");
        },

        setOnData(handler: typeof onData) {
            onData = handler;
        }
    }
}

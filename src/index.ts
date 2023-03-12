import express, { Express } from "express";
import expressWs from "express-ws";
import fs from "fs";
import path from "path";
import os from "os";
import cors from "cors";

import { initProcess } from "./process";
import { EduBlocksClient } from "./types/edublocks-client";
import { DataPacket } from "./types/data-packet";

const homeDir: string = os.homedir();
const workingDir: string = path.join(homeDir, ".edublocks");
const outputScript: string = path.join(workingDir, "output.py");

import beforeScript from "./scripts/before";
import afterScript from "./scripts/after";

if (!fs.existsSync(workingDir)) {
    fs.mkdirSync(workingDir);
}

const expressApp: Express = express();
const { app } = expressWs(expressApp);

app.use(express.json());
app.use(cors());

let proc = initProcess("ipython3", []);
proc.setOnData(sendDataToAllClients);

const clients: Array<EduBlocksClient> = [];
let log: string = "";

function clearLog() {
    log = "";
}

function sendDataToAllClients(data: string) {
    log += data;

    clients.forEach((client: EduBlocksClient) => {
        client.sendPacket({
            packetType: "data",
            payload: log.substring(client.pos)
        });

        client.pos = log.length;
    });
}

app.post("/runcode", (req, res) => {
    clearLog(); 

    const code = req.body.code;
    const script: string = [beforeScript, code, afterScript].join("\r\n");

    fs.writeFileSync(outputScript, script);

    if (proc){    
        proc.terminate();
    }

    proc = initProcess("python3", ["-u", outputScript]);

    proc.setOnData(sendDataToAllClients);

    res.sendStatus(204);
});

app.ws("/terminal", (socket, req) => {
    const client: EduBlocksClient = {
        pos: 0,
        sendPacket(packet) {
            socket.send(JSON.stringify(packet));
        }
    };

    clients.push(client) - 1;

    socket.on("message", (json: string) => {
        const packet: DataPacket = JSON.parse(json);

        if (packet.packetType === "data"){
            proc.write(packet.payload);
        }
    });

    socket.on("close", () => {
        const index: number = clients.indexOf(client);
        clients.splice(index, 1);
    })
})

app.listen(8081, () => {
    console.log("\x1b[32m", "EduBlocks Link is running...");
    console.log("\x1b[37m", "Get started by going to https://app.edublocks.org");
});
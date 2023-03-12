import { DataPacket } from "./data-packet";

export interface EduBlocksClient {
    pos: number;
    sendPacket(packet: DataPacket): void;
}
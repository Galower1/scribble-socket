import axios from "axios";
import { socketClient } from "./client-socket";

const BASE_URL = new URL(
  "https://server3.skribbl.io:5005/socket.io/?EIO=4&transport=polling&t=ORbjojQ"
);

const USERNAME = "Galower";
const LOBBY_CODE = "pLCfRuBN";

async function retrieveSID() {
  const { data } = await axios.get<string>(BASE_URL.href);
  const { sid } = JSON.parse(data.slice(1, data.length));
  BASE_URL.searchParams.set("sid", sid);
  console.log("SID retrieved:", sid);
}

async function registerSID() {
  await axios.post(BASE_URL.href, "40");
  console.log("Registered SID");
}

async function confirmSID() {
  await axios.get(BASE_URL.href);
  console.log("Confirmed SID");
}

async function joinLobby() {
  const payload = `42["login",{"join":"${LOBBY_CODE}","create":0,"name":"${USERNAME}","lang":"0","avatar":[3,19,45,-1]}]`;
  const { data } = await axios.post<string>(BASE_URL.href, payload, {
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
  });

  console.log("LOBBY STATUS:", data);
}

async function getLobbyData() {
  const { data } = await axios.get<string>(BASE_URL.href);
  console.log("LOBBY DATA:");
  const parsedData = JSON.parse(data.slice(2, data.length))[1];
  console.table(parsedData.data.users);
}

async function main() {
  const connectionCommands = [
    retrieveSID,
    registerSID,
    confirmSID,
    joinLobby,
    getLobbyData,
  ];

  try {
    for (const command of connectionCommands) {
      await command();
    }
  } catch (error) {
    console.error("Error while trying to connect:", error);
  }

  BASE_URL.protocol = "wss:";

  socketClient.connect(BASE_URL.href, "echo-protocol");
}

main();

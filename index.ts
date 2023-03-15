import { client } from "websocket";
import axios from "axios";

const BASE_URL = new URL("");

const USERNAME = "";
const LOBBY_CODE = "";

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
  const connectionCommands = [retrieveSID, registerSID, confirmSID, joinLobby, getLobbyData];

  for (const command of connectionCommands) {
    await command();
  }
}

main();

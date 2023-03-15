import { client } from "websocket";

export const socketClient = new client();

socketClient.on("connectFailed", (error) => {
  console.log("Connect error:", error);
});

socketClient.on("connect", (connection) => {
  console.log("Connected to websocket");

  connection.on("error", (error) => {
    console.log("Connection error", error);
  });

  connection.on("message", (message) => {
    console.log(message);
    if (message.type === "utf8") {
      console.log("Received: ", message.utf8Data);
    }
  });

  connection.on("close", (event) => {
    console.log("Connection closed");
  });

  function keepAlive() {
    if (connection.connected) {
      connection.send("2probe", (error) => {
        console.error(error);
      });
    }
  }

  keepAlive();
});

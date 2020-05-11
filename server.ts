import * as express from "express";
import { MotorService } from "./services/motor.service";

const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const app: express.Application = express();

app.disable("x-powered-by");
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = http.createServer({}, app);
var io = require("socket.io").listen(server);

server.listen(8888, "0.0.0.0");
console.log("> server.listen 8888");

io.on("connection", (client) => {
  console.log("#connection");
  new MotorService({ client, io });

  client.on("disconnect", () => {
    const name = "@todo";
    // const name = commandsService.getClientName(client.id);
    // commandsService.remove(client.id);
    console.log(`> disconnect from ${name}`);
  });
});

/**
 * fullstack template
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2020 Frame Factory GmbH
 */

import * as sourceMapSupport from "source-map-support";
sourceMapSupport.install();

import "module-alias/register";

import * as path from "path";
import * as http from "http";

import * as express from "express";
import * as morgan from "morgan";
import * as websocket from "express-ws";
import * as session from "express-session";
import * as bodyParser from "body-parser";

import { MongoClient } from "mongodb";

////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION

const port = parseInt(process.env["DOCKER_SERVER_PORT"]) || 8000;
const isDevMode = process.env["NODE_ENV"] !== "production";

const projectDir = path.resolve(__dirname, "../../..");
const builtDir = path.resolve(projectDir, "services/server/public/built");
const staticDir = path.resolve(projectDir, "services/server/public/static");

////////////////////////////////////////////////////////////////////////////////
// GREETING

console.log(`
--------------------------------------------------------------------------------
Template - Server
--------------------------------------------------------------------------------
Port:               ${port}
Development mode:   ${isDevMode}
Project directory:  ${projectDir}
Built files:        ${builtDir} 
Static files:       ${staticDir}
--------------------------------------------------------------------------------
`);

////////////////////////////////////////////////////////////////////////////////

const app = express();
const server = new http.Server(app);
websocket(app, server);
app.disable('x-powered-by');

// logging
if (isDevMode) {
    app.use(morgan("tiny"));
}

// session
app.use(session({
    secret: "K9mp5GdcPCBhkH5M",
    name: "montage.sessionId",
    resave: true,
}));

// body parser
app.use(bodyParser.json());

// websocket
app.ws("/ws", (ws, req) => {
    ws.on("open", () => {
        console.log("[Websocket:Open]");
    });
    ws.on("close", () => {
        console.log("[Websocket:Close]");
    });
    ws.on("error", error => {
        console.log("[Websocket:Error]", error);
    });
    ws.on("message", data => {
        console.log("[Websocket:Message]", data);
    });

    console.log("[Websocket]");
});

// static file server
app.use("/", express.static(builtDir));
app.use("/", express.static(staticDir));

// client application
const indexFile = path.resolve(builtDir, isDevMode ? "display.dev.html" : "display.html");
app.use("/", (req, res) => res.sendFile(indexFile));

MongoClient.connect("mongodb://db:27017", (err, client) => {
    if (err) {
        return console.error(err);
    }

    const db = client.db("montage");
    const collection = db.collection("sessions");
    console.info(`[Server] Connected to datbase`);
});

server.listen(port, () => {
    console.info(`[Server] Ready and listening on port ${port}\n`);
});

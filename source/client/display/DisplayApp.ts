/**
 * Montage Next
 *
 * @author Ralph Wiedemeier <ralph@framefactory.io>
 * @copyright (c) 2020 Frame Factory GmbH
 * @license MIT
 */

import "../styles.scss";
import CustomElement, { customElement, html } from "@ff/ui/CustomElement";

////////////////////////////////////////////////////////////////////////////////

@customElement("ff-display-app")
export default class DisplayApp extends CustomElement
{
    private _socket: WebSocket;

    constructor()
    {
        super();

        this.onSocketOpen = this.onSocketOpen.bind(this);
        this.onSocketMessage = this.onSocketMessage.bind(this);

        const host = window.location.host;
        const protocol = window.location.protocol.startsWith("https") ? "wss:" : "ws:";
        this._socket = new WebSocket(`${protocol}//${host}/ws`);
    }

    protected connected()
    {
        this._socket.addEventListener("open", this.onSocketOpen);
        this._socket.addEventListener("close", this.onSocketClose);
        this._socket.addEventListener("message", this.onSocketMessage);

        setInterval(() => {
            this._socket.send("Socket message!");
        }, 2000);
    }

    protected disconnected()
    {
        this._socket.removeEventListener("open", this.onSocketOpen);
        this._socket.removeEventListener("message", this.onSocketMessage);
    }

    render()
    {
        return html`<div>Hello, Display!</div>`;
    }

    protected onSocketOpen(event: MessageEvent)
    {
        console.log("socket open");
        console.log(event);
    }

    protected onSocketClose(event: MessageEvent)
    {

    }

    protected onSocketMessage(event: MessageEvent)
    {
        console.log("socket message");
        console.log(event);
    }
}

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

@customElement("ff-remote-app")
export default class RemoteApp extends CustomElement
{
    render()
    {
        return html`<div>Hello, Remote!</div>`;
    }
}

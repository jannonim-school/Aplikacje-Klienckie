import Popup from "./popup.js";
import UiElement from "./uiElement.js"
import { join, getPlayers, getWho } from "../api.js"
import GameManager from "../game.js";

export default class UiControler {
    constructor() {
        this.waitScreen = new WaitScreen(() => {
            this.checkWhoL();
        })
        this.joinScreen = new JoinScreen(() => {
            this.waitScreen.show();
            this.waitScreen.check();
        })
        this.opponentScreen = new OpponentScreen()
        this.popup = new Popup()
        this.joinScreen.show()
        this.lastTime = -1;
    }

    async checkWhoL() {
        const data = await getWho()
        if (data.time !== this.lastTime) {
            this.lastTime = data.time
            Popup.show(`${data.time}s`);
        }
        let nick;
        if (data.player)
            nick = data.player.nick
        let isYourTurn = GameManager.getState("nick") === nick
        GameManager.setState("isYourTurn", isYourTurn)
        if (isYourTurn) {
            this.opponentScreen.hide();
        }
        else {
            this.opponentScreen.show();
        }
        setTimeout(() => { this.checkWhoL(); }, 500)
    }
}

class JoinScreen extends UiElement {
    constructor(next) {
        super("join");
        this.nickHtml = this.getElementById("nick");
        this.joinHtml = this.getElementById("btn-join");
        this.resetHtml = this.getElementById("btn-reset");

        this.joinHtml.onclick = () => {
            if (this.nickHtml.value != "") {
                join(this.nickHtml.value).then((data) => {
                    if (data.sucess) {
                        GameManager.setState("nick", this.nickHtml.value)
                        this.hide();
                        next();
                    }
                    Popup.show(data.message);
                })
            }
            else {
                Popup.show("Podaj nick!");
            }
        }
    }

}

class WaitScreen extends UiElement {
    constructor(next) {
        super("wait");
        this.next = next;
    }

    check() {
        getPlayers().then((data) => {
            if (data.sucess) {
                if (data.players.length == 2) {
                    const player = data.players.filter((e) => GameManager.getState("nick") === e.nick)[0]
                    GameManager.setState("color", player.isWhite);
                    this.hide();
                    this.next();
                    return;
                }
            }
            setTimeout(() => { this.check(); }, 500)
        })
    }
}

class OpponentScreen extends UiElement {
    constructor() {
        super("opponent")
    }
}


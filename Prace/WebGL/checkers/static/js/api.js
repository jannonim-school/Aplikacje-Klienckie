import GameManager from "./game.js";

const API_URL = "/api"

async function join(nick) {
    try {
        const res = await fetch(`${API_URL}/join`, {
            method: "post",
            body: JSON.stringify({ nick }),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const json = await res.json();
        return json
    }
    catch (e) {
        return { message: e, sucess: false }
    }
}


async function getPlayers() {
    try {
        const res = await fetch(`${API_URL}/players`)
        const json = await res.json();
        return json
    }
    catch (e) {
        return { message: e, sucess: false }
    }
}

async function getWho() {
    try {
        const res = await fetch(`${API_URL}/who`)
        const json = await res.json();
        return json
    }
    catch (e) {
        return { message: e, sucess: false }
    }
}

async function move(from,to){
    try {
        const res = await fetch(`${API_URL}/move`, {
            method: "post",
            body: JSON.stringify({ from,to, nick: GameManager.getState("nick")}),
            headers: {
                "Content-Type": "application/json",
            }
        })
        const json = await res.json();
        return json
    }
    catch (e) {
        return { message: e, sucess: false }
    }
}

export { join, getPlayers, getWho,move }
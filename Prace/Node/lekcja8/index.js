const Server = require("./anonim-server");
const Route = require("./anonim-server/classes/Route");
const app = new Server();

app.setConfig("jsonParser", true);

const route = new Route();

route.get("/ok", async (ctx) => {
    ctx.sendJson({ message: "2" });
});

app.root.route("/api", route);

app.root.get("/get/:xd/f", async (ctx) => {
    ctx.sendJson({ message: ctx.getUrlParam("xd") });
});

app.listen();

export class App {

  configureRouter(config, router) {
    config.map([
        { route: "", moduleId: "./home", name: "home" },
    ]);

    this.router = router;
    console.log("configureRouter", this.router);
  }
}

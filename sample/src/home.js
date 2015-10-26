import { inject } from "aurelia-framework";
import { Router, activationStrategy } from "aurelia-router";

@inject(Router)
export class Home {
  constructor(router) {
    this.router = router;
  }

  activate(params) {
    this.currentPageNumber = Number(params.page) || 1;
    this.totalPages = 15;
  }

  determineActivationStrategy(){
    return activationStrategy.replace;
  }
}

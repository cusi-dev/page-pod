import { bindable, customElement, useView } from "aurelia-framework";

@customElement("page-pod")
@useView("./page-pod.html")
export class PagePod {
  @bindable router;
  @bindable totalPages;
  @bindable currentPageNumber;
  @bindable routeName;

  generateRouteForPage(pageNumber) {
    return this.router.generate(this.routeName, { page: pageNumber });
  }

  routerChanged() {
    this.buildPageLinks();
  }

  currentPageNumberChanged() {
    this.buildPageLinks();
  }

  buildPageLinks() {
    if (!this.router || !this.currentPageNumber) {
      return;
    }

    this.pageOptions = [];
    this.showFirstPageButton = true;
    this.showLastPageButton = true;

    let lowerBound = this.currentPageNumber - 3;
    let upperBound = this.currentPageNumber + 3;

    if (lowerBound < 1) {
      upperBound += 1 - lowerBound;
      lowerBound = 1;
    }

    if (upperBound > this.totalPages) {
      lowerBound -= upperBound - this.totalPages;
      upperBound = this.totalPages;
    }

    for (let pageNumber = lowerBound; pageNumber <= upperBound; pageNumber++) {
      this.pageOptions.push({
        number: pageNumber,
        route: this.generateRouteForPage(pageNumber),
      });
    }

    const prevPageNumber = this.currentPageNumber - 1;
    const nextPageNumber = this.currentPageNumber + 1;

    if (prevPageNumber < 1) {
      this.prevPageRoute = null;
    } else {
      this.prevPageRoute = this.generateRouteForPage(prevPageNumber);
    }

    if (nextPageNumber > this.totalPages) {
      this.nextPageRoute = null;
    } else {
      this.nextPageRoute = this.generateRouteForPage(nextPageNumber);
    }

    if (this.currentPageNumber === 1) {
      this.firstPageRoute = null;
    } else {
      this.firstPageRoute = this.generateRouteForPage(1);
    }

    if (this.currentPageNumber === this.totalPages) {
      this.lastPageRoute = null;
    } else {
      this.lastPageRoute = this.generateRouteForPage(this.totalPages);
    }
  }
}

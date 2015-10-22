export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin('page-pod');

  aurelia.start().then(a => a.setRoot('src/app'));
}

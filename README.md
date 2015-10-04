# Page Pod

Page Pod is an [aurelia][Aurelia] custom element for handling the process of dividing your content into discrete pages. Pagination!

# Using the plugin

First, you will need to tell Aurelia about the page-pod plugin. Inside the `configure` function of your Aurelia application (usually in main.js), add page-pod as a plugin:

```javascript
    export function configure(aurelia) {
      aurelia.use
        .standardConfiguration()
        .developmentLogging()
        .plugin("page-pod"); // This is the line you will need to add

      aurelia.start().then(a => a.setRoot());
    }
```

After Aurelia knows about the plugin, you can use it inside any view:

```html
    <page-pod
      router.bind="router"
      route-name="service-order-list"
      total-pages.bind="pageCount"
      current-page-number.bind="pageNumber">
    </page-pod>
```

This will render something like this:

![Page Pod Large](./img/large.png)

or if you are on a small display it will look like this:

![Page Pod Small](./img/small.png)

[aurelia]: http://aurelia.io/

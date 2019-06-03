
To build the project use:
```bash
./build.sh
```
This will install `/node_modules` for backend and frontend and compile js with webpack.

To run the server use: (requires node v10+)
```
node dev/server.js
```
This will start the app on `http://localhost:3012`, you can open it in browser.

To deploy the production, push your changes to the master, then use: (from clean working copy!)
```
./prod/deploy.sh
```

This will create and push the new tag to gitlab. 
A firefox window should pop up, if it does not - go to `https://production.dyninno.net/` manually.
____________________________________________________________________________________________

![example screenshot](https://gitlab.dyninno.net/client-management-system/gds-direct-nodejs/uploads/803cfa6f85ac4bb3115dfd457ffd85cd/image.png)

You can inject the app on a page in your project to give user access to a GDS (Apollo, Sabre, Galileo or Amadeus).

Inject the app this way:
```html
<div id="terminal-app-container" style="height: 100%;"></div>
<!-- http://dev-w13:20328/public/terminal-bundle.js on dev -->
<script src="https://gds-direct-plus.asaptickets.com/public/terminal-bundle.js"></script>
<script>
    window.InitGdsDirectPlusApp({
        htmlRootDom: document.getElementById('terminalContext'),
        emcSessionId: hashData['emcSessionId'],
    }).then(nodeApp => {
        // nodeApp.runPnr({pnrCode: 'QWE123'});
        // nodeApp.rebuild({data: {itineraryId: 1234, segmentStatus: 'GK'}});
    });
</script>
```

Since backend is hosted on node js, it is possible for server to preserve the http connection with GDS service endpoint resulting in 3 times faster response on a sequential command call compared to backend hosted on a php service.

When injecting this terminal in your project, you should keep in mind that some user actions may be destructive, for example if user books the reservation and forgets to cancel it later, or if he modifies a ticketed PNR.
There are mechanisms in this app that check agent roles and stuff, but they do not cover all possible formats in every GDS, so it's possible (even though not likely) for any agent to do something bad.

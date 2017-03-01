
WORK IN PROGRESS. ALMOST NOTHING HERE YET.

# Installing

```
npm install
npm run build
cp settings.js.example settings.js
```

# Running

```
npm start
```

Point a browser at http://localhost:8000/

# Setttings

Look at `settings.js`.

# Ideas

* On a node on the mesh, simply dump babeld routes to get IPs of all active nodes.
* Get list of nodes and their addresses from `secrets` server.
* Use same ubus-http info as our frontend (maybe with a limited user account) to poll connection info from each node

This is enough to build node map with connections. In fact the first two points is enough for everything but drawing the connections.

# ToDo

## frontend

* Add markercluser plugin for clustering
* Add custom icons for nodes: meshing, meshing only via internet, offline and potential (and maybe "does it have an extender node")





WORK IN PROGRESS. NOT USEFUL YET.

This is a very simple mesh map written in node.js, indended for use with mesh networks using Babel as the mesh routing algorithm and OpenWRT with ubus and uhttpd-mod-ubus.

It gets node status by running on a mesh node and asking babeld for the current routes. It will get node connection status by periodically polling every node in the mesh for their neighbors via http and getting a response from babeld via ubus via uhttpd-mod-ubus.

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

Look at the comments `settings.js`. To actually use it with babeld you'll need to modify the `babeld_cmd` option since it defaults to using a sample dataset.

# What does it do now

* Shows a map using leafletjs and openstreetmaps via a free mapbox account
* Streams node status to client by calling `babeld -i` and parsing the data

# ToDo

## Version 0 (node status only)

* Add plain list of nodes to UI (some nodes won't have addresses/locations)

## Version 1 (mapping the nodes)

* Periodically pull addresses from a remote [meshnode-database](https://github.com/sudomesh/meshnode-database) and associate with IPs from babeld
* Save this data to a local leveldb so you don't have to keep hitting the meshnode-database
* This will require adding an "IPs and locations only" method to the public meshnode-database API

## Version 2 (mapping connection between nodes)

Periodically pull `babeld -i` info from all nodes on the network via OpenWRTs ubus via uhttpd-mod-ubus. This will require adding to the ubus API (can be done simply using a bash script) and updating all nodes. Sync with Jehan since this will use same/similar API as the new front-end he's working on.

## Frontend

* Add custom icons for nodes: meshing, meshing only via internet, offline and potential (and maybe "does it have an extender node")
* Add leafletjs markercluser plugin for clustering when nodes are too close




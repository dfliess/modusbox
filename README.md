# Demo project for ModusBox

   
Create dir on host for influx persistance
sudo mkdir -p /srv/docker/influxdb/data

Run: docker-compose up -d

* Notice that app will restart until influx and redis are ready

The express server runs on port 3000 and has several endpoints, you can check examples at https://documenter.getpostman.com/view/478098/SzKTxfH3

Ports are mapped to host so you can access from host as localhost

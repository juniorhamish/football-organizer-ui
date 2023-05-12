#!/bin/sh

docker pull juniorhamish/football-organizer-ui:latest
docker stop Football_Organizer_UI
docker system prune -f
docker run -d --name=Football_Organizer_UI -p 80:80 -e PORT=80 juniorhamish/football-organizer-ui:latest

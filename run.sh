#!/bin/bash

docker build . -t wedding
cd database 
docker compose up -d 
cd ..
docker compose up -d
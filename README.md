# Weeding page deployment

The page is pulled from the git repository, then build by on the server and run via npm in a docker container

## Workflow

Clone page repo to server:

```bash
git clone https://github.com/HammerSeb/wedding.git
```

Then build docker image locally with tag `wedding`:

```bash
docker build . -t wedding
```

**_the tag needs to be the same as the image name specified in the docker-compose.yaml!_**

Now run the docker image with

```bash
docker compose up -d
```

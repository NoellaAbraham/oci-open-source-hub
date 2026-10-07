# Service API

This is a small Node HTTP service following the OCI Healthcheck editor pattern: the public list is read from JSON files and an editor can add a new JSON file through the API. The Docusaurus site stays on GitHub Pages.

## Run locally

Set `EDITOR_PASSWORD`, then run `node backend/server.mjs` from the repository root. The API listens on port 3001 by default. Start Docusaurus separately on port 3000.

The default data directory is `backend/data/services` and is seeded with the nine current services on first run. In production, set `SERVICE_DATA_DIR` to a persistent directory outside the Git checkout. Back it up separately.

On first run with an empty data directory, the API imports the former `~/.local/share/oci-open-source-hub/services.json` catalog if it exists. Otherwise it uses `seed-services.json`. Set `LEGACY_SERVICE_FILE` if the former file is elsewhere. Keep a backup of the former file during migration.

## Routes

- `GET /health` returns API status.
- `GET /api/services` returns `{services}` for all visitors.
- `POST /api/editor/verify` accepts `{password}` and returns a short lived editor token.
- `POST /api/services` accepts a service with `Authorization: Bearer <token>`. A new `<id>.json` file is created; duplicate names return 409.

Set `SITE_ORIGIN` to the exact website origin for browser requests. The site builds with `SERVICE_API_URL`; its production default is the existing OCI gateway. Configure the gateway routes for `/health` (GET), `/api/editor/verify` (POST, OPTIONS), and `/api/services` (GET, POST, OPTIONS) to point to this service.

## Existing OCI VM deployment

The included systemd unit assumes the repository is at `/home/ubuntu/oci-open-source-hub`, Node is at `/usr/bin/node`, and the persistent data directory is `/home/ubuntu/oci-open-source-hub-data/services`. Adjust it if the VM differs. Put `EDITOR_PASSWORD`, `SITE_ORIGIN=https://noellaabraham.github.io`, `PORT=3000`, and `SERVICE_DATA_DIR` in `/etc/oci-open-source-hub.env`; keep that file readable only by root. The existing password can be reused by setting it as `EDITOR_PASSWORD` on the VM. Create the data directory owned by `ubuntu` before starting the unit. The gateway should forward the three routes above to the VM's private IP on port 3000. Allow that port from the gateway subnet to the VM, while keeping it closed to the public internet.

After starting the unit, check `systemctl status oci-open-source-hub`, `curl http://127.0.0.1:3000/health`, and `curl http://127.0.0.1:3000/api/services` on the VM. Then check the public gateway URLs. Deploy the rebuilt Docusaurus site to GitHub Pages last.

From an updated checkout on the VM, the setup commands are:

```sh
sudo mkdir -p /home/ubuntu/oci-open-source-hub-data/services
sudo chown -R ubuntu:ubuntu /home/ubuntu/oci-open-source-hub-data
sudoedit /etc/oci-open-source-hub.env
sudo chmod 600 /etc/oci-open-source-hub.env
sudo cp backend/oci-open-source-hub.service /etc/systemd/system/oci-open-source-hub.service
sudo systemctl daemon-reload
sudo systemctl enable --now oci-open-source-hub
sudo systemctl restart oci-open-source-hub
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/api/services
```

In the OCI gateway deployment, use these methods and HTTP targets:

| Route | Methods | Target |
| --- | --- | --- |
| `/health` | GET | `http://10.10.220.80:3000/health` |
| `/api/editor/verify` | POST, OPTIONS | `http://10.10.220.80:3000/api/editor/verify` |
| `/api/services` | GET, POST, OPTIONS | `http://10.10.220.80:3000/api/services` |

Remove the former `/api/auth` route when the new routes work. If the public `/health` request times out while the VM's local request succeeds, check the gateway's public subnet route, TCP 443 ingress, and gateway to VM TCP 3000 access before publishing the website.

The old GitHub Actions proposal workflow is retired. Adding a service through this editor updates the API catalog immediately; it does not create a pull request or change `src/data/services.js`.

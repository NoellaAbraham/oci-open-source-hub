# VM content API

The Docusaurus site stays on GitHub Pages. The OCI VM stores live services, demos/resources, reports, and uploaded files. The website reads those catalogs through the existing OCI API Gateway. Editors use the same password as the original service editor; every editor dialog has a close **×** button.

The VM must be running for live edits and uploads. If it is offline, the pages show their built-in catalogs.

## Storage

Set `EDITOR_PASSWORD` in `/etc/oci-open-source-hub.env`. The existing `SERVICE_DATA_DIR` remains unchanged. The new directories default to siblings of it: `resources`, `reports`, and `media`. You can override them with `RESOURCE_DATA_DIR`, `REPORT_DATA_DIR`, and `MEDIA_DATA_DIR`. Keep all directories under `/home/ubuntu/oci-open-source-hub-data` so the included systemd unit can write them.

Each collection seeds once from `backend/seed-services.json`, `backend/seed-resources.json`, or `backend/seed-reports.json` if its directory is empty. An `.initialized` marker prevents a deliberately emptied catalog from being reseeded on restart. Back up the entire persistent data directory, including `media/`, separately from the Git checkout.

## API routes

| Route | Methods | Purpose |
| --- | --- | --- |
| `/health` | GET | API status |
| `/api/editor/verify` | POST, OPTIONS | Password to short-lived editor token |
| `/api/services` | GET, POST, DELETE, OPTIONS | Existing service catalog |
| `/api/resources` | GET, POST, PUT, DELETE, OPTIONS | Demo and resource catalog |
| `/api/reports` | GET, POST, PUT, DELETE, OPTIONS | Report catalog |
| `/api/media` | GET, POST, OPTIONS | Public uploaded files and authenticated uploads |

In the OCI API Gateway deployment, add these **three routes**. For each route, choose an **HTTP** back end and enter the full **HTTP URL** shown below:

| Gateway route path | Methods | HTTP back-end URL |
| --- | --- | --- |
| `/api/resources` | GET, POST, PUT, DELETE, OPTIONS | `http://10.10.220.80:3000/api/resources` |
| `/api/reports` | GET, POST, PUT, DELETE, OPTIONS | `http://10.10.220.80:3000/api/reports` |
| `/api/media` | GET, POST, OPTIONS | `http://10.10.220.80:3000/api/media` |

The public URLs use the existing gateway base, for example `https://ot4nerzcs4bqcj2o6tpvqx3fsq.apigateway.eu-frankfurt-1.oci.customer-oci.com/api/resources`. Preserve query strings on `/api/media`, including `?file=...` for downloads and `?kind=...&name=...` for uploads. Keep the existing `/health`, `/api/editor/verify`, and `/api/services` routes. Set `SITE_ORIGIN=https://noellaabraham.github.io` in the VM environment. The Docusaurus build uses `SERVICE_API_URL`; its production default is this gateway base URL.

Videos accept MP4 or WebM up to 10 MB; HTML reports and cover images accept up to 2 MB. The [OCI API Gateway request body limit is 20 MB](https://docs.oracle.com/en-us/iaas/Content/APIGateway/Reference/apigatewaylimits.htm), so link larger videos from a video host. Uploaded HTML should be self-contained or use absolute URLs for its assets. Uploaded files are publicly readable through `/api/media`.

## Deploy updated VM code

From an updated checkout on the VM:

```sh
sudo mkdir -p /home/ubuntu/oci-open-source-hub-data/{services,resources,reports,media}
sudo chown -R ubuntu:ubuntu /home/ubuntu/oci-open-source-hub-data
sudoedit /etc/oci-open-source-hub.env
sudo chmod 600 /etc/oci-open-source-hub.env
sudo cp backend/oci-open-source-hub.service /etc/systemd/system/oci-open-source-hub.service
sudo systemctl daemon-reload
sudo systemctl restart oci-open-source-hub
curl -i http://127.0.0.1:3000/health
curl -i http://127.0.0.1:3000/api/resources
curl -i http://127.0.0.1:3000/api/reports
```

After the gateway routes respond, deploy the rebuilt Docusaurus site to GitHub Pages. Test a temporary entry from each editor, then delete it. Content changes on the VM appear after the catalog refreshes; they do not require a site rebuild and do not create GitHub commits.

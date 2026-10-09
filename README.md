<p align="center">
  <img src="static/img/zoo.png" width="150" alt="OCI Open Source Hub logo" />
</p>

<h1 align="center">OCI Open Source Hub</h1>

<p align="center"><strong>Discover. Learn. Build with open source on Oracle Cloud Infrastructure.</strong></p>

<p align="center">
  <a href="https://noellaabraham.github.io/oci-open-source-hub/">Visit the website</a> ·
  <a href="https://noellaabraham.github.io/oci-open-source-hub/services/">Explore services</a> ·
  <a href="https://noellaabraham.github.io/oci-open-source-hub/demos-resources/">Browse demos and resources</a> ·
  <a href="https://noellaabraham.github.io/oci-open-source-hub/reports/">Read reports</a>
</p>

## What is this website for?

Oracle Cloud Infrastructure (OCI) offers managed services built around familiar open source technologies. This hub gives customers and curious visitors a starting point: see what services are available, understand what they do, and find examples that show them in use.

You can browse the website without setting up OCI or signing in. Service cards link to more information, while demos, videos, articles, and reports let you go deeper at your own pace.

## Find what you need

| If you want to... | Start here |
| --- | --- |
| Get a basic understanding of open source on OCI | Read the [About page](https://noellaabraham.github.io/oci-open-source-hub/about/) and browse the [Services page](https://noellaabraham.github.io/oci-open-source-hub/services/). |
| Explore a particular technology | Filter the service catalog by category, then open a service card for its official page. |
| See a practical example | Browse [Demos & Resources](https://noellaabraham.github.io/oci-open-source-hub/demos-resources/) for videos, repositories, articles, and architecture diagrams. |
| Catch up on developments | Open [Reports](https://noellaabraham.github.io/oci-open-source-hub/reports/) to read online or use the available PDF and slide links. |

**New to the topic?** Start with a service that sounds relevant to your work, read its short description, then look for a related demo. You do not need to understand every OCI service before exploring an example.

## How the website is built

| Part | Technology |
| --- | --- |
| Website | Docusaurus 3, React 19, JavaScript, and CSS |
| Hosting and deployment | GitHub Pages and GitHub Actions |
| Live catalogs and editor | Node.js on OCI, accessed through OCI API Gateway |

The website can show its built-in catalogs when the live content service is unavailable. Authorized editors can update services, demos, resources, and reports through the **Edit** buttons on their respective pages.

## Run the website locally

You need Git, Node.js 20 or later, and npm. From a terminal:

```bash
git clone https://github.com/NoellaAbraham/oci-open-source-hub.git
cd oci-open-source-hub
npm ci
npm run start
```

Open the local address printed by Docusaurus. The project uses the `/oci-open-source-hub/` base path. To check a production build, run `npm run build`; to preview that build locally, run `npm run serve`.

The local site works as a browsing preview with built-in catalog data. Live editing needs the separately hosted content service and editor access.

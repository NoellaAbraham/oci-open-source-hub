# Updating site content through GitHub

Only repository collaborators can make these changes. Put new source material into the matching `*-to-add` folder first. On GitHub, open the relevant data file, choose **Edit**, make the change, then use **Commit changes**. The website is rebuilt after the change is merged into the publishing branch.

## Propose a service from the website

1. On the Services page, choose **Collaborators: propose a service**. GitHub requires write access to this repository before someone can run the workflow.
2. Choose **Run workflow**, fill in the service name, category, description, and optional URL or existing logo path, then submit. The workflow validates the entry and opens a pull request; it does not publish the service immediately.
3. The repository owner reviews and merges the pull request. The Pages deployment then rebuilds the site and publishes the service.

Enable **Require review from Code Owners** in the `main` branch ruleset to enforce owner review before merging.

## Add a report

1. Upload the PDF to `static/reports/` and any cover image to `static/img/reports/`.
2. Open `src/data/reports.js`.
3. Copy the existing report object and update the title, dates, summary, file paths, links, and tags.
4. If the report needs a long in-site reading page like the June report, ask a developer to add that page. Otherwise link the Read Online button to the public PDF or slides.

## Add a service

1. Upload the logo to `static/img/services/`.
2. Open `src/data/services.js`.
3. Copy one service object and update its name, category, description, and image path.
4. Use one of these categories: `databases`, `streaming`, `big-data`, or `search`.

## Add a demo or resource

1. Open `src/data/demosResources.js`.
2. Copy the placeholder object, then update its `id`, `category`, `type`, `title`, `description`, `url`, and `tags`.
3. Use one of these categories: `demo`, `github`, `article`, or `diagram`.

## Important

Do not add passwords, private links, API keys, or customer information to these files. Everything published through GitHub Pages is public.

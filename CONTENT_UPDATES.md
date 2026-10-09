# Updating site content

The Services, Demos & Resources, and Reports pages each have an **Edit** button. Click it, enter the VM editor password, and add, edit, or delete an entry. Each editor has a close **×** button. Changes to the live VM catalog appear after the page refreshes; GitHub Pages does not need to rebuild for content edits.

## Services

Use **Edit services** to add or delete a service. Enter its name, category, description, optional URL, and an existing logo path. The logo file must already be on the published site. Leave it blank for a letter icon.

## Demos & Resources

Use **Edit demos & resources** to choose an existing item or add one. Enter the title, category, card type, creator, description, and URL. For a demo, add a video link or upload an MP4/WebM file up to 10 MB. Larger videos should use a link.

## Reports

Use **Edit reports** to choose an existing report or add one. Enter the title, reporting period, date, summary, and optional creator. You can upload a self-contained HTML report and cover image, and enter PDF and slide deck URLs. An uploaded HTML report takes priority over the existing read-online page URL.

The editor API and persistent files are on the OCI VM. The VM and gateway must be available for editing and uploads. See `backend/README.md` for deployment and backup instructions. Do not upload passwords, API keys, or private customer data; catalog entries and uploads are public.

import resourceCatalog from '../../backend/seed-resources.json';
import reportCatalog from '../../backend/seed-reports.json';

// Use the same ordering as the API, including after the VM is switched off.
const sorted = (items) => [...items].sort((a, b) =>
  (b.publishedAt || '').localeCompare(a.publishedAt || '') || (a.order ?? 9999) - (b.order ?? 9999));

export const resources = sorted(resourceCatalog);
export const reports = sorted(reportCatalog);

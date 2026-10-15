import serviceCatalog from '../../backend/seed-services.json';

export const serviceCategories = [
  {id: 'all', label: 'All Services'},
  {id: 'databases', label: 'Databases & Data Stores'},
  {id: 'streaming', label: 'Streaming & Messaging'},
  {id: 'big-data', label: 'Big Data & Processing'},
  {id: 'search', label: 'Search'},
];

// The editor syncs this shared catalog to GitHub when enabled on the VM.
export const services = serviceCatalog;

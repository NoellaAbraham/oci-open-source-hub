import {resources} from './catalogs';

// Page categories and service filter labels. Content comes from the shared catalog.
// Resource tags use the IDs listed in resourceServiceTags below.
export const demoResourceCategories = [
  {id: 'all', label: 'All Resources'},
  {id: 'demo', label: 'Videos & Tutorials'},
  {id: 'github', label: 'GitHub'},
  {id: 'article', label: 'Articles'},
  {id: 'diagram', label: 'Architecture Diagrams'},
];

export const resourceServiceTags = {
  'oci-cache': 'OCI Cache',
  'oci-streaming-with-apache-kafka': 'OCI Streaming with Apache Kafka',
  'oci-streaming': 'OCI Streaming',
  'oci-data-flow': 'OCI Data Flow',
  'oci-nosql': 'OCI NoSQL',
  'oci-database-with-postgresql': 'OCI Database with PostgreSQL',
  'oci-search-with-opensearch': 'OCI Search with OpenSearch',
  'mysql-heatwave': 'MySQL HeatWave',
};

// Catalog content is backed up from the website editor.
export {resources};
export const demosResources = resources.filter((item) => item.type !== 'Developer coaching session');

export const serviceCategories = [
  {id: 'all', label: 'All Services'},
  {id: 'databases', label: 'Databases & Data Stores'},
  {id: 'streaming', label: 'Streaming & Messaging'},
  {id: 'big-data', label: 'Big Data & Processing'},
  {id: 'search', label: 'Search'},
];

// To add a service, copy an object below, update its name, categories,
// description, and image. Put the image in static/img/services/ first, then
// use a path such as image: '/img/services/my-service.png'.
export const services = [
  {name: 'OCI Database with PostgreSQL', categories: ['databases'], description: 'Managed PostgreSQL on OCI with built-in backups, security, and high availability.', url: 'https://phantompete.github.io/OCIPostgreSQLShowcase/'},
  {name: 'MySQL HeatWave', categories: ['databases'], description: 'Run MySQL transactions, analytics, and AI workloads in one managed service on OCI.'},
  {name: 'OCI Cache', categories: ['databases'], description: 'Redis-compatible caching for fast queries, sessions, and real-time application data.'},
  {name: 'OCI Search with OpenSearch', categories: ['databases', 'search'], description: 'Index logs, search data, and monitor applications with managed OpenSearch clusters.'},
  {name: 'OCI NoSQL', categories: ['databases'], description: 'Store flexible data and scale high-throughput applications with managed NoSQL.'},
  {name: 'OCI Streaming', categories: ['streaming'], description: 'Ingest high-volume event streams for logs, user activity, IoT, and real-time apps.'},
  {name: 'OCI Streaming with Apache Kafka', categories: ['streaming'], description: 'Build real-time data pipelines with fully managed Apache Kafka on OCI.'},
  {name: 'OCI Data Flow', categories: ['big-data'], description: 'Process large datasets and run ETL jobs with managed Apache Spark.'},
  {name: 'OCI Big Data', categories: ['big-data'], description: 'Run Hadoop and Spark clusters to prepare large datasets for analytics.'},
];

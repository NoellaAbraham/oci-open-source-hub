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
  {name: 'MySQL HeatWave', categories: ['databases'], description: 'Run MySQL transactions, analytics, and AI workloads in one managed service on OCI.', url: 'https://www.oracle.com/mysql/'},
  {name: 'OCI Cache', categories: ['databases'], description: 'Redis-compatible caching for fast queries, sessions, and real-time application data.', url: 'https://www.oracle.com/cloud/cache/'},
  {name: 'OCI Search with OpenSearch', categories: ['databases', 'search'], description: 'Index logs, search data, and monitor applications with managed OpenSearch clusters.', url: 'https://www.oracle.com/cloud/search/'},
  {name: 'OCI NoSQL', categories: ['databases'], description: 'Store flexible data and scale high-throughput applications with managed NoSQL.', url: 'https://www.oracle.com/database/nosql/'},
  {name: 'OCI Streaming', categories: ['streaming'], description: 'Ingest high-volume event streams for logs, user activity, IoT, and real-time apps.', url: 'https://www.oracle.com/cloud/streaming/'},
  {name: 'OCI Streaming with Apache Kafka', categories: ['streaming'], description: 'Build real-time data pipelines with fully managed Apache Kafka on OCI.', url: 'https://www.oracle.com/cloud/apache-kafka/'},
  {name: 'OCI Data Flow', categories: ['big-data'], description: 'Process large datasets and run ETL jobs with managed Apache Spark.', url: 'https://docs.oracle.com/en-us/iaas/Content/data-flow/using/home.htm'},
  {name: 'OCI Big Data', categories: ['big-data'], description: 'Run Hadoop and Spark clusters to prepare large datasets for analytics.', url: 'https://www.oracle.com/big-data/big-data-service/'},
  {"name":"[TEST] Workflow Smoke Test","categories":["databases"],"description":"Temporary check of the collaborator service proposal workflow.","url":"https://example.com"},
];

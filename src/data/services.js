export const serviceCategories = [
  {id: 'all', label: 'All Services'},
  {id: 'databases', label: 'Databases & Data Stores'},
  {id: 'streaming', label: 'Streaming & Messaging'},
  {id: 'big-data', label: 'Big Data & Processing'},
  {id: 'search', label: 'Search'},
];

// To add a service, copy an object below and update its name, categories,
// description, and image. Put the image in static/img/services/ first, then
// use a path such as image: '/img/services/my-service.png'.
export const services = [
  {name: 'OCI Database with PostgreSQL', categories: ['databases'], description: 'Build and run reliable PostgreSQL databases on OCI without managing the underlying infrastructure. Scale as your workload grows, with built-in backups, security, and high availability.', url: 'https://phantompete.github.io/OCIPostgreSQLShowcase/'},
  {name: 'MySQL HeatWave', categories: ['databases'], description: 'A unified MySQL service for transactions, analytics and AI workloads—built to help teams run and scale modern applications on OCI without managing the underlying infrastructure.'},
  {name: 'OCI Cache', categories: ['databases'], description: 'A managed, Redis-compatible in-memory data store for caching frequent queries, session data, and real-time application data with low latency.'},
  {name: 'OCI Search with OpenSearch', categories: ['databases', 'search'], description: 'Managed OpenSearch clusters for indexing application logs, searching large datasets, and building dashboards that surface errors, latency, and service health.'},
  {name: 'OCI NoSQL', categories: ['databases'], description: 'A cloud-native NoSQL database service for storing flexible data models, scaling automatically with demand, and supporting high-throughput application workloads.'},
  {name: 'OCI Streaming', categories: ['streaming'], description: 'A managed service for ingesting and processing high-volume event streams, such as application logs, user activity, IoT data, and real-time system events.'},
  {name: 'OCI Streaming with Apache Kafka', categories: ['streaming'], description: 'A fully managed Apache Kafka service for building real-time event streaming pipelines, moving data reliably between applications, databases, and analytics platforms.'},
  {name: 'OCI Data Flow', categories: ['big-data'], description: 'A managed Apache Spark service for processing large datasets, running ETL jobs, and building analytics pipelines without managing Spark clusters.'},
  {name: 'OCI Big Data', categories: ['big-data'], description: 'Managed big-data clusters for running Hadoop, Spark, and related tools to process large datasets, prepare data, and support analytics workloads.'},
];

// Add demos, videos, GitHub repositories, articles, or architecture diagrams here.
// `tags` are ready for future filtering pages. Use a public URL for `url`.
export const demoResourceCategories = [
  {id: 'all', label: 'All Resources'},
  {id: 'demo', label: 'Demos'},
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

// Last source updates verified from the GitHub history for each example.
// Add a date for each new resource instead of assuming one from its service tag.
const githubUpdatedAt = {
  'oci-cache-connect-via-nlb': '2026-07-28',
  'oci-cache-vector-search': '2026-07-28',
  'data-flow-streaming-object-storage': '2026-07-28',
  'data-flow-build-deploy-ds': '2026-07-28',
  'data-flow-aws-s3': '2026-07-28',
  'data-flow-snowflake': '2026-07-28',
  'data-flow-adw': '2026-07-28',
  'data-flow-postgresql': '2026-07-28',
  'data-flow-salesforce': '2026-07-28',
  'data-flow-db-connectors-streaming': '2026-07-28',
  'data-flow-load-adw': '2026-07-28',
  'data-flow-functions': '2026-07-28',
  'mysql-heatwave-aidp': '2026-09-01',
  'postgresql-to-mysql-heatwave': '2026-09-01',
  'opensearch-anomaly-detection': '2026-07-28',
  'opensearch-nginx': '2026-07-28',
  'opensearch-rag-genai': '2026-07-28',
  'postgresql-oac': '2026-07-28',
  'postgresql-crr': '2026-07-28',
  'postgresql-pgbouncer': '2026-07-28',
  'postgresql-postgis-geoserver': '2026-07-28',
  'postgresql-mcp': '2026-07-28',
  'kafka-fraud-detection': '2026-07-28',
  'kafka-goldengate-streaming': '2026-07-28',
  'kafka-connect-opensearch': '2026-07-28',
  'kafka-mirrormaker2': '2026-07-28',
  'kafka-public-endpoint': '2026-07-28',
  'kafka-schema-registry-akhq': '2026-07-28',
  'streaming-fake-producer-consumer': '2026-07-28',
  'streaming-mosquitto-node-red': '2026-07-28',
};

export const demosResources = [
  {
    id: 'oci-cache-connect-via-nlb', category: 'github', type: 'GitHub repository', title: 'OCI Cache: Connect via Network Load Balancer',
    description: 'Example for connecting to OCI Cache through a Network Load Balancer.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-cache/code-examples/connect-via-nlb', tags: ['oci-cache'],
  },
  {
    id: 'oci-cache-vector-search', category: 'github', type: 'GitHub repository', title: 'OCI Cache: Vector Search',
    description: 'Code examples for vector search workloads with OCI Cache.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-cache/code-examples/vector-search', tags: ['oci-cache'],
  },
  {
    id: 'data-flow-streaming-object-storage', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Streaming from Object Storage',
    description: 'Stream data from OCI Object Storage with OCI Data Flow.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/Streaming_from_ObjectStorage', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-build-deploy-ds', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Build and Deploy from Data Science',
    description: 'Build and deploy a Data Flow application from OCI Data Science.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/build-and-deploy-app-from-oci-ds', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-aws-s3', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Connect to Amazon S3',
    description: 'Connect an OCI Data Flow application to Amazon S3.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/connect-to-AWS-S3', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-snowflake', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Connect to Snowflake',
    description: 'Connect an OCI Data Flow application to Snowflake.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/connect-to-Snowflake', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-adw', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Connect to Autonomous Data Warehouse',
    description: 'Connect OCI Data Flow to Autonomous Data Warehouse.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/connect-to-adw', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-postgresql', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Connect to PostgreSQL',
    description: 'Connect OCI Data Flow workloads to PostgreSQL.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/connect-to-postgresql', tags: ['oci-data-flow', 'oci-database-with-postgresql'],
  },
  {
    id: 'data-flow-salesforce', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Connect to Salesforce',
    description: 'Connect OCI Data Flow applications to Salesforce.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/connect-to-salesforce', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-db-connectors-streaming', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Database Connectors and Streaming',
    description: 'Examples for database connectivity and streaming with OCI Data Flow.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/db-connectors-and-streaming', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-load-adw', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Load Data to Autonomous Data Warehouse',
    description: 'Load data to Autonomous Data Warehouse with OCI Data Flow.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/load-data-to-adw', tags: ['oci-data-flow'],
  },
  {
    id: 'data-flow-functions', category: 'github', type: 'GitHub repository', title: 'OCI Data Flow: Run from Functions',
    description: 'Invoke OCI Data Flow workloads from OCI Functions.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-data-flow/code-examples/run-from-functions', tags: ['oci-data-flow'],
  },
  {
    id: 'mysql-heatwave-aidp', category: 'github', type: 'GitHub repository', title: 'MySQL HeatWave: AI Data Platform',
    description: 'Example resources for an AI Data Platform with MySQL HeatWave.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-mysql-heatwave/code-examples/aidp-mysql-heatwave', tags: ['mysql-heatwave'],
  },
  {
    id: 'postgresql-to-mysql-heatwave', category: 'github', type: 'GitHub repository', title: 'PostgreSQL to MySQL HeatWave with GoldenGate',
    description: 'Move data from PostgreSQL to MySQL HeatWave using OCI GoldenGate.',
    url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-mysql-heatwave/code-examples/postgresql-to-mysql-heatwave-oci-gg', tags: ['oci-database-with-postgresql', 'mysql-heatwave'],
  },
  {id: 'opensearch-anomaly-detection', category: 'github', type: 'GitHub repository', title: 'OCI OpenSearch: Anomaly Detection', description: 'Anomaly detection example using OCI OpenSearch.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-opensearch/code-examples/anomaly-detection-ons', tags: ['oci-search-with-opensearch']},
  {id: 'opensearch-nginx', category: 'github', type: 'GitHub repository', title: 'OCI OpenSearch: NGINX Server', description: 'NGINX server integration example for OCI OpenSearch.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-opensearch/code-examples/nginx-server', tags: ['oci-search-with-opensearch']},
  {id: 'opensearch-rag-genai', category: 'github', type: 'GitHub repository', title: 'OCI OpenSearch: RAG with Generative AI', description: 'Retrieval-augmented generation example using OCI OpenSearch and Generative AI.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-opensearch/code-examples/rag-oci-opensearch-genai-service', tags: ['oci-search-with-opensearch']},
  {id: 'postgresql-oac', category: 'github', type: 'GitHub repository', title: 'OCI PostgreSQL: Connect to Oracle Analytics Cloud', description: 'Connect OCI Database with PostgreSQL to Oracle Analytics Cloud.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-postgresql/code-examples/connect-to-oac', tags: ['oci-database-with-postgresql']},
  {id: 'postgresql-crr', category: 'github', type: 'GitHub repository', title: 'OCI PostgreSQL: Cross-Region Replication Automation', description: 'Automate cross-region replication for OCI PostgreSQL.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-postgresql/code-examples/crr-automation', tags: ['oci-database-with-postgresql']},
  {id: 'postgresql-pgbouncer', category: 'github', type: 'GitHub repository', title: 'OCI PostgreSQL: PgBouncer Setup', description: 'Set up PgBouncer connection pooling for OCI PostgreSQL.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-postgresql/code-examples/pgbouncer-setup', tags: ['oci-database-with-postgresql']},
  {id: 'postgresql-postgis-geoserver', category: 'github', type: 'GitHub repository', title: 'OCI PostgreSQL: PostGIS and GeoServer', description: 'Geospatial example using PostGIS and GeoServer with OCI PostgreSQL.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-postgresql/code-examples/postgis-geoserver', tags: ['oci-database-with-postgresql']},
  {id: 'postgresql-mcp', category: 'github', type: 'GitHub repository', title: 'OCI PostgreSQL: MCP', description: 'Model Context Protocol example for OCI PostgreSQL.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-postgresql/code-examples/postgres-mcp', tags: ['oci-database-with-postgresql']},
  {id: 'kafka-fraud-detection', category: 'github', type: 'GitHub repository', title: 'OCI Streaming with Apache Kafka: Fraud Detection', description: 'Fraud detection demo with OCI Streaming and Apache Kafka.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/fraud-detection-demo', tags: ['oci-streaming-with-apache-kafka']},
  {id: 'kafka-goldengate-streaming', category: 'github', type: 'GitHub repository', title: 'GoldenGate with OCI Streaming and Apache Kafka', description: 'GoldenGate integration guide for OCI Streaming with Apache Kafka.', url: 'https://github.com/oracle-devrel/technology-engineering/blob/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/goldengate_oci_streaming-with-apache-kafka/goldengate_osak.md', tags: ['oci-streaming-with-apache-kafka']},
  {id: 'kafka-connect-opensearch', category: 'github', type: 'GitHub repository', title: 'Kafka Connect with OCI OpenSearch', description: 'Kafka Connect setup guide with OCI OpenSearch.', url: 'https://github.com/oracle-devrel/technology-engineering/blob/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/kafka-ui-connect-setup-with-oci-opensearch/Kafka_Connect.md', tags: ['oci-streaming-with-apache-kafka', 'oci-search-with-opensearch']},
  {id: 'kafka-mirrormaker2', category: 'github', type: 'GitHub repository', title: 'Apache Kafka: MirrorMaker 2 Disaster Recovery', description: 'MirrorMaker 2 disaster recovery setup guide.', url: 'https://github.com/oracle-devrel/technology-engineering/blob/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/osak-setting-up-dr-with-mirrormaker2/MM2-Setup-Guide.md', tags: ['oci-streaming-with-apache-kafka']},
  {id: 'kafka-public-endpoint', category: 'github', type: 'GitHub repository', title: 'OCI Streaming with Apache Kafka: Public Endpoint', description: 'Set up a public endpoint for OCI Streaming with Apache Kafka.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/osak_public_endpoint', tags: ['oci-streaming-with-apache-kafka']},
  {id: 'kafka-schema-registry-akhq', category: 'github', type: 'GitHub repository', title: 'Kafka Schema Registry and AKHQ', description: 'Schema Registry and AKHQ setup guide for Apache Kafka.', url: 'https://github.com/oracle-devrel/technology-engineering/blob/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming-with-apache-kafka/code-examples/schema-registry-akhq-setup/schema-registry.md', tags: ['oci-streaming-with-apache-kafka']},
  {id: 'streaming-fake-producer-consumer', category: 'github', type: 'GitHub repository', title: 'OCI Streaming: Fake Producer and Consumer', description: 'Sample producer and consumer for OCI Streaming.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming/code-examples/fake-producer-consumer', tags: ['oci-streaming']},
  {id: 'streaming-mosquitto-node-red', category: 'github', type: 'GitHub repository', title: 'OCI Streaming: Mosquitto and Node-RED', description: 'Connect Mosquitto and Node-RED with OCI Streaming.', url: 'https://github.com/oracle-devrel/technology-engineering/tree/main/oci-and-db/cloud-native/open-source-data-platforms/oci-streaming/code-examples/mosquitto_node-red', tags: ['oci-streaming']},
  {
    id: 'article-postgresql-time-series-node', category: 'article', type: 'Medium article', title: 'Setting Up a Time-Series Node for OCI Database with PostgreSQL',
    creator: 'Andriy Dorokhin',
    url: 'https://medium.com/@andreumdorokhinum/setting-up-a-time-series-node-for-oci-database-with-postgresql-db1283a6fec8', tags: ['oci-database-with-postgresql'], publishedAt: '2026-08-19',
  },
  {
    id: 'article-cache-heatwave-better-together', category: 'article', type: 'Blog article', title: 'OCI Cache and MySQL HeatWave: Better Together for High-Performance Applications',
    creator: 'Olivier Dasini',
    url: 'https://dasini.net/blog/2026/07/21/oci-cache-and-mysql-heatwave-better-together-for-high-performance-applications/', tags: ['oci-cache', 'mysql-heatwave'], publishedAt: '2026-07-21',
  },
  {
    id: 'article-postgresql-kerberos', category: 'article', type: 'Medium article', title: 'Setting up Kerberos Auth for OCI Database with PostgreSQL',
    creator: 'Andriy Dorokhin',
    url: 'https://medium.com/@andreumdorokhinum/setting-up-kerberos-auth-for-oci-database-with-postgresql-51e9a235975b', tags: ['oci-database-with-postgresql'], publishedAt: '2026-06-26',
  },
  {
    id: 'article-postgresql-avdf', category: 'article', type: 'Medium article', title: 'Integration of OCI Database with PostgreSQL and Oracle Audit Vault and Database Firewall',
    creator: 'Andriy Dorokhin and Thomas Minne',
    url: 'https://medium.com/@andreumdorokhinum/integration-of-oci-database-with-postgresql-and-oracle-audit-vault-and-database-firewall-f98236b980bd', tags: ['oci-database-with-postgresql'], publishedAt: '2026-06-03',
  },
  {
    id: 'article-postgresql-boyer-moore-horspool', category: 'article', type: 'Medium article', title: 'Does Postgres need the Boyer-Moore-Horspool search algorithm for LIKE operator?',
    creator: 'Andriy Dorokhin',
    url: 'https://medium.com/@andreumdorokhinum/does-postgres-need-the-boyer-moore-horspool-search-algorithm-for-like-operator-00b43e4b115c', tags: ['oci-database-with-postgresql'], publishedAt: '2026-05-15',
  },
  {
    id: 'article-benchmark-oci-postgresql', category: 'article', type: 'Medium article', title: 'Benchmarking OCI Database with PostgreSQL',
    creator: 'Andriy Dorokhin',
    url: 'https://medium.com/@andreumdorokhinum/benchmarking-oci-database-with-postgresql-0a665e575fde', tags: ['oci-database-with-postgresql'], publishedAt: '2025-11-07',
  },
  {
    id: 'article-cache-redis-valkey', category: 'article', type: 'Medium article', title: 'Upgrade OCI Cache with Redis to Valkey',
    creator: 'Piotr Kurzynoga',
    url: 'https://medium.com/@devpiotrekk/upgrade-oci-cache-with-redis-to-valkey-d3c01deb8733', tags: ['oci-cache'], publishedAt: '2025-08-13',
  },
  {
    id: 'article-postgresql-rclone-migration', category: 'article', type: 'Medium article', title: 'Migrate PostgreSQL to OCI PostgreSQL using OCI Object Storage and Rclone',
    creator: 'Sylwester Dec',
    url: 'https://medium.com/@sylwekdec/migrate-postgresql-to-oci-postgresql-using-oci-object-storage-and-rclone-a61ef97c5b96', tags: ['oci-database-with-postgresql'], publishedAt: '2025-06-25',
  },
  {
    id: 'article-data-flow-energy-prediction', category: 'article', type: 'Medium article', title: 'Predict energy consumption with OCI Data Flow and Spark MLlib',
    creator: 'Sylwester Dec',
    url: 'https://medium.com/@sylwekdec/predict-energy-consumption-with-oci-data-flow-and-spark-mllib-74626c4db56a', tags: ['oci-data-flow'], publishedAt: '2025-04-22',
  },
  {
    id: 'article-data-flow-real-time-ingestion', category: 'article', type: 'Medium article', title: 'Ingest real time data with Spark, OCI Data Flow and OCI Data Lake',
    creator: 'Sylwester Dec',
    url: 'https://medium.com/@sylwekdec/ingest-real-time-data-with-spark-oci-data-flow-and-oci-data-lake-cdff7619b4ec', tags: ['oci-data-flow', 'oci-streaming'], publishedAt: '2025-04-08',
  },
  {
    id: 'article-data-flow-autonomous-database', category: 'article', type: 'Medium article', title: 'Apache Spark with OCI Data Flow and Oracle Autonomous Database',
    creator: 'Sylwester Dec',
    url: 'https://medium.com/@sylwekdec/apache-spark-with-oci-data-flow-and-oracle-autonomous-database-bd96055445ee', tags: ['oci-data-flow'], publishedAt: '2025-04-07',
  },
  {
    id: 'article-database-synergy-day-2025', category: 'article', type: 'Medium article', title: 'Database Synergy Day 2025 — Things left unsaid…',
    creator: 'Piotr Kurzynoga',
    url: 'https://medium.com/@devpiotrekk/database-synergy-day-2025-things-left-unsaid-07b9891454a5', tags: ['oci-database-with-postgresql', 'oci-streaming-with-apache-kafka', 'oci-data-flow'], publishedAt: '2025-04-03',
  },
  {
    id: 'database-synergy-day-2025-demo-code', category: 'github', type: 'GitHub repository', title: 'Database Synergy Day 2025: Demo Code',
    description: 'Code accompanying Piotr Kurzynoga’s PostgreSQL, Kafka, and Spark demo.',
    url: 'https://github.com/phantompete/SOUG_2025_PUB', tags: ['oci-database-with-postgresql', 'oci-streaming-with-apache-kafka', 'oci-data-flow'],
  },
  {
    id: 'article-postgresql-pglogical', category: 'article', type: 'Medium article', title: 'Replicating OCI Database with PostgreSQL using pglogical',
    creator: 'Piotr Kurzynoga',
    url: 'https://medium.com/@devpiotrekk/replicating-oci-database-with-postgresql-using-pglogical-118182ff08f9', tags: ['oci-database-with-postgresql'], publishedAt: '2024-09-27',
  },
  {
    id: 'article-postgresql-goldengate-cross-region', category: 'article', type: 'Medium article', title: 'OCI PostgreSQL to OCI PostgreSQL cross-region replication with OCI GoldenGate',
    creator: 'Piotr Kurzynoga',
    url: 'https://medium.com/@devpiotrekk/oci-postgresql-to-oci-postgresql-cross-region-replication-with-oci-goldengate-introduction-e0492fc37b92', tags: ['oci-database-with-postgresql'], publishedAt: '2024-09-29',
  },
  {
    id: 'architecture-bitbucket-opensearch-postgresql', category: 'diagram', type: 'Architecture Center', title: 'Deploy Atlassian Bitbucket Data Center on OCI with Managed OpenSearch and PostgreSQL',
    url: 'https://docs.oracle.com/en/solutions/deploy-bitbucket-oci/#GUID-D5ADF584-AFB8-4087-97F3-4EC8FF5E687D', tags: ['oci-database-with-postgresql', 'oci-search-with-opensearch'],
  },
  {
    id: 'architecture-modern-app-postgresql-cache-opensearch', category: 'diagram', type: 'Architecture Center', title: 'Modernize Your Application Development with OCI-Managed PostgreSQL, Redis, and OpenSearch',
    url: 'https://docs.oracle.com/en/solutions/modernize-app-dev-oci-postgresql-redis-opensearch/#GUID-DA0594DA-D549-481E-9CBD-46735766CA82', tags: ['oci-database-with-postgresql', 'oci-cache', 'oci-search-with-opensearch'],
  },
  {
    id: 'demo-livelabs-iot-cache-postgresql', category: 'demo', type: 'LiveLabs workshop', title: 'Accelerating IoT with OCI Cache and PostgreSQL',
    creator: 'Piotr Kurzynoga and Andriy Dorokhin',
    url: 'https://livelabs.oracle.com/ords/r/dbpm/livelabs/run-workshop?p210_wid=4383', tags: ['oci-cache', 'oci-database-with-postgresql'], publishedAt: '2026-04-21',
  },
  {
    id: 'demo-postgresql-full-stack-dr', category: 'demo', type: 'Oracle Learn tutorial', title: 'PostgreSQL Cold Disaster Recovery',
    creator: 'Piotr Kurzynoga and Antoun Moubarak',
    url: 'https://docs.oracle.com/en/learn/full-stack-dr-pgsql-cold-dr/', tags: ['oci-database-with-postgresql'], publishedAt: '2025-07-16',
  },
  {
    id: 'demo-postgresql-rclone-migration', category: 'demo', type: 'Oracle Learn tutorial', title: 'Migrate PostgreSQL with Rclone',
    creator: 'Sylwester Dec',
    url: 'https://docs.oracle.com/en/learn/migrate-postgres-with-rclone/#introduction', tags: ['oci-database-with-postgresql'], publishedAt: '2025-06-25',
  },
  {
    id: 'demo-postgresql-dbeaver', category: 'demo', type: 'Oracle Learn tutorial', title: 'Connect PostgreSQL with DBeaver',
    creator: 'Jevon Rowan',
    url: 'https://docs.oracle.com/en/learn/oci-postgres-dbeaver/#introduction', tags: ['oci-database-with-postgresql'], publishedAt: '2024-09-24',
  },
  {
    id: 'demo-postgresql-oac', category: 'demo', type: 'Oracle Learn tutorial', title: 'Connect PostgreSQL to Oracle Analytics Cloud',
    creator: 'Bob Peulen',
    url: 'https://docs.oracle.com/en/learn/oci-postgres-oac/', tags: ['oci-database-with-postgresql'], publishedAt: '2024-09-24',
  },
  {
    id: 'demo-cache-redis-insight', category: 'demo', type: 'Oracle Learn tutorial', title: 'Connect OCI Cache with Redis Insight',
    creator: 'Ismael Hassane',
    url: 'https://docs.oracle.com/en/learn/oci-cache-redis/#introduction', tags: ['oci-cache'], publishedAt: '2024-10-30',
  },
  {
    id: 'article-magical-suitcase', category: 'article', type: 'Medium article', title: 'Revival of the Magical Suitcase',
    creator: 'Piotr Kurzynoga',
    url: 'https://medium.com/@devpiotrekk/revival-of-the-magical-suitcase-73093af23f29', tags: ['oci-streaming'], publishedAt: '2024-04-30',
  },
].map((resource) => ({
  ...resource,
  updatedAt: resource.updatedAt ?? githubUpdatedAt[resource.id] ?? null,
}));

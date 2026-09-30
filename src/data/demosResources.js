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
].map((resource) => ({
  ...resource,
  updatedAt: githubUpdatedAt[resource.id] ?? null,
}));

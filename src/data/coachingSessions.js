// Add a YouTube video ID to youtubeId when a session is ready to publish.
// Example: for https://www.youtube.com/watch?v=abc123, use youtubeId: 'abc123'.
// Use the video's YouTube publication date for newest-first ordering.
// The tags array is reusable on future filtered pages.
export const coachingSessions = [
  {
    id: 'airport-chatbot-demo',
    youtubeId: 'rs-RtvtKkpg',
    publishedAt: '2025-02-06',
    title: 'Airport Chatbot Demo',
    speaker: 'Piotr Kurzynoga, Irine Benoy',
    focus: 'PostgreSQL, Streaming & Data Flow',
    tags: ['oci-database-with-postgresql', 'oci-streaming', 'oci-data-flow'],
  },
  {
    id: 'oci-postgresql-logs-with-grafana',
    youtubeId: 'gM9xJAmE0kY',
    publishedAt: '2025-01-29',
    title: 'Seamless Integration of OCI PostgreSQL Logs with Grafana',
    speaker: 'Irine Benoy',
    focus: 'PostgreSQL observability',
    tags: ['oci-database-with-postgresql'],
  },
  {
    id: 'security-best-practices',
    youtubeId: 'RyM7k54U9ts',
    publishedAt: '2025-05-09',
    title: 'Cross-Reference Code Mapping System with OpenSearch',
    speaker: 'Ismaël Hassane, Irine Benoy',
    focus: 'OpenSearch',
    tags: ['oci-search-with-opensearch'],
  },
  {
    id: 'real-time-insights-anomaly-detection',
    youtubeId: 'ScM7zxe65A8',
    publishedAt: '2024-08-19',
    title: 'Real-Time Insights and Anomaly Detection in ATM Transactions',
    speaker: 'Sylwester Dec, Robert de Laat',
    focus: 'Real-time analytics',
    tags: ['oci-database-with-postgresql', 'oci-streaming', 'oci-data-flow'],
  },
  {
    id: 'real-time-iot-master',
    youtubeId: 'TxkR4o_m3ls',
    publishedAt: '2024-10-18',
    title: 'Real-Time IoT Master',
    speaker: 'Piotr Kurzynoga',
    focus: 'IoT & streaming',
    tags: ['oci-database-with-postgresql', 'oci-streaming-with-apache-kafka', 'oci-data-flow'],
  },  
];

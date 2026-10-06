import {latestReport} from './latestReport';

// To publish another report, copy the object below, update its values, and
// upload its PDF and cover image into static/reports/ through GitHub.
// The `readOnlinePath` can point to a custom in-site report page when needed.
export const reports = [
  {
    title: 'MySQL HeatWave Core Capabilities',
    period: 'September 2026',
    summary: 'Five core capabilities for transactional MySQL workloads: automated indexing, high availability, read scaling, enterprise security, and fast DB System cloning.',
    coverImage: '/reports/mysql-heatwave-core-capabilities/diagram-01.png',
    readOnlinePath: '/reports/mysql-heatwave-core-capabilities',
    slidesUrl: 'https://speakerdeck.com/freshdaz/mysql-heatwave-on-oci-five-capabilities-for-transactional-workloads',
    pdfUrl: 'https://speakerdeck.com/freshdaz/mysql-heatwave-on-oci-five-capabilities-for-transactional-workloads-45d1a5d4-8ad5-4c0a-be67-d04e8b6b26e5',
    tags: ['mysql-heatwave'],
  },
  {
    ...latestReport,
    period: 'June 2026',
    summary: 'Key MySQL 9.7 LTS and MySQL HeatWave 9.7 features, including reliability, security, observability, and GenAI capabilities.',
  },
];

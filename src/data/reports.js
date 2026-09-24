import {latestReport} from './latestReport';

// To publish another report, copy the object below, update its values, and
// upload its PDF and cover image into static/reports/ through GitHub.
// The `readOnlinePath` can point to a custom in-site report page when needed.
export const reports = [
  {
    ...latestReport,
    period: 'June 2026',
    summary: 'Key MySQL 9.7 LTS and MySQL HeatWave 9.7 features, including reliability, security, observability, and GenAI capabilities.',
  },
];

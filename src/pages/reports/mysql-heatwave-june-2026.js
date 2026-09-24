import Layout from '@theme/Layout';
import {latestReport} from '@site/src/data/latestReport';
import styles from './mysql-heatwave-june-2026.module.css';

const reportSections = [
  {
    number: '01',
    title: 'MySQL 9.7 LTS: a new milestone',
    body: 'MySQL 9.7 establishes the next Long-Term Support release line after MySQL 8.4. It brings innovations from the 9.x cycle into a stable platform, with stronger observability, high availability, modern application development, query optimization, and security.',
    points: ['A stable LTS target for organizations standardizing on MySQL', 'More Community Edition capabilities', 'Lower operational complexity and stronger governance'],
  },
  {
    number: '02',
    title: 'Core engine and query improvements',
    body: 'The release improves reliability and performance at the database core. Atomic DDL handling is more resilient, GIPK handling is broadened, and cloning can operate between consecutive LTS releases after 9.7.',
    points: ['Hypergraph Optimizer is available in Community Edition', 'Better plans for complex multi-table joins', 'Fewer optimizer hints and stronger analytical performance'],
  },
  {
    number: '03',
    title: 'Modern developer experience',
    body: 'JSON Duality Views give developers a unified relational and document representation while preserving normalized storage. The release also brings native OpenTelemetry integration to Community Edition for centralized logs, metrics, and traces.',
    points: ['DML support and auto-increment with JSON Duality Views', 'JSON-friendly APIs without duplicating data models', 'OpenTelemetry export for cloud-native observability'],
  },
  {
    number: '04',
    title: 'Performance and resource awareness',
    body: 'Profile-Guided Optimization support is expanded across more RPM build targets. MySQL also becomes more resource-aware in constrained deployments by improving its handling of cpuset cgroup limits.',
    points: ['Better real-world performance optimization', 'More accurate CPU awareness in containers', 'Useful for Kubernetes and managed cloud environments'],
  },
  {
    number: '05',
    title: 'High availability and replication',
    body: 'Replication observability and HA management gain stronger flow-control visibility, extended applier statistics, automatic eviction and rejoin behavior, and more current-aware primary elections.',
    points: ['Faster troubleshooting of throughput and lag', 'Improved failover quality', 'Simpler read scaling and disaster recovery with HeatWave Replica Clone'],
  },
  {
    number: '06',
    title: 'Security and compliance',
    body: 'Authentication gains PBKDF2 with SHA512 support for caching_sha2_password. Enterprise Edition and HeatWave also introduce centralized dynamic data-masking policies that can adapt results by user or active role.',
    points: ['Stronger password protection', 'Protect sensitive data without application changes', 'Audit-log rotation and filter-recovery improvements'],
  },
  {
    number: '07',
    title: 'HeatWave data and AI capabilities',
    body: 'MySQL HeatWave simplifies replica DB System cloning for cross-region recovery and read scaling. Bulk loading now supports tables with foreign keys, and NL_SQL can use Gemini and OpenAI models for natural-language-to-SQL workflows.',
    points: ['Simpler cross-region disaster recovery', 'Safer bulk ingest with foreign-key validation', 'More model choice for GenAI database experiences'],
  },
];

export default function MySqlHeatWaveJune2026Report() {
  return (
    <Layout
      title="MySQL HeatWave Report - June 2026"
      description="A native web edition of the MySQL and MySQL HeatWave Report for June 2026.">
      <main className={styles.reportPage}>
        <header className={styles.hero}>
          <div className={styles.heroInner}>
            <h1>MySQL &amp; MySQL HeatWave Report</h1>
            <p className={styles.date}>June 2026</p>
            <div className={styles.heroDetails}>
              <p className={styles.intro}>An overview of the MySQL 9.7 LTS and MySQL HeatWave 9.7 release, covering core database improvements, cloud operations, security, and GenAI capabilities.</p>
            </div>
            <p className={styles.author}>Prepared by Olivier Dasini, Cloud AI &amp; Analytics Solutions Architect</p>
            <div className={styles.actions}>
              <a href={latestReport.pdfUrl} download>Download PDF &#8594;</a>
              <a href={latestReport.slidesUrl} target="_blank" rel="noreferrer">View Slides</a>
            </div>
          </div>
        </header>

        <section className={styles.summary}>
          <div className={styles.contentWidth}>
            <p className={styles.sectionLabel}>At a glance</p>
            <h2>What matters in MySQL 9.7 LTS</h2>
            <div className={styles.summaryGrid}>
              <article><strong>For DBAs</strong><span>Better replication visibility, stronger controls, easier HA management, and richer observability.</span></article>
              <article><strong>For developers</strong><span>JSON Duality Views, query optimization, and OpenTelemetry integration.</span></article>
              <article><strong>For leaders</strong><span>A new LTS platform with expanded capabilities, lower complexity, and stronger governance.</span></article>
            </div>
          </div>
        </section>

        <section className={styles.sections}>
          <div className={styles.contentWidth}>
            {reportSections.map((section) => (
              <article className={styles.reportSection} key={section.number}>
                <span className={styles.sectionNumber}>{section.number}</span>
                <div>
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.community}>
          <div className={styles.contentWidth}>
            <p className={styles.sectionLabel}>Community</p>
            <h2>Thank you to MySQL contributors</h2>
            <p>The release includes contributions across Connector/NET, the optimizer, parser, prepared statements, Performance Schema, data types, and character sets. The MySQL ecosystem continues to benefit from work by contributors, developers, DBAs, and partners worldwide.</p>
          </div>
        </section>
      </main>
    </Layout>
  );
}

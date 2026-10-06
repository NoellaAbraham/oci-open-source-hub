import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './mysql-heatwave-core-capabilities.module.css';

export default function MySqlHeatWaveCoreCapabilitiesReport() {
  const reportUrl = useBaseUrl('/reports/mysql-heatwave-core-capabilities.html');

  return (
    <Layout
      title="MySQL HeatWave Core Capabilities"
      description="Five MySQL HeatWave capabilities for transactional workloads.">
      <main className={styles.page}>
        <iframe
          className={styles.report}
          src={reportUrl}
          title="MySQL HeatWave Core Capabilities report"
        />
      </main>
    </Layout>
  );
}

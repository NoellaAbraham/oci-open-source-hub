import {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import VmCatalogEditor from '@site/src/components/VmCatalogEditor';
import {reports as builtInReports} from '@site/src/data/reports';
import styles from './index.module.css';

export default function ReportsPage() {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = String(siteConfig.customFields.serviceApiUrl).replace(/\/$/, '');
  const baseUrl = useBaseUrl('/');
  const [reports, setReports] = useState(builtInReports);
  const [catalogError, setCatalogError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);

  async function loadReports() {
    const response = await fetch(`${apiUrl}/api/reports`);
    if (!response.ok) throw new Error(`Report API returned ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.reports)) throw new Error('Report API returned an invalid list.');
    setReports(data.reports);
    setCatalogError('');
  }

  useEffect(() => { loadReports().catch(() => setCatalogError('Live reports are unavailable. Showing the built-in catalog.')); }, [apiUrl]);

  function href(path) {
    if (!path) return '';
    if (path.startsWith('/api/media?')) return `${apiUrl}${path}`;
    return /^https?:\/\//.test(path) ? path : `${baseUrl}${path.replace(/^\//, '')}`;
  }

  return <Layout title="Reports" description="Quarterly Oracle Cloud open source reports.">
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Open Source Reports</h1>
        <p>Quarterly reports covering key enhancements and updates.</p>
        <button className={styles.editorButton} type="button" onClick={() => setEditorOpen(true)}>Edit reports</button>
      </header>
      <section className={styles.list} aria-label="Available reports">
        {catalogError && <p className={styles.notice} role="status">{catalogError}</p>}
        {reports.map((report) => {
          const readOnlineHref = href(report.htmlFile || report.readOnlinePath);
          const coverImage = href(report.coverImage);
          const pdfHref = href(report.pdfUrl);
          const slidesHref = href(report.slidesUrl);
          const Cover = readOnlineHref ? 'a' : 'div';
          const Title = readOnlineHref ? 'a' : 'span';
          return <article className={styles.report} key={report.id || report.title}>
            <Cover className={styles.cover} {...(readOnlineHref ? {href: readOnlineHref, 'aria-label': `Read ${report.title}`} : {})}>
              {coverImage ? <img src={coverImage} alt={`${report.title} cover`} /> : <span className={styles.coverPlaceholder}>Report</span>}
            </Cover>
            <div className={styles.details}>
              <h2><Title {...(readOnlineHref ? {href: readOnlineHref} : {})}>{report.title}</Title></h2>
              {report.period && <p className={styles.period}>{report.period}</p>}
              {report.creator && <p className={styles.creator}>Created by: {report.creator}</p>}
              <p className={styles.summary}>{report.summary || report.description}</p>
            </div>
            <div className={styles.actions}>
              {readOnlineHref && <a href={readOnlineHref}>Read Online</a>}
              {pdfHref && <a href={pdfHref} target="_blank" rel="noopener noreferrer">PDF</a>}
              {slidesHref && <a href={slidesHref} target="_blank" rel="noopener noreferrer">Slides</a>}
            </div>
          </article>;
        })}
      </section>
      {editorOpen && <VmCatalogEditor kind="reports" apiUrl={apiUrl} items={reports} onSaved={loadReports} onClose={() => setEditorOpen(false)} />}
    </main>
  </Layout>;
}

import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {reports} from '@site/src/data/reports';
import styles from './index.module.css';

export default function ReportsPage() {
  return (
    <Layout title="Reports" description="Quarterly Oracle Cloud open source reports.">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Open Source Reports</h1>
          <p>Quarterly reports covering key enhancements and updates.</p>
        </header>
        <section className={styles.list} aria-label="Available reports">
          {reports.map((report) => (
            <article className={styles.report} key={report.readOnlinePath}>
              <Link className={styles.cover} to={report.readOnlinePath} aria-label={`Read ${report.title}`}>
                <img src={report.coverImage} alt={`${report.title} cover`} />
              </Link>
              <div className={styles.details}>
                <h2><Link to={report.readOnlinePath}>{report.title}</Link></h2>
                <p className={styles.period}>{report.period}</p>
                <p className={styles.summary}>{report.summary}</p>
              </div>
              <div className={styles.actions}>
                <Link to={report.readOnlinePath}>Read Online</Link>
                <a href={report.pdfUrl} download>PDF</a>
                <a href={report.slidesUrl} target="_blank" rel="noreferrer">Slides</a>
              </div>
            </article>
          ))}
        </section>
      </main>
    </Layout>
  );
}

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {reports} from '@site/src/data/reports';
import styles from './index.module.css';

export default function ReportsPage() {
  const baseUrl = useBaseUrl('/');
  return (
    <Layout title="Reports" description="Quarterly Oracle Cloud open source reports.">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Open Source Reports</h1>
          <p>Quarterly reports covering key enhancements and updates.</p>
        </header>
        <section className={styles.list} aria-label="Available reports">
          {reports.map((report) => {
            const readOnlineHref = `${baseUrl}${report.readOnlinePath.replace(/^\//, '')}`;
            const coverImage = /^https?:\/\//.test(report.coverImage)
              ? report.coverImage
              : `${baseUrl}${report.coverImage.replace(/^\//, '')}`;
            const pdfIsExternal = /^https?:\/\//.test(report.pdfUrl);
            const pdfHref = pdfIsExternal
              ? report.pdfUrl
              : `${baseUrl}${report.pdfUrl.replace(/^\//, '')}`;
            const ReadOnlineLink = ({className, children, ...props}) => report.staticHtml
              ? <a className={className} href={readOnlineHref} {...props}>{children}</a>
              : <Link className={className} to={report.readOnlinePath} {...props}>{children}</Link>;

            return <article className={styles.report} key={report.readOnlinePath}>
              <ReadOnlineLink className={styles.cover} aria-label={`Read ${report.title}`}>
                <img src={coverImage} alt={`${report.title} cover`} />
              </ReadOnlineLink>
              <div className={styles.details}>
                <h2><ReadOnlineLink>{report.title}</ReadOnlineLink></h2>
                <p className={styles.period}>{report.period}</p>
                <p className={styles.summary}>{report.summary}</p>
              </div>
              <div className={styles.actions}>
                <ReadOnlineLink>Read Online</ReadOnlineLink>
                <a href={pdfHref} {...(pdfIsExternal ? {target: '_blank', rel: 'noreferrer'} : {download: true})}>PDF</a>
                <a href={report.slidesUrl} target="_blank" rel="noreferrer">Slides</a>
              </div>
            </article>;
          })}
        </section>
      </main>
    </Layout>
  );
}

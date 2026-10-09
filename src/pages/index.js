import {useEffect, useState} from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {coachingSessions as builtInSessions} from '@site/src/data/coachingSessions';
import {openSourceHighlights} from '@site/src/data/openSourceHighlights';
import {reports as builtInReports} from '@site/src/data/reports';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = String(siteConfig.customFields.serviceApiUrl).replace(/\/$/, '');
  const baseUrl = useBaseUrl('/');
  const [reports, setReports] = useState(builtInReports);
  const [coachingSessions, setCoachingSessions] = useState(builtInSessions);
  const latestReport = reports[0];
  const siteHref = (path) => path && (path.startsWith('/api/media?') ? `${apiUrl}${path}`
    : /^https?:\/\//.test(path) ? path : `${baseUrl}${path.replace(/^\//, '')}`);
  const reportPdfUrl = siteHref(latestReport?.pdfUrl);
  const reportReadOnlineUrl = siteHref(latestReport?.htmlFile || latestReport?.readOnlinePath);
  const reportCoverUrl = siteHref(latestReport?.coverImage);
  const featuredSessions = coachingSessions.slice(0, 4);
  const hasMoreSessions = coachingSessions.length > 4;
  const featuredHighlights = openSourceHighlights.slice(0, 3);

  useEffect(() => {
    fetch(`${apiUrl}/api/reports`).then((response) => response.ok ? response.json() : null)
      .then((data) => { if (Array.isArray(data?.reports)) setReports(data.reports); }).catch(() => {});
    fetch(`${apiUrl}/api/resources`).then((response) => response.ok ? response.json() : null)
      .then((data) => { if (Array.isArray(data?.resources)) setCoachingSessions(data.resources.filter((item) => item.type === 'Developer coaching session').map((item) => ({...item, speaker: item.creator, focus: item.description}))); }).catch(() => {});
  }, [apiUrl]);

  return (
    <Layout
      title="OCI Open Source Hub"
      description="Discover open source technologies and managed open source services on Oracle Cloud Infrastructure.">
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
          <div className={styles.copy}>
            <h1>
              Discover. Learn. Build with <strong>Open Source on OCI.</strong>
            </h1>
            <p>Discover open source technologies and managed open source services on Oracle Cloud Infrastructure.</p>
            <div className={styles.buttons}>
              <Link className={styles.primaryButton} to="/services">Explore Services <span aria-hidden="true">&#8594;</span></Link>
              <Link className={styles.secondaryButton} to="/reports">Read Documentation</Link>
            </div>
          </div>
          </div>
        </section>
        <section className={styles.benefitsSection}>
          <div className={styles.benefitsCard}>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">✥</span>
              <div><h2>Open Source First</h2><p>Built on leading open source communities, bringing trusted technologies and innovation to OCI.</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">◆</span>
              <div><h2>Cloud Native</h2><p>Seamlessly deploy open source stacks directly to Oracle Cloud Infrastructure.</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">⌁</span>
              <div><h2>Enterprise Scale</h2><p>Built for high availability, massive scale and mission-critical workloads.</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">⟳</span>
              <div><h2>Developer Friendly</h2><p>Tools, documentations and examples to help you build faster.</p></div>
            </article>
          </div>
        </section>
        <section className={styles.sessionsSection}>
          <div className={styles.sessionsHeader}>
            <h2>Developer Coaching Sessions</h2>
            {hasMoreSessions && (
              <Link className={styles.viewAllSessions} to="/demos-resources">
                View all sessions <span aria-hidden="true">&#8594;</span>
              </Link>
            )}
          </div>
          <div className={styles.sessionsGrid}>
            {featuredSessions.map((session) => {
              const videoId = !session.videoFile && (session.videoUrl || session.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/)?.[1];
              const thumbnail = videoId
                ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
                : null;
              const videoUrl = siteHref(session.videoFile || session.videoUrl || session.url);

              return (
                <article className={styles.sessionCard} data-tags={session.tags.join(' ')} key={session.id}>
                  {videoUrl ? (
                    <a className={styles.videoFrame} href={videoUrl} target="_blank" rel="noreferrer" aria-label={`Play ${session.title} on YouTube`}>
                      {thumbnail ? <img src={thumbnail} alt="" /> : session.videoFile ? <video src={videoUrl} muted playsInline preload="metadata" /> : null}
                      <span className={styles.playButton} aria-hidden="true" />
                    </a>
                  ) : (
                    <div className={styles.videoFrame} aria-label={`${session.title} video placeholder`}>
                      <span className={styles.playButton} aria-hidden="true" />
                    </div>
                  )}
                  <h3>{session.title}</h3>
                  <p>{session.speaker} <span aria-hidden="true">&#8226;</span> {session.focus}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section className={styles.highlightsSection}>
          <div className={styles.highlightsHeader}>
            <h2>Latest Open Source Highlights</h2>
            <Link className={styles.viewAllSessions} to="/demos-resources">
              View all highlights <span aria-hidden="true">&#8594;</span>
            </Link>
          </div>
          <div className={styles.highlightsGrid}>
            {featuredHighlights.map((highlight) => (
              <article className={styles.highlightCard} data-tags={highlight.tags.join(' ')} key={highlight.id}>
                <div className={styles.highlightTopline}>
                  <span>{highlight.type}</span>
                  <span className={styles.highlightMeta}>{highlight.meta}</span>
                </div>
                <h3>{highlight.title}</h3>
                <p>{highlight.description}</p>
                {highlight.url ? (
                  <a className={styles.highlightLink} href={highlight.url} target="_blank" rel="noreferrer">
                    Explore <span aria-hidden="true">&#8594;</span>
                  </a>
                ) : (
                  <span className={styles.highlightLink}>Explore <span aria-hidden="true">&#8594;</span></span>
                )}
              </article>
            ))}
          </div>
        </section>
        {latestReport && <section className={styles.reportSection}>
          <div className={styles.reportCard} data-tags={(latestReport.tags || []).join(' ')}>
            <div className={styles.reportContent}>
              <p className={styles.reportEyebrow}>Latest Report</p>
              <h2>{latestReport.title}</h2>
              <p className={styles.reportDescription}>{latestReport.description || latestReport.summary}</p>
              <div className={styles.reportActions}>
                {reportReadOnlineUrl ? <a href={reportReadOnlineUrl}>Read Online</a> : <span>Read Online</span>}
                {latestReport.pdfUrl ? (
                  <a href={reportPdfUrl} target="_blank" rel="noreferrer">Download PDF <span aria-hidden="true">&#8594;</span></a>
                ) : <span>Download PDF <span aria-hidden="true">&#8594;</span></span>}
                {latestReport.slidesUrl ? (
                  <a href={latestReport.slidesUrl} target="_blank" rel="noreferrer">View Slides</a>
                ) : <span>View Slides</span>}
              </div>
            </div>
            <div className={styles.reportCover}>
              {latestReport.coverImage ? <img src={reportCoverUrl} alt={`${latestReport.title} cover`} /> : <span>Latest<br />Report</span>}
            </div>
          </div>
        </section>}
      </main>
    </Layout>
  );
}

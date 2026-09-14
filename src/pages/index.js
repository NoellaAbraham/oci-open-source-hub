import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
import {coachingSessions} from '@site/src/data/coachingSessions';
import {openSourceHighlights} from '@site/src/data/openSourceHighlights';
import {latestReport} from '@site/src/data/latestReport';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Docusaurus Tutorial - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const featuredSessions = coachingSessions.slice(0, 4);
  const hasMoreSessions = coachingSessions.length > 4;
  const featuredHighlights = openSourceHighlights.slice(0, 3);

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
              const thumbnail = session.youtubeId
                ? `https://i.ytimg.com/vi/${session.youtubeId}/maxresdefault.jpg`
                : null;
              const videoUrl = session.youtubeId
                ? `https://www.youtube.com/watch?v=${session.youtubeId}`
                : null;

              return (
                <article className={styles.sessionCard} data-tags={session.tags.join(' ')} key={session.id}>
                  {videoUrl ? (
                    <a className={styles.videoFrame} href={videoUrl} target="_blank" rel="noreferrer" aria-label={`Play ${session.title} on YouTube`}>
                      <img src={thumbnail} alt="" />
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
        <section className={styles.reportSection}>
          <div className={styles.reportCard} data-tags={latestReport.tags.join(' ')}>
            <div className={styles.reportContent}>
              <p className={styles.reportEyebrow}>Latest Report</p>
              <h2>{latestReport.title}</h2>
              <p className={styles.reportDescription}>{latestReport.description}</p>
              <div className={styles.reportActions}>
                {latestReport.readOnlinePath ? (
                  <Link to={latestReport.readOnlinePath}>Read Online</Link>
                ) : <span>Read Online</span>}
                {latestReport.pdfUrl ? (
                  <a href={latestReport.pdfUrl} target="_blank" rel="noreferrer">Download PDF <span aria-hidden="true">&#8594;</span></a>
                ) : <span>Download PDF <span aria-hidden="true">&#8594;</span></span>}
                {latestReport.slidesUrl ? (
                  <a href={latestReport.slidesUrl} target="_blank" rel="noreferrer">View Slides</a>
                ) : <span>View Slides</span>}
              </div>
            </div>
            <div className={styles.reportCover}>
              {latestReport.coverImage ? <img src={latestReport.coverImage} alt="" /> : <span>Latest<br />Report</span>}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import Heading from '@theme/Heading';
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
  return (
    <Layout
      title="OCI Open Source Hub"
      description="Discover open source technologies and managed open source services on Oracle Cloud Infrastructure.">
      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
          <div className={styles.copy}>
            <h1>
              Discover.
              Learn.
              Build with Open Source on OCI.
            </h1>
            <p>Discover open source technologies and managed open source services on Oracle Cloud Infrastructure.</p>
            <div className={styles.buttons}>
              <Link className={styles.primaryButton} to="/services">Explore Services <span aria-hidden="true">&#8594;</span></Link>
              <Link className={styles.secondaryButton} to="/reports">Latest Report</Link>
            </div>
          </div>
          <img
            className={styles.heroImage}
            src="/img/open-source-stack.png"
            alt="Open Source Stack"
          />
          </div>
        </section>
        <section className={styles.benefitsSection}>
          <div className={styles.benefitsCard}>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">✥</span>
              <div><h2>Open Source First</h2><p>Built on leading open source communities</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">◆</span>
              <div><h2>Managed by Oracle</h2><p>Enterprise-grade support, security and reliability</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">⌁</span>
              <div><h2>Optimized for OCI</h2><p>Designed for performance, scale and cost-efficiency</p></div>
            </article>
            <article className={styles.benefit}>
              <span className={styles.benefitIcon} aria-hidden="true">⟳</span>
              <div><h2>Developer Friendly</h2><p>Tools, docs and examples to help you build faster</p></div>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}

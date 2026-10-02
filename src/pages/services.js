import {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import {serviceCategories, services} from '@site/src/data/services';
import styles from './services.module.css';

const serviceIcons = {
  'OCI Database with PostgreSQL': '/img/services/postgresql.png',
  'MySQL HeatWave': '/img/services/mysql-heatwave.png',
  'OCI Cache': '/img/services/oci-cache.png',
  'OCI Search with OpenSearch': '/img/services/opensearch.png',
  'OCI NoSQL': '/img/services/NoSQL-Database.svg',
  'OCI Streaming': '/img/services/Streaming.svg',
  'OCI Streaming with Apache Kafka': '/img/services/apache-kafka.png',
  'OCI Data Flow': '/img/services/DataFlow.svg',
  'OCI Big Data': '/img/services/BigData.svg',
};

const logoAccents = {
  'OCI Database with PostgreSQL': '#2d9adf',
  'MySQL HeatWave': '#f39800',
  'OCI Cache': '#8794ff',
  'OCI Search with OpenSearch': '#2d9adf',
  'OCI NoSQL': '#143e5a',
  'OCI Streaming': '#cc579b',
  'OCI Streaming with Apache Kafka': '#107e34',
  'OCI Data Flow': '#c91a1a',
  'OCI Big Data': '#4d36df',
};

function ServiceCard({service, baseUrl}) {
  const Card = service.url ? 'a' : 'article';
  const linkProps = service.url ? {href: service.url, target: '_blank', rel: 'noopener noreferrer'} : {};

  return <Card className={styles.card} {...linkProps}>
    <span className={styles.logoBlock} style={{'--logo-accent': logoAccents[service.name]}} aria-hidden="true">
      <span className={`${styles.marker} ${service.name === 'OCI Streaming with Apache Kafka' ? styles.lightLogo : ''} ${service.name === 'OCI Search with OpenSearch' ? styles.brightLogo : ''}`} style={{backgroundImage: `url(${baseUrl}${(service.image || serviceIcons[service.name] || '').replace(/^\//, '')})`}} />
      <span className={styles.logoAccent} />
    </span>
    <h2>{service.name}{service.url && <span className={styles.srOnly}> (opens in a new tab)</span>}</h2>
    <p>{service.description}</p>
  </Card>;
}

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const baseUrl = useBaseUrl('/');
  const visibleServices = activeCategory === 'all' ? services : services.filter((service) => service.categories.includes(activeCategory));

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 400);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, {passive: true});
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({top: 0, behavior: reducedMotion ? 'auto' : 'smooth'});
  }

  return <Layout title="Services" description="Oracle Cloud managed open source services.">
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Services</h1>
          <p>Explore Oracle Cloud managed open source services. Production-ready, scalable, and secure.</p>
          <a className={styles.collaboratorLink} href="https://github.com/NoellaAbraham/oci-open-source-hub/actions/workflows/propose-service.yml">Collaborators: propose a service</a>
        </div>
        <img className={styles.heroImage} src={`${baseUrl}img/zoo.png`} alt="Open source technology zoo" />
      </header>
      <section className={styles.catalog}>
        <div className={styles.catalogControls}>
          <div className={styles.tabs} role="tablist" aria-label="Service categories">
            {serviceCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
        </div>
        <div className={styles.grid}>
          {visibleServices.map((service) => <ServiceCard key={service.name} service={service} baseUrl={baseUrl} />)}
        </div>
      </section>
    </main>
    {showBackToTop && <button className={styles.backToTop} type="button" onClick={scrollToTop} aria-label="Back to top" title="Back to top">↑</button>}
  </Layout>;
}

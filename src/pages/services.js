import {useState} from 'react';
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

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');
  const baseUrl = useBaseUrl('/');
  const visibleServices = activeCategory === 'all' ? services : services.filter((service) => service.categories.includes(activeCategory));
  return <Layout title="Services" description="Oracle Cloud managed open source services.">
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Services</h1>
          <p>Explore Oracle Cloud managed open source services. Production-ready, scalable, and secure.</p>
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
          {visibleServices.map((service) => <article key={service.name} className={styles.card}><span className={styles.logoBlock} style={{'--logo-accent': logoAccents[service.name]}} aria-hidden="true"><span className={`${styles.marker} ${service.name === 'OCI Streaming with Apache Kafka' ? styles.lightLogo : ''} ${service.name === 'OCI Search with OpenSearch' ? styles.brightLogo : ''}`} style={{backgroundImage: `url(${baseUrl}${(service.image || serviceIcons[service.name] || '').replace(/^\//, '')})`}} /><span className={styles.logoAccent} /></span><h2>{service.name}</h2><p>{service.description}</p>{service.url ? <a className={styles.learn} href={service.url} target="_blank" rel="noreferrer">Explore service &#8594;</a> : <span className={styles.learn}>Learn More &#8594;</span>}</article>)}
        </div>
      </section>
    </main>
  </Layout>;
}

import {useState} from 'react';
import Layout from '@theme/Layout';
import {serviceCategories, services} from '@site/src/data/services';
import styles from './services.module.css';

const serviceIcons = {
  'OCI Database with PostgreSQL': '/img/services/postgresql.png',
  'MySQL HeatWave': '/img/services/mysql-heatwave.png',
  'OCI Cache': '/img/services/oci-cache.png',
  'OCI Search with OpenSearch': '/img/services/opensearch.png',
  'OCI NoSQL': '/img/services/oci-nosql.png',
  'OCI Streaming': '/img/services/oci-streaming.png',
  'OCI Streaming with Apache Kafka': '/img/services/apache-kafka.png',
  'OCI Data Flow': '/img/services/oci-data-flow.png',
  'OCI Big Data': '/img/services/oci-big-data.png',
};

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('all');
  const visibleServices = activeCategory === 'all' ? services : services.filter((service) => service.categories.includes(activeCategory));
  return <Layout title="Services" description="Oracle Cloud managed open source services.">
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Services</h1>
          <p>Explore Oracle Cloud managed open source services. Production-ready, scalable, and secure.</p>
          <button className={styles.addService} type="button" disabled title="Services are managed by GitHub collaborators">+ Add Service</button>
        </div>
        <img className={styles.heroImage} src="/img/zoo.png" alt="Open source technology zoo" />
      </header>
      <section className={styles.catalog}>
        <div className={styles.tabs} role="tablist" aria-label="Service categories">
          {serviceCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
        </div>
        <div className={styles.grid}>
          {visibleServices.map((service) => <article key={service.name} className={styles.card}><span className={styles.marker} style={{backgroundImage: `url(${service.image || serviceIcons[service.name] || ''})`}} aria-hidden="true" /><h2>{service.name}</h2><p>{service.description}</p>{service.url ? <a className={styles.learn} href={service.url} target="_blank" rel="noreferrer">Explore service &#8594;</a> : <span className={styles.learn}>Learn More &#8594;</span>}</article>)}
        </div>
      </section>
    </main>
  </Layout>;
}

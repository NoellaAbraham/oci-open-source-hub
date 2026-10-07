import {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import {serviceCategories, services as builtInServices} from '@site/src/data/services';
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
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = String(siteConfig.customFields.serviceApiUrl).replace(/\/$/, '');
  const [services, setServices] = useState(builtInServices);
  const [catalogError, setCatalogError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorToken, setEditorToken] = useState('');
  const [password, setPassword] = useState('');
  const [editorError, setEditorError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState({name: '', categories: [], description: '', url: '', image: ''});
  const [activeCategory, setActiveCategory] = useState('all');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const baseUrl = useBaseUrl('/');
  const visibleServices = activeCategory === 'all' ? services : services.filter((service) => service.categories.includes(activeCategory));

  async function loadServices() {
    const response = await fetch(`${apiUrl}/api/services`);
    if (!response.ok) throw new Error(`Service API returned ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.services)) throw new Error('Service API returned an invalid list.');
    setServices(data.services);
    setCatalogError('');
  }

  useEffect(() => {
    loadServices().catch(() => setCatalogError('Live services are unavailable. Showing the built-in catalog.'));
  }, [apiUrl]);

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

  async function unlockEditor(event) {
    event.preventDefault();
    setEditorError('');
    try {
      const response = await fetch(`${apiUrl}/api/editor/verify`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not unlock the editor.');
      setEditorToken(data.token);
      setPassword('');
    } catch (error) { setEditorError(error.message); }
  }

  function toggleCategory(id) {
    setDraft((current) => ({...current, categories: current.categories.includes(id)
      ? current.categories.filter((item) => item !== id) : [...current.categories, id]}));
  }

  async function addService(event) {
    event.preventDefault();
    setEditorError('');
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/services`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${editorToken}`},
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not add the service.');
      await loadServices();
      setDraft({name: '', categories: [], description: '', url: '', image: ''});
      setEditorOpen(false);
      setActiveCategory('all');
    } catch (error) { setEditorError(error.message); }
    finally { setSaving(false); }
  }

  return <Layout title="Services" description="Oracle Cloud managed open source services.">
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>Services</h1>
          <p>Explore Oracle Cloud managed open source services. Production-ready, scalable, and secure.</p>
          <button className={styles.collaboratorLink} type="button" onClick={() => {setEditorError(''); setEditorOpen(true);}}>Edit services</button>
        </div>
        <img className={styles.heroImage} src={`${baseUrl}img/zoo.png`} alt="Open source technology zoo" />
      </header>
      <section className={styles.catalog}>
        {catalogError && <p className={styles.notice} role="status">{catalogError}</p>}
        <div className={styles.catalogControls}>
          <div className={styles.tabs} role="tablist" aria-label="Service categories">
            {serviceCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
        </div>
        <div className={styles.grid}>
          {visibleServices.map((service) => <ServiceCard key={service.name} service={service} baseUrl={baseUrl} />)}
        </div>
      </section>
      {editorOpen && <div className={styles.editorBackdrop}>
        <section className={styles.editorPanel} aria-label="Service editor">
          <button className={styles.closeEditor} type="button" onClick={() => setEditorOpen(false)} aria-label="Close editor">×</button>
          <h2>{editorToken ? 'Add a service' : 'Unlock service editor'}</h2>
          {editorError && <p className={styles.editorError} role="alert">{editorError}</p>}
          {!editorToken ? <form onSubmit={unlockEditor}>
            <label htmlFor="editor-password">Editor password</label>
            <input id="editor-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="submit">Unlock editor</button>
          </form> : <form onSubmit={addService}>
            <label htmlFor="service-name">Service name</label>
            <input id="service-name" value={draft.name} maxLength={100} onChange={(event) => setDraft({...draft, name: event.target.value})} required />
            <fieldset><legend>Categories</legend>{serviceCategories.filter((item) => item.id !== 'all').map((item) =>
              <label className={styles.categoryChoice} key={item.id}><input type="checkbox" checked={draft.categories.includes(item.id)} onChange={() => toggleCategory(item.id)} /> {item.label}</label>)}</fieldset>
            <label htmlFor="service-description">Short description</label>
            <textarea id="service-description" value={draft.description} minLength={15} maxLength={400} onChange={(event) => setDraft({...draft, description: event.target.value})} required />
            <label htmlFor="service-url">Service URL (optional)</label>
            <input id="service-url" type="url" value={draft.url} onChange={(event) => setDraft({...draft, url: event.target.value})} placeholder="https://" />
            <label htmlFor="service-image">Existing logo path (optional)</label>
            <input id="service-image" value={draft.image} onChange={(event) => setDraft({...draft, image: event.target.value})} placeholder="/img/services/example.svg" />
            <button type="submit" disabled={saving || !draft.categories.length}>{saving ? 'Saving…' : 'Add service'}</button>
          </form>}
        </section>
      </div>}
    </main>
    {showBackToTop && <button className={styles.backToTop} type="button" onClick={scrollToTop} aria-label="Back to top" title="Back to top">↑</button>}
  </Layout>;
}

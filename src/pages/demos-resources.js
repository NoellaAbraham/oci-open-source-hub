import {useEffect, useState} from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import VmCatalogEditor from '@site/src/components/VmCatalogEditor';
import {demoResourceCategories, demosResources, resourceServiceTags} from '@site/src/data/demosResources';
import {coachingSessions} from '@site/src/data/coachingSessions';
import styles from './demos-resources.module.css';

const builtInItems = [...demosResources, ...coachingSessions.map((session) => ({
  ...session, category: 'demo', type: 'Developer coaching session', creator: session.speaker,
  description: session.focus, url: `https://www.youtube.com/watch?v=${session.youtubeId}`,
}))];

function videoIdFor(item) {
  if (item.videoFile) return null;
  return (item.videoUrl || item.url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/)?.[1];
}

export default function DemosResources() {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = String(siteConfig.customFields.serviceApiUrl).replace(/\/$/, '');
  const baseUrl = useBaseUrl('/');
  const [items, setItems] = useState(builtInItems);
  const [catalogError, setCatalogError] = useState('');
  const [apiReady, setApiReady] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  async function loadItems() {
    const response = await fetch(`${apiUrl}/api/resources`);
    if (!response.ok) throw new Error(`Resource API returned ${response.status}.`);
    const data = await response.json();
    if (!Array.isArray(data.resources)) throw new Error('Resource API returned an invalid list.');
    setItems(data.resources);
    setCatalogError('');
    setApiReady(true);
  }

  useEffect(() => { loadItems().catch(() => {
    setApiReady(false);
    setCatalogError('Live resources are unavailable. Showing the built-in catalog.');
  }); }, [apiUrl]);
  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 400);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, {passive: true});
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  function mediaUrl(path) {
    if (!path) return '';
    if (path.startsWith('/api/media?')) return `${apiUrl}${path}`;
    return path.startsWith('/') ? `${baseUrl}${path.replace(/^\//, '')}` : path;
  }

  function toggleTag(tag) {
    setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);
  }

  const visibleItems = items
    .filter((item) => activeCategory === 'all' || item.category === activeCategory)
    .filter((item) => selectedTags.length === 0 || selectedTags.some((tag) => (item.tags || []).includes(tag)))
    .sort((first, second) => new Date(second.publishedAt || second.updatedAt || 0) - new Date(first.publishedAt || first.updatedAt || 0));

  return <Layout title="Demos & Resources" description="Oracle Cloud open source demos and resources.">
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Demos &amp; Resources</h1>
        <p>Explore demos, repositories, articles, and architecture resources for Oracle Cloud open source services.</p>
        <button className={styles.editorButton} type="button" disabled={!apiReady} onClick={() => setEditorOpen(true)}>Edit demos &amp; resources</button>
      </header>
      <section className={styles.catalog}>
        {catalogError && <p className={styles.notice} role="status">{catalogError}</p>}
        <div className={styles.catalogControls}>
          <div className={styles.tabs} role="tablist" aria-label="Resource categories">
            {demoResourceCategories.map((category) => <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>{category.label}</button>)}
          </div>
          <div className={styles.filterWrap}>
            <button type="button" className={styles.filterButton} aria-expanded={filterOpen} aria-controls="service-filter-menu" onClick={() => setFilterOpen((open) => !open)}>
              Filter{selectedTags.length > 0 ? ` (${selectedTags.length})` : ''} <span aria-hidden="true">⌄</span>
            </button>
            {filterOpen && <div className={styles.filterMenu} id="service-filter-menu">
              <p>Filter by service</p>
              {Object.entries(resourceServiceTags).map(([id, label]) => <label key={id}><input type="checkbox" checked={selectedTags.includes(id)} onChange={() => toggleTag(id)} />{label}</label>)}
              {selectedTags.length > 0 && <button type="button" onClick={() => setSelectedTags([])}>Clear filters</button>}
            </div>}
          </div>
        </div>
        {visibleItems.length > 0 && <div className={styles.grid}>
          {visibleItems.map((item) => {
            const videoId = videoIdFor(item);
            const href = mediaUrl(item.videoFile || item.videoUrl || item.url);
            const Card = href ? 'a' : 'article';
            const tags = (item.tags || []).map((tag) => resourceServiceTags[tag] || tag);
            const hasVideo = videoId || item.videoFile || item.videoUrl;
            return <Card className={`${styles.card} ${hasVideo ? styles.videoCard : ''}`} key={item.id} {...(href ? {href, target: '_blank', rel: 'noopener noreferrer'} : {})}>
              {hasVideo && <div className={styles.videoFrame}>
                {videoId ? <img src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} alt="" />
                  : item.videoFile ? <video src={href} muted playsInline preload="metadata" /> : null}
                <span className={styles.playButton} aria-hidden="true" />
              </div>}
              <div className={styles.cardContent}>
                <div className={styles.cardTopline}><span>{item.type}</span></div>
                <h2>{item.title}</h2>
                <div className={styles.cardDetails}>
                  {item.description && <p>{item.description}</p>}
                  {item.creator && <p className={styles.creator}>Created by: {item.creator}</p>}
                </div>
                {tags.length > 0 && <span className={styles.serviceTag} title={tags.join(' · ')}>{tags.join(' · ')}</span>}
                {href && <span className={styles.srOnly}>Opens in a new tab</span>}
              </div>
            </Card>;
          })}
        </div>}
      </section>
      {editorOpen && <VmCatalogEditor kind="resources" apiUrl={apiUrl} items={items} onSaved={loadItems} onClose={() => setEditorOpen(false)} serviceTags={resourceServiceTags} />}
    </main>
    {showBackToTop && <button className={styles.backToTop} type="button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} aria-label="Back to top" title="Back to top">↑</button>}
  </Layout>;
}

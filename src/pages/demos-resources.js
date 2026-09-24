import {useState} from 'react';
import Layout from '@theme/Layout';
import {demoResourceCategories, demosResources, resourceServiceTags} from '@site/src/data/demosResources';
import {coachingSessions} from '@site/src/data/coachingSessions';
import styles from './demos-resources.module.css';

export default function DemosResources() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const videoItems = coachingSessions.map((session) => ({
    ...session,
    category: 'demo',
    type: 'Developer coaching session',
    description: `${session.speaker} · ${session.focus}`,
    url: `https://www.youtube.com/watch?v=${session.youtubeId}`,
    publishedAt: null,
  }));
  const visibleItems = [...demosResources, ...videoItems]
    .filter((item) => activeCategory === 'all' || item.category === activeCategory)
    .filter((item) => selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag)))
    .sort((first, second) => new Date(second.publishedAt || 0) - new Date(first.publishedAt || 0));

  function toggleTag(tag) {
    setSelectedTags((currentTags) => currentTags.includes(tag)
      ? currentTags.filter((currentTag) => currentTag !== tag)
      : [...currentTags, tag]);
  }

  return (
    <Layout title="Demos & Resources" description="Oracle Cloud open source demos and resources.">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Demos &amp; Resources</h1>
          <p>Explore demos, repositories, articles, and architecture resources for Oracle Cloud open source services.</p>
        </header>
        <section className={styles.catalog}>
          <div className={styles.catalogControls}>
          <div className={styles.tabs} role="tablist" aria-label="Resource categories">
            {demoResourceCategories.map((category) => (
              <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>
                {category.label}
              </button>
            ))}
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
            {visibleItems.map((item) => (
              <article className={`${styles.card} ${item.category === 'demo' ? styles.videoCard : ''}`} key={item.id}>
                {item.category === 'demo' && <a className={styles.videoFrame} href={item.url} target="_blank" rel="noreferrer" aria-label={`Play ${item.title} on YouTube`}>
                  <img src={`https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg`} alt="" /><span className={styles.playButton} aria-hidden="true" />
                </a>}
                <div className={styles.cardContent}>
                  <div className={styles.cardTopline}>
                    <span>{item.type}</span>
                    <span className={styles.serviceTag}>{item.tags.map((tag) => resourceServiceTags[tag]).join(' · ')}</span>
                  </div>
                  <h2>{item.title}</h2><p>{item.description}</p>
                  {item.url ? <a className={styles.exploreLink} href={item.url} target="_blank" rel="noreferrer">Explore <span aria-hidden="true">→</span></a> : <span className={styles.comingSoon}>Coming soon</span>}
                </div>
              </article>
            ))}
          </div>}
        </section>
      </main>
    </Layout>
  );
}

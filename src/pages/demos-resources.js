import {useEffect, useState} from 'react';
import Layout from '@theme/Layout';
import {demoResourceCategories, demosResources, resourceServiceTags} from '@site/src/data/demosResources';
import {coachingSessions} from '@site/src/data/coachingSessions';
import styles from './demos-resources.module.css';

export default function DemosResources() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const videoItems = coachingSessions.map((session) => ({
    ...session,
    category: 'demo',
    type: 'Developer coaching session',
    creator: session.speaker,
    url: `https://www.youtube.com/watch?v=${session.youtubeId}`,
    publishedAt: session.publishedAt,
  }));
  const visibleItems = [...demosResources, ...videoItems]
    .filter((item) => activeCategory === 'all' || item.category === activeCategory)
    .filter((item) => selectedTags.length === 0 || selectedTags.some((tag) => item.tags.includes(tag)))
    .sort((first, second) => {
      const firstDate = first.publishedAt || first.updatedAt;
      const secondDate = second.publishedAt || second.updatedAt;
      return new Date(secondDate || 0) - new Date(firstDate || 0);
    });

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
              <a className={`${styles.card} ${item.youtubeId ? styles.videoCard : ''}`} key={item.id} href={item.url} title={item.title} target="_blank" rel="noopener noreferrer">
                {item.youtubeId && <div className={styles.videoFrame}>
                  <img src={`https://i.ytimg.com/vi/${item.youtubeId}/maxresdefault.jpg`} alt="" /><span className={styles.playButton} aria-hidden="true" />
                </div>}
                <div className={styles.cardContent}>
                  <div className={styles.cardTopline}>
                    <span>{item.type}</span>
                  </div>
                  <h2>{item.title}</h2>
                  <div className={styles.cardDetails}>
                    {item.description && <p>{item.description}</p>}
                    {item.creator && <p className={styles.creator}>Created by: {item.creator}</p>}
                  </div>
                  <span className={styles.serviceTag} title={item.tags.map((tag) => resourceServiceTags[tag]).join(' · ')}>{item.tags.map((tag) => resourceServiceTags[tag]).join(' · ')}</span>
                  <span className={styles.srOnly}>Opens in a new tab</span>
                </div>
              </a>
            ))}
          </div>}
        </section>
      </main>
      {showBackToTop && <button className={styles.backToTop} type="button" onClick={scrollToTop} aria-label="Back to top" title="Back to top">↑</button>}
    </Layout>
  );
}

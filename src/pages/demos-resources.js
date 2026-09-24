import {useState} from 'react';
import Layout from '@theme/Layout';
import {demoResourceCategories, demosResources} from '@site/src/data/demosResources';
import styles from './demos-resources.module.css';

export default function DemosResources() {
  const [activeCategory, setActiveCategory] = useState('all');
  const visibleItems = activeCategory === 'all'
    ? demosResources
    : demosResources.filter((item) => item.category === activeCategory);

  return (
    <Layout title="Demos & Resources" description="Oracle Cloud open source demos and resources.">
      <main className={styles.page}>
        <header className={styles.header}>
          <h1>Demos &amp; Resources</h1>
          <p>Explore demos, repositories, articles, and architecture resources for Oracle Cloud open source services.</p>
        </header>
        <section className={styles.catalog}>
          <div className={styles.tabs} role="tablist" aria-label="Resource categories">
            {demoResourceCategories.map((category) => (
              <button key={category.id} type="button" role="tab" aria-selected={activeCategory === category.id} className={activeCategory === category.id ? styles.activeTab : ''} onClick={() => setActiveCategory(category.id)}>
                {category.label}
              </button>
            ))}
          </div>
          <div className={styles.grid}>
            {visibleItems.map((item) => (
              <article className={styles.card} key={item.id}>
                <p className={styles.type}>{item.type}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                {item.url ? <a href={item.url} target="_blank" rel="noreferrer">Open resource &rarr;</a> : <span className={styles.comingSoon}>Coming soon</span>}
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}

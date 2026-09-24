import {useEffect, useRef} from 'react';
import Layout from '@theme/Layout';
import styles from './about.module.css';

const focusAreas = [
  {
    icon: '✓',
    title: 'Our Mission',
    text: 'To empower developers and enterprises to build, scale, and innovate freely using secure, cloud-native open source solutions on Oracle Cloud.',
  },
  {
    icon: '</>',
    title: 'What We Do',
    text: 'We provide managed open source services, curated architectures, and the infrastructure needed to support your entire development lifecycle.',
  },
  {
    icon: '◌',
    title: 'How To Engage',
    text: 'Explore our projects on GitHub, join developer coaching sessions, or deploy a managed service directly from the OCI console.',
  },
];

const team = [
  {name: 'Bob Peuleun', role: 'Open Source Data Leader', email: 'bob.peulen@oracle.com', initials: 'bp'},
  {name: 'Noella Abraham', role: 'Open Source Data Black Belt', email: 'noella.abraham@oracle.com', initials: 'na'},
  {name: 'Irine Benoy', role: 'Open Source Data Black Belt', email: 'irine.benoy@oracle.com', initials: 'ib'},
  {name: 'Olivier Dasini', role: 'Open Source Data Black Belt', email: 'olivier.dasini@oracle.com', initials: 'od'},
  {name: 'Piotr Kurzynoga', role: 'Open Source Data Black Belt', email: 'piotr.kurzynoga@oracle.com', initials: 'pk'},
  {name: 'Andriy Dorokhin', role: 'Open Source Data Black Belt', email: 'andriy.dorokhin@oracle.com', initials: 'ad'},
  {name: 'Jevon Rowan', role: 'Open Source Data Black Belt', email: 'jevon.rowan@oracle.com', initials: 'jr'},
  {name: 'Mohammed Bashir', role: 'Open Source Data Black Belt', email: 'mohammed.bashir@oracle.com', initials: 'mb'},
  {name: 'Sylwester Dec', role: 'Open Source Data Black Belt', email: 'sylwester.dec@oracle.com', initials: 'sd'},
  {name: 'Ivan Ma', role: 'Open Source Data Black Belt', email: 'ivan-cs.ma@oracle.com', initials: 'im'},
];

export default function AboutPage() {
  const carouselRef = useRef(null);
  const moveCarousel = (direction) => {
    const viewport = carouselRef.current;
    const card = viewport?.querySelector('article');
    if (!viewport || !card) return;
    const gap = Number.parseFloat(getComputedStyle(viewport).gap) || 0;
    viewport.scrollBy({left: direction * (card.offsetWidth + gap), behavior: 'smooth'});
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      const viewport = carouselRef.current;
      const card = viewport?.querySelector('article');
      if (!viewport || !card) return;
      const gap = Number.parseFloat(getComputedStyle(viewport).gap) || 0;
      const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 4;
      if (atEnd) {
        viewport.scrollTo({left: 0, behavior: 'smooth'});
      } else {
        viewport.scrollBy({left: card.offsetWidth + gap, behavior: 'smooth'});
      }
    }, 3000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <Layout title="About" description="About the OCI Open Source Hub team.">
      <main className={styles.page}>
        <section className={styles.introduction}>
          <div className={styles.contentWidth}>
            <div className={styles.aboutHero}>
              <div>
                <h1>About Us</h1>
                <p className={styles.lead}>We are a team of technologists and open source enthusiasts helping customers succeed with open source technologies on OCI.</p>
              </div>
              <img className={styles.heroImage} src="/img/zoo.png" alt="Open source technology zoo" />
            </div>
            <div className={styles.focusGrid}>
              {focusAreas.map((area) => (
                <article className={styles.focus} key={area.title}>
                  <span className={styles.focusIcon} aria-hidden="true">{area.icon}</span>
                  <h2>{area.title}</h2>
                  <p>{area.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.teamSection}>
          <div className={styles.contentWidth}>
            <div className={styles.teamHeader}>
              <div>
                <p className={styles.label}>The People</p>
                <h2>Meet the Team</h2>
              </div>
              <div className={styles.carouselControls}>
                <button type="button" aria-label="Previous team members" onClick={() => moveCarousel(-1)}>←</button>
                <button type="button" aria-label="Next team members" onClick={() => moveCarousel(1)}>→</button>
              </div>
            </div>
            <div className={styles.carousel} ref={carouselRef} aria-label="Team members">
              {team.map((member) => (
                <article className={styles.member} key={member.initials}>
                  <div className={styles.photoPlaceholder} aria-label={`${member.name} photo placeholder`} role="img">
                    {member.image ? <img src={member.image} alt={`${member.name} placeholder`} /> : member.initials}
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <span className={styles.email}>{member.email}</span>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

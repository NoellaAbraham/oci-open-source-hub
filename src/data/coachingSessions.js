import {resources} from './catalogs';

// Keep the homepage's offline coaching cards aligned with the live catalog.
export const coachingSessions = resources
  .filter((item) => item.type === 'Developer coaching session')
  .map((item) => ({...item, speaker: item.creator, focus: item.description}));

export function githubSaveNotice(sync) {
  return sync?.status === 'synced'
    ? 'Saved to the live catalog and GitHub. The website backup will update after deployment.'
    : sync?.status === 'pending'
      ? 'Saved to the live catalog. GitHub backup is pending; the server will retry automatically.'
      : 'Saved to the live catalog. GitHub backup is not configured on the server.';
}

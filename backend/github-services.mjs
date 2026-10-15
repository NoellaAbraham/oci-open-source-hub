// Runs on the VM only. Never expose the GitHub token to the frontend.
export function createServiceGithubSync({enabled, repository, branch = 'main', token, fetchImpl = fetch}) {
  if (!enabled) return {enabled: false, sync: async () => ({status: 'disabled'})};
  if (!token || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '') || !branch) {
    throw new Error('GitHub service sync requires GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo), and GITHUB_BRANCH.');
  }
  const url = `https://api.github.com/repos/${repository}/contents/backend/seed-services.json`;
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
  return {
    enabled: true,
    async sync(services) {
      const content = `${JSON.stringify(services.map(({id, ...service}) => service), null, 2)}\n`;
      // A changed branch/file SHA can race another commit; reload before retrying.
      for (let attempt = 0; attempt < 3; attempt++) {
        const current = await fetchImpl(`${url}?ref=${encodeURIComponent(branch)}`, {headers, signal: AbortSignal.timeout(10_000)});
        if (!current.ok && current.status !== 404) throw new Error(`GitHub read failed (HTTP ${current.status}).`);
        const file = current.ok ? await current.json() : null;
        if (file && (!file.sha || typeof file.content !== 'string' || file.encoding !== 'base64')) {
          throw new Error('GitHub returned an invalid service catalog.');
        }
        if (file && Buffer.from(file.content, 'base64').toString('utf8') === content) return {status: 'synced'};
        const saved = await fetchImpl(url, {
          method: 'PUT', headers, signal: AbortSignal.timeout(10_000),
          body: JSON.stringify({
            message: 'Update service catalog from website editor', branch,
            content: Buffer.from(content).toString('base64'), ...(file ? {sha: file.sha} : {}),
          }),
        });
        if (saved.ok) return {status: 'synced'};
        if (![409, 422].includes(saved.status) || attempt === 2) throw new Error(`GitHub save failed (HTTP ${saved.status}).`);
      }
    },
  };
}

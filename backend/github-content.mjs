import {createHash} from 'node:crypto';

// Server-only writer shared by catalogs and uploaded media.
export function createGithubFileSync({enabled, repository, branch = 'main', token, fetchImpl = fetch}) {
  if (!enabled) return {enabled: false, syncFile: async () => ({status: 'disabled'})};
  if (!token || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository || '') || !branch) {
    throw new Error('GitHub sync requires GITHUB_TOKEN, GITHUB_REPOSITORY (owner/repo), and GITHUB_BRANCH.');
  }
  const headers = {
    Accept: 'application/vnd.github.object+json', Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json',
  };
  return {
    enabled: true,
    async syncFile(path, value, message) {
      const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
      const sha = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
      const url = `https://api.github.com/repos/${repository}/contents/${path}`;
      for (let attempt = 0; attempt < 3; attempt++) {
        const current = await fetchImpl(`${url}?ref=${encodeURIComponent(branch)}`, {headers, signal: AbortSignal.timeout(15_000)});
        if (!current.ok && current.status !== 404) throw new Error(`GitHub read failed (HTTP ${current.status}).`);
        const file = current.ok ? await current.json() : null;
        if (file && typeof file.sha !== 'string') throw new Error('GitHub returned invalid file metadata.');
        // For files over 1 MB GitHub returns metadata without base64 content.
        if (file?.sha === sha || (file?.encoding === 'base64' && Buffer.from(file.content, 'base64').equals(bytes))) return {status: 'synced'};
        const saved = await fetchImpl(url, {
          method: 'PUT', headers, signal: AbortSignal.timeout(30_000),
          body: JSON.stringify({message, branch, content: bytes.toString('base64'), ...(file ? {sha: file.sha} : {})}),
        });
        if (saved.ok) return {status: 'synced'};
        if (![409, 422].includes(saved.status) || attempt === 2) throw new Error(`GitHub save failed (HTTP ${saved.status}).`);
      }
    },
  };
}

export function createCollectionGithubSync(config) {
  const writer = createGithubFileSync(config);
  const syncedMedia = new Set();
  return {
    enabled: writer.enabled,
    async sync(kind, items, readMedia) {
      if (!writer.enabled) return {status: 'disabled'};
      if (!['resources', 'reports'].includes(kind)) throw new Error('Invalid catalog.');
      const snapshot = [];
      for (const item of items) {
        const copy = {...item};
        for (const field of ['url', 'videoUrl', 'videoFile', 'coverImage', 'htmlFile', 'readOnlinePath', 'pdfUrl', 'slidesUrl']) {
          if (!String(copy[field] || '').startsWith('/api/media?')) continue;
          const filename = new URL(copy[field], 'https://local.invalid').searchParams.get('file');
          if (!/^(video|html|image)-[a-f0-9]{24}\.(mp4|webm|html|png|jpe?g|webp)$/.test(filename || '')) throw new Error('Invalid uploaded media reference.');
          if (!syncedMedia.has(filename)) {
            await writer.syncFile(`static/uploads/${filename}`, await readMedia(filename), 'Back up uploaded website media');
            syncedMedia.add(filename);
          }
          copy[field] = `/uploads/${filename}`;
        }
        snapshot.push(copy);
      }
      // Publish media before the catalog that links to it. Failed uploads never
      // leave the GitHub catalog pointing at files that haven't been backed up.
      return writer.syncFile(`backend/seed-${kind}.json`, `${JSON.stringify(snapshot, null, 2)}\n`, `Update ${kind} catalog from website editor`);
    },
  };
}

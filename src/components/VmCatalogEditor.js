import {useEffect, useState} from 'react';
import styles from './VmCatalogEditor.module.css';

const uploadLimits = {video: 10_000_000, html: 10_000_000, image: 2_000_000};

function emptyDraft(kind) {
  return kind === 'resources'
    ? {title: '', category: 'demo', type: 'Demo', creator: '', description: '', url: '', videoUrl: '', videoFile: '', tags: [], publishedAt: '', updatedAt: ''}
    : {title: '', creator: '', period: '', publishedAt: '', summary: '', coverImage: '', htmlFile: '', readOnlinePath: '', pdfUrl: '', slidesUrl: ''};
}

export default function VmCatalogEditor({kind, apiUrl, items, onSaved, onClose, serviceTags}) {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [draft, setDraft] = useState(() => emptyDraft(kind));
  const [files, setFiles] = useState({});
  const label = kind === 'resources' ? 'demo or resource' : 'report';

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  async function jsonResponse(response) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
    return data;
  }

  async function unlock(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = await jsonResponse(await fetch(`${apiUrl}/api/editor/verify`, {
        method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({password}),
      }));
      setToken(data.token);
      setPassword('');
    } catch (failure) { setError(failure.message); }
    finally { setSaving(false); }
  }

  function selectItem(id) {
    setSelectedId(id);
    setDraft(id ? {...emptyDraft(kind), ...items.find((item) => item.id === id)} : emptyDraft(kind));
    setFiles({});
    setError('');
  }

  function update(name, value) { setDraft((current) => ({...current, [name]: value})); }

  function toggleTag(tag) {
    setDraft((current) => ({...current, tags: (current.tags || []).includes(tag)
      ? current.tags.filter((item) => item !== tag) : [...(current.tags || []), tag]}));
  }

  async function upload(kindToUpload, file) {
    if (file.size > uploadLimits[kindToUpload]) throw new Error(`${file.name} is too large. Use a link for larger files.`);
    const response = await fetch(`${apiUrl}/api/media?kind=${kindToUpload}&name=${encodeURIComponent(file.name)}`, {
      method: 'POST', headers: {Authorization: `Bearer ${token}`, 'Content-Type': file.type || 'application/octet-stream'}, body: file,
    });
    return (await jsonResponse(response)).url;
  }

  async function save(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const value = {...draft};
      if (files.videoFile) value.videoFile = await upload('video', files.videoFile);
      if (files.htmlFile) value.htmlFile = await upload('html', files.htmlFile);
      if (files.coverImage) value.coverImage = await upload('image', files.coverImage);
      await jsonResponse(await fetch(`${apiUrl}/api/${kind}`, {
        method: selectedId ? 'PUT' : 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify(value),
      }));
      await onSaved();
      onClose();
    } catch (failure) { setError(failure.message); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!selectedId || !window.confirm(`Delete ${draft.title}? This removes it from the public page.`)) return;
    setError('');
    setSaving(true);
    try {
      await jsonResponse(await fetch(`${apiUrl}/api/${kind}`, {
        method: 'DELETE', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
        body: JSON.stringify({id: selectedId}),
      }));
      await onSaved();
      onClose();
    } catch (failure) { setError(failure.message); }
    finally { setSaving(false); }
  }

  const input = (name, title, options = {}) => <label key={name} className={styles.field}>
    <span>{title}</span>
    {options.multiline
      ? <textarea value={draft[name] || ''} onChange={(event) => update(name, event.target.value)} required={options.required} maxLength={options.maxLength || 1500} />
      : <input type={options.type || 'text'} value={draft[name] || ''} onChange={(event) => update(name, event.target.value)} required={options.required} maxLength={options.maxLength || 1000} />}
  </label>;

  const fileInput = (name, title, accept) => <label key={name} className={styles.field}>
    <span>{title}</span>
    <input type="file" accept={accept} onChange={(event) => setFiles((current) => ({...current, [name]: event.target.files?.[0]}))} />
    {draft[name] && <small>Current file: {draft[name]}</small>}
  </label>;

  return <div className={styles.backdrop}>
    <section className={styles.panel} role="dialog" aria-modal="true" aria-label={`Edit ${kind}`}>
      <button className={styles.close} type="button" onClick={onClose} aria-label="Close editor">×</button>
      <h2>{token ? `Manage ${kind === 'resources' ? 'demos & resources' : 'reports'}` : 'Unlock editor'}</h2>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {!token ? <form onSubmit={unlock}>
        <label className={styles.field}><span>Editor password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button type="submit" disabled={saving}>{saving ? 'Unlocking…' : 'Unlock editor'}</button>
      </form> : <>
        <label className={styles.field}><span>Choose an existing {label}, or add a new one</span>
          <select value={selectedId} onChange={(event) => selectItem(event.target.value)}>
            <option value="">Add new {label}</option>
            {items.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <form onSubmit={save}>
          {input('title', 'Title', {required: true, maxLength: 180})}
          {kind === 'resources' ? <>
            <label className={styles.field}><span>Category</span><select value={draft.category} onChange={(event) => update('category', event.target.value)}>
              <option value="demo">Demo</option><option value="github">GitHub repository</option><option value="article">Article</option><option value="diagram">Architecture diagram</option>
            </select></label>
            {input('type', 'Type shown on card', {required: true, maxLength: 100})}
            {input('creator', 'Created by')}
            {input('description', 'Description', {multiline: true})}
            {input('url', 'Resource URL')}
            {input('videoUrl', 'Video link (optional)')}
            {fileInput('videoFile', 'Upload video (MP4 or WebM, up to 10 MB)', '.mp4,.webm')}
            <fieldset><legend>Related services</legend>{Object.entries(serviceTags || {}).map(([id, name]) =>
              <label key={id} className={styles.choice}><input type="checkbox" checked={(draft.tags || []).includes(id)} onChange={() => toggleTag(id)} /> {name}</label>)}</fieldset>
            {input('publishedAt', 'Published date', {type: 'date'})}
          </> : <>
            {input('creator', 'Created by')}
            {input('period', 'Reporting period')}
            {input('publishedAt', 'Published date', {type: 'date'})}
            {input('summary', 'Summary', {multiline: true, required: true})}
            {input('coverImage', 'Cover image URL (optional)')}
            {fileInput('coverImage', 'Or upload a cover image', '.png,.jpg,.jpeg,.webp')}
            {fileInput('htmlFile', 'Upload HTML report (up to 10 MB)', '.html')}
            {input('readOnlinePath', 'Existing read-online page URL (optional)')}
            {input('pdfUrl', 'PDF URL (optional)')}
            {input('slidesUrl', 'Slide deck URL (optional)')}
          </>}
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : selectedId ? `Save ${label}` : `Add ${label}`}</button>
        </form>
        {selectedId && <button className={styles.delete} type="button" disabled={saving} onClick={remove}>Delete {label}</button>}
      </>}
    </section>
  </div>;
}

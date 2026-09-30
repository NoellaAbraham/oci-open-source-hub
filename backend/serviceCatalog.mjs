const categories = new Set(['databases', 'streaming', 'big-data', 'search']);

export function validateService(form) {
  const name = String(form.get('name') || '').trim();
  const category = String(form.get('category') || '');
  const description = String(form.get('description') || '').trim();
  const url = String(form.get('url') || '').trim();
  const image = String(form.get('image') || '').trim();
  const testOnly = form.get('testOnly') === 'on';
  if (name.length < 3 || name.length > 100 || /[\r\n\x00-\x1f]/.test(name)) throw new Error('Enter a service name of 3-100 characters.');
  if (!categories.has(category)) throw new Error('Choose a valid category.');
  if (description.length < 15 || description.length > 400) throw new Error('Enter a description of 15-400 characters.');
  if (url && (!/^https:\/\/[^\s]+$/i.test(url) || url.length > 500)) throw new Error('Service URL must start with https://.');
  if (image && (!/^\/img\/services\/[a-z0-9._-]+\.(png|jpe?g|webp|svg)$/i.test(image) || image.includes('..'))) throw new Error('Logo path must point to an image in /img/services/.');
  if (testOnly && !name.startsWith('[TEST] ')) throw new Error('Test service names must start with [TEST] so they are easy to identify.');
  return {name, categories: [category], description, ...(url ? {url} : {}), ...(image ? {image} : {}), ...(testOnly ? {testOnly: true} : {})};
}

function markerIndex(source) {
  const index = source.lastIndexOf('\n];');
  if (index < 0) throw new Error('Could not find the service list in the repository.');
  return index;
}

export function testServices(source) {
  markerIndex(source);
  return source.split(/\r?\n/).flatMap((line) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('{') || !trimmed.endsWith('},')) return [];
    try {
      const entry = JSON.parse(trimmed.slice(0, -1));
      return entry.testOnly === true && typeof entry.name === 'string' && entry.name.startsWith('[TEST] ') ? [entry.name] : [];
    } catch {
      return [];
    }
  });
}

export function addService(source, service) {
  const index = markerIndex(source);
  if (source.includes(`name: '${service.name.replaceAll("'", "\\'")}'`) || source.includes(`"name":${JSON.stringify(service.name)}`)) {
    throw new Error('A service with that name already exists.');
  }
  return `${source.slice(0, index)}\n  ${JSON.stringify(service)},${source.slice(index)}`;
}

export function removeTestService(source, name) {
  if (!testServices(source).includes(name)) throw new Error('Only services created as test entries can be removed here.');
  const lines = source.split('\n');
  const index = lines.findIndex((line) => {
    try {
      const entry = JSON.parse(line.trim().replace(/,$/, ''));
      return entry.testOnly === true && entry.name === name;
    } catch {
      return false;
    }
  });
  if (index < 0) throw new Error('Test service not found.');
  lines.splice(index, 1);
  return lines.join('\n');
}

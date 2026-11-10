export const siteTagline = '一些有用无用的想法。';

export const siteDescription = 'Daisy Lab。一些有用无用的想法。';

export const archiveDescription = siteDescription;

export const defaultImage = '/assets/interior-room-reference.webp';

export const defaultImageAlt = 'Pixel-art inspired interior room reference with warm practical light and portfolio desk details.';

export function canonicalPath(pathname) {
  let path = pathname || '/';

  if (path.endsWith('/index.html')) {
    path = path.slice(0, -'index.html'.length);
  } else if (path.endsWith('.html')) {
    path = path.slice(0, -'.html'.length);
  }

  if (path === '' || path === '/') {
    return '/';
  }

  if (/\.(xml|txt)$/i.test(path)) {
    return path.startsWith('/') ? path : `/${path}`;
  }

  const withSlash = path.endsWith('/') ? path : `${path}/`;

  return withSlash.startsWith('/') ? withSlash : `/${withSlash}`;
}

export function absoluteUrl(pathname, site) {
  return new URL(canonicalPath(pathname), site).href;
}

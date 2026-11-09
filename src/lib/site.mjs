export const archiveDescription = 'Daisy Lab 的私人作品档案，整理技术美术、实时特效、程序化流程与项目复盘。';

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

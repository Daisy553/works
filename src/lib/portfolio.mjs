import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

export function loadPortfolio() {
  const file = path.resolve(process.cwd(), 'public/project-data.js');

  return require(file).DAISY_PORTFOLIO;
}

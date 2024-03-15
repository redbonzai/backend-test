import * as fs from 'fs';

export function readPackageVersion(): string {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version || 'UNKNOWN';
}

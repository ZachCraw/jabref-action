const core = require('@actions/core');
const cache = require('@actions/cache');
const { execSync } = require('child_process');
const path = require('path');
const https = require('https');
const fs = require('fs');

async function run() {
  try {
    const url = 'https://builds.jabref.org/main/jabkit-portable_linux.tar.gz';
    const downloadDir = '/tmp/jabkit';
    const archivePath = '/tmp/jabkit.tar.gz';

    // 1. Fetch remote metadata
    const metadata = await fetchMetadata(url);
    const lastModified = metadata['last-modified'] || Date.now().toString();
    const etag = metadata['etag'] || '';

    // 2. Create cache key based on metadata
    const cacheKey = `jabkit-${etag.replace(/"/g, '') || lastModified}`;
    console.log(`🔑 Using cache key: ${cacheKey}`);

    // 3. Try restoring from cache
    const restoredCache = await cache.restoreCache([downloadDir], cacheKey);

    if (!restoredCache) {
      // 4. Download archive
      console.log('Cache miss. Downloading archive...');
      execSync(`curl --silent --show-error --location ${url} --output ${archivePath}`, { stdio: 'inherit' });

      // 5. Unzip archive
      console.log('Extracting archive...');
      fs.mkdirSync(downloadDir, { recursive: true });
      execSync(`tar -xzf ${archivePath} -C ${downloadDir}`, { stdio: 'inherit' });

      // 6. Save cache
      await cache.saveCache([downloadDir], cacheKey);
      console.log('Cached extracted JabKit.');
    } else {
      console.log('Cache hit. Using cached JabKit.');
    }

    // 7. Execute jabkit
    const bibfile = core.getInput('bibfile');
    const jabkitExecutable = '/tmp/jabkit/jabkit/bin/jabkit';

    console.log(`Running JabKit consistency check on ${bibfile}...`);
    execSync(`${jabkitExecutable} --porcelain --check-consistency "${bibfile}"`, { stdio: 'inherit' });
  } catch (error) {
    core.setFailed(error.message);
  }
}

function fetchMetadata(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    options.method = 'HEAD';

    const req = https.request(options, res => {
      const headers = {};
      for (const [key, value] of Object.entries(res.headers)) {
        headers[key.toLowerCase()] = value;
      }
      resolve(headers);
    });

    req.on('error', reject);
    req.end();
  });
}

run();

const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

const version = packageJson.version;
const buildId = Date.now().toString(); // Use timestamp as build ID for uniqueness

const content = {
    version,
    buildId,
    timestamp: new Date().toISOString()
};

const outputPath = path.join(__dirname, '../public/version.json');

fs.writeFileSync(outputPath, JSON.stringify(content, null, 2));

console.log(`✅ Generated version.json: v${version} (Build ID: ${buildId})`);

const fs = require('fs');
const path = require('path');
const os = require('os');

const HOOKS_SOURCE_DIR = path.join(process.cwd(), 'scripts', 'hooks');
const GIT_HOOKS_DIR = path.join(process.cwd(), '.git', 'hooks');

if (!fs.existsSync(GIT_HOOKS_DIR)) {
    console.error("Error: .git directory not found. Is this a git repository?");
    process.exit(1);
}

const hooks = ['prepare-commit-msg', 'post-commit'];

hooks.forEach(hook => {
    const sourcePath = path.join(HOOKS_SOURCE_DIR, hook);
    const destPath = path.join(GIT_HOOKS_DIR, hook);

    if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(destPath, content);

        // Make executable on unix-like systems
        if (os.platform() !== 'win32') {
            fs.chmodSync(destPath, '755');
        }
        console.log(`Installed hook: ${hook}`);
    } else {
        console.warn(`Warning: Hook source not found: ${hook}`);
    }
});

console.log("Git hooks installed successfully.");

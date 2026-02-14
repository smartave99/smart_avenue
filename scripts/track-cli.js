const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TRACKING_DIR = path.join(process.cwd(), '.tracking');
const SESSIONS_DIR = path.join(TRACKING_DIR, 'sessions');
const INDEX_FILE = path.join(TRACKING_DIR, 'index.json');
const HEAD_FILE = path.join(TRACKING_DIR, 'HEAD'); // Stores current session ID

// Ensure directories exist
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function getUUID() {
    return crypto.randomUUID();
}

function getCurrentSessionId() {
    if (fs.existsSync(HEAD_FILE)) {
        return fs.readFileSync(HEAD_FILE, 'utf8').trim();
    }
    return null;
}

function loadSession(sessionId) {
    const sessionPath = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (fs.existsSync(sessionPath)) {
        return JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
    }
    return null;
}

function saveSession(session) {
    const sessionPath = path.join(SESSIONS_DIR, `${session.sessionId}.json`);
    fs.writeFileSync(sessionPath, JSON.stringify(session, null, 2));
}

function updateIndex(taskId, sessionId) {
    let index = {};
    if (fs.existsSync(INDEX_FILE)) {
        try {
            index = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
        } catch (e) {
            console.error("Error reading index file, starting fresh.");
        }
    }

    if (!index.tasks) index.tasks = {};
    if (!index.tasks[taskId]) {
        index.tasks[taskId] = { sessions: [], commits: [], status: 'active', lastUpdated: new Date().toISOString() };
    }

    if (!index.tasks[taskId].sessions.includes(sessionId)) {
        index.tasks[taskId].sessions.push(sessionId);
    }

    index.tasks[taskId].lastUpdated = new Date().toISOString();

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));
}

function initSession(taskId) {
    const sessionId = getUUID();
    const session = {
        sessionId: sessionId,
        taskId: taskId,
        startTime: new Date().toISOString(),
        status: 'active',
        events: []
    };

    saveSession(session);
    fs.writeFileSync(HEAD_FILE, sessionId);
    updateIndex(taskId, sessionId);
    console.log(`Session initialized: ${sessionId} for task ${taskId}`);
}

function logEvent(message, type = 'log', author = 'user') {
    const sessionId = getCurrentSessionId();
    if (!sessionId) {
        console.error("No active session. Run 'init <task-id>' first.");
        return;
    }

    const session = loadSession(sessionId);
    if (!session) {
        console.error("Session file not found.");
        return;
    }

    const event = {
        timestamp: new Date().toISOString(),
        type: type,
        author: author,
        content: message
    };

    session.events.push(event);
    saveSession(session);
    console.log(`Logged: ${message}`);
}

function stopSession() {
    const sessionId = getCurrentSessionId();
    if (!sessionId) {
        console.log("No active session to stop.");
        return;
    }

    const session = loadSession(sessionId);
    if (session) {
        session.status = 'completed';
        session.endTime = new Date().toISOString();
        saveSession(session);
        console.log(`Session ${sessionId} stopped.`);
    }

    if (fs.existsSync(HEAD_FILE)) {
        fs.unlinkSync(HEAD_FILE);
    }
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'init':
            const taskId = args[1];
            if (!taskId) {
                console.error("Usage: node track-cli.js init <task-id>");
                process.exit(1);
            }
            initSession(taskId);
            break;
        case 'log':
            const message = args[1];
            const typeArg = args.find(arg => arg.startsWith('--type='));
            const type = typeArg ? typeArg.split('=')[1] : 'log';

            if (!message) {
                console.error("Usage: node track-cli.js log <message> [--type=<type>]");
                process.exit(1);
            }
            logEvent(message, type);
            break;
        case 'stop':
            stopSession();
            break;
        case 'status':
            const currentId = getCurrentSessionId();
            if (currentId) {
                const session = loadSession(currentId);
                console.log(`Active Session: ${currentId}`);
                console.log(`Task: ${session.taskId}`);
                console.log(`Started: ${session.startTime}`);
                console.log(`Events: ${session.events.length}`);
            } else {
                console.log("No active session.");
            }
            break;
        default:
            console.log("Usage: node track-cli.js [init <task-id> | log <message> | stop | status]");
    }
}

main();

const fs = require('fs');
const path = require('path');

const TRACKING_DIR = path.join(process.cwd(), '.tracking');
const SESSIONS_DIR = path.join(TRACKING_DIR, 'sessions');
const REPORTS_DIR = path.join(TRACKING_DIR, 'reports');

if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function generateReport(taskId) {
    if (!fs.existsSync(SESSIONS_DIR)) {
        console.log("No sessions found.");
        return;
    }

    const sessions = fs.readdirSync(SESSIONS_DIR)
        .filter(file => file.endsWith('.json'))
        .map(file => JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, file), 'utf8')))
        .filter(session => !taskId || session.taskId === taskId)
        .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    if (sessions.length === 0) {
        console.log(`No sessions found for task: ${taskId || 'all'}`);
        return;
    }

    const reportDate = new Date().toISOString().split('T')[0];
    const reportContent = [];

    reportContent.push(`# Tracking Report - ${reportDate}`);
    if (taskId) reportContent.push(`## Task: ${taskId}`);
    reportContent.push('');

    // Aggregate stats
    let totalTime = 0;
    const uniqueAuthors = new Set();
    let totalCommits = 0;

    sessions.forEach(session => {
        if (session.endTime && session.startTime) {
            totalTime += (new Date(session.endTime) - new Date(session.startTime));
        }
        session.events.forEach(event => {
            if (event.author) uniqueAuthors.add(event.author);
            if (event.type === 'commit') totalCommits++;
        });
    });

    const durationMinutes = Math.floor(totalTime / 1000 / 60);

    reportContent.push(`**Total Duration:** ${durationMinutes} minutes`);
    reportContent.push(`**Contributors:** ${Array.from(uniqueAuthors).join(', ')}`);
    reportContent.push(`**Total Commits:** ${totalCommits}`);
    reportContent.push('');

    // Detailed Sessions
    reportContent.push('## Detailed Session Log');

    sessions.forEach(session => {
        reportContent.push(`### Session: ${session.sessionId} (${session.status})`);
        reportContent.push(`*Started: ${session.startTime}*`);
        if (session.endTime) reportContent.push(`*Ended: ${session.endTime}*`);

        reportContent.push('');
        reportContent.push('| Time | Type | Author | Content |');
        reportContent.push('|---|---|---|---|');

        session.events.forEach(event => {
            const time = new Date(event.timestamp).toLocaleTimeString();
            const content = event.content.replace(/\n/g, '<br>').replace(/\|/g, '\\|');
            reportContent.push(`| ${time} | ${event.type} | ${event.author} | ${content} |`);
        });
        reportContent.push('');
    });

    const reportFileName = `report-${taskId || 'all'}-${reportDate}.md`;
    const reportPath = path.join(REPORTS_DIR, reportFileName);
    fs.writeFileSync(reportPath, reportContent.join('\n'));

    console.log(`Report generated: ${reportPath}`);
}

module.exports = { generateReport };

// If run directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const taskId = args[0]; // Optional
    generateReport(taskId);
}

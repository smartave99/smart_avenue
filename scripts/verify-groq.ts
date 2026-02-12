
import { testAPIKey } from '@/app/api-key-actions';

async function main() {
    console.log('Testing Groq Key Support...');
    // We expect a failure because the key is fake, but it should NOT be "Unknown provider"
    const result = await testAPIKey('gsk_fake_key_12345', false, 'groq');

    if (result.error === 'Unknown provider') {
        console.error('FAIL: Provider "groq" is still unknown');
        process.exit(1);
    } else {
        console.log('PASS: Provider "groq" was recognized (even if auth failed as expected)');
        console.log('Result:', result);
    }
}

// Mock fetch global for partial testing if needed, or rely on actual network failure
// Since we are running in a script, we might not have fetch polyfilled if node < 18,
// but Next.js environment usually has it.
// However, since we can't easily run this script with next environment without setup,
// we'll rely on code review or user verification mostly, but this script serves as a usage example.

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const NOUS_API_KEY = process.env.NOUS_API_KEY;
const NOUS_API_URL = process.env.NOUS_API_URL;

console.log('🔍 Testing Nous API with correct model name...\n');

async function testCorrectModel() {
    try {
        const response = await fetch(NOUS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${NOUS_API_KEY}`
            },
            body: JSON.stringify({
                model: "Hermes-3-Llama-3.1-405B",
                messages: [
                    { role: "user", content: "Say 'API is working!'" }
                ],
                max_tokens: 50
            })
        });

        console.log('Status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error:', errorText);
            return;
        }

        const data = await response.json();
        console.log('\n✅ SUCCESS! API is working!');
        console.log('Response:', data.choices[0].message.content);

    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
}

testCorrectModel();

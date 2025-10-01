// test-mailjet-diagnosis.js - Enhanced Version
require('dotenv').config();
const Mailjet = require('node-mailjet');

console.log('🔍 ENHANCED MAILJET DIAGNOSTIC TEST');
console.log('================================\n');

// Step 1: Check Environment Variables
console.log('1️⃣ Checking Environment Variables:');
const fromEmail = process.env.FROM_EMAIL;
const publicKey = process.env.Node_MailJet_APIKEY_PUBLIC;
const privateKey = process.env.Node_MailJet_APIKEY_PRIVATE;

console.log(`   FROM_EMAIL: ${fromEmail || '❌ MISSING'}`);
console.log(`   PUBLIC_KEY: ${publicKey ? '✅ Present' : '❌ MISSING'}`);
console.log(`   PRIVATE_KEY: ${privateKey ? '✅ Present' : '❌ MISSING'}`);

if (!publicKey || !privateKey) {
  console.log('\n❌ ERROR: Missing API keys in .env file!');
  console.log('   Make sure your .env file contains:');
  console.log('   Node_MailJet_APIKEY_PUBLIC=your_public_key');
  console.log('   Node_MailJet_APIKEY_PRIVATE=your_private_key');
  process.exit(1);
}

// Step 2: Check for common formatting issues
console.log('\n2️⃣ Checking Key Format:');
console.log(`   Public Key Length: ${publicKey.length} chars`);
console.log(`   Private Key Length: ${privateKey.length} chars`);

// Check for common issues
const issues = [];
if (publicKey.includes(' ')) issues.push('Public key contains spaces');
if (privateKey.includes(' ')) issues.push('Private key contains spaces');
if (publicKey.includes('"') || publicKey.includes("'")) issues.push('Public key has quotes');
if (privateKey.includes('"') || privateKey.includes("'")) issues.push('Private key has quotes');
if (publicKey.startsWith(' ') || publicKey.endsWith(' ')) issues.push('Public key has leading/trailing spaces');
if (privateKey.startsWith(' ') || privateKey.endsWith(' ')) issues.push('Private key has leading/trailing spaces');

if (issues.length > 0) {
  console.log('   ⚠️  FORMATTING ISSUES DETECTED:');
  issues.forEach(issue => console.log(`      - ${issue}`));
} else {
  console.log('   ✅ No obvious formatting issues');
}

// Show first/last few characters for verification (safely)
console.log(`   Public Key Preview: ${publicKey.substring(0, 8)}...${publicKey.substring(publicKey.length - 4)}`);
console.log(`   Private Key Preview: ${privateKey.substring(0, 8)}...${privateKey.substring(privateKey.length - 4)}`);

// Step 3: Test Mailjet Connection
console.log('\n3️⃣ Testing Mailjet Connection...');
const mailjet = Mailjet.apiConnect(
  publicKey.trim(),
  privateKey.trim()
);

// Step 4: Test API access with a simple request
console.log('4️⃣ Testing API Access (fetching sender addresses)...');

mailjet
  .get('sender')
  .request()
  .then((result) => {
    console.log('✅ API CONNECTION SUCCESSFUL!');
    console.log(`   Found ${result.body.Data.length} sender address(es)`);
    
    // Step 5: Send test email
    console.log('\n5️⃣ Sending Test Email...');
    console.log(`   From: ${fromEmail}`);
    console.log(`   To: atnestly@gmail.com`);
    
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: 'Mailjet Test'
            },
            To: [
              {
                Email: 'atnestly@gmail.com', // Replace with your actual email
                Name: 'Test Recipient'
              }
            ],
            Subject: 'Mailjet Diagnostic Test - Success!',
            TextPart: 'If you receive this email, your Mailjet setup is working correctly!',
            HTMLPart: '<h3>Success!</h3><p>Your Mailjet integration is working properly.</p>'
          }
        ]
      });
    
    return request;
  })
  .then((result) => {
    console.log('✅ SUCCESS! Email sent successfully.');
    console.log(`   Message ID: ${result.body.Messages[0].To[0].MessageID}`);
    console.log('\n🎉 All tests passed! Your Mailjet setup is working correctly.');
  })
  .catch((err) => {
    console.log('❌ FAILED!');
    console.log('\n📋 Error Details:');
    console.log(`   Status Code: ${err.statusCode}`);
    console.log(`   Error Message: ${err.message || err.ErrorMessage}`);
    
    if (err.response && err.response.body) {
      console.log(`   Response Body: ${JSON.stringify(err.response.body, null, 2)}`);
    }
    
    console.log('\n🔧 Troubleshooting Steps:');
    
    if (err.statusCode === 401) {
      console.log('   ❌ 401 UNAUTHORIZED - Invalid API Keys');
      console.log('   Steps to fix:');
      console.log('   1. Go to: https://app.mailjet.com/account/apikeys');
      console.log('   2. Check if your API keys are active (not expired/deleted)');
      console.log('   3. Generate NEW keys if needed');
      console.log('   4. Copy them EXACTLY (no spaces, no quotes)');
      console.log('   5. Update your .env file:');
      console.log('      Node_MailJet_APIKEY_PUBLIC=paste_public_key_here');
      console.log('      Node_MailJet_APIKEY_PRIVATE=paste_private_key_here');
      console.log('   6. Make sure .env has NO spaces around the = sign');
    } else if (err.statusCode === 400) {
      console.log('   ❌ 400 BAD REQUEST');
      console.log('   → Check that FROM_EMAIL is verified in Mailjet');
      console.log('   → Verify sender at: https://app.mailjet.com/account/sender');
    }
  });
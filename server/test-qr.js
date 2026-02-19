
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

const testQR = async () => {
    try {
        console.log('Generating secret...');
        const secret = speakeasy.generateSecret({
            length: 20,
            name: `Task Manager (test@example.com)`
        });
        console.log('Secret generated:', secret.base32);
        console.log('OTPAuth URL:', secret.otpauth_url);

        console.log('Generating QR Code...');
        // Test Promise support
        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        console.log('QR Code URL generated successfully.');
        console.log('Length:', qrCodeUrl.length);
        console.log('Start:', qrCodeUrl.substring(0, 50));

    } catch (error) {
        console.error('❌ Error:', error);
    }
};

testQR();

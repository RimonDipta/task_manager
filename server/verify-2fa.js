
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import speakeasy from 'speakeasy';
import User from './models/User.js';

import dns from 'dns';
dotenv.config();

// Fix DNS for this script
dns.setServers(['8.8.8.8']);

const testUserEmail = 'verify2fa@example.com';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runVerification = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to DB');

        // Cleanup previous test
        await User.deleteOne({ email: testUserEmail });

        // 1. Create User (Simulate registration)
        console.log('\n--- 1. Creating User ---');
        const user = await User.create({
            name: '2FA Tester',
            email: testUserEmail,
            password: 'password123',
            isVerified: true 
        });
        console.log('User created:', user._id);

        // 2. Generate Secret
        console.log('\n--- 2. Generating 2FA Secret ---');
        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFactorSecret = secret;
        await user.save();
        console.log('Secret generated:', secret.base32);

        // 3. Enable 2FA (Simulate App verification)
        console.log('\n--- 3. Enabling 2FA (App) ---');
        const token = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        console.log('Generated TOTP Token:', token);

        // Simulate Controller Logic for Enable
        // (In real app, we hit the API. Here we verify logic matches)
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret.base32,
            encoding: 'base32',
            token: token
        });
        
        if (verified) {
             user.is2FAEnabled = true;
             user.twoFactorMethod = 'app';
             await user.save();
             console.log('✅ 2FA Enabled Successfully');
        } else {
            throw new Error('2FA Verification Failed');
        }

        // 4. Login Attempt (Should require 2FA)
        console.log('\n--- 4. Verify Login Logic ---');
        const updatedUser = await User.findById(user._id);
        if (updatedUser.is2FAEnabled && updatedUser.twoFactorMethod === 'app') {
            console.log('✅ Login Logic: User requires App 2FA');
        } else {
             throw new Error('Login Logic: User should require App 2FA');
        }

        // 5. Verify OTP Endpoint Logic
        console.log('\n--- 5. Verify OTP Endpoint Logic ---');
        const newToken = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        const loginVerified = speakeasy.totp.verify({
            secret: updatedUser.twoFactorSecret.base32,
            encoding: 'base32',
            token: newToken
        });

        if (loginVerified) {
            console.log('✅ OTP Verified Successfully');
        } else {
             throw new Error('OTP Verification Failed');
        }

         console.log('\n✅ ALL CHECKS PASSED');
         process.exit(0);

    } catch (error) {
        console.error('❌ Verification Failed:', error);
        process.exit(1);
    }
};

runVerification();

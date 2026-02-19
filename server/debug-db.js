
import dns from 'dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const hostname = '_mongodb._tcp.taskmanagerdatabase.s6hgwdm.mongodb.net';

console.log('--- Diagnosis Start ---');
console.log(`Node Environment: ${process.env.NODE_ENV}`);
console.log(`Checking DNS resolution for: ${hostname}`);

dns.resolveSrv(hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Failed:', err);
        console.error('Code:', err.code);
        console.error('Syscall:', err.syscall);
        console.error('Hostname:', err.hostname);
    } else {
        console.log('DNS Resolution Succeeded:');
        console.log(addresses);
    }

    console.log('\nAttempting Mongoose Connection...');
    if (!process.env.MONGO_URI) {
        console.error('ERROR: MONGO_URI is not defined in .env');
        process.exit(1);
    }

    // Mask URI for log
    const maskedURI = process.env.MONGO_URI.replace(/:([^@]+)@/, ':****@');
    console.log(`Using URI: ${maskedURI}`);

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Mongoose Connected Successfully!');
            process.exit(0);
        })
        .catch(err => {
            console.error('Mongoose Connection Failed:', err);
            // Check specifically for the querySrv error again
            process.exit(1);
        });
});

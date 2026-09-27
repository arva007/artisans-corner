const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');
const dotenv = require('dotenv');

// Load environment variables (.env in server folder or root folder)
dotenv.config();
dotenv.config({ path: path.join(__dirname, '..', '.env') });

let mongoMemoryServer = null;

const sanitizeUri = (uri) => {
  if (!uri) return '';
  return uri.replace(/\/\/(.*?):(.*?)@/, '//$1:****@');
};

const connectDB = async () => {
  // Read MongoDB connection string from environment variable MONGODB_URI (with MONGO_URI fallback)
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/artisan_corner';
  const isProduction = process.env.NODE_ENV === 'production';
  const isRemoteUri =
    uri.startsWith('mongodb+srv://') ||
    (uri.startsWith('mongodb://') && !uri.includes('localhost') && !uri.includes('127.0.0.1'));

  // MongoDB Atlas and production-ready connection options
  const mongooseOptions = {
    serverSelectionTimeoutMS: isProduction || isRemoteUri ? 10000 : 3000,
    retryWrites: true,
    w: 'majority',
  };

  const attemptConnect = async () => {
    return await mongoose.connect(uri, mongooseOptions);
  };

  try {
    const conn = await attemptConnect();
    const isAtlas = isRemoteUri || uri.includes('mongodb.net');
    console.log(`✓ [Database] Connected successfully to ${isAtlas ? 'MongoDB Atlas' : 'MongoDB'}: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (primaryErr) {
    // If Windows / ISP system DNS fails to resolve SRV records for Atlas, retry with public DNS resolver
    if (primaryErr.message && primaryErr.message.includes('querySrv ECONNREFUSED')) {
      try {
        console.warn('[Database] Local system DNS failed to resolve MongoDB SRV records. Retrying with public DNS resolver...');
        dns.setServers(['8.8.8.8', '1.1.1.1']);
        const conn = await attemptConnect();
        console.log(`✓ [Database] Connected successfully to MongoDB Atlas: ${conn.connection.host} (Database: ${conn.connection.name})`);
        return conn;
      } catch (retryErr) {
        primaryErr = retryErr;
      }
    }

    const maskedUri = sanitizeUri(uri);
    console.error(`✗ [Database] MongoDB Connection Error: Failed to connect to ${maskedUri}`);
    console.error(`  Error message: ${primaryErr.message}`);

    // In production or when targeting a cloud/Atlas cluster, never fall back to in-memory database
    if (isProduction || isRemoteUri) {
      console.error('\n--- MongoDB Atlas Connection Checklist ---');
      console.error('  1. Network Access (IP Whitelist): In MongoDB Atlas -> Network Access, ensure 0.0.0.0/0 is added.');
      console.error('  2. Database Credentials: Verify the database username & password in MONGODB_URI.');
      console.error('  3. Special Characters: If your password contains symbols (@, #, :, etc.), ensure they are URL-encoded.');
      console.error('  4. URI format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority');
      console.error('-------------------------------------------\n');
      throw primaryErr;
    }

    console.log('[Database] Starting embedded in-memory MongoDB for zero-configuration development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`✓ [Database] In-memory MongoDB running at: ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`✗ [Database] Failed to initialize embedded MongoDB: ${memErr.message}`);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };

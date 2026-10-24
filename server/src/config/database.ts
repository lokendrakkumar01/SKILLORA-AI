import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://versecolor7_db_user:Lg9exoFnIzGsS2N4@ac-h0hrfjj-shard-00-00.oyviqrq.mongodb.net:27017,ac-h0hrfjj-shard-00-01.oyviqrq.mongodb.net:27017,ac-h0hrfjj-shard-00-02.oyviqrq.mongodb.net:27017/skillora?ssl=true&replicaSet=atlas-9n2zm1-shard-0&authSource=admin&compressors=zlib';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

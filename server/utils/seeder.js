const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async (exitOnComplete = true) => {
  try {
    if (exitOnComplete) {
      await connectDB();
    }
    console.log('[Seeder] Cleaning existing database records...');

    await Promise.all([
      User.deleteMany(),
      Vendor.deleteMany(),
      Product.deleteMany(),
      Order.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('[Seeder] Creating demo users...');

    // 1. Admin
    const adminUser = await User.create({
      name: 'Eleanor Vance (Admin)',
      email: 'admin@artisancorner.com',
      password: process.env.DEMO_ADMIN_PASSWORD || 'Admin123!',
      role: 'admin',
      bio: 'Platform administrator overseeing artisan quality and community standards.',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });

    // 2. Vendor 1
    const vendorUser1 = await User.create({
      name: 'Marcus Thorne',
      email: 'vendor@artisancorner.com',
      password: process.env.DEMO_VENDOR_PASSWORD || 'Vendor123!',
      role: 'vendor',
      bio: 'Third-generation woodworker and ceramic artist based in the Pacific Northwest.',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    });

    // 3. Vendor 2
    const vendorUser2 = await User.create({
      name: 'Elena Rostova',
      email: 'artisan.elena@artisancorner.com',
      password: process.env.DEMO_VENDOR_PASSWORD || 'Vendor123!',
      role: 'vendor',
      bio: 'Textile artisan weaving natural fibers and crafting small-batch leather goods.',
      profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    });

    // 4. Buyer
    const buyerUser = await User.create({
      name: 'Clara Oswald',
      email: 'buyer@artisancorner.com',
      password: process.env.DEMO_BUYER_PASSWORD || 'Buyer123!',
      role: 'buyer',
      bio: 'Avid collector of handcrafted home goods, ceramics, and sustainable textiles.',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    });

    console.log('[Seeder] Creating vendor stores...');

    const store1 = await Vendor.create({
      owner: vendorUser1._id,
      storeName: 'Terra & Timber Studio',
      description:
        'Functional stoneware ceramics and reclaimed hardwood decor made with traditional lathe and hand-carving techniques.',
      logo: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 234-8901',
      address: 'Hood River, Oregon',
      rating: 4.9,
      numberOfReviews: 8,
    });

    const store2 = await Vendor.create({
      owner: vendorUser2._id,
      storeName: 'Luna Loom & Leather',
      description:
        'Slow-crafted home textiles, botanical block prints, and vegetable-tanned leather goods designed to age beautifully with time.',
      logo: 'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=300&q=80',
      banner: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80',
      phone: '+1 (555) 789-0123',
      address: 'Asheville, North Carolina',
      rating: 4.8,
      numberOfReviews: 6,
    });

    console.log('[Seeder] Creating handcrafted products...');

    const products = await Product.create([
      {
        name: 'Hand-Thrown Speckled Ceramic Mug',
        description:
          'Wheel-thrown from iron-rich stoneware clay, finished with a food-safe satin eggshell glaze. Features an ergonomic thumb rest and holds approximately 12 fluid ounces. Dishwasher and microwave safe.',
        price: 36,
        category: 'Ceramics & Pottery',
        stock: 14,
        vendor: store1._id,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        featured: true,
        tags: ['mug', 'stoneware', 'pottery', 'coffee'],
      },
      {
        name: 'Reclaimed Walnut Charcuterie Board',
        description:
          'Cut and hand-sanded from rescued American black walnut logs. Finished with organic beeswax and mineral oil. Distinct natural wood grain makes every piece one-of-a-kind. Includes hanging brass hole.',
        price: 68,
        category: 'Woodwork & Furniture',
        stock: 8,
        vendor: store1._id,
        image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
        featured: true,
        tags: ['walnut', 'charcuterie', 'kitchen', 'woodwork'],
      },
      {
        name: 'Minimalist Stoneware Pour-Over Dripper',
        description:
          'Designed for cone coffee filters (#02 size). Interior ridges ensure optimum water flow and extraction for a bright, balanced morning brew. Glazed in earthy matte sage.',
        price: 42,
        category: 'Ceramics & Pottery',
        stock: 10,
        vendor: store1._id,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        featured: false,
        tags: ['coffee', 'pour-over', 'ceramics', 'slow-living'],
      },
      {
        name: 'Hand-Turned Oak Candle Holders (Pair)',
        description:
          'Turned on a traditional wood lathe from fallen English white oak. Sized for standard taper candles. Warm oil finish highlighting rich rings and ray flecks.',
        price: 52,
        category: 'Woodwork & Furniture',
        stock: 6,
        vendor: store1._id,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
        featured: false,
        tags: ['candleholder', 'oak', 'dining', 'tableware'],
      },
      {
        name: 'Botanical Hand-Dyed Linen Throw Blanket',
        description:
          'Woven from 100% French flax linen and naturally dyed using wild avocado pits and madder root for an earthy blush hue. Pre-washed for incredible softness that relaxes further with every wash.',
        price: 94,
        category: 'Textiles & Leather',
        stock: 9,
        vendor: store2._id,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
        featured: true,
        tags: ['linen', 'botanical-dye', 'textiles', 'throw-blanket'],
      },
      {
        name: 'Full-Grain Leather Field Journal',
        description:
          'Constructed from 4oz Horween vegetable-tanned leather. Hand-stitched with waxed linen thread. Comes filled with 160 pages of fountain-pen friendly recycled acid-free cream paper.',
        price: 48,
        category: 'Textiles & Leather',
        stock: 12,
        vendor: store2._id,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        featured: true,
        tags: ['leather', 'journal', 'notebook', 'stationery'],
      },
      {
        name: 'Hand-Hammered Brass Crescent Earrings',
        description:
          'Delicately hammered raw brass arches finished with hypoallergenic 14k gold-filled ear wires. Feather-light for all-day wear with an understated luminous glow.',
        price: 38,
        category: 'Jewelry & Accessories',
        stock: 15,
        vendor: store2._id,
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        featured: false,
        tags: ['jewelry', 'brass', 'earrings', 'handmade'],
      },
      {
        name: 'Wild Bergamot & Cedarwood Soy Candle',
        description:
          'Hand-poured in small batches using 100% domestic soy wax, cotton wick, and pure essential oils. Housed in an amber glass jar with a recyclable brass lid. 50-hour clean burn.',
        price: 28,
        category: 'Candles & Apothecary',
        stock: 20,
        vendor: store2._id,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        featured: true,
        tags: ['candle', 'aromatherapy', 'cedarwood', 'soy-wax'],
      },
      {
        name: 'Original Forest Canopy Linocut Print',
        description:
          'Limited edition linoleum block print hand-pulled on heavyweight Japanese mulberry paper. Numbered and signed by the artist. Archival ink ensures lifelong brilliance.',
        price: 55,
        category: 'Art & Prints',
        stock: 7,
        vendor: store2._id,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        featured: false,
        tags: ['linocut', 'printmaking', 'art', 'nature'],
      },
    ]);

    console.log('[Seeder] Creating sample order for verified purchase testing...');

    const sampleMug = products[0];
    const itemSubtotal = sampleMug.price * 1;
    const platformFee = Math.round(itemSubtotal * 0.05 * 100) / 100;
    const vendorPayout = Math.round((itemSubtotal - platformFee) * 100) / 100;

    const sampleOrder = await Order.create({
      buyer: buyerUser._id,
      orderItems: [
        {
          product: sampleMug._id,
          vendor: store1._id,
          name: sampleMug.name,
          image: sampleMug.image,
          price: sampleMug.price,
          quantity: 1,
        },
      ],
      shippingAddress: {
        fullName: 'Clara Oswald',
        address: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'Oregon',
        postalCode: '97201',
        country: 'United States',
        phone: '+1 (555) 987-6543',
      },
      totalAmount: itemSubtotal,
      platformFee,
      vendorPayout,
      paymentMethod: 'Stripe',
      paymentStatus: 'completed',
      stripePaymentIntentId: 'pi_seed_verified_sample_001',
      orderStatus: 'Delivered',
      deliveredAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    console.log('[Seeder] Adding verified reviews...');

    await Review.create({
      buyer: buyerUser._id,
      product: sampleMug._id,
      rating: 5,
      comment:
        'This mug is sheer perfection! The weight in the hand is just right and the thumb rest makes it my favorite morning companion. Superb craftsmanship from Marcus.',
    });

    // Recalculate rating
    await Review.calculateAverageRating(sampleMug._id);

    console.log('===============================================');
    console.log(' SEEDING COMPLETE! DEMO ACCOUNTS:');
    console.log('-----------------------------------------------');
    console.log(' Admin:   admin@artisancorner.com  / Admin123!');
    console.log(' Vendor:  vendor@artisancorner.com / Vendor123!');
    console.log(' Buyer:   buyer@artisancorner.com  / Buyer123!');
    console.log('===============================================');

    if (exitOnComplete) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('[Seeder] Seeding error:', err);
    if (exitOnComplete) {
      await disconnectDB();
      process.exit(1);
    } else {
      throw err;
    }
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('[Database] Empty database detected. Auto-populating artisan demo catalog & accounts...');
      await seedData(false);
    }
  } catch (err) {
    console.error('[Seeder] Auto-seeding check error:', err.message);
  }
};

if (require.main === module) {
  seedData(true);
}

module.exports = { seedData, autoSeedIfEmpty };

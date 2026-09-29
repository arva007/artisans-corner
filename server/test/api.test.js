process.env.NODE_ENV = 'test';
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/../.env' });
process.env.NODE_ENV = 'test';
const { connectDB, disconnectDB } = require('../config/db');
const { app } = require('../server');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

let testServer;
let port = 5055;
let baseUrl;

const request = (method, path, data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('\n--- STARTING BACKEND ARCHITECTURE & PRODUCTS TESTS ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  };

  try {
    await connectDB();

    testServer = app.listen(port);
    baseUrl = `http://localhost:${port}`;

    // Clean test records
    await User.deleteMany({ email: /@testrunner\.com$/ });
    await Vendor.deleteMany({ storeName: /Test Store/ });
    await Product.deleteMany({ name: /Test Product/ });

    // 1. Health Check & Helmet Security Headers
    const health = await request('GET', '/api/health');
    assert(
      health.status === 200 && health.body.status === 'ok' && health.headers['x-content-type-options'] === 'nosniff',
      'Health check endpoint returns status ok and Helmet security headers'
    );

    // 2. Auth: Register Buyer
    const regRes = await request('POST', '/api/auth/register', {
      name: 'Test Buyer',
      email: 'buyer@testrunner.com',
      password: 'Password123!',
      role: 'buyer',
    });
    assert(regRes.status === 201 && regRes.body.token, 'Register buyer returns JWT token');
    const buyerToken = regRes.body.token;

    // 3. Auth: Login
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'buyer@testrunner.com',
      password: 'Password123!',
    });
    assert(loginRes.status === 200 && loginRes.body.token, 'Login buyer succeeds with matching password');

    // 4. Auth: Invalid Login
    const badLogin = await request('POST', '/api/auth/login', {
      email: 'buyer@testrunner.com',
      password: 'WrongPassword!',
    });
    assert(badLogin.status === 401, 'Invalid credentials rejected with 401');

    // 4b. Auth: Test Seeded Demo Accounts (Admin, Vendor, Buyer)
    const demoAdminLogin = await request('POST', '/api/auth/login', {
      email: 'admin@artisancorner.com',
      password: 'Admin123!',
    });
    assert(demoAdminLogin.status === 200 && demoAdminLogin.body.user.role === 'admin', 'Seeded Demo Admin login succeeds');

    const demoVendorLogin = await request('POST', '/api/auth/login', {
      email: 'vendor@artisancorner.com',
      password: 'Vendor123!',
    });
    assert(demoVendorLogin.status === 200 && demoVendorLogin.body.user.role === 'vendor', 'Seeded Demo Vendor login succeeds');

    const demoBuyerLogin = await request('POST', '/api/auth/login', {
      email: 'buyer@artisancorner.com',
      password: 'Buyer123!',
    });
    assert(demoBuyerLogin.status === 200 && demoBuyerLogin.body.user.role === 'buyer', 'Seeded Demo Buyer login succeeds');

    // 4c. Auth: Test Custom Gmail User Registration and Login Flow
    await User.deleteOne({ email: 'evaluator.gmail@gmail.com' });
    const gmailReg = await request('POST', '/api/auth/register', {
      name: 'Evaluator Gmail',
      email: 'evaluator.gmail@gmail.com',
      password: 'MyGmailPassword123!',
      role: 'buyer',
    });
    assert(gmailReg.status === 201 && gmailReg.body.token, 'Normal Gmail registration succeeds with 201');

    const gmailLogin = await request('POST', '/api/auth/login', {
      email: 'evaluator.gmail@gmail.com',
      password: 'MyGmailPassword123!',
    });
    assert(gmailLogin.status === 200 && gmailLogin.body.token, 'Normal Gmail login succeeds with 200');

    const gmailBadLogin = await request('POST', '/api/auth/login', {
      email: 'evaluator.gmail@gmail.com',
      password: 'WrongPassword!',
    });
    assert(gmailBadLogin.status === 401, 'Invalid password for registered Gmail rejected with 401');
    await User.deleteOne({ email: 'evaluator.gmail@gmail.com' });

    // 4d. Auth: Test Unregistered Gmail Login Rejection
    const unregisteredLogin = await request('POST', '/api/auth/login', {
      email: 'unregistered.evaluator.test@gmail.com',
      password: 'RandomPassword123!',
    });
    assert(unregisteredLogin.status === 401, 'Unregistered Gmail login rejected with 401');

    // 5. Auth: Get Current User (/api/auth/me)
    const meRes = await request('GET', '/api/auth/me', null, buyerToken);
    assert(meRes.status === 200 && meRes.body.user.email === 'buyer@testrunner.com', 'Get current user profile succeeds');

    // 6. Role Authorization: Buyer cannot create product directly
    const unauthorizedProduct = await request(
      'POST',
      '/api/products',
      {
        name: 'Test Product Direct',
        description: 'Should fail authorization',
        price: 50,
        category: 'Woodwork & Furniture',
        stock: 5,
        image: 'https://example.com/item.jpg',
      },
      buyerToken
    );
    assert(unauthorizedProduct.status === 403, 'Buyer is prevented from creating product directly (403)');

    // 7. Vendor Onboarding: Become a Seller
    const becomeSellerRes = await request(
      'POST',
      '/api/vendors/become-seller',
      {
        storeName: 'Test Store & Crafts',
        description: 'Artisanal handmade wares for testing',
      },
      buyerToken
    );
    assert(
      becomeSellerRes.status === 201 && becomeSellerRes.body.vendor.storeName === 'Test Store & Crafts',
      'Become a Seller creates Vendor profile and promotes role to vendor'
    );

    // Refresh user profile to check new role
    const updatedUserRes = await request('GET', '/api/auth/me', null, buyerToken);
    assert(updatedUserRes.body.user.role === 'vendor', 'User role updated to vendor');

    // 8. Vendor: Create Product
    const newProductRes = await request(
      'POST',
      '/api/products',
      {
        name: 'Test Product Handcrafted Bowl',
        description: 'A beautifully turned wooden bowl made from sustainable cedar.',
        price: 45,
        category: 'Woodwork & Furniture',
        stock: 10,
        image: 'https://example.com/bowl.jpg',
        tags: ['wooden', 'bowl', 'test'],
      },
      buyerToken
    );
    assert(
      newProductRes.status === 201 && newProductRes.body.product.name === 'Test Product Handcrafted Bowl',
      'Vendor successfully creates a product linked to their store'
    );
    const createdProductId = newProductRes.body.product._id;

    // 9. Products: Public Listing & Filtering
    const listRes = await request('GET', '/api/products?category=Woodwork%20%26%20Furniture');
    assert(
      listRes.status === 200 && listRes.body.products.length > 0,
      'Product listing with category filter returns matching products'
    );

    // 10. Products: Get Product By ID
    const singleProduct = await request('GET', `/api/products/${createdProductId}`);
    assert(
      singleProduct.status === 200 && singleProduct.body.product.vendor.storeName === 'Test Store & Crafts',
      'Get product by ID populates vendor store name'
    );

    // 11. Vendor: View Analytics Endpoint
    const analyticsRes = await request('GET', '/api/vendors/analytics', null, buyerToken);
    assert(
      analyticsRes.status === 200 && analyticsRes.body.analytics.commissionRate === 5,
      'Vendor analytics returns metrics with 5% commission rate'
    );

    // 12. Stripe Webhook: Process payment_intent.succeeded with raw body parsing
    const webhookRes = await request('POST', '/api/payments/webhook', {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_test_mock_123',
        },
      },
    });
    assert(
      webhookRes.status === 200 && webhookRes.body.received === true,
      'Stripe webhook endpoint handles payment event with raw parsing and returns received: true'
    );

    console.log(`\nResults: ${passed} passed, ${failed} failed`);

    // Clean up
    await User.deleteMany({ email: /@testrunner\.com$/ });
    await Vendor.deleteMany({ storeName: /Test Store/ });
    await Product.deleteMany({ name: /Test Product/ });
    testServer.close();
    await disconnectDB();

    if (failed > 0) {
      process.exit(1);
    } else {
      console.log('--- ALL BACKEND ARCHITECTURE & PRODUCT TESTS PASSED ---\n');
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    if (testServer) testServer.close();
    await disconnectDB();
    process.exit(1);
  }
};

runTests();

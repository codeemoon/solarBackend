require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Ensure models are registered
require('./models/Company');
require('./models/Brand');
require('./models/Unit');
require('./models/Supplier');
require('./models/Customer');
require('./models/Bank');
require('./models/Gst');
require('./models/Category');
require('./models/Item');
require('./models/Role');
require('./models/User');
require('./models/Purchase');
require('./models/PurchaseDetail');
require('./models/FuturePurchase');
require('./models/FuturePurchaseDetail');
require('./models/Sale');
require('./models/SaleDetail');
require('./models/FutureSale');
require('./models/FutureSaleDetail');
require('./models/Payment');
require('./models/Receipt');

const companyRoutes = require('./routes/companyRoutes');
const brandRoutes = require('./routes/brandRoutes');
const unitRoutes = require('./routes/unitRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const bankRoutes = require('./routes/bankRoutes');
const gstRoutes = require('./routes/gstRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const itemRoutes = require('./routes/itemRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const futurePurchaseRoutes = require('./routes/futurePurchaseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const futureSaleRoutes = require('./routes/futureSaleRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const receiptRoutes = require('./routes/receiptRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');


const app = express();


app.use(cors());
app.use(express.json());
 //These are all the routes for the API endpoints
app.use('/v1/companies', companyRoutes);
app.use('/v1/brands', brandRoutes);
app.use('/v1/units', unitRoutes);
app.use('/v1/suppliers', supplierRoutes);
app.use('/v1/banks', bankRoutes);
app.use('/v1/gst', gstRoutes);
app.use('/v1/categories', categoryRoutes);
app.use('/v1/items', itemRoutes);
app.use('/v1/roles', roleRoutes);
app.use('/v1/users', userRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/purchases', purchaseRoutes);
app.use('/v1/future-purchases', futurePurchaseRoutes);
app.use('/v1/sales', saleRoutes);
app.use('/v1/future-sales', futureSaleRoutes);
app.use('/v1/payments', paymentRoutes);
app.use('/v1/receipts', receiptRoutes);
app.use('/v1/dashboard', dashboardRoutes);
app.use('/v1/reports', reportRoutes);

module.exports = app;
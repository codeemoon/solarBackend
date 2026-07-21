const Item = require('../models/Item');

const createItem = async (req, res) => {
  try {
    const { name, sku, brandId, categoryId, unitId, hsnCode, gstRate, sellingPrice, purchasePrice, description, status } = req.body;

    const item = new Item({
      name,
      sku,
      brandId,
      categoryId,
      unitId,
      hsnCode,
      gstRate,
      sellingPrice,
      purchasePrice,
      description,
      status
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Item with this SKU already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = search ? {
      name: { $regex: search, $options: 'i' }
    } : {};

    const items = await Item.find(filter)
      .populate('brandId categoryId unitId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Item.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: items,
      total: totalCount,
      page: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('brandId categoryId unitId');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const { name, sku, brandId, categoryId, unitId, hsnCode, gstRate, sellingPrice, purchasePrice, description, status } = req.body;
    
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, sku, brandId, categoryId, unitId, hsnCode, gstRate, sellingPrice, purchasePrice, description, status },
      { new: true, runValidators: true }
    ).populate('brandId categoryId unitId');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Item with this SKU already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    await item.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem };
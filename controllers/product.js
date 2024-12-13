import Product from '../models/product.js';
import fs from 'fs';
import slugify from 'slugify';

export const create = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    /*     switch (true) {
      case !name.trim():
        res.status(500).json({ error: 'Name is required' });
        break;
      case !description.trim():
        res.status(500).json({ error: 'Description is required' });
        break;
      case !price.trim():
        res.status(500).json({ error: 'Price is required' });
        break;
      case !category.trim():
        res.status(500).json({ error: 'Category is required' });
        break;
      case !quantity.trim():
        res.status(500).json({ error: 'Quantity is required' });
        break;
      case !shipping.trim():
        res.status(500).json({ error: 'Shipping is required' });
        break;
      case photo && photo.size > 1000000:
        res
          .status(500)
          .json({ error: 'Image should be less than 1mb in size' });
        break;
      default:
        break;
    } */

    if (!name.trim()) {
      return res.status(500).json({ error: 'Name is required' });
    }

    // create product
    const product = new Product({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

export const list = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category')
      .select('-photo')
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

export const read = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select('-photo')
      .populate('category');

    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const photo = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      'photo'
    );
    if (product.photo.data) {
      res.set('Content-Type', product.photo.contentType);
      return res.send(product.photo.data);
    }
  } catch (err) {
    console.log(err);
  }
};

export const remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(
      req.params.productId
    ).select('-photo');
    res.json(product);
  } catch (err) {
    console.log(err);
  }
};

export const update = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    // validation
    /*    switch (true) {
      case !name.trim():
        res.status(500).json({ error: 'Name is required' });
        break;
      case !description.trim():
        res.status(500).json({ error: 'Description is required' });
        break;
      case !price.trim():
        res.status(500).json({ error: 'Price is required' });
        break;
      case !category.trim():
        res.status(500).json({ error: 'Category is required' });
        break;
      case !quantity.trim():
        res.status(500).json({ error: 'Quantity is required' });
        break;
      case !shipping.trim():
        res.status(500).json({ error: 'Shipping is required' });
        break;
      case photo && photo.size > 1000000:
        res
          .status(500)
          .json({ error: 'Image should be less than 1mb in size' });
        break;
      default:
        break;
    } */

    // update product
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      {
        ...req.fields,
        slug: slugify(name),
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.json(product);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

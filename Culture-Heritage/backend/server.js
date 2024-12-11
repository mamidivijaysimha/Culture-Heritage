const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const User = require('./models/User'); 
const Product = require('./models/Product'); 
const Cart = require('./models/Cart');
const State = require('./models/state'); 

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
};

app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key', // Use a strong secret key
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      httpOnly: true,
  },
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect')
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('MongoDB connection error:', error));


 

    app.post('/api/register', upload.single('image'), async (req, res) => {
        const { username, password, uniqueId } = req.body;
    
        // Get only the filename from the uploaded image
        const image = req.file ? req.file.filename : null;
    
        if (!username || !password || !uniqueId || !image) {
            return res.status(400).json({ message: 'All fields are required' });
        }
    
        try {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
    
            const newUser = new User({ username, password, uniqueId, image });
            await newUser.save();
    
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    
    

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password }); // Using plain text for demonstration
        if (user) {
            req.session.uniqueId = user.uniqueId; // Store uniqueId in session
            res.status(200).json({ message: 'Login successful', uniqueId: user.uniqueId });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Product upload route
app.post('/api/products', upload.single('image'), async (req, res) => {
    const { name, type, price, quantity, phone, address, uniqueId } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!name || !type || !price  || !quantity || !phone || !address || !image || !uniqueId) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newProduct = new Product({ name, type, price, quantity, phone, address, image, uniqueId });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ error: 'Failed to upload product' });
    }
});

// Get products by user ID
app.get('/api/products/user/:userId', (req, res) => {
    const userId = req.params.userId;
    Product.find({ uniqueId: userId })
      .then(products => {
        if (!products || products.length === 0) {
          return res.status(404).json({ message: 'No products found for this user' });
        }
        res.status(200).json(products);
      })
      .catch(err => res.status(500).json({ error: 'Failed to fetch products' }));
});

// Get all products
app.get('/api/product', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Error fetching products', details: error.message });
    }
});

// Update product by ID
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id;
    const { name, type, price, quantity, phone, address } = req.body;
    const image = req.file ? req.file.filename : undefined; 

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { name, type, price, quantity, phone, address, image },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
});

// Get products by type
app.get('/api/products/type/:type', async (req, res) => {
    const { type } = req.params;

    try {
        const products = await Product.find({ type });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by type:', error.message);
        res.status(500).json({ message: 'Error fetching products by type', details: error.message });
    }
});



// Add item to cart
app.post('/api/cart', async (req, res) => {
    const { uniqueId, name, type, price, quantity, phone, address, image } = req.body;

    try {
        // Check for existing item in the cart
        const existingItem = await Cart.findOne({
            uniqueId: uniqueId,
            name: name,
            type: type,
        });

        if (existingItem) {
            // If the item exists, respond with a URL to redirect to the cart page
            return res.status(200).json({ 
                message: 'Item already in cart.', 
                redirectTo: `/cart/${uniqueId}` // Assuming this is the route for the cart page
            });
        }

        // If not a duplicate, create a new cart item
        const newCartItem = new Cart({
            uniqueId,
            name,
            type,
            price,
            quantity,
            phone,
            address,
            image,
        });

        const savedItem = await newCartItem.save();
        return res.status(201).json(savedItem); // Return the newly created cart item
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});





// Get cart items by user ID
app.get('/api/cart/:userId', async (req, res) => {
    try {
        const cartItems = await Cart.find({ uniqueId: req.params.userId });
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Failed to fetch cart items' });
    }
});


// Update cart item quantity
app.put('/api/cart/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Expecting quantity to update

    try {
        const updatedItem = await Cart.findByIdAndUpdate(
            id,
            { quantity },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Error updating cart item' });
    }
});

// DELETE /api/cart/:userUniqueId/:itemId
app.delete('/api/cart/:userUniqueId/:itemId', async (req, res) => {
    try {
        const { userUniqueId, itemId } = req.params;
        const deletedItem = await Cart.findOneAndDelete({ _id: itemId, uniqueId: userUniqueId });
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error.message);
        res.status(500).json({ message: 'Server error removing item from cart' });
    }
});


app.get('/api/products/:productId', async (req, res) => {
    const { productId } = req.params;
  
    try {
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      console.error('Error fetching the product:', error);
  
      // Check if the error is a casting error (invalid product ID)
      if (error.kind === 'ObjectId') {
        return res.status(400).json({ success: false, message: 'Invalid product ID' });
      }
  
      res.status(500).json({ success: false, message: 'Error fetching the product' });
    }
  });
  
// Get specific product from cart by productId
app.get('/api/product/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const cartProduct = await Cart.findById(productId); // Assuming Cart has the product stored with _id
        if (cartProduct) {
            res.status(200).json({ success: true, data: cartProduct }); // Consistent response structure
        } else {
            res.status(404).json({ success: false, message: 'Product not found in cart' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching cart product', error });
    }
});

// Route to get products of the same type and name (excluding the selected one)
app.get('/api/products/type/:type/:name', async (req, res) => {
    const { type, name } = req.params;

    try {
        const sameTypeProducts = await Product.find({
            type: type,
            name: name,
        });

        res.status(200).json({ success: true, data: sameTypeProducts });
    } catch (error) {
        console.error('Error fetching products of the same type:', error);
        res.status(500).json({ success: false, message: 'Error fetching similar products' });
    }
});
  
app.get('/api/user/:uniqueId', async (req, res) => {
    const { uniqueId } = req.params;
    console.log('Fetching user with uniqueId:', uniqueId); // Debug log

    try {
        const user = await User.findOne({ uniqueId }, 'username uniqueId image');
        if (!user) {
            console.log('User not found'); // Debug log
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('User data fetched:', user); // Debug log
        res.json(user);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





//state info code


app.post('/upload-state', upload.array('images'), async (req, res) => {
    const { stateName, introduction, history, artsAndCrafts, food, festivals, touristPlaces } = req.body;
    const files = req.files.map((file) => `/images/${file.filename}`); // Adjusted path

    try {
        const state = new State({
            stateName,
            introduction,
            history: JSON.parse(history),
            artsAndCrafts: JSON.parse(artsAndCrafts),
            food: JSON.parse(food),
            festivals: JSON.parse(festivals),
            touristPlaces: JSON.parse(touristPlaces),
            images: files, // Correct path saved in the database
        });

        await state.save();
        res.status(201).json({ message: 'State details uploaded successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// API: Get Details of a Specific State
app.get('/state/:stateName', async (req, res) => {
    const { stateName } = req.params;

    try {
        const state = await State.findOne({ stateName: { $regex: `^${stateName}$`, $options: 'i' } });

        if (!state) {
            return res.status(404).json({ message: `State ${stateName} not found.` });
        }

        res.status(200).json(state);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




app.get('/state/:stateName/images', async (req, res) => {
    const { stateName } = req.params;

    try {
        // Find the state in the database (case-insensitive)
        const state = await State.findOne({
            stateName: { $regex: `^${stateName}$`, $options: 'i' },
        });

        if (!state) {
            return res.status(404).json({ message: `State ${stateName} not found.` });
        }

        // Log all images for debugging purposes
        console.log('Images in state:', state.images);

        // Normalize image names
        const normalizedImages = state.images.map((image) =>
            path.basename(image).trim().toLowerCase()
        );
        console.log('Normalized Images:', normalizedImages);

        // Filter images that start with "festival"
        const festivalImages = normalizedImages.filter((image) => image.includes('festival'));
        console.log('Filtered festival images:', festivalImages);

        // Return filtered images and festivals
        res.status(200).json({
            images: festivalImages.map((image) => `/images/${image}`),
            festivals: state.festivals,
        });
    } catch (error) {
        console.error('Error fetching state data:', error);
        res.status(500).json({ message: 'An error occurred while fetching state data.' });
    }
});


app.get('/state/:stateName/food', async (req, res) => {
    const { stateName } = req.params;

    try {
        // Find the state in the database
        const state = await State.findOne({
            stateName: { $regex: `^${stateName}$`, $options: 'i' },
        });

        if (!state) {
            return res.status(404).json({ message: `State "${stateName}" not found.` });
        }

        console.log('Found State:', state);

        // Normalize image names
        const normalizedImages = state.images.map((image) =>
            path.basename(image).trim().toLowerCase()
        );

        // Filter images containing "food"
        const foodImages = normalizedImages.filter((image) => image.includes('food'));
        console.log('Filtered Food Images:', foodImages);

        // Return data
        res.status(200).json({
            images: foodImages.map((image) => `/images/${image}`),
            foods: state.food || [], // Fallback if `foods` field is not set
        });
    } catch (error) {
        console.error('Error fetching state data:', error);
        res.status(500).json({ message: 'An error occurred while fetching state data.' });
    }
});



app.get('/state/:stateName/arts-and-crafts', async (req, res) => {
    const { stateName } = req.params;

    try {
        // Find the state in the database
        const state = await State.findOne({
            stateName: { $regex: `^${stateName}$`, $options: 'i' },
        });

        if (!state) {
            return res.status(404).json({ message: `State "${stateName}" not found.` });
        }

        console.log('Found State:', state);

        // Normalize image names
        const normalizedImages = state.images.map((image) =>
            path.basename(image).trim().toLowerCase()
        );

        // Filter images whose names start with "art"
        const artImages = normalizedImages.filter((image) => image.includes('art'));
        console.log('Filtered Art Images:', artImages);

        // Return data
        res.status(200).json({
            images: artImages.map((image) => `/images/${image}`),
            artsAndCrafts: state.artsAndCrafts || [], // Fallback if `artsAndCrafts` field is not set
        });
    } catch (error) {
        console.error('Error fetching state data:', error);
        res.status(500).json({ message: 'An error occurred while fetching state data.' });
    }
});







app.get('/state/:stateName/history', async (req, res) => {
    const { stateName } = req.params;

    try {
        // Find the state in the database
        const state = await State.findOne({
            stateName: { $regex: `^${stateName}$`, $options: 'i' },
        });

        if (!state) {
            return res.status(404).json({ message: `State "${stateName}" not found.` });
        }

        console.log('Found State:', state);

        // Normalize image names
        const normalizedImages = state.images.map((image) =>
            path.basename(image).trim().toLowerCase()
        );

        // Filter images whose names start with "history"
        const historyImages = normalizedImages.filter((image) => image.includes('history'));
        console.log('Filtered History Images:', historyImages);

        // Return data
        res.status(200).json({
            images: historyImages.map((image) => `/images/${image}`),
            history: state.history || [], // Fallback if `history` field is not set
        });
    } catch (error) {
        console.error('Error fetching state data:', error);
        res.status(500).json({ message: 'An error occurred while fetching state data.' });
    }
});


app.get('/state/:stateName/tourist-places', async (req, res) => {
    const { stateName } = req.params;

    try {
        // Find the state in the database
        const state = await State.findOne({
            stateName: { $regex: `^${stateName}$`, $options: 'i' },
        });

        if (!state) {
            return res.status(404).json({ message: `State "${stateName}" not found.` });
        }

        // Normalize image names
        const normalizedImages = state.images.map((image) =>
            path.basename(image).trim().toLowerCase()
        );

        // Filter images containing "tourist"
        const touristImages = normalizedImages.filter((image) => image.includes('tourist'));

        // Return data
        res.status(200).json({
            images: touristImages.map((image) => `/images/${image}`),
            places: state.touristPlaces || [], // Fallback if `touristPlaces` field is not set
        });
    } catch (error) {
        console.error('Error fetching tourist data:', error);
        res.status(500).json({ message: 'An error occurred while fetching tourist data.' });
    }
});


//url code
app.get('/api/user-details/:userId', async (req, res) => {
    const { userId } = req.params; // Get userId from URL params

    try {
        const user = await User.findOne({ uniqueId: userId }); // Use findOne with uniqueId

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user); // Return the user data
    } catch (err) {
        console.error('Error fetching user details:', err.message);  // Log the error message
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
})




// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const Product = require('../../models/productSchema')
const User = require("../../models/userSchema");
const Wishlist = require('../../models/wishlistSchema');
const Brand = require('../../models/brandSchema');
const { getBestOffer } = require('../../utils/offerUtils');

const productDetails = async (req, res) => {
    try {
        const userId = req.session.user;
        const userData = await User.findById(userId);
        const productid = req.query.id;
        const product = await Product.findById(productid).populate('category');

        // Get user's wishlist
        const wishlist = userId ? await Wishlist.findOne({ userId }) : null;
        const isInWishlist = wishlist ? wishlist.products.some(item => item.productId.toString() === productid) : false;

        const findCategory = product.category;
        const cat = findCategory.name;
        const {bestOffer,discountedPrice} = await getBestOffer(product);
        product.salePrice = discountedPrice

        // Get related products
        const relatedProducts = await Product.find({
            category: findCategory._id,  
            _id: { $ne: productid }, 
        })

        // Check which related products are in wishlist
        const relatedProductsWithWishlist = relatedProducts.map(product => {
            return {
                ...product.toObject(),
                isInWishlist: wishlist?.products.some(item => item.productId.toString() === product._id.toString())
            };
        });
        //   const brand= await Brand.findOne({brandName:product.brand});
         
        return res.render('product-details', {
            user: userData,
            product: {
                ...product.toObject(),
                isInWishlist: isInWishlist
            },
            quantity: product.quantity,
            category: cat,
            relatedProducts: relatedProductsWithWishlist,
            offer:bestOffer,
            // brand
        });

    } catch (error) {
        console.error(error);
        res.redirect('/pageNotFound')   
    }
}

module.exports = {
    productDetails,
}
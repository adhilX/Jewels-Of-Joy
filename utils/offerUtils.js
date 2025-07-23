function getBestOffer(product) {
    console.log('first',product)
    const productOffer = product.productOffer || 0;
    const categoryOffer = product.category?.categoryOffer || 0;
    const bestOffer = Math.max(productOffer, categoryOffer);

    const discountedPrice = product.salePrice - (product.salePrice * bestOffer / 100);

    return {
        bestOffer,
        discountedPrice
    };
}

module.exports = {
    getBestOffer
};

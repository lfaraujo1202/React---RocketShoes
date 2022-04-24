import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';
const _ = require('lodash')

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const [stock, setStock] = useState<ProductFormatted[]>([]);

  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    const newSumAmount = {...sumAmount}
    newSumAmount[product.id] = product.amount;
    
    return newSumAmount
  }, {} as CartItemsAmount)


  async function loadProducts() {
    const results = await api.get<Product[]>('products')
    const data = results.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price)
    }))
    setProducts(data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  const finalProds = _.merge(products, stock)

  console.log(finalProds)

  return (
    <ProductList>
    {products.map(Product => (
      <li key={Product.id}>
        <img src={Product.image} alt={Product.title} />
        <strong>{Product.title}</strong>
        <span>{Product.priceFormatted}</span>
        <button
          type="button"
          data-testid="add-product-button"
        onClick={() => handleAddProduct(Product.id)}
        >
          <div data-testid="cart-product-quantity">
            <MdAddShoppingCart size={16} color="#FFF" />
            {cartItemsAmount[Product.id] || 0}
          </div>

          <span>ADICIONAR AO CARRINHO</span>
        </button>
      </li>
    ))}
  </ProductList>
  );
};

export default Home;

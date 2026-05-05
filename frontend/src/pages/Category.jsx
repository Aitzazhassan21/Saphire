import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItem from '../components/ProductItem';
import Title from '../components/Title';

const Category = () => {
  const { category } = useParams();
  const { products } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [category, products]);

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw] pt-10">
      <div className="text-2xl text-center border-t py-8">
        <Title text1={categoryTitle} text2="COLLECTION" />
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 py-10">
          {filteredProducts.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-slate-500 text-lg">No products found in the {categoryTitle} category</p>
        </div>
      )}
    </div>
  );
};

export default Category;

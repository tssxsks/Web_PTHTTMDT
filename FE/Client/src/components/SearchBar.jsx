import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { searchProducts } = useShop();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const data = await searchProducts(value);
      setResults(data);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
        <Search className="w-5 h-5 text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Tìm kiếm giày..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query && setIsOpen(true)}
          className="flex-1 px-3 py-2 bg-transparent outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }}>
            <X className="w-5 h-5 text-gray-400 mr-3" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-10">
          {results.map(product => (
            <a key={product._id} href={`/product/${product._id}`} className="flex items-center gap-3 p-3 hover:bg-gray-100 border-b last:border-b-0">
              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-lg">
                {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded" /> : '👟'}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                <p className="text-primary font-bold">{(product.price / 1000).toFixed(0)}K</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

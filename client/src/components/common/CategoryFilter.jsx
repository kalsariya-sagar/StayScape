import React from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Umbrella,
  Building,
  TreePine,
  Waves,
  Sparkles,
  Castle,
  Home,
  Flame,
  Tent,
  Compass,
} from 'lucide-react';

const CATEGORIES = [
  { label: 'All', icon: Compass },
  { label: 'Beachfront', icon: Umbrella },
  { label: 'Cabins', icon: TreePine },
  { label: 'Amazing Pools', icon: Waves },
  { label: 'Iconic Cities', icon: Building },
  { label: 'Castles', icon: Castle },
  { label: 'Domes', icon: Tent },
  { label: 'Luxe', icon: Sparkles },
  { label: 'Trending', icon: Flame },
  { label: 'Tiny Homes', icon: Home },
];

const CategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';

  const handleCategorySelect = (categoryName) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', categoryName);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="bg-white border-b border-gray-200 py-4 mb-6 sticky top-20 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 overflow-x-auto no-scrollbar scroll-smooth py-1">
          {CATEGORIES.map(({ label, icon: Icon }) => {
            const isActive =
              currentCategory.toLowerCase() === label.toLowerCase() ||
              (label === 'All' && !searchParams.has('category'));

            return (
              <button
                key={label}
                onClick={() => handleCategorySelect(label)}
                className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all flex-shrink-0 group ${
                  isActive
                    ? 'border-black text-black opacity-100 font-semibold'
                    : 'border-transparent text-gray-500 opacity-70 hover:opacity-100 hover:border-gray-300'
                }`}
              >
                <Icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-black' : 'text-gray-500'
                  }`}
                />
                <span className="text-xs whitespace-nowrap">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
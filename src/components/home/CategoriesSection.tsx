import { Users, Radio } from 'lucide-react';
import type { Category } from '../../types';
import { formatViewers } from '../../data/mockData';

interface CategoriesSectionProps {
  categories: Category[];
}

export default function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Browse Categories</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{categories.length} categories live right now</p>
        </div>
        <button className="text-sm text-accent hover:text-accent-dim font-medium transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-3">
        {categories.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="category-card-hover cursor-pointer group">
      <div className="relative rounded-xl overflow-hidden aspect-[3/4] bg-surface-elevated">
        <img
          src={category.thumbnail}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: category.color }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-white text-xs font-bold leading-tight">{category.name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Users size={9} className="text-zinc-400" />
            <span className="text-zinc-400 text-xs">{formatViewers(category.viewers)}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <Radio size={9} className="text-zinc-500" />
            <span className="text-zinc-500 text-xs">{category.streams.toLocaleString()} live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

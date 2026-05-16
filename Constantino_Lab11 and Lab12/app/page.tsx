'use client';
import { useState, useEffect } from 'react';

// Color for each type
const typeColors: { [key: string]: string } = {
  grass: '#78C850',
  poison: '#A040A0',
  fire: '#F08030',
  water: '#6890F0',
  flying: '#A890F0',
  bug: '#A8B820',
  normal: '#A8A878',
  electric: '#F8D030',
  ground: '#E0C068',
  fairy: '#EE99AC',
  fighting: '#C03028',
  psychic: '#F85888',
  rock: '#B8A038',
  ghost: '#705898',
  ice: '#98D8D8',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0'
};

export default function Pokedex() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        // Step 1: Get list of first 15 Pokémon
        const resList = await fetch('https://pokeapi.co/api/v2/pokemon?limit=15');
        const listData = await resList.json();

        // Step 2: Get full details for each Pokémon
        const detailedData = await Promise.all(
          listData.results.map(async (item: any, index: number) => {
            const resDetail = await fetch(item.url);
            const detail = await resDetail.json();
            return {
              id: detail.id.toString().padStart(4, '0'), // 0001, 0002...
              name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
              image: detail.sprites.front_default,
              height: (detail.height / 10).toFixed(1), // convert to meters
              weight: (detail.weight / 10).toFixed(1), // convert to kg
              types: detail.types.map((t: any) => t.type.name)
            };
          })
        );

        setPokemons(detailedData);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setLoading(false);
      }
    };

    fetchAllPokemon();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-white text-xl">Loading Pokédex...</div>;

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-500 text-pink p-8">
    <h1 className="text-center text-4xl font-bold mb-10">Pokedex API Next.js Laboratory</h1>

    <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
      {pokemons.map((pkm) => (
        <div key={pkm.id} className="bg-white text-black rounded-xl p-4 text-center shadow-lg">
          
          <p className="text-sm text-gray-600 font-medium">{pkm.id}</p>
          
          <img src={pkm.image} alt={pkm.name} className="w-24 h-24 mx-auto my-2" />
          
          <h3 className="font-bold text-lg mb-2">{pkm.name}</h3>
          
          <div className="flex justify-center gap-2 mb-3">
            {pkm.types.map((type: string) => (
              <span 
                key={type} 
                style={{ backgroundColor: typeColors[type] }} 
                className="text-white text-xs font-semibold px-3 py-1 rounded-full uppercase"
              >
                {type}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-gray-700">
            ↥ {pkm.height} m &nbsp; ⚖ {pkm.weight} kg
          </p>
        </div>
      ))}
    </div>
  </div>
);
}
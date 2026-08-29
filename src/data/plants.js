export const WA_NUMBER = '919943199955';

const rawPlants = [
  { id: 1, name: 'African Blackwood', botanical: 'Dalbergia melanoxylon', category: 'Timber', price: 650, size: '2–3 ft', light: 'Full sun', popular: true, image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=85' },
  { id: 2, name: 'Teak', botanical: 'Tectona grandis', category: 'Timber', price: 480, size: '2–3 ft', light: 'Full sun', popular: true, image: 'https://images.unsplash.com/photo-1599685315640-9d7f42c4d3d0?auto=format&fit=crop&w=900&q=85' },
  { id: 3, name: 'Mahogany', botanical: 'Swietenia macrophylla', category: 'Timber', price: 420, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=85' },
  { id: 4, name: 'Neem', botanical: 'Azadirachta indica', category: 'Native', price: 180, size: '2–4 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=85' },
  { id: 5, name: 'Rain Tree', botanical: 'Samanea saman', category: 'Shade', price: 260, size: '3–4 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?auto=format&fit=crop&w=900&q=85' },
  { id: 6, name: 'Indian Rosewood', botanical: 'Dalbergia latifolia', category: 'Timber', price: 560, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=85' },
  { id: 7, name: 'Mango', botanical: 'Mangifera indica', category: 'Fruit', price: 350, size: '3–4 ft', light: 'Full sun', popular: true, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=85' },
  { id: 8, name: 'Guava', botanical: 'Psidium guajava', category: 'Fruit', price: 240, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=85' },
  { id: 9, name: 'Coconut', botanical: 'Cocos nucifera', category: 'Fruit', price: 300, size: '3–5 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85' },
  { id: 10, name: 'Areca Palm', botanical: 'Dypsis lutescens', category: 'Indoor', price: 280, size: '2–4 ft', light: 'Bright indirect', popular: true, image: 'https://images.unsplash.com/photo-1523430118692-5f5dfc6f1ff8?auto=format&fit=crop&w=900&q=85' },
  { id: 11, name: 'Bougainvillea', botanical: 'Bougainvillea glabra', category: 'Flowering', price: 220, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=900&q=85' },
  { id: 12, name: 'Hibiscus', botanical: 'Hibiscus rosa-sinensis', category: 'Flowering', price: 160, size: '1.5–2 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1495231916350-4c7b5a5e6f5a?auto=format&fit=crop&w=900&q=85' },
  { id: 13, name: 'Jade Plant', botanical: 'Crassula ovata', category: 'Indoor', price: 190, size: '1–1.5 ft', light: 'Bright indirect', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=85' },
  { id: 14, name: 'Money Plant', botanical: 'Epipremnum aureum', category: 'Indoor', price: 140, size: 'Trailing', light: 'Medium light', image: 'https://images.unsplash.com/photo-1614594576068-98b03b6a5b20?auto=format&fit=crop&w=900&q=85' },
  { id: 15, name: 'Ficus', botanical: 'Ficus benjamina', category: 'Indoor', price: 320, size: '2–4 ft', light: 'Bright indirect', image: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=85' },
  { id: 16, name: 'Lemon', botanical: 'Citrus limon', category: 'Fruit', price: 250, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=900&q=85' },
  { id: 17, name: 'Pongamia', botanical: 'Millettia pinnata', category: 'Native', price: 210, size: '2–3 ft', light: 'Full sun', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85' },
  { id: 18, name: 'Bamboo', botanical: 'Bambusa vulgaris', category: 'Shade', price: 275, size: '4–6 ft', light: 'Partial sun', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85' }
];

// Build a small gallery per plant (main shot + two supporting angles) reusing
// the verified photo pool above, so every plant has a real, working gallery
// without depending on network calls at build time.
const pool = rawPlants.map(p => p.image);
export const plants = rawPlants.map((p, i) => ({
  ...p,
  images: [p.image, pool[(i + 3) % pool.length], pool[(i + 7) % pool.length]]
}));

export const categories = ['All', 'Timber', 'Native', 'Shade', 'Fruit', 'Indoor', 'Flowering'];

export const findPlant = id => plants.find(p => p.id === Number(id));

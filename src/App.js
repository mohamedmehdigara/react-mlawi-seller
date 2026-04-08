import React, { useState, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme ---
const theme = {
  colors: {
    primary: '#e67e22',
    secondary: '#d35400',
    accent: '#f1c40f',
    bg: '#fcf8f2',
    card: '#ffffff',
    text: '#2c3e50',
    muted: '#95a5a6'
  }
};

const GlobalStyle = createGlobalStyle`
  body { margin: 0; font-family: 'Poppins', sans-serif; background: ${props => props.theme.colors.bg}; color: ${props => props.theme.colors.text}; }
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: #e67e22; border-radius: 10px; }
`;

// --- Store ---
const useStore = create(persist((set) => ({
  cart: [],
  currentView: { page: 'home', params: null },
  setView: (page, params = null) => set({ currentView: { page, params } }),
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(i => i.id === item.id);
    if (existing) return { cart: state.cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) };
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),
  removeFromCart: (id) => set((state) => ({ cart: state.cart.filter(i => i.id !== id) })),
  clearCart: () => set({ cart: [] }),
}), { name: 'mlawi-pro-storage' }));

// --- Styled Components ---
const Container = styled.div` max-width: 1100px; margin: 0 auto; padding: 20px; `;

const Nav = styled.nav`
  display: flex; justify-content: space-between; align-items: center; 
  padding: 20px 0; cursor: pointer;
`;

const SearchInput = styled.input`
  width: 100%; padding: 12px 20px; border-radius: 12px; border: 1px solid #ddd;
  margin-bottom: 30px; font-size: 1rem; outline: none;
  &:focus { border-color: ${props => props.theme.colors.primary}; }
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;
`;

const Card = styled(motion.div)`
  background: white; border-radius: 18px; padding: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);
  display: flex; flex-direction: column; cursor: pointer;
`;

const Badge = styled.span`
  background: ${props => props.type === 'drink' ? '#3498db' : '#e67e22'};
  color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: bold; width: fit-content;
`;

const Button = styled(motion.button)`
  background: ${props => props.variant === 'secondary' ? '#ecf0f1' : props.theme.colors.primary};
  color: ${props => props.variant === 'secondary' ? '#333' : 'white'};
  border: none; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer;
  margin-top: 10px; width: 100%;
`;

const CartSidebar = styled(motion.div)`
  position: fixed; right: 0; top: 0; bottom: 0; width: 350px; background: white;
  box-shadow: -5px 0 20px rgba(0,0,0,0.1); padding: 30px; z-index: 1000;
`;

// --- Data ---
const MENU = [
  { id: 1, name: "Mlawi Classic", price: 1.5, cat: "Flatbread", desc: "Authentic plain semolina bread." },
  { id: 2, name: "Mlawi Royal", price: 4.5, cat: "Special", desc: "Tuna, Egg, Harissa, Cheese, and Salami." },
  { id: 3, name: "Mlawi Kaftaji", price: 3.8, cat: "Traditional", desc: "Fried vegetable mix with egg." },
  { id: 4, name: "Mlawi Chawarma", price: 5.5, cat: "Meaty", desc: "Spiced chicken with garlic cream." },
  { id: 5, name: "Mlawi Cheese Bomb", price: 3.2, cat: "Vegetarian", desc: "Mozzarella, Gruyere, and Ricotta." },
  { id: 7, name: "Boga Lim", price: 1.8, cat: "drink", desc: "Refreshing lemon soda." },
  { id: 8, name: "Citronnade Artisanale", price: 3.0, cat: "drink", desc: "Homemade fresh lemon juice." },
  { id: 9, name: "Small Fries", price: 2.0, cat: "side", desc: "Hand-cut potato fries." },
  { id: 10, name: "Mlawi Nutella", price: 3.5, cat: "dessert", desc: "Sweet flatbread with chocolate hazelnut." }
];

// --- Views ---
const ProductDetail = ({ item, onBack, onAdd }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
    <Button variant="secondary" onClick={onBack} style={{ width: 'fit-content' }}>← Back to Menu</Button>
    <div style={{ marginTop: '30px' }}>
      <Badge type={item.cat}>{item.cat.toUpperCase()}</Badge>
      <h1 style={{ fontSize: '2.5rem', margin: '10px 0' }}>{item.name}</h1>
      <p style={{ fontSize: '1.2rem', color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
      <h2 style={{ color: '#27ae60' }}>{item.price.toFixed(3)} TND</h2>
      <ul style={{ paddingLeft: '20px', color: '#7f8c8d' }}>
        <li>Preparation time: 10-15 mins</li>
        <li>Fresh ingredients sourced locally</li>
        <li>Traditional semolina dough</li>
      </ul>
      <Button onClick={() => onAdd(item)} style={{ fontSize: '1.1rem', padding: '18px' }}>Add to Cart - {item.price.toFixed(3)} TND</Button>
    </div>
  </motion.div>
);

const SuccessView = ({ onHome }) => (
  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ textAlign: 'center', marginTop: '100px' }}>
    <div style={{ fontSize: '5rem' }}>👨‍🍳</div>
    <h1>Order Fired Up!</h1>
    <p>We are stretching your dough right now. It will be ready shortly.</p>
    <Button onClick={onHome} style={{ width: '200px' }}>Order More</Button>
  </motion.div>
);

// --- Main App ---
export default function App() {
  const { cart, addToCart, removeFromCart, currentView, setView, clearCart } = useStore();
  const [search, setSearch] = useState("");

  const filteredMenu = useMemo(() => 
    MENU.filter(i => i.name.toLowerCase().includes(search.toLowerCase())), 
  [search]);

  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Nav onClick={() => setView('home')}>
          <h2 style={{ margin: 0 }}>Mlawi<span style={{ color: theme.colors.primary }}>Express</span></h2>
          <div>Cart ({cart.length})</div>
        </Nav>

        <AnimatePresence mode="wait">
          {currentView.page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SearchInput 
                placeholder="Search your favorite Mlawi..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Grid>
                {filteredMenu.map(item => (
                  <Card 
                    key={item.id} 
                    whileHover={{ y: -5 }} 
                    onClick={() => setView('detail', item)}
                  >
                    <Badge type={item.cat}>{item.cat}</Badge>
                    <h3 style={{ margin: '10px 0 5px' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#777', flexGrow: 1 }}>{item.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                      <span style={{ fontWeight: 'bold' }}>{item.price.toFixed(3)}</span>
                      <Button 
                        whileTap={{ scale: 0.9 }} 
                        style={{ width: 'auto', padding: '8px 15px' }}
                        onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                      >+</Button>
                    </div>
                  </Card>
                ))}
              </Grid>
            </motion.div>
          )}

          {currentView.page === 'detail' && (
            <ProductDetail 
              key="detail"
              item={currentView.params} 
              onBack={() => setView('home')} 
              onAdd={addToCart}
            />
          )}

          {currentView.page === 'success' && (
            <SuccessView key="success" onHome={() => setView('home')} />
          )}
        </AnimatePresence>

        {/* Sidebar Cart */}
        <AnimatePresence>
          {cart.length > 0 && currentView.page !== 'success' && (
            <CartSidebar initial={{ x: 350 }} animate={{ x: 0 }} exit={{ x: 350 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Your Basket</h3>
                <button onClick={clearCart} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>Clear</button>
              </div>
              <div style={{ height: '70%', overflowY: 'auto', margin: '20px 0' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.quantity}x {item.name}</div>
                    </div>
                    <div>
                      <span style={{ marginRight: '10px' }}>{(item.price * item.quantity).toFixed(3)}</span>
                      <span onClick={() => removeFromCart(item.id)} style={{ cursor: 'pointer' }}>✕</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '2px solid #eee', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>
                  <span>Total:</span>
                  <span>{total.toFixed(3)} TND</span>
                </div>
                <Button onClick={() => { clearCart(); setView('success'); }}>Checkout Order</Button>
              </div>
            </CartSidebar>
          )}
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}
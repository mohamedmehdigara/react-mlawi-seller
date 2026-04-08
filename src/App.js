import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import styled, { createGlobalStyle, ThemeProvider, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme & Reset ---
const theme = {
  colors: {
    primary: '#e67e22',
    secondary: '#2c3e50',
    accent: '#27ae60',
    warning: '#f1c40f',
    bg: '#f9f6f2',
    white: '#ffffff',
    text: '#1a1a1a'
  }
};

const GlobalStyle = createGlobalStyle`
  body { margin: 0; font-family: 'Outfit', sans-serif; background: ${props => props.theme.colors.bg}; color: ${props => props.theme.colors.text}; }
  * { box-sizing: border-box; transition: background 0.2s ease; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #e67e22; border-radius: 10px; }
`;

// --- Store (Enhanced with Customization) ---
const useStore = create(persist((set) => ({
  cart: [],
  view: { page: 'home', data: null },
  setView: (page, data = null) => set({ view: { page, data } }),
  addToCart: (item, extras = []) => set((state) => {
    const extraPrice = extras.reduce((sum, e) => sum + e.price, 0);
    const uniqueId = `${item.id}-${extras.map(e => e.id).join('')}`;
    const existing = state.cart.find(i => i.uniqueId === uniqueId);
    
    if (existing) {
      return { cart: state.cart.map(i => i.uniqueId === uniqueId ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { cart: [...state.cart, { ...item, uniqueId, extras, price: item.price + extraPrice, quantity: 1 }] };
  }),
  removeFromCart: (uniqueId) => set((state) => ({ cart: state.cart.filter(i => i.uniqueId !== uniqueId) })),
  clearCart: () => set({ cart: [] }),
}), { name: 'mlawi-ultra-v3' }));

// --- Styled Components ---
const Container = styled.div` max-width: 1200px; margin: 0 auto; padding: 20px; `;
const Grid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; `;

const CategoryTab = styled.button`
  padding: 10px 20px; border-radius: 30px; border: none; font-weight: 600;
  background: ${props => props.active ? props.theme.colors.primary : '#eee'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer; margin-right: 10px;
`;

const Card = styled(motion.div)`
  background: white; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04);
  display: flex; flex-direction: column; cursor: pointer; position: relative;
  overflow: hidden;
`;

const PriceTag = styled.div`
  font-size: 1.4rem; font-weight: 800; color: ${props => props.theme.colors.primary};
`;

const Button = styled(motion.button)`
  background: ${props => props.bg || props.theme.colors.primary};
  color: white; border: none; padding: 14px 24px; border-radius: 16px; 
  font-weight: 700; cursor: pointer; width: 100%;
`;

// --- Mock Data (Expanded) ---
const EXTRAS = [
  { id: 'ex1', name: 'Extra Cheese', price: 0.800 },
  { id: 'ex2', name: 'Extra Harissa', price: 0.200 },
  { id: 'ex3', name: 'Extra Egg', price: 0.700 },
];

const MENU = [
  { id: 1, name: "Mlawi Nature", price: 1.5, cat: "Classic", desc: "Authentic handmade flatbread." },
  { id: 2, name: "Mlawi Cheese", price: 2.5, cat: "Classic", desc: "Stuffed with local melting cheese." },
  { id: 3, name: "Mlawi Special", price: 4.8, cat: "Signature", desc: "Tuna, Egg, Cheese, Salad, Salami." },
  { id: 4, name: "Mlawi Merguez", price: 5.2, cat: "Meaty", desc: "Spiced Tunisian lamb sausages." },
  { id: 5, name: "Mlawi Makloub", price: 6.0, cat: "Meaty", desc: "Folded pizza-style with chicken." },
  { id: 6, name: "Mlawi Kaftaji", price: 3.9, cat: "Veggie", desc: "Fried peppers, squash, and egg." },
  { id: 7, name: "Mlawi Shakshuka", price: 3.5, cat: "Veggie", desc: "Tomato and pepper base with poached egg." },
  { id: 8, name: "Mlawi Nutella", price: 3.5, cat: "Sweet", desc: "Hazelnut spread delight." },
  { id: 9, name: "Mlawi Honey/Butter", price: 2.8, cat: "Sweet", desc: "Traditional morning breakfast style." },
  { id: 10, name: "Boga Lim", price: 1.8, cat: "Drinks", desc: "The iconic Tunisian soda." },
  { id: 11, name: "Citronnade", price: 3.2, cat: "Drinks", desc: "Fresh local lemons and mint." },
  { id: 12, name: "Mint Tea", price: 1.5, cat: "Drinks", desc: "Traditional pine-nut optional." }
];

// --- Sub-Views ---
const DetailsView = ({ item, onAdd }) => {
  const [selectedExtras, setSelectedExtras] = useState([]);
  const totalPrice = item.price + selectedExtras.reduce((s, e) => s + e.price, 0);

  const toggleExtra = (e) => {
    setSelectedExtras(prev => prev.find(i => i.id === e.id) ? prev.filter(i => i.id !== e.id) : [...prev, e]);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header style={{ marginBottom: 40 }}>
        <span onClick={() => useStore.getState().setView('home')} style={{ cursor: 'pointer', fontWeight: 'bold' }}>← BACK</span>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div>
          <div style={{ background: '#eee', height: 300, borderRadius: 20, marginBottom: 20 }} />
          <h1>{item.name}</h1>
          <p>{item.desc}</p>
        </div>
        <div>
          <h3>Customize your Mlawi</h3>
          {EXTRAS.map(e => (
            <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
              <span>{e.name} (+{e.price.toFixed(3)})</span>
              <input type="checkbox" onChange={() => toggleExtra(e)} />
            </div>
          ))}
          <div style={{ marginTop: 30 }}>
            <PriceTag style={{ marginBottom: 20 }}>Total: {totalPrice.toFixed(3)} TND</PriceTag>
            <Button onClick={() => onAdd(item, selectedExtras)}>Add to Basket</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ChefView = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setProgress(p => p < 100 ? p + 1 : 100), 50);
    if (progress === 100) setTimeout(onFinish, 1000);
    return () => clearInterval(timer);
  }, [progress, onFinish]);

  return (
    <div style={{ textAlign: 'center', padding: '100px 0' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>🔥</motion.div>
      <h2>Chef is Stretching the Dough...</h2>
      <div style={{ width: '100%', height: 10, background: '#eee', borderRadius: 5, overflow: 'hidden', margin: '20px 0' }}>
        <motion.div style={{ height: '100%', background: '#e67e22', width: `${progress}%` }} />
      </div>
      <p>{progress}% Sizzling...</p>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const { cart, view, setView, addToCart, removeFromCart, clearCart } = useStore();
  const [activeCat, setActiveCat] = useState("All");

  const cats = ["All", ...new Set(MENU.map(i => i.cat))];
  const filtered = MENU.filter(i => activeCat === "All" || i.cat === activeCat);
  const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
          <h1 onClick={() => setView('home')} style={{ cursor: 'pointer' }}>Mlawi<span style={{ color: theme.colors.primary }}>King</span></h1>
          <div onClick={() => setView('cart')} style={{ cursor: 'pointer', fontWeight: '800' }}>🛒 {cart.length}</div>
        </nav>

        <AnimatePresence mode="wait">
          {view.page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ marginBottom: 30, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {cats.map(c => <CategoryTab key={c} active={activeCat === c} onClick={() => setActiveCat(c)}>{c}</CategoryTab>)}
              </div>
              <Grid>
                {filtered.map(item => (
                  <Card key={item.id} whileHover={{ y: -10 }} onClick={() => setView('detail', item)}>
                    <div style={{ background: '#f0f0f0', height: 120, borderRadius: 15, marginBottom: 15 }} />
                    <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#666', flexGrow: 1 }}>{item.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                      <PriceTag>{item.price.toFixed(3)}</PriceTag>
                      <button style={{ background: '#eee', border: 'none', borderRadius: 8, padding: '5px 12px', fontWeight: 'bold' }}>View</button>
                    </div>
                  </Card>
                ))}
              </Grid>
            </motion.div>
          )}

          {view.page === 'detail' && (
            <DetailsView key="detail" item={view.data} onAdd={(item, ext) => { addToCart(item, ext); setView('home'); }} />
          )}

          {view.page === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2>Your Basket</h2>
              {cart.map(item => (
                <div key={item.uniqueId} style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'white', borderRadius: 15, marginBottom: 10 }}>
                  <div>
                    <h4 style={{ margin: 0 }}>{item.quantity}x {item.name}</h4>
                    <small>{item.extras.map(e => e.name).join(', ') || 'Standard'}</small>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', marginRight: 20 }}>{(item.price * item.quantity).toFixed(3)} TND</span>
                    <button onClick={() => removeFromCart(item.uniqueId)} style={{ color: 'red', border: 'none', background: 'none' }}>Remove</button>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 40, textAlign: 'right' }}>
                <h2 style={{ color: theme.colors.primary }}>Total: {total.toFixed(3)} TND</h2>
                <Button onClick={() => setView('cooking')} style={{ width: 300 }}>Confirm & Pay</Button>
              </div>
            </motion.div>
          )}

          {view.page === 'cooking' && (
            <ChefView key="cook" onFinish={() => { clearCart(); setView('success'); }} />
          )}

          {view.page === 'success' && (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <h1>Bon Appétit! 🥙</h1>
              <p>Your Mlawi is ready at the counter.</p>
              <Button onClick={() => setView('home')} style={{ width: 200 }}>Order Another</Button>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </ThemeProvider>
  );
}
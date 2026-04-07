import React, { useState, useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import styled, { createGlobalStyle, ThemeProvider, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// --- Theme Configuration ---
const theme = {
  colors: {
    primary: '#e67e22',
    secondary: '#d35400',
    success: '#27ae60',
    danger: '#c0392b',
    background: '#fcf8f2',
    text: '#2c3e50',
    white: '#ffffff',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.08)',
    strong: '0 8px 30px rgba(0,0,0,0.12)',
  }
};

// --- Global Styles ---
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    -webkit-font-smoothing: antialiased;
  }
  * { box-sizing: border-box; }
`;

// --- State Management (Zustand with Persistence) ---
const useStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) => set((state) => {
        const exists = state.cart.find(item => item.id === product.id);
        if (exists) {
          return {
            cart: state.cart.map(item =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),
      updateQuantity: (id, delta) => set((state) => ({
        cart: state.cart.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
      })),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(item => item.id !== id)
      })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'mlawi-cart-storage' }
  )
);

// --- Styled Components ---
const AppContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  margin-bottom: 40px;
`;

const Logo = styled.h1`
  font-size: 1.8rem;
  color: ${props => props.theme.colors.primary};
  margin: 0;
  span { color: ${props => props.theme.colors.text}; }
`;

const Hero = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  color: white;
  padding: 60px 40px;
  border-radius: 24px;
  text-align: center;
  margin-bottom: 50px;
  box-shadow: ${props => props.theme.shadows.strong};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: ${props => props.theme.shadows.soft};
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Tag = styled.span`
  background: #fff3e0;
  color: #e67e22;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 50px;
  align-self: flex-start;
  margin-bottom: 15px;
`;

const AddButton = styled(motion.button)`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: auto;
  &:hover { background: ${props => props.theme.colors.secondary}; }
`;

const Sidebar = styled(motion.div)`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 350px;
  background: white;
  border-radius: 24px;
  box-shadow: ${props => props.theme.shadows.strong};
  padding: 25px;
  z-index: 100;
  max-height: 80vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 400px) {
    width: calc(100% - 40px);
  }
`;

const CartList = styled.div`
  overflow-y: auto;
  margin: 15px 0;
  flex-grow: 1;
`;

const CartItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
`;

// --- Mock Data ---
const PRODUCTS = [
  { id: 'm1', name: "Standard Mlawi", price: 1.500, category: "Classic" },
  { id: 'm2', name: "Mlawi Egg & Cheese", price: 2.800, category: "Popular" },
  { id: 'm3', name: "Mlawi Tuna Extra", price: 3.900, category: "Signature" },
  { id: 'm4', name: "Mlawi Harissa Chicken", price: 4.500, category: "Spicy" },
  { id: 'm5', name: "Mlawi Mixed Meat", price: 5.200, category: "Premium" },
];

export default function App() {
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useStore();
  const [isOrdering, setIsOrdering] = useState(false);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleOrder = () => {
    setIsOrdering(true);
    setTimeout(() => {
      alert("Order Received! Our chef is preparing your Mlawi.");
      clearCart();
      setIsOrdering(false);
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Nav>
          <Logo>Mlawi<span>App</span></Logo>
          <div style={{ fontWeight: '500' }}>Tunis, TN 🇹🇳</div>
        </Nav>

        <Hero>
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            Hand-Stretched Daily.
          </motion.h2>
          <p>Experience authentic Tunisian street food with premium ingredients.</p>
        </Hero>

        <section>
          <h3 style={{ marginBottom: '25px' }}>Explore Menu</h3>
          <ProductGrid>
            {PRODUCTS.map((product) => (
              <ProductCard 
                key={product.id}
                whileHover={{ y: -8 }}
              >
                <Tag>{product.category}</Tag>
                <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px' }}>
                  {product.price.toFixed(3)} <small style={{ fontSize: '0.7rem' }}>TND</small>
                </div>
                <AddButton 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </AddButton>
              </ProductCard>
            ))}
          </ProductGrid>
        </section>

        <AnimatePresence>
          {cart.length > 0 && (
            <Sidebar
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
            >
              <h3 style={{ margin: 0 }}>My Basket</h3>
              <CartList>
                {cart.map((item) => (
                  <CartItem 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>
                        {item.price.toFixed(3)} TND
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button 
                        style={{ border: 'none', background: '#eee', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, -1)}
                      >-</button>
                      <span style={{ fontWeight: 'bold' }}>{item.quantity}</span>
                      <button 
                        style={{ border: 'none', background: '#eee', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => updateQuantity(item.id, 1)}
                      >+</button>
                    </div>
                  </CartItem>
                ))}
              </CartList>
              
              <div style={{ borderTop: '2px solid #f9f9f9', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <strong>Total Payable</strong>
                  <strong style={{ color: theme.colors.primary }}>{total.toFixed(3)} TND</strong>
                </div>
                <AddButton 
                  disabled={isOrdering}
                  style={{ width: '100%', padding: '15px' }}
                  onClick={handleOrder}
                >
                  {isOrdering ? 'Processing...' : 'Place Order Now'}
                </AddButton>
              </div>
            </Sidebar>
          )}
        </AnimatePresence>
      </AppContainer>
    </ThemeProvider>
  );
}
import { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    images: string[];
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabaseClient();
  const user = useUser();

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setItems([]);
      setIsLoading(false);
    }
  }, [user]);

  async function loadCart() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            name,
            price,
            images
          )
        `)
        .eq('cart_id', (
          await supabase
            .from('carts')
            .select('id')
            .eq('profile_id', user?.id)
            .single()
        ).data?.id);

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }

  async function addItem(productId: string, quantity: number) {
    try {
      setIsLoading(true);
      
      // Get or create cart
      let { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (!cart) {
        const { data: newCart } = await supabase
          .from('carts')
          .insert({ profile_id: user?.id })
          .select()
          .single();
        cart = newCart;
      }

      // Add item to cart
      const { data, error } = await supabase
        .from('cart_items')
        .upsert({
          cart_id: cart.id,
          product_id: productId,
          quantity,
        })
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            name,
            price,
            images
          )
        `)
        .single();

      if (error) throw error;

      setItems((prev) => {
        const existingItem = prev.find((item) => item.product_id === productId);
        if (existingItem) {
          return prev.map((item) =>
            item.product_id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, data];
      });

      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  }

  async function removeItem(itemId: string) {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsLoading(false);
    }
  }

  async function updateQuantity(itemId: string, quantity: number) {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating item quantity:', error);
      toast.error('Failed to update quantity');
    } finally {
      setIsLoading(false);
    }
  }

  async function clearCart() {
    try {
      setIsLoading(true);
      const { data: cart } = await supabase
        .from('carts')
        .select('id')
        .eq('profile_id', user?.id)
        .single();

      if (cart) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id);

        if (error) throw error;
      }

      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 
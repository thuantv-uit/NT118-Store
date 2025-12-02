import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '../../../constants/api';

// Helper to call API carts
const fetchCartByCustomerId = async (customerId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${customerId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Validate: Đảm bảo là array, fallback []
    const cartsArray = Array.isArray(data) ? data : [];
    // console.log(`Debug fetchCart - customerId: ${customerId}, carts:`, cartsArray); // Debug
    return cartsArray;
  } catch (err) {
    console.error('Error fetching cart:', err);
    throw err;
  }
};

// NEW: Helper to fetch orders by userId
const fetchOrdersByUserId = async (customerId) => {
  try {
    const response = await fetch(`${API_URL}/order/user/${customerId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Validate: Đảm bảo là array, fallback []
    const ordersArray = Array.isArray(data) ? data : [];
    // console.log(`Debug fetchOrders - customerId: ${customerId}, orders:`, ordersArray); // Debug
    return ordersArray;
  } catch (err) {
    console.error('Error fetching orders:', err);
    // Fallback empty array nếu orders fail (không filter)
    return [];
  }
};

// Helper to fetch product by ID
const fetchProductById = async (productId) => {
  try {
    const response = await fetch(`${API_URL}/product/${productId}`);
    if (!response.ok) {
      throw new Error(`Product not found: ${productId}`);
    }
    const product = await response.json();
    return product;
  } catch (err) {
    console.error(`Error fetching product ${productId}:`, err);
    return null;
  }
};

// NEW: Helper to match variant từ cart (dựa trên size/color/variant_id)
const matchVariant = (product, cart) => {
  if (!product || !product.variants || product.variants.length === 0) return null;
  return product.variants.find(v => 
    v.id === cart.variant_id || (v.size === cart.size && v.color === cart.color)
  );
};

// Load carts and fetch products unmerge, set { cart, product, variant }
const loadCartWithProducts = async (carts) => {
  const itemsWithProducts = await Promise.all(
    carts.map(async (cart) => {
      const product = await fetchProductById(cart.product_id);
      const variant = product ? matchVariant(product, cart) : null;
      return {
        cart,
        product,
        variant,
      };
    })
  );

  // Filter items have variant valid (price >0)
  const validItems = itemsWithProducts.filter(({ variant }) => variant && parseFloat(variant.price || 0) > 0);
  return validItems;
};

const updateCartQuantity = async (cartId, newQty) => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedCart = await response.json();
    // Re-fetch product để match variant mới
    const product = await fetchProductById(updatedCart.product_id);
    const variant = product ? matchVariant(product, updatedCart) : null;
    return { cart: updatedCart, product, variant };
  } catch (err) {
    console.error('Error updating quantity:', err);
    throw err;
  }
};

const deleteCartItem = async (cartId) => {
  try {
    const response = await fetch(`${API_URL}/cart/${cartId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Error deleting item:', err);
    throw err;
  }
};

export const useCart = (customerId) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load carts when mount or customerId thay đổi (UPDATED: Filter carts chưa ordered)
  useEffect(() => {
    const loadCart = async () => {
      if (!customerId) {
        setError('Bạn cần đăng nhập để xem giỏ hàng.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch parallel: carts và orders
        const [carts, orders] = await Promise.all([
          fetchCartByCustomerId(customerId),
          fetchOrdersByUserId(customerId),
        ]);

        // Extract all ordered cart_ids (hỗ trợ array hoặc single)
        const orderedCartIds = new Set();
        orders.forEach(order => {
          const cartIds = Array.isArray(order.cart_id) ? order.cart_id : (order.cart_id ? [order.cart_id] : []);
          cartIds.forEach(id => {
            if (id) orderedCartIds.add(id);
          });
        });
        // console.log(`Debug loadCart - ordered cart_ids:`, Array.from(orderedCartIds)); // Debug

        // Filter carts: Chỉ giữ những chưa ordered
        const unOrderedCarts = carts.filter(cart => !orderedCartIds.has(cart.id));
        // console.log(`Debug loadCart - filtered carts (un-ordered):`, unOrderedCarts); // Debug

        // Enrich và filter valid
        const enrichedData = await loadCartWithProducts(unOrderedCarts);
        // console.log("enrichedData: ", enrichedData);
        setCartItems(enrichedData);
      } catch (err) {
        setError(err.message);
        Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [customerId]);

  // Update quantity
  const updateQuantity = useCallback(async (cartId, newQty) => {
    if (newQty < 1) {
      await removeItem(cartId);
      return;
    }

    try {
      const updatedItem = await updateCartQuantity(cartId, newQty);
      setCartItems(prev => prev.map(item => 
        item.cart.id === cartId ? updatedItem : item
      ));
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng. Vui lòng thử lại.');
    }
  }, []);

  // Remove item
  const removeItem = useCallback(async (cartId) => {
    try {
      await deleteCartItem(cartId);
      setCartItems(prev => prev.filter(item => item.cart.id !== cartId));
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm. Vui lòng thử lại.');
    }
  }, []);

  // Total from variant.price * cart.quantity (SỬA: Dùng variant.price thay product.price)
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.variant?.price || 0);
    return sum + (price * item.cart.quantity);
  }, 0);

  // Refetch (UPDATED: Sẽ re-filter khi gọi)
  const refetchCart = useCallback(async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError(null);
      const [carts, orders] = await Promise.all([
        fetchCartByCustomerId(customerId),
        fetchOrdersByUserId(customerId),
      ]);
      const orderedCartIds = new Set();
      orders.forEach(order => {
        const cartIds = Array.isArray(order.cart_id) ? order.cart_id : (order.cart_id ? [order.cart_id] : []);
        cartIds.forEach(id => orderedCartIds.add(id));
      });
      const unOrderedCarts = carts.filter(cart => !orderedCartIds.has(cart.id));
      const newData = await loadCartWithProducts(unOrderedCarts);
      setCartItems(newData);
    } catch (err) {
      setError(err.message);
      Alert.alert('Lỗi', 'Không thể tải lại giỏ hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  return {
    cartItems,
    loading,
    error,
    total,
    updateQuantity,
    removeItem,
    refetchCart,
  };
};
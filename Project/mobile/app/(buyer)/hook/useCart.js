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
    return data;
  } catch (err) {
    console.error('Error fetching cart:', err);
    throw err;
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
    // console.log(`Fetched product ${productId}:`, product); // Debug: Check images/image
    return product;
  } catch (err) {
    console.error(`Error fetching product ${productId}:`, err);
    return null;
  }
};

// Load carts and fetch products unmerge, set { cart, product }
const loadCartWithProducts = async (carts) => {
  const itemsWithProducts = await Promise.all(
    carts.map(async (cart) => {
      const product = await fetchProductById(cart.product_id);
      // console.log(`Loaded for cart ${cart.id}: cart=`, cart, 'product=', product); // Debug
      return {
        cart,
        product,
      };
    })
  );

  // Filter items have product valid (price >0)
  const validItems = itemsWithProducts.filter(({ product }) => product && parseFloat(product.price || 0) > 0);
  // console.log('Final cartItems (with products):', validItems); // Debug array cuối
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
    // Re-fetch product để giữ nguyên
    const product = await fetchProductById(updatedCart.product_id);
    return { cart: updatedCart, product };
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
  const [cartItems, setCartItems] = useState([]); // Array of { cart, product }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load carts when mount or customerId thay đổi
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
        const carts = await fetchCartByCustomerId(customerId);
        const enrichedData = await loadCartWithProducts(carts || []); // Load { cart, product }
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
      const updatedItem = await updateCartQuantity(cartId, newQty); // Return { cart, product }
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

  // Total from product.price * cart.quantity
  const total = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.product?.price || 0);
    return sum + (price * item.cart.quantity);
  }, 0);

  // Refetch
  const refetchCart = useCallback(async () => {
    if (!customerId) return;
    try {
      setLoading(true);
      setError(null);
      const carts = await fetchCartByCustomerId(customerId);
      const newData = await loadCartWithProducts(carts || []);
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
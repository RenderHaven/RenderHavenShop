const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('rhs_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || data?.error || 'Something went wrong');
  }
  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  sendOtp: (phone: string) =>
    request('/user/send_otp', { method: 'POST', body: JSON.stringify({ phone }) }),

  register: (payload: { name: string; phone: string; otp: string; email?: string }) =>
    request('/user/register', { method: 'POST', body: JSON.stringify(payload) }),

  login: (payload: { phone: string; password?: string; otp?: string }) =>
    request<{ token: string; user: unknown }>('/user/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getUser: (userId: string) => request(`/user/get_user/${userId}`),

  editUser: (userId: string, payload: unknown) =>
    request(`/user/edit_user/${userId}`, { method: 'PUT', body: JSON.stringify(payload) }),

  changePassword: (payload: unknown) =>
    request('/user/edit_user_password', { method: 'PUT', body: JSON.stringify(payload) }),
};

// ─── Addresses ─────────────────────────────────────────────────────────────
export const addressApi = {
  getAll: (userId: string) => request(`/user/get_addresses/${userId}`),
  add: (payload: unknown) =>
    request('/user/add_address', { method: 'POST', body: JSON.stringify(payload) }),
  edit: (addressId: string, payload: unknown) =>
    request(`/user/edit_add/${addressId}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (addressId: string) =>
    request(`/user/remove_add/${addressId}`, { method: 'DELETE' }),
};

// ─── Products ──────────────────────────────────────────────────────────────
export const productApi = {
  getAll: () => request('/item/get_all'),
  getById: (productId: string) => request(`/product/get_product/${productId}`),
  getItemsByProduct: (productId: string) =>
    request(`/product/get_items_by_product/${productId}`),
  search: (q: string) => request(`/product/search?q=${encodeURIComponent(q)}`),
  getByCategory: (categoryId: string) =>
    request(`/product/get_products_by_category/${categoryId}`),
  getTree: (payload: unknown) =>
    request('/product/get_products_tree', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── Items (SKUs) ──────────────────────────────────────────────────────────
export const itemApi = {
  getAll: () => request('/item/get_all'),
  getById: (itemId: string) => request(`/item/get_item/${itemId}/false`),
  search: (q: string) => request(`/item/search?q=${encodeURIComponent(q)}`),
  getByIds: (ids: string[]) =>
    request('/item/get_items_by_ids', { method: 'POST', body: JSON.stringify({ ids }) }),
  getByCart: () => request('/item/get_by_cart'),
};

// ─── Categories ────────────────────────────────────────────────────────────
export const categoryApi = {
  getSubcategories: (categoryId: string) =>
    request(`/get_all_subcat/${categoryId}`),
  getItemsByCategory: (payload: unknown) =>
    request('/get_items_by_category', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── Orders ────────────────────────────────────────────────────────────────
export const orderApi = {
  getAll: () => request('/order/get_all'),
  getById: (orderId: string) => request(`/order/get/${orderId}`),
  create: (payload: unknown) =>
    request('/order/create_order', { method: 'POST', body: JSON.stringify(payload) }),
  createPaymentOrder: (payload: unknown) =>
    request('/order/create_payment_orderId', { method: 'POST', body: JSON.stringify(payload) }),
  verifyPayment: (orderId: string) => request(`/order/verify_payment/${orderId}`),
};

// ─── Coupons ───────────────────────────────────────────────────────────────
export const couponApi = {
  check: (code: string) => request(`/check/${code}`),
  getByCode: (code: string, userId: string) =>
    request(`/get_by_code/${code}/${userId}`),
};

// ─── Home / Summary ────────────────────────────────────────────────────────
export const homeApi = {
  getHome: () => request('/home/get_home'),
  sendEmail: (payload: unknown) =>
    request('/home/send_email', { method: 'POST', body: JSON.stringify(payload) }),
};

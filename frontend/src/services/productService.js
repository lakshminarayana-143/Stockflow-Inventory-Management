import api from './api';

export const productService = {
  getProducts: async (params = {}) => {
    return await api.get('/products', { params });
  },
  getProductById: async (id) => {
    return await api.get(`/products/${id}`);
  },
  createProduct: async (productData) => {
    return await api.post('/products', productData);
  },
  updateProduct: async (id, productData) => {
    return await api.put(`/products/${id}`, productData);
  },
  adjustStock: async (id, deltaUnits, note = '') => {
    return await api.patch(`/products/${id}/adjust`, { deltaUnits, note });
  },
  deleteProduct: async (id) => {
    return await api.delete(`/products/${id}`);
  },
};


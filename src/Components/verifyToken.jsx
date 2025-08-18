export const verifyToken = async (token) => {
  try {
    console.log('🔍 Verifying token...');
    const response = await fetch(`https://synconode.onrender.com/api/admin/auth/login/verify`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log('📦 Verify response:', result);

    if (response.ok) {
      localStorage.setItem('adminInfo', JSON.stringify(result.admin));
      localStorage.setItem('role', (result.admin.role));
    
      return true;
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      throw new Error(result.message || 'Token verification failed');
    }
  } catch (err) {
    console.error('❌ verifyToken error:', err);
    throw new Error(err.message || 'Something went wrong during token verification');
  }
};


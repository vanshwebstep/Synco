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

    if (response.ok && result.status === true) {
      localStorage.setItem('adminInfo', JSON.stringify(result.admin));
      return true;
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      return false;
    }
  } catch (err) {
    console.error('❌ verifyToken error:', err);
    return false;
  }
};

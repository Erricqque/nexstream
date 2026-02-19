// Real earnings calculator
const calculateEarnings = async (userId) => {
  // Get all completed purchases for user's content
  const { data: purchases } = await supabase
    .from('purchases')
    .select('amount, created_at, content_id')
    .eq('creator_id', userId)
    .eq('status', 'completed');

  // Calculate MLM commissions
  const { data: referrals } = await supabase
    .from('referrals')
    .select('user_id, level, earnings')
    .eq('referrer_id', userId);

  const totalEarnings = purchases.reduce((sum, p) => sum + p.amount, 0);
  const commissionEarnings = referrals.reduce((sum, r) => sum + r.earnings, 0);

  return {
    contentSales: totalEarnings,
    mlmCommissions: commissionEarnings,
    total: totalEarnings + commissionEarnings,
    recent: purchases.slice(-10)
  };
};
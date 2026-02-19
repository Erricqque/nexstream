// wallet.js - Wallet and Withdrawal Management
const { supabase } = require('./supabaseClient');

async function processWithdrawalRequest(userId, amount, method, phone) {
  console.log('Processing withdrawal request:', { userId, amount, method, phone });
  
  try {
    // Validation checks
    if (!amount || amount < 10) {
      return { success: false, message: 'Minimum withdrawal is $10' };
    }
    
    if (!method) {
      return { success: false, message: 'Payment method required' };
    }
    
    if (method !== 'bank' && !phone) {
      return { success: false, message: 'Phone number required' };
    }
    
    // Get user's current balance
    const { data: earnings, error: earningsError } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId);
      
    if (earningsError) {
      console.error('Error fetching earnings:', earningsError);
      return { success: false, message: 'Database error' };
    }
    
    const totalEarnings = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0;
    
    // Get pending withdrawals
    const { data: pendingWithdrawals, error: pendingError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'pending');
      
    if (pendingError) {
      console.error('Error fetching pending withdrawals:', pendingError);
      return { success: false, message: 'Database error' };
    }
    
    const pendingTotal = pendingWithdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;
    
    // Get completed withdrawals
    const { data: completedWithdrawals, error: completedError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('user_id', userId)
      .eq('status', 'completed');
      
    if (completedError) {
      console.error('Error fetching completed withdrawals:', completedError);
      return { success: false, message: 'Database error' };
    }
    
    const withdrawnTotal = completedWithdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;
    
    // Calculate available balance
    const availableBalance = totalEarnings - (pendingTotal + withdrawnTotal);
    
    // Check if sufficient balance
    if (amount > availableBalance) {
      return { 
        success: false, 
        message: `Insufficient balance. Available: $${availableBalance.toFixed(2)}` 
      };
    }
    
    // Check for duplicate pending request (same amount within 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { data: duplicateCheck } = await supabase
      .from('withdrawals')
      .select('id')
      .eq('user_id', userId)
      .eq('amount', amount)
      .eq('status', 'pending')
      .gte('created_at', oneDayAgo.toISOString());
      
    if (duplicateCheck && duplicateCheck.length > 0) {
      return { 
        success: false, 
        message: 'Duplicate withdrawal request detected. Please wait 24 hours.' 
      };
    }
    
    // Create withdrawal request
    const { data, error } = await supabase
      .from('withdrawals')
      .insert([{
        user_id: userId,
        amount: amount,
        method: method,
        phone: phone || null,
        status: 'pending',
        created_at: new Date()
      }])
      .select()
      .single();
      
    if (error) {
      console.error('Error creating withdrawal:', error);
      return { success: false, message: 'Failed to create withdrawal request' };
    }
    
    return { 
      success: true, 
      message: 'Withdrawal request submitted successfully',
      data: data 
    };
    
  } catch (error) {
    console.error('Error in processWithdrawalRequest:', error);
    return { success: false, message: 'Internal server error' };
  }
}

async function approveWithdrawal(withdrawalId, adminId) {
  try {
    // Get withdrawal details
    const { data: withdrawal, error: fetchError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', withdrawalId)
      .single();
      
    if (fetchError || !withdrawal) {
      return { success: false, message: 'Withdrawal not found' };
    }
    
    if (withdrawal.status !== 'pending') {
      return { success: false, message: `Withdrawal already ${withdrawal.status}` };
    }
    
    // Update status to processing
    await supabase
      .from('withdrawals')
      .update({ 
        status: 'processing',
        processed_by: adminId,
        processed_at: new Date()
      })
      .eq('id', withdrawalId);
    
    // In production, integrate with payment gateway here
    
    // Mark as completed
    const { error } = await supabase
      .from('withdrawals')
      .update({ 
        status: 'completed',
        completed_at: new Date()
      })
      .eq('id', withdrawalId);
      
    if (error) {
      console.error('Error approving withdrawal:', error);
      return { success: false, message: 'Database error' };
    }
    
    return { success: true, message: 'Withdrawal approved' };
    
  } catch (error) {
    console.error('Error in approveWithdrawal:', error);
    return { success: false, message: 'Internal server error' };
  }
}

async function getUserBalance(userId) {
  try {
    // Get all earnings
    const { data: earnings, error: earningsError } = await supabase
      .from('earnings')
      .select('amount')
      .eq('user_id', userId);
      
    if (earningsError) throw earningsError;
    
    const totalEarnings = earnings?.reduce((sum, e) => sum + e.amount, 0) || 0;
    
    // Get all withdrawals
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('amount, status')
      .eq('user_id', userId);
      
    if (withdrawalsError) throw withdrawalsError;
    
    const pendingTotal = withdrawals
      ?.filter(w => w.status === 'pending')
      .reduce((sum, w) => sum + w.amount, 0) || 0;
      
    const completedTotal = withdrawals
      ?.filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0) || 0;
    
    return {
      totalEarnings,
      pendingWithdrawals: pendingTotal,
      withdrawn: completedTotal,
      available: totalEarnings - (pendingTotal + completedTotal)
    };
    
  } catch (error) {
    console.error('Error getting user balance:', error);
    return null;
  }
}

module.exports = { 
  processWithdrawalRequest, 
  approveWithdrawal, 
  getUserBalance 
};
// business.js - Atomic Business Transaction Processing
const { supabase } = require('./supabaseClient');
const { calculateCommissions } = require('./mlm');

async function processSale(saleData) {
  console.log('Processing sale:', saleData);
  
  // Use Supabase transaction (rpc function)
  try {
    // Start transaction
    const { data, error } = await supabase.rpc('process_sale_transaction', {
      p_user_id: saleData.user_id,
      p_product_id: saleData.product_id,
      p_amount: saleData.amount,
      p_platform_fee: saleData.amount * 0.45,
      p_creator_earnings: saleData.amount * 0.55,
      p_buyer_id: saleData.buyer_id || null
    });
    
    if (error) throw error;
    
    console.log('Sale processed successfully:', data);
    
    // Trigger MLM commission calculation asynchronously
    if (saleData.buyer_id) {
      calculateCommissions({
        id: data.sale_id,
        user_id: saleData.buyer_id,
        amount: saleData.amount
      }).catch(err => console.error('MLM commission error:', err));
    }
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Error processing sale:', error);
    return { success: false, error: error.message };
  }
}

async function processRefund(saleId, reason) {
  try {
    // Get original sale
    const { data: sale, error: fetchError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', saleId)
      .single();
      
    if (fetchError || !sale) {
      return { success: false, message: 'Sale not found' };
    }
    
    if (sale.status === 'refunded') {
      return { success: false, message: 'Already refunded' };
    }
    
    // Process refund transaction
    const { data, error } = await supabase.rpc('process_refund_transaction', {
      p_sale_id: saleId,
      p_reason: reason
    });
    
    if (error) throw error;
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Error processing refund:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { processSale, processRefund };
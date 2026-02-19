// mlm.js - MLM Commission Calculation Logic
const { supabase } = require('./supabaseClient');

async function calculateCommissions(purchase) {
  console.log('Calculating commissions for purchase:', purchase);
  
  try {
    // Get buyer's profile with referral info
    const { data: buyer, error: buyerError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', purchase.user_id)
      .single();
      
    if (buyerError || !buyer) {
      console.error('Buyer not found:', buyerError);
      return;
    }
    
    // If no referrer, no commissions to calculate
    if (!buyer.referred_by) {
      console.log('Buyer has no referrer. No commissions.');
      return;
    }
    
    // Level 1 Commission (10%)
    await createCommission(
      buyer.referred_by, 
      purchase.amount * 0.10, 
      1, 
      purchase.id,
      `Commission from ${buyer.email || 'user'}`
    );
    
    // Get Level 1 referrer's profile
    const { data: level1User, error: level1Error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', buyer.referred_by)
      .single();
      
    if (level1Error) {
      console.error('Level 1 user not found:', level1Error);
      return;
    }
    
    // Level 2 Commission (5%) - if level 1 user has a referrer
    if (level1User.referred_by) {
      await createCommission(
        level1User.referred_by,
        purchase.amount * 0.05,
        2,
        purchase.id,
        `Level 2 commission from ${buyer.email || 'user'}`
      );
      
      // Get Level 2 referrer's profile
      const { data: level2User, error: level2Error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', level1User.referred_by)
        .single();
        
      if (!level2Error && level2User.referred_by) {
        // Level 3 Commission (2.5%)
        await createCommission(
          level2User.referred_by,
          purchase.amount * 0.025,
          3,
          purchase.id,
          `Level 3 commission from ${buyer.email || 'user'}`
        );
      }
    }
    
    console.log('Commissions calculated successfully');
  } catch (error) {
    console.error('Error calculating commissions:', error);
  }
}

async function createCommission(userId, amount, level, purchaseId, description) {
  try {
    // Check if commission already exists for this purchase and level
    const { data: existing } = await supabase
      .from('earnings')
      .select('id')
      .eq('user_id', userId)
      .eq('reference_id', purchaseId)
      .eq('metadata->level', level)
      .maybeSingle();
      
    if (existing) {
      console.log(`Commission already exists for user ${userId} level ${level}`);
      return;
    }
    
    // Create new commission record
    const { error } = await supabase
      .from('earnings')
      .insert([{
        user_id: userId,
        amount: amount,
        type: 'commission',
        status: 'pending',
        metadata: {
          level: level,
          purchase_id: purchaseId,
          description: description
        },
        created_at: new Date()
      }]);
      
    if (error) {
      console.error('Error creating commission:', error);
    } else {
      console.log(`✅ Level ${level} commission of $${amount.toFixed(2)} created for user ${userId}`);
    }
  } catch (error) {
    console.error('Error in createCommission:', error);
  }
}

module.exports = { calculateCommissions };
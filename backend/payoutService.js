// payoutService.js - Complete International Payout System
const axios = require('axios');
const crypto = require('crypto');

class PayoutService {
  constructor() {
    // PayPal Credentials (Your provided keys)
    this.paypalClientId = 'ARYI4FsMZmrE16UB4JUEKLisycYYnaCnfj4oHBbrChBTXin61_11D3X5maiLRA8pNEd-4SP35YBM_6_t';
    this.paypalSecret = 'EAoVWkued62h5Tq6eJR9iIZ0SJQC4fC2jxMiBNC-_KaNQ8wREnW73V9mysErmdltOqgKOtmqJFhr7l2S';
    this.paypalApi = 'https://api-m.sandbox.paypal.com'; // Sandbox for testing

    // Flutterwave Credentials (Your existing keys)
    this.flutterwaveSecretKey = 'FLWSECK_TEST-3cf5564bc372a08321518a4a318e32b3-X';
    this.flutterwavePublicKey = 'FLWPUBK_TEST-fcd4bccac3d8853702e77c7d3019854c-X';
    this.flutterwaveEncryptionKey = 'wxPAoaje4yjJTisgdsbHc+lwVS53/SrJdkbVQUpQlcc=';
    this.flutterwaveApi = 'https://api.flutterwave.com/v3';
  }

  // ========== PAYPAL METHODS ==========

  // Get PayPal access token
  async getPayPalAccessToken() {
    try {
      const auth = Buffer.from(`${this.paypalClientId}:${this.paypalSecret}`).toString('base64');
      const response = await axios.post(
        `${this.paypalApi}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      console.log('✅ PayPal authenticated successfully');
      return response.data.access_token;
    } catch (error) {
      console.error('❌ PayPal auth error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  // Send payout to PayPal account
  async paypalAccountPayout(withdrawal) {
    try {
      const accessToken = await this.getPayPalAccessToken();
      
      const payload = {
        sender_batch_header: {
          sender_batch_id: `batch_${Date.now()}`,
          email_subject: '💰 You received a payout from NexStream!',
          email_message: `You've received $${withdrawal.amount} USD from your NexStream earnings. It's now available in your PayPal account.`
        },
        items: [{
          recipient_type: 'EMAIL',
          amount: {
            value: withdrawal.amount.toString(),
            currency: withdrawal.currency || 'USD'
          },
          receiver: withdrawal.paypalEmail,
          note: withdrawal.note || 'Thank you for being part of NexStream!',
          sender_item_id: `item_${Date.now()}`
        }]
      };

      const response = await axios.post(
        `${this.paypalApi}/v1/payments/payouts`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `payout_${Date.now()}`
          }
        }
      );

      console.log(`✅ PayPal payout initiated to ${withdrawal.paypalEmail}`);
      return {
        success: true,
        status: 'processing',
        batchId: response.data.batch_header.payout_batch_id,
        reference: response.data.batch_header.sender_batch_header.sender_batch_id,
        message: 'PayPal payout initiated successfully'
      };
    } catch (error) {
      console.error('❌ PayPal payout error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'PayPal payout failed');
    }
  }

  // Send payout to PayPal card
  async paypalCardPayout(withdrawal) {
    try {
      const accessToken = await this.getPayPalAccessToken();
      
      const payload = {
        sender_batch_header: {
          sender_batch_id: `batch_${Date.now()}`,
          email_subject: '💳 Card payout from NexStream'
        },
        items: [{
          recipient_type: 'PHONE',
          amount: {
            value: withdrawal.amount.toString(),
            currency: withdrawal.currency || 'USD'
          },
          receiver: withdrawal.phoneNumber,
          note: 'Card payout from NexStream',
          sender_item_id: `item_${Date.now()}`
        }]
      };

      const response = await axios.post(
        `${this.paypalApi}/v1/payments/payouts`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        status: 'processing',
        batchId: response.data.batch_header.payout_batch_id,
        reference: response.data.batch_header.sender_batch_header.sender_batch_id,
        message: 'Card payout initiated'
      };
    } catch (error) {
      console.error('❌ PayPal card payout error:', error.response?.data || error.message);
      throw error;
    }
  }

  // ========== FLUTTERWAVE METHODS (Cards & Mobile Money) ==========

  // Flutterwave - Card Payout (International)
  async flutterwaveCardPayout(withdrawal) {
    try {
      // Format card details
      const [expiryMonth, expiryYear] = withdrawal.expiryDate.split('/');
      
      // Generate unique transaction reference
      const txRef = `card-payout-${Date.now()}-${withdrawal.userId}`;

      const payload = {
        card_number: withdrawal.cardNumber.replace(/\s/g, ''),
        cvv: withdrawal.cvv,
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        currency: withdrawal.currency || 'USD',
        amount: withdrawal.amount,
        email: withdrawal.email,
        fullname: withdrawal.fullName,
        tx_ref: txRef,
        enckey: this.flutterwaveEncryptionKey
      };

      // First, make the charge request
      const chargeResponse = await axios.post(
        `${this.flutterwaveApi}/charges?type=card`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const chargeData = chargeResponse.data;

      // Check if PIN is required
      if (chargeData.meta?.authorization?.mode === 'pin') {
        return {
          success: true,
          status: 'pending',
          requires: 'pin',
          flw_ref: chargeData.data.flw_ref,
          message: 'PIN required for this card'
        };
      }

      // Check if OTP is required
      if (chargeData.meta?.authorization?.mode === 'otp') {
        return {
          success: true,
          status: 'pending',
          requires: 'otp',
          flw_ref: chargeData.data.flw_ref,
          message: 'OTP required for this card'
        };
      }

      // If successful
      if (chargeData.status === 'success') {
        return {
          success: true,
          status: 'completed',
          transactionId: chargeData.data.id,
          reference: txRef,
          message: 'Card payout completed successfully'
        };
      }

      throw new Error(chargeData.message || 'Card payout failed');
    } catch (error) {
      console.error('❌ Flutterwave card payout error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Flutterwave - M-Pesa Payout (Tanzania)
  async flutterwaveMpesaPayout(withdrawal) {
    try {
      const txRef = `mpesa-payout-${Date.now()}-${withdrawal.userId}`;

      const payload = {
        account_bank: 'MPESA',
        account_number: withdrawal.phoneNumber,
        amount: withdrawal.amount,
        currency: withdrawal.currency || 'TZS',
        narration: `Payout from NexStream`,
        reference: txRef,
        beneficiary_name: withdrawal.fullName,
        meta: [{
          sender: 'NexStream Platform',
          sender_country: 'TZ',
          mobile_number: withdrawal.phoneNumber
        }]
      };

      const response = await axios.post(
        `${this.flutterwaveApi}/transfers`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          status: 'processing',
          transactionId: response.data.data.id,
          reference: txRef,
          message: 'M-Pesa payout initiated'
        };
      }

      throw new Error(response.data.message || 'M-Pesa payout failed');
    } catch (error) {
      console.error('❌ Flutterwave M-Pesa error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Flutterwave - Airtel Money Payout (Tanzania)
  async flutterwaveAirtelPayout(withdrawal) {
    try {
      const txRef = `airtel-payout-${Date.now()}-${withdrawal.userId}`;

      const payload = {
        account_bank: 'AIRTEL',
        account_number: withdrawal.phoneNumber,
        amount: withdrawal.amount,
        currency: withdrawal.currency || 'TZS',
        narration: `Payout from NexStream`,
        reference: txRef,
        beneficiary_name: withdrawal.fullName,
        meta: [{
          sender: 'NexStream Platform',
          sender_country: 'TZ',
          mobile_number: withdrawal.phoneNumber
        }]
      };

      const response = await axios.post(
        `${this.flutterwaveApi}/transfers`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          status: 'processing',
          transactionId: response.data.data.id,
          reference: txRef,
          message: 'Airtel Money payout initiated'
        };
      }

      throw new Error(response.data.message || 'Airtel payout failed');
    } catch (error) {
      console.error('❌ Flutterwave Airtel error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Flutterwave - Tigo Pesa Payout (Tanzania)
  async flutterwaveTigoPayout(withdrawal) {
    try {
      const txRef = `tigo-payout-${Date.now()}-${withdrawal.userId}`;

      const payload = {
        account_bank: 'TIGO',
        account_number: withdrawal.phoneNumber,
        amount: withdrawal.amount,
        currency: withdrawal.currency || 'TZS',
        narration: `Payout from NexStream`,
        reference: txRef,
        beneficiary_name: withdrawal.fullName,
        meta: [{
          sender: 'NexStream Platform',
          sender_country: 'TZ',
          mobile_number: withdrawal.phoneNumber
        }]
      };

      const response = await axios.post(
        `${this.flutterwaveApi}/transfers`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.flutterwaveSecretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          success: true,
          status: 'processing',
          transactionId: response.data.data.id,
          reference: txRef,
          message: 'Tigo Pesa payout initiated'
        };
      }

      throw new Error(response.data.message || 'Tigo payout failed');
    } catch (error) {
      console.error('❌ Flutterwave Tigo error:', error.response?.data || error.message);
      throw error;
    }
  }

  // ========== MAIN PROCESSOR ==========

  // Main method to process any payout
  async processPayout(withdrawal) {
    console.log(`🔄 Processing ${withdrawal.method} payout of $${withdrawal.amount} for user ${withdrawal.userId}`);

    try {
      let result;

      // Route to appropriate method based on payment type
      switch (withdrawal.method) {
        // PayPal methods
        case 'paypal':
          result = await this.paypalAccountPayout(withdrawal);
          break;
        case 'paypal_card':
          result = await this.paypalCardPayout(withdrawal);
          break;

        // Flutterwave Card methods
        case 'flutterwave_card_visa':
        case 'flutterwave_card_mastercard':
        case 'flutterwave_card_amex':
          result = await this.flutterwaveCardPayout(withdrawal);
          break;

        // Flutterwave Mobile Money (Tanzania)
        case 'mpesa':
        case 'flutterwave_mpesa':
          result = await this.flutterwaveMpesaPayout(withdrawal);
          break;
        case 'airtel':
        case 'flutterwave_airtel':
          result = await this.flutterwaveAirtelPayout(withdrawal);
          break;
        case 'tigo':
        case 'flutterwave_tigo':
          result = await this.flutterwaveTigoPayout(withdrawal);
          break;

        default:
          throw new Error(`Unsupported payout method: ${withdrawal.method}`);
      }

      console.log(`✅ Payout processed successfully: ${withdrawal.method}`);
      return result;

    } catch (error) {
      console.error(`❌ Payout failed for ${withdrawal.method}:`, error.message);
      throw error;
    }
  }

  // ========== UTILITY METHODS ==========

  // Validate card details
  validateCard(cardNumber, cvv, expiryDate) {
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      throw new Error('Invalid card number');
    }
    if (!cvv || cvv.length < 3) {
      throw new Error('Invalid CVV');
    }
    if (!expiryDate || !expiryDate.includes('/')) {
      throw new Error('Invalid expiry date (use MM/YY)');
    }
    return true;
  }

  // Verify payout status
  async verifyPayout(reference, method) {
    try {
      if (method.includes('paypal')) {
        const accessToken = await this.getPayPalAccessToken();
        const response = await axios.get(
          `${this.paypalApi}/v1/payments/payouts/${reference}`,
          {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }
        );
        return {
          status: response.data.batch_header.batch_status.toLowerCase(),
          details: response.data
        };
      } 
      else if (method.includes('flutterwave')) {
        const response = await axios.get(
          `${this.flutterwaveApi}/transfers/${reference}`,
          {
            headers: { 'Authorization': `Bearer ${this.flutterwaveSecretKey}` }
          }
        );
        return {
          status: response.data.data.status,
          details: response.data.data
        };
      }
    } catch (error) {
      console.error('❌ Verify payout error:', error.message);
      throw error;
    }
  }

  // Test PayPal connection
  async testPayPalConnection() {
    try {
      const token = await this.getPayPalAccessToken();
      return { success: true, message: '✅ PayPal connected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // Test Flutterwave connection
  async testFlutterwaveConnection() {
    try {
      const response = await axios.get(
        `${this.flutterwaveApi}/banks/TZ`,
        {
          headers: { 'Authorization': `Bearer ${this.flutterwaveSecretKey}` }
        }
      );
      return { success: true, message: '✅ Flutterwave connected successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new PayoutService();
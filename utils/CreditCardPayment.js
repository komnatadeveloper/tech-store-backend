const getPayment = async ({
  cardNumber,
  cvvCode,
  expiryDate,
  cardHolder
}) => {
  console.log('getPayment method FIRED');
  const delay = ms => new Promise(res => setTimeout(res, ms))
  await delay(1000);
  if ( !cardNumber ) {
    return {
      status: false,
      msg: 'No Card Number'
    };
  }
  if (typeof (cardNumber) !== 'string' ) {
    return {
      status: false,
      msg: 'Invalid Card Number'
    };
  }
  if ( cardNumber.length !== 19 ) {
    return {
      status: false,
      msg: 'Invalid Card Number'
    };
  }
  // CVV CODE
  if (!cvvCode) {
    return {
      status: false,
      msg: 'No CVV Code'
    };
  }
  if (typeof (cvvCode) !== 'string') {
    return {
      status: false,
      msg: 'Invalid CVV Code'
    };
  }
  if ( 
    cvvCode.length !== 3
    && cvvCode.length !== 4    
    ) {
    return {
      status: false,
      msg: 'Invalid CVV Code'
    };
  }
  // Expiry Date
  if (!expiryDate) {
    return {
      status: false,
      msg: 'No Expiry Date'
    };
  }
  if (typeof (expiryDate) !== 'string') {
    return {
      status: false,
      msg: 'Invalid Expiry Date'
    };
  }
  if (
    expiryDate.length !== 5
  ) {
    return {
      status: false,
      msg: 'Invalid Expiry Date'
    };
  }
  // Card Holder
  if (!cardHolder) {
    return {
      status: false,
      msg: 'No Card Holder'
    };
  }
  if (typeof (cardHolder) !== 'string') {
    return {
      status: false,
      msg: 'Invalid Card Holder'
    };
  }
  if (
    cardHolder.length < 2
  ) {
    return {
      status: false,
      msg: 'Invalid Card Holder'
    };
  }
  await delay(2000);
  return {
    status: true,
    msg: 'Payment has been completed successfully!'
  };
}

module.exports = {
  getPayment
};
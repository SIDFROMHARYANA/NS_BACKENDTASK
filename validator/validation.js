
  const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  
  const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length == 0) return false;
    if (typeof value === "string") return true;
  };
  
  const isValidId = function (value) {
    const regexForId = /^[A-Z]{3}[0-9]{7}$/
    return regexForId.test(value)
  }

  const isValidEmail = function (value) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    return regexForEmail.test(value)
  }
  
  
   
  
  const isValidPassword = function (password) {
    if (/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) return true
  }
   
  //============================
  
  
  
  module.exports = {
    
    isValidRequestBody,
    isValid,
    isValidId,
    isValidEmail,
    isValidPassword,
    
  }
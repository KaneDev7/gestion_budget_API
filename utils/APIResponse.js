module.exports = class APIResponse {
    constructor(status, data, message = null) {
      this.status = status;
      this.data = data;
      this.message = message;
    }
  
    static success(data, message = null) {
      return new APIResponse('success', data, message);
    }
  
    static error(message, data = null) {
      return new APIResponse('error', data, message);
    }
  
    toJSON() {
      return {
        status: this.status,
        data: this.data,
        message: this.message,
      };
    }
  }
  



  
class apiResponse {
  constructor(status,data = null, message="Operation successful") {
    this.status = status;
    this.message = message;
    this.data = data;
    this.success=status<400

  }
}

export default apiResponse;
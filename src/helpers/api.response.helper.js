class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.statusCode = statusCode
        this.ok = statusCode >= 200 && statusCode < 300
        this.message = message
        if (data) {
            this.data = data
        }
    }
}

export default ApiResponse
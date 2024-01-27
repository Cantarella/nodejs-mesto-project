class Error401 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    if (message) this.message = message;
  }
}

export default Error401;

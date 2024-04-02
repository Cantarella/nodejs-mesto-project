class Error409 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 409;
  }
}

export default Error409;

class Error401 extends Error {
  statusCode: number;

  message = 'необходима авторизация';

  constructor(message: string) {
    super(message);
    this.statusCode = 401;
    if (message) this.message = message;
  }
}

export default Error401;

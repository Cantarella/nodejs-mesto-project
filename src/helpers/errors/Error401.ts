import * as http2 from 'http2';

class Error401 extends Error {
  statusCode: number;

  message = 'необходима авторизация';

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_UNAUTHORIZED;
    if (message) this.message = message;
  }
}

export default Error401;

import * as http2 from 'http2';

class Error404 extends Error {
  statusCode: number;

  message = 'запрошенный ресурс не найден';

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
    if (message) this.message = message;
  }
}

export default Error404;

import * as http2 from 'http2';

class Error400 extends Error {
  statusCode: number;

  message = 'Некорректно сконструирован запрос';

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_BAD_REQUEST;
    if (message) this.message = message;
  }
}

export default Error400;

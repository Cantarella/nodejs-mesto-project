import * as http2 from 'http2';

class Error400 extends Error {
  statusCode: number;

  message = 'Ошибка сервера';

  constructor(message :string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
    if (message) this.message = message;
  }
}

export default Error400;

import * as http2 from 'http2';

class Error404 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_NOT_FOUND;
  }
}

export default Error404;

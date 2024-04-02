import * as http2 from 'http2';

class Error403 extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = http2.constants.HTTP_STATUS_FORBIDDEN;
  }
}

export default Error403;

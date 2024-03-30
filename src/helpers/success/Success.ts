import * as http2 from 'http2';

class Success201 {
  statusCode: number;

  data = 'Запись успешно создана';

  constructor(data: any) {
    this.statusCode = http2.constants.HTTP_STATUS_CREATED;
    if (data) this.data = data;
  }
}

export default Success201;

class Error400 extends Error {
  statusCode: number;

  message = 'Ошибка сервера';

  constructor(message :string) {
    super(message);
    this.statusCode = 500;
    if (message) this.message = message;
  }
}

export default Error400;

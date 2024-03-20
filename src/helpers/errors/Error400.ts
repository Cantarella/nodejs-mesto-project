class Error400 extends Error {
  statusCode: number;

  message = 'Некорректно сконструирован запрос';

  constructor(message: string) {
    super(message);
    this.statusCode = 400;
    if (message) this.message = message;
  }
}

export default Error400;

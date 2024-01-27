class Error404 extends Error {
  statusCode: number;

  message = 'карточка или пользователь не найден';

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
    if (message) this.message = message;
  }
}

export default Error404;

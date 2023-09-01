export class ResponseDto<T> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(data: T) {}

  static create<T>(data: T | T[]) {
    if (Array.isArray(data)) {
      return data.map(d => new this(d));
    }

    return new this(data);
  }
}

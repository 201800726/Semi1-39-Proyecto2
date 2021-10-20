export class MessageModel {
  constructor(
    public message?: string,
    public time?: string,
    public date?: string,
    public emmiter?: number,
    public emisor?: string
  ) {}
}

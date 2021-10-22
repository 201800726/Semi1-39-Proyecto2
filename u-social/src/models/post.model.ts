export class PostModel {
  constructor(
    public id_publication?: number,
    public username?: string,
    public user_picture?: string,
    public date?: string,
    public comment?: string,
    public picture?: string,
    public pictureB64?: string,
    public tags?: []
  ) {}
}

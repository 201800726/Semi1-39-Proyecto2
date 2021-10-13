export class UserModel {
  constructor(
    public id_user?: number,
    public name?: string,
    public username?: string,
    public e_mail?: string,
    public profile_picture?: string,
    public password?: string,
    public files?: number,
    public friends?: number
  ) {}
}

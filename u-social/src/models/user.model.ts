export class UserModel {
  constructor(
    public name?: string,
    public username?: string,
    public e_mail?: string,
    public profile_picture?: string,
    public password?: string,
    public posts?: number,
    public friends?: number,
    public bot_mode?: boolean
  ) {}
}

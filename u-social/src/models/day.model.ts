import { MessageModel } from './message.model';

export class DayModel {
  constructor(public messages: MessageModel[], public date?: string) {}
}

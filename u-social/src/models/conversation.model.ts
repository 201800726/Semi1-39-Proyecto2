import { DayModel } from './day.model';

export class ConversationModel {
  constructor(
    public days: DayModel[],
    public emmiter?: string,
    public receiver?: string
  ) {}
}

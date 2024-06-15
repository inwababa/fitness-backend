export class CreateMembershipDto {
    firstName: string;
    lastName: string;
    membershipType: string;
    startDate: Date;
    dueDate: Date;
    totalAmount: number;
    email: string;
    isFirstMonth: boolean;
  }
  
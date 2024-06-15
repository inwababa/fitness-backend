import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleModule } from '@nestjs/schedule';
import { BillingService } from '../src/billing/billing.service';
import { EmailService } from '../src/email.service';
import { Membership } from '../src/membership/entities/membership.entity';
import { AddOn } from '../src/membership/entities/adds-on.entity';

describe('BillingService - Cron Job', () => {
  let billingService: BillingService;
  let emailService: EmailService;

  const mockMemberships: Membership[] = [
    {
      membershipId: 1,
      firstName: 'John',
      lastName: 'Doe',
      membershipType: 'annual',
      startDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 days from now
      totalAmount: 100,
      email: 'john.doe@example.com',
      isFirstMonth: true,
      add_ons: [],
      invoices: [],
    },
    {
      membershipId: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      membershipType: 'monthly',
      startDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days from now
      totalAmount: 50,
      email: 'jane.doe@example.com',
      isFirstMonth: false,
      add_ons: [
        {
          addOnId: 1,
          membership: {} as Membership,
          serviceName: 'Towel Rental',
          monthlyAmount: 10,
          dueDate: new Date(), // Today
        },
      ],
      invoices: [],
    },
  ];

  const mockBillingService = {
    getMembershipsWithUpcomingDueDates: jest.fn().mockResolvedValue(mockMemberships),
    createFirstMonthInvoice: jest.fn().mockResolvedValue({}),
    createMonthlyInvoice: jest.fn().mockResolvedValue({}),
  };

  const mockEmailService = {
    sendFirstMonthEmail: jest.fn().mockResolvedValue(true),
    sendMonthlyEmail: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        { provide: BillingService, useValue: mockBillingService },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    billingService = module.get<BillingService>(BillingService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should handle the cron job for first month memberships and add-ons', async () => {
    jest.spyOn(global.Date, 'now').mockImplementation(() => new Date().valueOf());

    await billingService.handleCron();

    expect(mockBillingService.getMembershipsWithUpcomingDueDates).toHaveBeenCalledWith(7);
    expect(mockBillingService.createFirstMonthInvoice).toHaveBeenCalledWith(mockMemberships[0]);
    expect(mockEmailService.sendFirstMonthEmail).toHaveBeenCalledWith(mockMemberships[0], {});

    expect(mockBillingService.createMonthlyInvoice).toHaveBeenCalledWith(mockMemberships[1], mockMemberships[1].add_ons[0]);
    expect(mockEmailService.sendMonthlyEmail).toHaveBeenCalledWith(mockMemberships[1], mockMemberships[1].add_ons[0], {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});



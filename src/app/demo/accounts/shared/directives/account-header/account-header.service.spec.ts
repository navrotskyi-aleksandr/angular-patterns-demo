import { TestBed, inject, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserSessionService } from '../../../../../demo-common/services/user-session.service';
import { IAccount } from '../../models/account.models';
import { AccountDataService } from '../../services/account-data.service';
import { AccountHeaderService } from './account-header.service';
import { UtilitiesService } from '../../../../../framework/services/utilities.service';

describe('AccountHeaderService', () => {

    const account = {
        accountName: 'Test Account'
    };
    let service: AccountHeaderService;

    class MockAccountDataService {
        currentAccount = {
            accountCode: 'ABC123',
            accountName: 'Test Account',
            accountType: 'Personal',
            accountStatus: 'Active'
        };
        accountChanged = of();
        userSelectedAnotherAccount(): boolean {
            return false;
        }
        getAccount(): Promise<IAccount> {
            return new Promise<IAccount>((resolve) => {
                resolve(<IAccount>account);
            });
        }
        userUpdatedAccountName(name: string) {
        }
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AccountHeaderService,
                UserSessionService,
                UtilitiesService,
                {
                    provide: AccountDataService,
                    useClass: MockAccountDataService
                }
            ]
        });
    });

    beforeEach(inject([AccountHeaderService], (s: AccountHeaderService) => {
        service = s;
    }));

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('can initialize', async () => {
        const currentAccount = await service.initialize();
        expect(currentAccount).toBeDefined();
    });

    it('can initialize with same account selected', async(() => {
        service.initialize().then((currentAccount) => {
            expect(currentAccount.accountName).toBe(account.accountName);
        }).catch(error => {
            expect(error).toBeNull();
        });
    }));

    it('can update account name', async(() => {
        service.initialize().then((currentAccount) => {
            service.updateAccountName('new name');
            expect(service.accountName).toBe('new name');
        }).catch(error => {
            expect(error).toBeNull();
        });
    }));
});

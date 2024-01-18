import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ChildComponent3Component } from './child-component3.component';
import { UtilitiesService } from '../../../framework/services/utilities.service';
import { TestInjector } from '../../../demo-common/testing/testing-helpers';
import { IChild3Entity } from '../shared/models/child3-entity.models';

const child3: IChild3Entity = {
  transactionIdentifier: {
    id: 0
  },
  accountCode: '1',
  adminYearEndDate: new Date('2017-03-26'),
  statementYearEndDate: new Date('2017-03-26'),
  statementFrequencyPerYear: 365,
  processingFrequencyPerYear: 4,
  billingFrequencyPerYear: 4,
  adminFrequencyPerYear: 4,
  timePeriodList: []
};

class MockActivatedRoute extends ActivatedRoute {
  data = of({
    child3: UtilitiesService.cloneDeep(child3)
  });
}

const mockChild3DataService = jasmine.createSpyObj(
  'Child3DataService', ['getChild3']);

  mockChild3DataService.getChild3.and.returnValue(
  new Promise<IChild3Entity>((resolve) => {
      resolve(child3);
}));

describe('ChildComponent3Component', () => {
  let component: ChildComponent3Component;
  beforeAll(() => {
    TestInjector.setInjector();
  });

  beforeEach(() => {
    component = new ChildComponent3Component(
      new MockActivatedRoute(),
      mockChild3DataService);
  });

  it('should be created', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      expect(component).toBeTruthy();
    });
    component.ngOnInit();
  }));

  it('can toggle edit mode', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      component.toggleEditMode(true);
      expect(component.editMode).toBe(true);
    });
    component.ngOnInit();
  }));

  it('can save frequency data ', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      component.toggleEditMode(true);
      component.child3.statementFrequencyPerYear = 4;
      component.save().then(() => {
        expect(component.child3.statementFrequencyPerYear).toEqual(4);
      });
    });
    component.ngOnInit();
  }));

  it('can undo edit mode', async(() => {
    component.componentLoadingComplete.subscribe(() => {
      component.toggleEditMode(true);
      component.child3.processingFrequencyPerYear = 365;
      component.toggleEditMode(false);
      expect(component.editMode).toBe(false);
    });
    component.ngOnInit();
  }));
});

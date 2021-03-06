import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { AuthorizationProvider, AuthorizationService } from '../../../services/authorization.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import 'rxjs/add/observable/of';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppMaterialModule } from '../../../app.material.module';

describe('LoginComponent', () => {

  describe('login()', () => {

    let component: LoginComponent;
    let authorizationServiceMock: AuthorizationService;
    let routerMock: Router;

    beforeEach(() => {
      authorizationServiceMock = jasmine.createSpyObj('authorizationService', {
        login: Observable.of(null),
      });
      routerMock = jasmine.createSpyObj('Router', {
        navigate: Promise.resolve(),
      });
      component = new LoginComponent(authorizationServiceMock, routerMock);
    });

    it('should call service and navigate to / when login is successful', () => {
      // Given
      const username = 'username';
      const password = 'password';
      const expectedProvider = AuthorizationProvider.LDAP;
      const expectedNavigation = ['/'];
      component.username = username;
      component.password = password;

      // When
      component.login();

      // Then
      expect(authorizationServiceMock.login).toHaveBeenCalledWith(expectedProvider, username, password);
      expect(routerMock.navigate).toHaveBeenCalledWith(expectedNavigation);
    });

    it('should call service and not navigate to / when login is not successful', () => {
      // Given
      const username = 'username';
      const password = 'password';
      const expectedError = new Error('error');
      const expectedProvider = AuthorizationProvider.LDAP;
      authorizationServiceMock.login = jasmine.createSpy('login').and.returnValue(Observable.throw(expectedError));
      component.username = username;
      component.password = password;

      // When
      component.login();

      // Then
      expect(authorizationServiceMock.login).toHaveBeenCalledWith(expectedProvider, username, password);
      expect(routerMock.navigate).toHaveBeenCalledTimes(0);
      expect(component.errorMessage).toBe(expectedError.message);
    });

  });

  describe('template', () => {

    let fixture: ComponentFixture<LoginComponent>;
    let comp: LoginComponent;
    let de: DebugElement;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [
          LoginComponent,
        ],
        imports: [
          FormsModule,
          NoopAnimationsModule,
          AppMaterialModule,
          RouterTestingModule,
        ],
        providers: [
          {
            provide: AuthorizationService,
            useValue: { login() {} },
          },
        ],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(LoginComponent);
      de = fixture.debugElement;
      comp = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create the component', async(() => {
      expect(fixture).toBeTruthy();
    }));

    it('should call login() on submit', async(() => {
      // Given
      comp.login = jasmine.createSpy('login');
      const submitButton = de.query(By.css('button[type=submit]')).nativeElement;

      // When
      submitButton.click();

      // Then
      expect(comp.login).toHaveBeenCalled();
    }));

  });

});

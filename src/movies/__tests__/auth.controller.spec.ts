import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from '../../auth/guards/user-role/user-role.guard';
import { ValidRoles } from '../../auth/interfaces/valid-roles';

interface MockReflector extends Reflector {
    get: jest.Mock;
    // Añade más métodos si es necesario
  }
  
  describe('UserRoleGuard', () => {
    let guard: UserRoleGuard;
    let reflector: MockReflector;
  
    beforeEach(() => {
      // Creamos un mock para reflector con el método mockReturnValue
      reflector = {
        get: jest.fn(),
        mockReturnValue: jest.fn(),
      } as unknown as MockReflector;
      guard = new UserRoleGuard(reflector);
    });

  it('should allow access if no roles are required', async () => {
    reflector.get.mockReturnValue(undefined);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'administrator' }, // Simula un usuario administrador
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should allow access if user role matches required role', async () => {
    reflector.get.mockReturnValue([ValidRoles.administrator]);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'administrator' }, // Simula un usuario administrador
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(mockContext);

    expect(result).toBe(true);
  });

  it('should deny access if user role does not match required role', async () => {
    reflector.get.mockReturnValue([ValidRoles.administrator]);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'regular' }, // Simula un usuario regular
        }),
      }),
      getHandler: jest.fn(),
    } as unknown as ExecutionContext;

    try {
      await guard.canActivate(mockContext);
    } catch (error) {
      expect(error.status).toBe(403);
    }
  });
});

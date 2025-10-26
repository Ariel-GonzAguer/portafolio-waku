# Guía Completa para Crear Tests de Calidad

Esta guía proporciona principios universales y mejores prácticas para crear tests unitarios efectivos, basados en patrones probados que funcionan en proyectos React/TypeScript modernos.

## 🎯 Filosofía del Testing

### ¿Por qué Testear?

- **Confianza**: Los tests dan certeza de que el código funciona correctamente
- **Mantenibilidad**: Facilitan refactorizaciones sin miedo a romper funcionalidad
- **Documentación**: Los tests sirven como ejemplos vivos del comportamiento esperado
- **Detección Temprana**: Encuentran bugs antes de que lleguen a producción

### Principios Fundamentales

- **Tests como Especificación**: Los tests definen qué debe hacer el código
- **Primero lo Simple**: Empieza con tests básicos antes de casos complejos
- **Aislamiento**: Cada test debe ser independiente
- **Rapidez**: Los tests deben ejecutarse rápido para feedback inmediato

## 🛠️ Stack de Testing Recomendado

### Framework Principal

- **Vitest**: Moderno, rápido, excelente integración con Vite y bundlers modernos
- **Jest**: Madura, amplia comunidad, buena para proyectos legacy

### Librerías de Testing para React

- **@testing-library/react**: Enfoque en testing desde la perspectiva del usuario
- **@testing-library/jest-dom**: Matchers adicionales para assertions del DOM
- **@testing-library/user-event**: Simulación realista de interacciones de usuario

### Utilidades Adicionales

- **msw (Mock Service Worker)**: Para testing de APIs HTTP
- **@testing-library/react-hooks**: Para testing de hooks personalizados

## 📋 Estructura de un Test Efectivo

### Patrón AAA (Arrange, Act, Assert)

```typescript
describe('MiComponente', () => {
  it('debe manejar clicks correctamente', () => {
    // Arrange: Preparar el estado inicial
    const mockOnClick = vi.fn();
    render(<MiComponente onClick={mockOnClick} />);

    // Act: Ejecutar la acción que queremos testear
    fireEvent.click(screen.getByRole('button'));

    // Assert: Verificar el resultado esperado
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
```

### Nombres Descriptivos

```typescript
// ✅ Bueno: Describe comportamiento esperado
describe('Usuario autenticado', () => {
  it('puede acceder a rutas protegidas', () => {
    /* */
  });
  it('ve su información de perfil', () => {
    /* */
  });
});

// ❌ Malo: Describe implementación
describe('AuthGuard', () => {
  it('llama useAuth', () => {
    /* */
  });
  it('renderiza children cuando token existe', () => {
    /* */
  });
});
```

## 🎭 Estrategias de Mocking

### 1. Librerías Externas

```typescript
// Mock completo de una librería
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock parcial (spy)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});
```

### 2. APIs del Navegador

```typescript
// localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Fetch API
global.fetch = vi.fn();

// Geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn(),
  },
  writable: true,
});
```

### 3. Contextos y Providers

```typescript
// Mock de Context Provider
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockValue = {
    user: { id: '1', name: 'Test User' },
    login: vi.fn(),
    logout: vi.fn(),
  };

  return (
    <AuthContext.Provider value={mockValue}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. Stores de Estado (Zustand, Redux, etc.)

```typescript
vi.mock('../store/useAuthStore', () => ({
  default: vi.fn(() => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
  })),
}));
```

## 🔍 Queries de Testing Library

### Jerarquía de Preferencia

```typescript
// 1. getByRole - Elementos interactivos
const button = screen.getByRole('button', { name: /guardar/i });
const checkbox = screen.getByRole('checkbox', { name: /aceptar términos/i });

// 2. getByLabelText - Inputs asociados a labels
const emailInput = screen.getByLabelText(/correo electrónico/i);

// 3. getByPlaceholderText - Inputs con placeholder
const searchInput = screen.getByPlaceholderText('Buscar productos...');

// 4. getByText - Texto visible
const title = screen.getByText('Bienvenido');

// 5. getByTestId - Solo cuando es estrictamente necesario
const chart = screen.getByTestId('revenue-chart');
```

### Queries Asíncronas

```typescript
// Esperar a que aparezca
await screen.findByText('Datos cargados');

// Esperar a que desaparezca
await waitFor(() => {
  expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
});
```

## 🚀 Testing de Componentes React

### Componentes Simples

```typescript
describe('Button', () => {
  it('renderiza children correctamente', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('maneja clicks', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('aplica variant class correctamente', () => {
    render(<Button variant="primary">Test</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Componentes con Estado

```typescript
describe('Counter', () => {
  it('incrementa contador al hacer click', () => {
    render(<Counter />);

    const button = screen.getByRole('button', { name: /incrementar/i });
    const display = screen.getByTestId('counter-value');

    expect(display).toHaveTextContent('0');

    fireEvent.click(button);
    expect(display).toHaveTextContent('1');
  });

  it('no permite valores negativos', () => {
    render(<Counter />);

    const decrementButton = screen.getByRole('button', { name: /decrementar/i });
    const display = screen.getByTestId('counter-value');

    fireEvent.click(decrementButton);
    expect(display).toHaveTextContent('0'); // No debería bajar de 0
  });
});
```

### Formularios

```typescript
describe('LoginForm', () => {
  it('envía credenciales correctamente', async () => {
    const mockOnSubmit = vi.fn();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Llenar campos
    fireEvent.change(screen.getByLabelText(/usuario/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/contraseña/i), {
      target: { value: 'password123' },
    });

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
      });
    });
  });

  it('muestra errores de validación', async () => {
    render(<LoginForm onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    expect(await screen.findByText(/email requerido/i)).toBeInTheDocument();
  });
});
```

## ⚡ Testing de Hooks Personalizados

### useCounter Hook

```typescript
describe('useCounter', () => {
  it('inicializa con valor por defecto', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('inicializa con valor personalizado', () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it('incrementa contador', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

### useAsync Hook

```typescript
describe('useAsync', () => {
  it('maneja estado de carga', async () => {
    const mockAsyncFunction = vi.fn().mockResolvedValue('success');

    const { result } = renderHook(() => useAsync(mockAsyncFunction));

    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe('success');
    });
  });
});
```

## 🔧 Testing de Utilidades y Funciones

### Funciones Puras

```typescript
describe('formatCurrency', () => {
  it('formatea números correctamente', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(-100)).toBe('-$100.00');
  });

  it('maneja diferentes monedas', () => {
    expect(formatCurrency(100, 'EUR')).toBe('€100.00');
    expect(formatCurrency(100, 'GBP')).toBe('£100.00');
  });

  it('redondea decimales correctamente', () => {
    expect(formatCurrency(123.456)).toBe('$123.46');
    expect(formatCurrency(123.454)).toBe('$123.45');
  });
});
```

### Validadores

```typescript
describe('emailValidator', () => {
  describe('emails válidos', () => {
    const validEmails = [
      'user@example.com',
      'test.email+tag@gmail.com',
      'user@subdomain.example.com',
    ];

    it.each(validEmails)('acepta %s', email => {
      expect(emailValidator(email)).toBe(true);
    });
  });

  describe('emails inválidos', () => {
    const invalidEmails = ['invalid', '@example.com', 'user@', 'user.example.com'];

    it.each(invalidEmails)('rechaza %s', email => {
      expect(emailValidator(email)).toBe(false);
    });
  });
});
```

## 🌐 Testing de APIs e Integración

### Testing con MSW

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.json([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ]));
  }),
);

describe('UserList', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('carga y muestra usuarios', async () => {
    render(<UserList />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });
});
```

## 📊 Cobertura y Métricas

### Tipos de Tests por Pirámide

```
          E2E Tests (pocos)
        /       \
  Integration    UI Tests
      |           |
   Unit Tests (muchos)
```

### Cobertura Recomendada

- **Unit Tests**: 70-80% (funciones, componentes, hooks)
- **Integration Tests**: 15-20% (interacción entre módulos)
- **E2E Tests**: 5-10% (flujos críticos de usuario)

### Métricas a Monitorear

- Cobertura de código
- Tiempo de ejecución de tests
- Flaky tests (tests que fallan aleatoriamente)
- Tests que no pasan en CI/CD

## 🐛 Debugging y Troubleshooting

### Tests que Fallan Intermitentemente

```typescript
// Usar waitFor con timeout apropiado
await waitFor(() => expect(screen.getByText('Success')).toBeInTheDocument(), { timeout: 3000 });

// Evitar race conditions
it('handles async operation', async () => {
  const promise = screen.findByText('Loaded');
  fireEvent.click(button);
  await promise;
});
```

### Mocks que no Funcionan

```typescript
// Limpiar mocks entre tests
beforeEach(() => {
  vi.clearAllMocks();
});

// Verificar que mocks están configurados
it('uses correct mock', () => {
  expect(vi.isMockFunction(mockFunction)).toBe(true);
});
```

### Componentes que no se Renderizan

```typescript
// Verificar que todos los providers necesarios están presentes
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>
    <Router>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Router>
  </ThemeProvider>
);

render(<MyComponent />, { wrapper: TestWrapper });
```

## 🚀 Mejores Prácticas Avanzadas

### Test Factories

```typescript
// Factory para crear datos de prueba consistentes
const createUser = (overrides = {}) => ({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  ...overrides,
});

describe('UserProfile', () => {
  it('muestra información del usuario', () => {
    const user = createUser({ name: 'Jane Doe' });
    render(<UserProfile user={user} />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  });
});
```

### Custom Render Functions

```typescript
// Render function reutilizable con providers comunes
const renderWithProviders = (component: React.ReactElement) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(component, { wrapper: Wrapper });
};
```

### Snapshot Testing (con Moderación)

```typescript
it('matches snapshot', () => {
  const { container } = render(<MyComponent />);
  expect(container.firstChild).toMatchSnapshot();
});
```

## 📚 Recursos y Herramientas

### Librerías Recomendadas

- **Vitest**: https://vitest.dev/
- **Testing Library**: https://testing-library.com/
- **MSW**: https://mswjs.io/

### Cursos y Tutoriales

- **Testing JavaScript** (Kent C. Dodds)
- **React Testing Library** documentación oficial
- **Vitest** getting started guide

### Comunidad

- **Kent C. Dodds** blog y cursos
- **Testing Library** Discord
- **Vitest** GitHub discussions

---

## 🎯 Checklist para Tests de Calidad

- [ ] **Nombres descriptivos** que explican comportamiento, no implementación
- [ ] **Aislamiento** - cada test es independiente
- [ ] **Rapidez** - tests ejecutan en menos de 100ms cada uno
- [ ] **Queries apropiadas** - usa getByRole antes que getByTestId
- [ ] **Mocks realistas** - simulan comportamiento real, no stubs vacíos
- [ ] **Casos edge** - prueba valores límite, errores, casos vacíos
- [ ] **Assertions específicas** - evita assertions genéricas como toBeTruthy()
- [ ] **Setup limpio** - beforeEach/afterEach para estado consistente
- [ ] **Cobertura balanceada** - foco en lógica crítica, no en getters/setters triviales

_Recuerda: Los tests son código que se mantiene. Escribe tests que sean fáciles de entender, modificar y ejecutar._

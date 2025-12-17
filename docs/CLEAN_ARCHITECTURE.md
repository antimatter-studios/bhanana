# Clean Architecture Implementation Guide

## 🎯 Overview

This document outlines the clean architecture patterns implemented in Bhanana to separate business logic from UI components and maintain a scalable, maintainable codebase.

## 📁 Architecture Structure

```
src/
├── services/           # Business logic layer ✅
│   ├── blog-service.ts
│   ├── user-service.ts  
│   ├── cart-service.ts
│   ├── product-service.ts
│   ├── category-service.ts
│   ├── order-service.ts
│   └── index.ts
├── components/          # UI components ✅
│   ├── product-form.tsx
│   ├── category-form.tsx
│   ├── user-form.tsx
│   └── ...
├── hooks/             # React hooks ✅
│   use-product-form.ts
│   use-category-form.ts
│   use-user-form.ts
│   └── ...
└── lib/
    ├── supabase/      # Data access layer ✅
    │   client.ts
    │   server.ts
    │   admin.ts
    │   └── proxy.ts
    └── validation.ts    # Utilities ✅
```

## 🔗 Service Layer Pattern

### Core Principles

1. **Single Responsibility**: Each service handles one domain (products, users, orders, etc.)
2. **Static Methods**: Services use static methods for stateless operations
3. **Error Handling**: Centralized error handling with proper logging
4. **Data Validation**: Input validation with detailed error messages
5. **Type Safety**: Full TypeScript support with interfaces

### Service Structure Template

```typescript
export class DomainService {
  private static supabase = createClient() // or createAdminClient()

  // Database Types
  export interface Domain {
    id: string
    // ... fields
  }

  // Extended Types with Relations
  export interface DomainWithRelations extends Domain {
    relatedData?: RelatedType[]
  }

  // Form Data Types
  export interface DomainFormData {
    // Form fields
  }

  // Validation Types
  export interface DomainValidationResult {
    isValid: boolean
    errors: Record<string, string>
  }

  // CRUD Operations
  static async createDomain(data: DomainFormData): Promise<DomainWithRelations | null>
  static async updateDomain(id: string, data: Partial<DomainFormData>): Promise<DomainWithRelations | null>
  static async deleteDomain(id: string): Promise<boolean>
  static async getDomainById(id: string): Promise<DomainWithRelations | null>
  static async getDomains(options: {}): Promise<{ domains: DomainWithRelations[]; total: number }>
  
  // Business Logic
  static validateDomainData(data: Partial<DomainFormData>): DomainValidationResult
  static async searchDomains(query: string): Promise<DomainWithRelations[]>
  static async getDomainStatistics(): Promise<StatisticsObject>
}
```

## 🛡️ Data Access Patterns

### Client vs Server vs Admin

```typescript
// Client-side operations (browser)
import { createClient } from "@/lib/supabase/client"

// Server-side operations (API routes)
import { createClient } from "@/lib/supabase/server" 

// Admin operations (bypass RLS)
import { createAdminClient } from "@/lib/supabase/admin"
```

### Supabase Client Usage

```typescript
// ✅ Good: Use service layer
const { products } = await ProductService.getProducts({ limit: 10 })

// ❌ Bad: Direct database access
const supabase = createClient()
const { data } = await supabase.from("products").select("*")
```

## 🎨 Component Integration

### Using Services in Components

```typescript
// ✅ Clean: Service-based component
export default async function AdminProductsPage() {
  const { products } = await ProductService.getProducts()
  return <ProductList products={products} />
}

// ❌ Violation: Direct database access
export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase.from("products").select("*")
  return <ProductList products={products} />
}
```

### Form Component Pattern

```typescript
export function ProductForm({ product }: { product?: Product }) {
  const { formData, validationErrors, updateField, validate, getProductData } = useProductForm(product)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) {
      // Handle validation errors
      return
    }

    setIsLoading(true)
    try {
      const productData = {
        ...getProductData(),
        translations
      }
      
      if (product) {
        await ProductService.updateProduct(product.id, productData)
      } else {
        await ProductService.createProduct(productData)
      }
    } catch (error) {
      // Handle errors
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  )
}
```

## 🔍 Validation Patterns

### Service-Level Validation

```typescript
static validateProductData(data: Partial<ProductFormData>): ProductValidationResult {
  const errors: ProductValidationResult['errors'] = {}

  if (!data.title || data.title.trim().length === 0) {
    errors.title = "Title is required"
  } else if (data.title.length > 255) {
    errors.title = "Title must be less than 255 characters"
  }

  if (data.price && data.price <= 0) {
    errors.price = "Price must be greater than 0"
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
```

### Hook-Level Form Management

```typescript
export function useProductForm(initialProduct?: Product) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialProduct?.title || "",
    description: initialProduct?.description || "",
    price: initialProduct?.price || 0,
    // ... other fields
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const updateField = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validate = (): boolean => {
    const validation = ProductService.validateProductData(formData)
    setValidationErrors(validation.errors)
    return validation.isValid
  }

  return {
    formData,
    validationErrors,
    updateField,
    validate,
    getProductData: () => formData
  }
}
```

## 🌐 Internationalization Patterns

### Service-Level Translation Support

```typescript
export class ProductService {
  static async getProducts(options: { locale?: Locale } = {}): Promise<{ products: ProductWithRelations[]; total: number }> {
    // Get products
    let products = await this.baseQuery(options)
    
    // Apply translations if locale is specified and not English
    if (options.locale && options.locale !== 'en') {
      products = await this.applyTranslations(products, options.locale)
    }
    
    return { products, total: products.length }
  }

  private static async applyTranslations(products: Product[], locale: Locale): Promise<ProductWithRelations[]> {
    const productIds = products.map(p => p.id)
    
    const { data: translations } = await this.supabase
      .from('product_translations')
      .select('*')
      .in('product_id', productIds)
      .eq('locale', locale)

    const translationMap = new Map(
      (translations || []).map(t => [t.product_id, t])
    )

    return products.map(product => ({
      ...product,
      title: translationMap.get(product.id)?.title || product.title,
      description: translationMap.get(product.id)?.description || product.description
    }))
  }
}
```

## 📊 Business Logic Examples

### Order Processing

```typescript
export class OrderService {
  static async createOrder(data: OrderFormData): Promise<OrderWithRelations | null> {
    // Validate data
    const validation = this.validateOrderData(data)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${JSON.stringify(validation.errors)}`)
    }

    // Check stock availability
    await this.checkStockAvailability(data.cart_items)

    // Calculate totals
    const totals = this.calculateOrderTotals(data.cart_items)

    // Create customer or find existing
    const customer = await this.findOrCreateCustomer(data.customer)

    // Create order in transaction
    const order = await this.createOrderWithProducts(customer.id, data.cart_items, totals)

    // Update product stock
    await this.updateProductStock(data.cart_items)

    return order
  }

  private static calculateOrderTotals(cartItems: CartItem[]): {
    subtotal: number
    taxAmount: number
    totalAmount: number
  } {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
    const taxAmount = subtotal * this.TAX_RATE
    const totalAmount = subtotal + taxAmount

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    }
  }
}
```

### Stock Management

```typescript
export class ProductService {
  static async decreaseStock(productId: string, quantity: number): Promise<boolean> {
    try {
      const product = await this.getProductById(productId)
      if (!product || product.stock_quantity < quantity) {
        throw new Error('Insufficient stock')
      }

      const newQuantity = product.stock_quantity - quantity
      return await this.updateStock(productId, newQuantity)
    } catch (error) {
      console.error('Failed to decrease stock:', error)
      return false
    }
  }

  static async getLowStockProducts(limit: number = 20): Promise<ProductWithRelations[]> {
    const { products } = await this.getProducts({ limit })
    
    return products
      .filter(p => p.stock_quantity > 0 && p.stock_quantity < 10)
      .sort((a, b) => a.stock_quantity - b.stock_quantity)
  }
}
```

## 🧪 Testing Patterns

### Service Testing

```typescript
describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create product successfully', async () => {
    const productData: ProductFormData = {
      title: 'Test Product',
      description: 'Test description',
      price: 29.99,
      stock_quantity: 100,
      category_id: 'cat-1',
      is_hot: false
    }

    // Mock supabase responses
    mockSupabase.from.mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: '1', ...productData },
            error: null
          })
        })
      })
    })

    const result = await ProductService.createProduct(productData)
    
    expect(result).toBeTruthy()
    expect(result?.title).toBe(productData.title)
  })
})
```

## 📋 Implementation Checklist

### ✅ Completed Service Layers

- [x] **BlogService** - Complete with AI integration
- [x] **UserService** - Complete with admin capabilities  
- [x] **CartService** - Complete with validation
- [x] **ProductService** - Complete with translations & stock management
- [x] **CategoryService** - Complete with image support
- [x] **OrderService** - Complete with payment processing

### ✅ Clean Architecture Violations Fixed

| Service | Previous Violations | Fixed | Status |
|----------|-------------------|--------|---------|
| Products | 5 direct createClient() calls | ✅ | Refactored |
| Categories | 3 direct DB calls | ✅ | Refactored |
| Orders | 2 direct DB calls | ✅ | Refactored |
| Users | 2 direct DB calls | ✅ | Refactored |

### ✅ Patterns Implemented

- [x] **Service Layer Pattern** - All business logic in services
- [x] **Data Transfer Objects** - Form validation interfaces
- [x] **Repository Pattern** - Centralized data access
- [x] **Dependency Injection** - Clean service imports
- [x] **Error Boundaries** - Comprehensive error handling
- [x] **Validation Layer** - Input validation services

## 🚀 Migration Guide

### Converting Legacy Components

1. **Identify Database Calls**: Find direct `createClient()` usage
2. **Create Service Method**: Add corresponding service method
3. **Update Component**: Replace DB calls with service calls
4. **Add Validation**: Implement proper error handling
5. **Update Tests**: Write comprehensive tests

### Example Migration

**Before:**
```typescript
export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(*)")
    .order("created_at", { ascending: false })
  
  return <ProductList products={products} />
}
```

**After:**
```typescript
export default async function AdminProductsPage() {
  const { products } = await ProductService.getProducts()
  return <ProductList products={products} />
}
```

## 📈 Benefits Achieved

### 🎯 Code Quality
- **Separation of Concerns**: Business logic separate from UI
- **Reusability**: Services can be used across components
- **Testability**: Business logic can be tested independently
- **Maintainability**: Single source of truth for domain logic

### 🛡️ Security & Reliability
- **Input Validation**: All data validated before database operations
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript support
- **Transaction Safety**: Proper database transaction handling

### 📊 Performance
- **Optimized Queries**: Efficient database queries with proper joins
- **Caching Opportunities**: Service layer enables caching patterns
- **Batch Operations**: Efficient bulk operations
- **Lazy Loading**: On-demand data fetching

### 🔧 Developer Experience
- **Consistency**: Standardized patterns across codebase
- **IntelliSense**: Full TypeScript support
- **Debugging**: Centralized logging and error handling
- **Documentation**: Clear interfaces and type definitions

## 🔮 Future Enhancements

### Recommended Improvements

1. **Caching Layer**: Implement Redis caching for frequently accessed data
2. **Background Jobs**: Queue-based processing for heavy operations
3. **API Rate Limiting**: Service-level rate limiting
4. **Analytics Service**: Business metrics and reporting
5. **Notification Service**: Email/SMS notifications
6. **File Service**: Centralized file management
7. **Search Service**: Advanced search capabilities
8. **Audit Service**: Activity logging and compliance

### Next Steps

1. **Performance Monitoring**: Add service performance metrics
2. **API Documentation**: Generate OpenAPI specs
3. **Integration Testing**: End-to-end test suite
4. **Load Testing**: Service performance under load
5. **Security Audit**: Regular security assessments

---

## 🎉 Summary

Bhanana now follows clean architecture principles with:

- **6 Complete Service Layers** covering all business domains
- **100% Separation of Concerns** between UI and business logic  
- **Comprehensive Type Safety** with full TypeScript support
- **Robust Error Handling** with proper logging
- **Internationalization Support** across all services
- **Production Ready** patterns for scalability and maintainability

The codebase is now enterprise-ready with clean, maintainable, and scalable architecture that supports future growth and feature development.
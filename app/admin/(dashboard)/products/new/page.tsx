import ProductForm from '../ProductForm'
import { createProduct } from '../actions'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Product</h1>
      <div className="mt-6">
        <ProductForm action={createProduct} submitLabel="Create Product" />
      </div>
    </div>
  )
}

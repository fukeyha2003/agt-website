import CustomerForm from '../CustomerForm'
import { createCustomer } from '../actions'

export default function NewCustomerPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Customer</h1>
      <div className="mt-6">
        <CustomerForm action={createCustomer} submitLabel="Create Customer" />
      </div>
    </div>
  )
}
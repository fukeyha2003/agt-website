import ServiceForm from '../ServiceForm'
import { createService } from '../actions'

export default function NewServicePage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Add Service</h1>
      <div className="mt-6">
        <ServiceForm action={createService} submitLabel="Create Service" />
      </div>
    </div>
  )
}
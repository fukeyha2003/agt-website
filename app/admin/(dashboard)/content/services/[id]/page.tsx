import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/lib/supabase/admin'
import ServiceForm from '../ServiceForm'
import { updateService } from '../actions'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const { data: service } = await supabase.from('services').select('*').eq('id', id).single()
  if (!service) notFound()

  const boundUpdate = updateService.bind(null, service.id)

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-[#062F4F]">Edit Service — {service.title}</h1>
      <div className="mt-6">
        <ServiceForm
          action={boundUpdate}
          submitLabel="Save Changes"
          initialData={{
            title: service.title,
            slug: service.slug,
            summary: service.summary,
            items: Array.isArray(service.items) ? service.items : [],
            icon: service.icon,
            is_published: service.is_published,
            sort_order: service.sort_order,
          }}
        />
      </div>
    </div>
  )
}
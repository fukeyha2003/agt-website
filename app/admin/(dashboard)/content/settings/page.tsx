import Link from 'next/link'
import { createAdminClient } from '@/app/lib/supabase/admin'
import SettingsForm from './SettingsForm'
import { saveSettings } from './actions'

type Json = Record<string, string | undefined> | null

export default async function SettingsPage() {
  const supabase = createAdminClient()

  const { data: rows } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', ['hero_text', 'about_text', 'contact_details'])

  const byKey = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value as Json]))
  const hero = byKey.hero_text
  const about = byKey.about_text
  const contact = byKey.contact_details

  return (
    <div>
      <Link href="/admin/content" className="text-sm font-medium text-gray-500 hover:text-gray-700">
        ← Content
      </Link>
      <h1 className="mt-2 font-serif text-2xl font-bold text-[#062F4F]">Site Settings</h1>

      <div className="mt-6">
        <SettingsForm
          action={saveSettings}
          initialValues={{
            hero_headline: hero?.headline ?? '',
            hero_subtext: hero?.subtext ?? '',
            about_body: about?.body ?? '',
            contact_address: contact?.address ?? 'Office# R-57, Sector Z-6, Gulshan-e-Maymar, Karachi',
            contact_phone_1: contact?.phone_1 ?? '+92 331 1363614',
            contact_phone_2: contact?.phone_2 ?? '+92 332 3361352',
            contact_email: contact?.email ?? 'agogt77@gmail.com',
          }}
        />
      </div>
    </div>
  )
}
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/app/lib/supabase/admin'
import { QUOTE_PRODUCTS } from '@/app/lib/quote-products'

export const runtime = 'nodejs'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png']

function generateReference() {
  const now = new Date()
  const yy = String(now.getFullYear()).slice(2)
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I — avoids ambiguity
  let suffix = ''
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
  return `AGT-${yy}${mm}${dd}-${suffix}`
}

function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

type Errors = Record<string, string>

function validateFields(data: Record<string, string>): Errors {
  const errors: Errors = {}

  const name = data.name?.trim() || ''
  if (!name) errors.name = 'Please enter your full name.'
  else if (name.length < 2) errors.name = 'Your name looks too short.'
  else if (name.length > 120) errors.name = 'Please keep your name under 120 characters.'
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) errors.name = 'Please use letters only (spaces, dots and hyphens are fine).'

  const company = data.company?.trim() || ''
  if (company.length > 160) errors.company = 'Please keep the company name under 160 characters.'

  const mobile = data.mobile?.trim() || ''
  if (!mobile) {
    errors.mobile = 'Please enter your mobile number.'
  } else {
    const n = mobile.replace(/[\s\-()]/g, '')
    if (!/^\+?\d+$/.test(n)) {
      errors.mobile = 'Use only numbers, spaces, dashes and an optional + at the start.'
    } else if (/^03/.test(n)) {
      if (n.length !== 11) errors.mobile = 'Pakistani mobile numbers have 11 digits, e.g. 0331 1234567.'
    } else if (/^(\+92|0092|92)/.test(n)) {
      const rest = n.replace(/^(\+92|0092|92)/, '')
      if (rest.length !== 10) errors.mobile = 'Enter the number as +92 331 1234567 (10 digits after +92).'
    } else {
      const digits = n.replace(/^\+/, '')
      if (digits.length < 7 || digits.length > 15) errors.mobile = 'Please enter a valid phone number (7 to 15 digits).'
    }
  }

  const email = data.email?.trim() || ''
  if (!email) errors.email = 'Please enter your email address.'
  else if (email.length > 160) errors.email = 'That email address is too long.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = 'Please enter a valid email, e.g. name@company.com.'

  const product = data.product?.trim() || ''
  if (!product || !QUOTE_PRODUCTS[product]) errors.product = 'Please select a product or service.'

  const quantity = data.quantity?.trim() || ''
  if (!quantity) errors.quantity = 'Please enter the quantity you need.'
  else if (!/\d/.test(quantity)) errors.quantity = 'Include a number, e.g. 20 MT or 5,000 Litres.'
  else if (quantity.length > 100) errors.quantity = 'Please keep this under 100 characters.'

  const deliveryLocation = data.delivery_location?.trim() || ''
  if (!deliveryLocation) errors.delivery_location = 'Please enter the delivery location.'
  else if (deliveryLocation.length < 3) errors.delivery_location = 'Please enter a fuller location (city, depot or terminal).'
  else if (deliveryLocation.length > 200) errors.delivery_location = 'Please keep the location under 200 characters.'

  const requiredDate = data.required_date?.trim() || ''
  if (requiredDate && requiredDate < todayString()) errors.required_date = 'The required date cannot be in the past.'

  const message = data.message?.trim() || ''
  if (message.length > 3000) errors.message = 'Please keep your message under 3,000 characters.'

  return errors
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const fields = {
      name: String(formData.get('name') || ''),
      company: String(formData.get('company') || ''),
      mobile: String(formData.get('mobile') || ''),
      email: String(formData.get('email') || ''),
      product: String(formData.get('product') || ''),
      quantity: String(formData.get('quantity') || ''),
      delivery_location: String(formData.get('delivery_location') || ''),
      required_date: String(formData.get('required_date') || ''),
      message: String(formData.get('message') || ''),
    }

    const errors = validateFields(fields)

    const file = formData.get('attachment') as File | null
    if (file && file.size > 0) {
      const ext = (file.name.split('.').pop() || '').toLowerCase()
      if (!ALLOWED_EXT.includes(ext)) errors.attachment = 'Please upload a PDF, Word, Excel, JPG or PNG file.'
      else if (file.size > MAX_FILE_BYTES) errors.attachment = 'The file must be 5 MB or smaller.'
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 422 })
    }

    const supabase = createAdminClient()
    const reference = generateReference()

    let attachmentPath: string | null = null
    let attachmentName: string | null = null

    if (file && file.size > 0) {
      const ext = file.name.split('.').pop()
      const path = `${reference}/${crypto.randomUUID()}.${ext}`
      const bytes = new Uint8Array(await file.arrayBuffer())

      const { error: uploadError } = await supabase.storage
        .from('quote-attachments')
        .upload(path, bytes, { contentType: file.type, upsert: false })

      if (uploadError) {
        console.error('Attachment upload failed:', uploadError)
        return NextResponse.json(
          { success: false, errors: { attachment: 'Could not upload the file — please try again.' } },
          { status: 500 }
        )
      }

      attachmentPath = path
      attachmentName = file.name
    }

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null

    const { error: insertError } = await supabase
      .from('quote_requests')
      .insert({
        reference,
        name: fields.name.trim(),
        company: fields.company.trim() || null,
        mobile: fields.mobile.trim(),
        email: fields.email.trim(),
        product: QUOTE_PRODUCTS[fields.product],
        quantity: fields.quantity.trim(),
        delivery_location: fields.delivery_location.trim(),
        required_date: fields.required_date || null,
        message: fields.message.trim() || null,
        attachment_path: attachmentPath,
        attachment_name: attachmentName,
        ip_address: ip,
      })

    if (insertError) {
      console.error('Insert failed:', insertError)
      return NextResponse.json(
        { success: false, errors: { form: 'Something went wrong saving your request. Please try again.' } },
        { status: 500 }
      )
    }

    // Fire-and-forget notification email — a failure here should never
    // block the customer from seeing a success response. If RESEND_API_KEY
    // isn't set yet, this is skipped entirely (no crash).
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: process.env.QUOTE_NOTIFY_FROM || 'AGT Website <onboarding@resend.dev>',
          to: process.env.QUOTE_NOTIFY_TO || 'fukeharizwan2003@gmail.com',
          replyTo: fields.email.trim(),
          subject: `New Quote Request — ${reference}`,
          text: [
            `Reference: ${reference}`,
            `Name: ${fields.name}`,
            `Company: ${fields.company || '—'}`,
            `Mobile: ${fields.mobile}`,
            `Email: ${fields.email}`,
            `Product: ${QUOTE_PRODUCTS[fields.product]}`,
            `Quantity: ${fields.quantity}`,
            `Delivery Location: ${fields.delivery_location}`,
            `Required Date: ${fields.required_date || '—'}`,
            `Message: ${fields.message || '—'}`,
            attachmentName ? `Attachment: ${attachmentName}` : '',
          ]
            .filter(Boolean)
            .join('\n'),
        })
      } catch (emailError) {
        console.error('Notification email failed:', emailError)
      }
    }

    return NextResponse.json({ success: true, reference })
  } catch (err) {
    console.error('Request-quote route error:', err)
    return NextResponse.json(
      { success: false, errors: { form: 'Unexpected error. Please try again.' } },
      { status: 500 }
    )
  }
}
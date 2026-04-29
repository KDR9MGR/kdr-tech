import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FAQForm from '@/components/admin/forms/FAQForm'

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: faq, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !faq) {
    notFound()
  }

  return <FAQForm initialData={faq} isEdit />
}

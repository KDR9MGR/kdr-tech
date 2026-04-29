import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CaseStudyForm from '@/components/admin/forms/CaseStudyForm'

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: caseStudy, error } = await supabase
    .from('case_studies')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !caseStudy) {
    notFound()
  }

  return <CaseStudyForm initialData={caseStudy} isEdit />
}

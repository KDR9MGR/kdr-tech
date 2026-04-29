import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Eye, EyeOff, HelpCircle } from 'lucide-react'

async function getFaqs() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true })
    if (error) throw error
    return data || []
  } catch {
    return []
  }
}

export default async function FAQsAdminPage() {
  const faqs = await getFaqs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQs</h1>
          <p className="text-gray-400 mt-1">Manage frequently asked questions shown on the public site</p>
        </div>
        <Link href="/admin/faqs/new">
          <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
            <Plus className="w-4 h-4 mr-2" />Add FAQ
          </Button>
        </Link>
      </div>

      {faqs.length === 0 ? (
        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl p-12 text-center">
          <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No FAQs yet</h3>
          <p className="text-gray-400 mb-6">Add frequently asked questions to build trust with potential clients.</p>
          <Link href="/admin/faqs/new">
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500">
              <Plus className="w-4 h-4 mr-2" />Add First FAQ
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-[#1A1A2E] border border-[#2A0E61] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A0E61]">
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Question</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium hidden lg:table-cell">Order</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq: any) => (
                <tr key={faq.id} className="border-b border-[#2A0E61] last:border-0 hover:bg-[#030014]/50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white max-w-md truncate">{faq.question}</div>
                    <div className="text-sm text-gray-400 max-w-md truncate mt-1">{faq.answer}</div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2 py-1 bg-[#030014] border border-[#2A0E61] rounded text-xs text-gray-300 capitalize">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-gray-300">{faq.order_index}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      faq.visible
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-600'
                    }`}>
                      {faq.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {faq.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/faqs/${faq.id}/edit`}>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-[#030014]">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { 
  File, 
  Upload, 
  Trash2, 
  ExternalLink, 
  Search, 
  Loader2, 
  Plus,
  FileIcon,
  X,
  Eye,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface Document {
  id: string
  name: string
  file_url: string
  file_type: string
  size: number
  created_at: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isSnippetDialogOpen, setIsSnippetDialogOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [snippetName, setSnippetName] = useState('')
  const [snippetContent, setSnippetContent] = useState('')
  const [isSavingSnippet, setIsSavingSnippet] = useState(false)
  
  const { toast } = useToast()
  const supabase = createClient()

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      } else {
        throw new Error('Failed to fetch documents')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    const file = acceptedFiles[0]
    
    try {
      // 1. Upload to Supabase Storage
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
      const filePath = `uploads/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 3. Save to Database
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          size: file.size,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Document uploaded successfully',
        })
        setIsUploadDialogOpen(false)
        fetchDocuments()
      } else {
        throw new Error('Failed to save document info')
      }
    } catch (error: any) {
      toast({
        title: 'Upload Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }, [supabase, toast, fetchDocuments])

  const handleSaveSnippet = async () => {
    if (!snippetName || !snippetContent) {
      toast({
        title: 'Error',
        description: 'Please provide both name and content',
        variant: 'destructive',
      })
      return
    }

    setIsSavingSnippet(true)
    try {
      // 1. Create a blob from the content
      const blob = new Blob([snippetContent], { type: 'text/html' })
      const file = new File([blob], `${snippetName}.html`, { type: 'text/html' })
      
      // 2. Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.html`
      const filePath = `snippets/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath)

      // 4. Save to Database
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: snippetName,
          file_url: publicUrl,
          file_type: 'text/html',
          size: blob.size,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'HTML Snippet saved successfully',
        })
        setIsSnippetDialogOpen(false)
        setSnippetName('')
        setSnippetContent('')
        fetchDocuments()
      } else {
        throw new Error('Failed to save snippet info')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsSavingSnippet(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Document deleted successfully',
        })
        setDocuments(prev => prev.filter(doc => doc.id !== id))
      } else {
        throw new Error('Failed to delete document')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="flex min-h-screen bg-[#030014]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
              <p className="text-gray-400">Upload and manage table charts, drafts, and other assets</p>
            </div>

            <div className="flex gap-3">
              <Dialog open={isSnippetDialogOpen} onOpenChange={setIsSnippetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-[#2A0E61] text-white hover:bg-[#030014]">
                    <Code className="w-4 h-4 mr-2" />
                    New HTML Snippet
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A2E] border-[#2A0E61] text-white max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create HTML Snippet</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Paste your Claude-generated HTML code here to preview and interact with it.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label>Snippet Name</Label>
                      <Input 
                        placeholder="e.g. Social Media Plan" 
                        value={snippetName}
                        onChange={(e) => setSnippetName(e.target.value)}
                        className="bg-[#030014] border-[#2A0E61] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>HTML Content</Label>
                      <Textarea 
                        placeholder="Paste your HTML code here..." 
                        rows={12}
                        value={snippetContent}
                        onChange={(e) => setSnippetContent(e.target.value)}
                        className="bg-[#030014] border-[#2A0E61] text-white font-mono text-xs"
                      />
                    </div>
                    <Button 
                      onClick={handleSaveSnippet} 
                      disabled={isSavingSnippet}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                    >
                      {isSavingSnippet ? 'Saving...' : 'Save & Preview'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1A1A2E] border-[#2A0E61] text-white">
                  <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Drag and drop your files here or click to browse.
                    </DialogDescription>
                  </DialogHeader>
                  <div
                    {...getRootProps()}
                    className={`mt-4 border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                      isDragActive 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-[#2A0E61] hover:border-purple-500/50 bg-[#030014]'
                    }`}
                  >
                    <input {...getInputProps()} />
                    {uploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                        <p className="text-sm text-gray-400">Uploading...</p>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-10 h-10 mb-4 ${isDragActive ? 'text-purple-500' : 'text-gray-500'}`} />
                        <p className="text-sm text-center text-gray-400">
                          {isDragActive ? 'Drop the file here' : 'Drag & drop or click to upload'}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Supports any file type up to 50MB
                        </p>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="bg-[#1A1A2E] border-[#2A0E61]">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#030014] border-[#2A0E61] text-white"
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <FileIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No documents found</p>
                  {searchQuery && (
                    <Button 
                      variant="link" 
                      onClick={() => setSearchQuery('')}
                      className="text-purple-400"
                    >
                      Clear search
                    </Button>
                  )}
                </div>
              ) : (
                <div className="rounded-md border border-[#2A0E61] overflow-hidden">
                  <Table>
                    <TableHeader className="bg-[#030014]">
                      <TableRow className="border-[#2A0E61] hover:bg-transparent">
                        <TableHead className="text-gray-400">Name</TableHead>
                        <TableHead className="text-gray-400">Type</TableHead>
                        <TableHead className="text-gray-400">Size</TableHead>
                        <TableHead className="text-gray-400">Uploaded</TableHead>
                        <TableHead className="text-gray-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id} className="border-[#2A0E61] hover:bg-[#2A0E61]/20">
                          <TableCell className="font-medium text-white">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded bg-purple-500/10">
                                <File className="w-4 h-4 text-purple-400" />
                              </div>
                              <span className="truncate max-w-[200px] md:max-w-[400px]">
                                {doc.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-400 text-xs uppercase">
                            {doc.file_type.split('/').pop()}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {formatSize(doc.size)}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {format(new Date(doc.created_at), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedDoc(doc)
                                  setIsPreviewOpen(true)
                                }}
                                className="text-gray-400 hover:text-purple-400 hover:bg-[#030014]"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="text-gray-400 hover:text-white hover:bg-[#030014]"
                              >
                                <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(doc.id)}
                                className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="bg-[#1A1A2E] border-[#2A0E61] text-white max-w-[95vw] h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b border-[#2A0E61] flex flex-row items-center justify-between">
            <div>
              <DialogTitle>{selectedDoc?.name}</DialogTitle>
              <DialogDescription className="text-gray-400">
                Interactive Preview
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex-1 bg-white overflow-hidden">
            {selectedDoc && (
              <iframe 
                src={selectedDoc.file_url} 
                className="w-full h-full border-none"
                title={selectedDoc.name}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

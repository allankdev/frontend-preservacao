'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import api from '@/lib/api'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [name, setName] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState({
    autor: '',
    tema: '',
    linguagem: '',
    ano: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return alert('Selecione um arquivo PDF!')

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name)
      formData.append('metadata', JSON.stringify(metadata))

      await api.post('/documents', formData)
      router.push('/dashboard')
    } catch (err) {
      console.error('Erro ao enviar documento', err)
      alert('Falha no envio. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Novo Documento</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nome do Documento</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Autor</Label>
          <Input
            value={metadata.autor}
            onChange={(e) => setMetadata({ ...metadata, autor: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Tema</Label>
          <Input
            value={metadata.tema}
            onChange={(e) => setMetadata({ ...metadata, tema: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Linguagem</Label>
          <Input
            value={metadata.linguagem}
            onChange={(e) => setMetadata({ ...metadata, linguagem: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Ano</Label>
          <Input
            value={metadata.ano}
            onChange={(e) => setMetadata({ ...metadata, ano: e.target.value })}
            required
          />
        </div>

        <div>
          <Label>Arquivo PDF</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Preservar Documento'}
        </Button>
      </form>
    </div>
  )
}

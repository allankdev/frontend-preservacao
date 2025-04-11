"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Download,
  FileText,
  Share2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

interface Document {
  id: string
  name: string
  status: string
  metadata: Record<string, any>
  createdAt: string
}

const statusConfig = {
  PRESERVADO: {
    label: "Preservado",
    color: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: CheckCircle,
  },
  FALHA: {
    label: "Falha",
    color: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: AlertTriangle,
  },
  PROCESSANDO: {
    label: "Processando",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: Clock,
  },
  default: {
    label: "Desconhecido",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    icon: FileText,
  },
}

export default function DocumentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const documentId = params.id as string

  const [doc, setDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const fetchDoc = async () => {
    try {
      const res = await api.get(`/documents/${documentId}`)
      setDoc(res.data)

      // Gera token temporário para PDF
      const tokenRes = await api.get(`/documents/${documentId}/token`)
      const token = tokenRes.data.token
      setPdfUrl(`${process.env.NEXT_PUBLIC_API_URL || ""}/documents/${documentId}/view?token=${token}`)
    } catch (err) {
      console.error("Erro ao carregar documento", err)
      window.alert("Erro ao carregar documento. Não foi possível obter os detalhes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoc()
    const interval = setInterval(() => {
      if (doc?.status === "PROCESSANDO") {
        fetchDoc()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [documentId, doc?.status])

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.default
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })
    } catch (e) {
      return dateString
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/documents/${documentId}`)
      window.alert("Documento excluído com sucesso!")
      router.push("/dashboard")
    } catch (err) {
      window.alert("Erro ao excluir documento. Tente novamente.")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  const downloadMetadata = () => {
    if (!doc) return
    const blob = new Blob([JSON.stringify(doc.metadata, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${doc.name}-metadados.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="max-w-4xl mx-auto p-6">Carregando...</div>
  if (!doc || !pdfUrl) return null

  const statusInfo = getStatusInfo(doc.status)
  const StatusIcon = statusInfo.icon

  return (
   
   <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{doc.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusInfo.color}>
                <StatusIcon className="mr-1 h-3 w-3" />
                {statusInfo.label}
              </Badge>
              <span className="text-sm text-muted-foreground">Criado em {formatDate(doc.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Share2 className="mr-2 h-4 w-4" /> Compartilhar
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex-1 sm:flex-none">
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Excluir documento</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir o documento "{doc.name}"? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Excluindo..." : "Excluir permanentemente"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Visualização</TabsTrigger>
          <TabsTrigger value="metadata">Metadados</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                <span>Visualização do Documento</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Abrir em nova aba
                  </a>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border rounded-lg overflow-hidden h-[600px]">
                <iframe src={pdfUrl} title="Visualização do PDF" className="w-full h-full" />
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="secondary" asChild className="w-full sm:w-auto">
                <a href={pdfUrl} download={`${doc.name}.pdf`}>
                  <Download className="mr-2 h-4 w-4" /> Baixar PDF
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="metadata" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadados do Documento</CardTitle>
              <CardDescription>Informações técnicas extraídas do documento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(doc.metadata).length === 0 ? (
                  <p className="text-muted-foreground italic">Nenhum metadado disponível para este documento.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(doc.metadata).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <h3 className="text-sm font-medium text-muted-foreground">{key}</h3>
                        <p className="text-sm break-words">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </p>
                        <Separator className="mt-2" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={downloadMetadata} disabled={Object.entries(doc.metadata).length === 0}>
                <Download className="mr-2 h-4 w-4" /> Baixar Metadados (.json)
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

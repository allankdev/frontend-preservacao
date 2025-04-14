"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  FileEdit,
  Trash2,
  Share2,
  FileArchive,
  Filter,
  Copy,
  Check,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

interface Document {
  id: string
  name: string
  status: string
  createdAt: string
}

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  aprovado: "bg-green-100 text-green-800 hover:bg-green-100",
  rejeitado: "bg-red-100 text-red-800 hover:bg-red-100",
  "em análise": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  default: "bg-gray-100 text-gray-800 hover:bg-gray-100",
}

export default function DashboardPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  // Dialog states
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/documents")
        setDocuments(res.data)
        setFilteredDocs(res.data)
      } catch (err) {
        console.error("Erro ao buscar documentos", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDocs()
  }, [])

  useEffect(() => {
    let result = [...documents]

    // Apply search filter
    if (searchQuery) {
      result = result.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "todos") {
      result = result.filter((doc) => doc.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredDocs(result)
  }, [searchQuery, statusFilter, documents])

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase()
    return statusColors[normalizedStatus as keyof typeof statusColors] || statusColors.default
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch (e) {
      return dateString
    }
  }

  // Handle share action
  const handleShare = (doc: Document) => {
    setSelectedDoc(doc)
    setShareDialogOpen(true)
  }

  // Handle edit action
  const handleEdit = (docId: string) => {
    router.push(`/document/${docId}`)
  }

  // Handle delete action
  const handleDeleteClick = (doc: Document) => {
    setSelectedDoc(doc)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedDoc) return

    setDeleting(true)
    try {
      await api.delete(`/documents/${selectedDoc.id}`)
      // Remove the document from the list
      setDocuments(documents.filter((doc) => doc.id !== selectedDoc.id))
      window.alert("Documento excluído com sucesso!")
    } catch (err) {
      console.error("Erro ao excluir documento", err)
      window.alert("Erro ao excluir documento. Tente novamente.")
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
    }
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Seus Documentos</h1>
        <Link href="/upload">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Novo Documento
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em análise">Em análise</SelectItem>
              <SelectItem value="aprovado">Aprovado</SelectItem>
              <SelectItem value="rejeitado">Rejeitado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileArchive className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum documento encontrado</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            {searchQuery || statusFilter !== "todos"
              ? "Tente ajustar seus filtros de busca ou"
              : "Você ainda não possui documentos cadastrados. Comece"}{" "}
            criando um novo documento.
          </p>
          <Link href="/upload">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Documento
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <Card key={doc.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-muted rounded-md p-2">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <h2 className="font-semibold text-lg truncate" title={doc.name}>
                      {doc.name}
                    </h2>
                    <Badge variant="secondary" className={getStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">Criado em {formatDate(doc.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between p-6 pt-0">
                <Link href={`/document/${doc.id}`}>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(doc.id)}>
                      <FileEdit className="mr-2 h-4 w-4" /> Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare(doc)}>
                      <Share2 className="mr-2 h-4 w-4" /> Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      {selectedDoc && (
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Compartilhar documento</DialogTitle>
              <DialogDescription>Compartilhe este documento com outras pessoas</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="social">Redes Sociais</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="mt-4">
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Input value={`${window.location.origin}/document/${selectedDoc.id}`} readOnly className="w-full" />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="px-3"
                    onClick={() => copyToClipboard(`${window.location.origin}/document/${selectedDoc.id}`)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copiar</span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-4">
                <div className="flex flex-col space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Compartilhe diretamente nas redes sociais ou aplicativos de mensagem
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://api.whatsapp.com/send?text=${encodeURIComponent(`${selectedDoc.name}: ${window.location.origin}/document/${selectedDoc.id}`)}`,
                          "_blank",
                        )
                      }
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://telegram.me/share/url?url=${encodeURIComponent(`${window.location.origin}/document/${selectedDoc.id}`)}&text=${encodeURIComponent(selectedDoc.name)}`,
                          "_blank",
                        )
                      }
                    >
                      Telegram
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `mailto:?subject=${encodeURIComponent(selectedDoc.name)}&body=${encodeURIComponent(`Confira este documento: ${window.location.origin}/document/${selectedDoc.id}`)}`,
                          "_blank",
                        )
                      }
                    >
                      Email
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="sm:justify-between">
              <div className="text-sm text-muted-foreground">Link válido enquanto o documento existir</div>
              {navigator.share && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    navigator
                      .share({
                        title: selectedDoc.name,
                        text: "Confira este documento preservado!",
                        url: `${window.location.origin}/document/${selectedDoc.id}`,
                      })
                      .catch((err) => console.error("Erro ao compartilhar:", err))
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedDoc && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir documento</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir o documento "{selectedDoc.name}"? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? "Excluindo..." : "Excluir permanentemente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { format, parseISO, isAfter, isBefore, isValid } from "date-fns"
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
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  X,
  ChevronDown,
  Tag,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface Document {
  id: string
  name: string
  status: string
  createdAt: string
  metadata?: Record<string, any>
}

// Atualizado para usar os status reais do backend
const statusConfig = {
  INICIADO: {
    label: "Processando",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: Clock,
  },
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
  default: {
    label: "Desconhecido",
    color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    icon: FileText,
  },
}

// Campos de metadados comuns para pesquisa
const metadataFields = [
  { id: "author", label: "Autor" },
  { id: "title", label: "Título" },
  { id: "subject", label: "Assunto" },
  { id: "keywords", label: "Palavras-chave" },
  { id: "producer", label: "Produtor" },
  { id: "creator", label: "Criador" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocs, setFilteredDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("todos")

  // Filtros avançados
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [metadataField, setMetadataField] = useState<string>("todos")
  const [metadataValue, setMetadataValue] = useState("")
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

  // Dialog states
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchDocs = async () => {
    try {
      const res = await api.get("/documents")
      setDocuments(res.data)
    } catch (err) {
      console.error("Erro ao buscar documentos", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocs()

    // Adiciona polling a cada 10 segundos para atualizar os documentos
    const interval = setInterval(() => {
      fetchDocs()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let result = [...documents]

    // Apply basic search filter (name)
    if (searchQuery) {
      result = result.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "todos") {
      result = result.filter((doc) => doc.status === statusFilter)
    }

    // Apply metadata filter
    if (metadataValue && metadataField !== "todos") {
      result = result.filter((doc) => {
        if (!doc.metadata) return false

        const value = doc.metadata[metadataField]
        if (!value) return false

        return String(value).toLowerCase().includes(metadataValue.toLowerCase())
      })
    }

    // Apply date range filter
    if (dateFrom) {
      result = result.filter((doc) => {
        const docDate = parseISO(doc.createdAt)
        return isValid(docDate) && isAfter(docDate, dateFrom)
      })
    }

    if (dateTo) {
      // Add one day to include the end date
      const endDate = new Date(dateTo)
      endDate.setDate(endDate.getDate() + 1)

      result = result.filter((doc) => {
        const docDate = parseISO(doc.createdAt)
        return isValid(docDate) && isBefore(docDate, endDate)
      })
    }

    setFilteredDocs(result)
  }, [searchQuery, statusFilter, metadataField, metadataValue, dateFrom, dateTo, documents])

  const getStatusInfo = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.default
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

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("todos")
    setMetadataField("todos")
    setMetadataValue("")
    setDateFrom(undefined)
    setDateTo(undefined)
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

      <div className="space-y-4">
        {/* Filtro básico */}
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
                <SelectItem value="INICIADO">Processando</SelectItem>
                <SelectItem value="PRESERVADO">Preservado</SelectItem>
                <SelectItem value="FALHA">Falha</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados */}
        <Collapsible
          open={showAdvancedFilters}
          onOpenChange={setShowAdvancedFilters}
          className="border rounded-md p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="p-0 hover:bg-transparent">
                <ChevronDown
                  className={`h-4 w-4 mr-2 transition-transform ${showAdvancedFilters ? "transform rotate-180" : ""}`}
                />
                <span className="font-medium">Filtros avançados</span>
              </Button>
            </CollapsibleTrigger>
            {(metadataValue || dateFrom || dateTo || metadataField !== "todos") && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8">
                <X className="h-3 w-3 mr-1" /> Limpar filtros
              </Button>
            )}
          </div>

          <CollapsibleContent className="space-y-4">
            {/* Filtro por metadados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Tag className="h-4 w-4 mr-1" /> Filtrar por metadados
                </label>
                <div className="flex gap-2">
                  <Select value={metadataField} onValueChange={setMetadataField}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione um campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os campos</SelectItem>
                      {metadataFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Valor do metadado..."
                    value={metadataValue}
                    onChange={(e) => setMetadataValue(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Filtro por intervalo de datas */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Filtrar por período
                </label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Data inicial"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                        {dateTo ? format(dateTo, "dd/MM/yyyy") : "Data final"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Contador de resultados */}
        {!loading && (
          <div className="text-sm text-muted-foreground">
            {filteredDocs.length} {filteredDocs.length === 1 ? "documento encontrado" : "documentos encontrados"}
            {(searchQuery ||
              statusFilter !== "todos" ||
              metadataValue ||
              dateFrom ||
              dateTo ||
              metadataField !== "todos") && <span> com os filtros aplicados</span>}
          </div>
        )}
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
            {searchQuery || statusFilter !== "todos" || metadataValue || dateFrom || dateTo || metadataField !== "todos"
              ? "Tente ajustar seus filtros de busca ou"
              : "Você ainda não possui documentos cadastrados. Comece"}{" "}
            criando um novo documento.
          </p>
          {searchQuery ||
          statusFilter !== "todos" ||
          metadataValue ||
          dateFrom ||
          dateTo ||
          metadataField !== "todos" ? (
            <Button onClick={resetFilters}>
              <X className="mr-2 h-4 w-4" /> Limpar filtros
            </Button>
          ) : (
            <Link href="/upload">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Novo Documento
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const statusInfo = getStatusInfo(doc.status)
            const StatusIcon = statusInfo.icon

            return (
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
                      <Badge variant="secondary" className={statusInfo.color}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusInfo.label}
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
            )
          })}
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

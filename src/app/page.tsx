"use client"
import { useRouter } from "next/navigation"
import {
  FileArchive,
  Clock,
  Database,
  CheckCircle,
  ArrowRight,
  Upload,
  Download,
  Search,
  FileText,
  Package,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
            <FileArchive className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Preservação Digital com Archivematica
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            Plataforma completa para gestão e preservação de documentos PDF utilizando Archivematica como repositório
            digital confiável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" className="gap-2" onClick={() => router.push("/login")}>
              Entrar na plataforma <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/register")}>
              Criar uma conta
            </Button>
          </div>
        </div>
      </section>

      {/* O que é o Sistema */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">O que é nosso Sistema de Preservação Digital?</h2>
              <p className="text-muted-foreground">
                Nossa plataforma integra-se ao Archivematica, uma solução de código aberto líder em preservação digital,
                para garantir que seus documentos PDF permaneçam acessíveis, autênticos e utilizáveis a longo prazo,
                independentemente das mudanças tecnológicas.
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p>Upload, visualização e download de documentos preservados</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p>Gestão completa de metadados para fácil recuperação</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p>Integração com Archivematica via API para preservação confiável</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <p>Acompanhamento em tempo real do status de preservação</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden border bg-background p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm border">
                    <Upload className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Upload de PDFs</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm border">
                    <Database className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Gestão de Metadados</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm border">
                    <FileArchive className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Preservação Digital</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-background rounded-lg shadow-sm border">
                    <Download className="h-8 w-8 text-primary mb-2" />
                    <p className="text-sm font-medium">Download Seguro</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fluxo de Preservação */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Fluxo de Preservação Digital</h2>
            <p className="max-w-[700px] text-muted-foreground">
              Nosso sistema implementa o fluxo completo de preservação digital do Archivematica, garantindo a
              integridade e acessibilidade dos seus documentos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Pacote SIP</CardTitle>
                <CardDescription>Submission Information Package</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quando você faz upload de um documento, nosso sistema cria um pacote SIP com o PDF e seus metadados,
                  enviando-o ao Archivematica para iniciar o processo de preservação.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
                  <FileArchive className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Pacote AIP</CardTitle>
                <CardDescription>Archival Information Package</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  O Archivematica processa o SIP e cria um pacote AIP, que contém o documento preservado com todos os
                  metadados necessários para garantir sua autenticidade e acessibilidade a longo prazo.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="p-2 bg-primary/10 rounded-full w-fit mb-2">
                  <Download className="w-5 h-5 text-primary" />
                </div>
                <CardTitle>Pacote DIP</CardTitle>
                <CardDescription>Dissemination Information Package</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Quando você solicita um documento, o sistema recupera o pacote DIP do Archivematica, permitindo o
                  acesso e download do documento preservado em formato adequado para visualização.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Principais Funcionalidades</h2>
            <p className="max-w-[700px] text-muted-foreground">
              Nossa plataforma oferece todas as ferramentas necessárias para gerenciar seus documentos digitais
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Upload de Documentos</h3>
              <p className="text-muted-foreground text-sm">
                Faça upload de documentos PDF com metadados personalizados para preservação digital
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Busca Avançada</h3>
              <p className="text-muted-foreground text-sm">
                Encontre documentos rapidamente com busca por metadados e filtros por data
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Visualização Online</h3>
              <p className="text-muted-foreground text-sm">
                Visualize documentos PDF diretamente no navegador sem necessidade de download
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm border">
              <div className="p-3 bg-primary/10 rounded-full mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Status em Tempo Real</h3>
              <p className="text-muted-foreground text-sm">
                Acompanhe o status da preservação: Iniciada, Preservado ou Falha
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstração da Interface */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Interface Intuitiva</h2>
            <p className="max-w-[700px] text-muted-foreground">
              Nossa plataforma foi projetada para ser fácil de usar, com uma interface moderna e responsiva
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Dashboard Principal</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Lista completa de documentos preservados com ID, nome, data e status</p>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Campo de busca por metadados para localização rápida</p>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Filtro por intervalo de datas para refinar resultados</p>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Botões de ação para download direto e visualização detalhada</p>
                </li>
              </ul>
              <h3 className="text-xl font-bold pt-4">Detalhes do Documento</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Visualização do PDF diretamente no navegador</p>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Informações completas: nome, data, status e metadados</p>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <p>Opção de download do documento preservado</p>
                </li>
              </ul>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden border bg-background p-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="w-full max-w-md p-4 bg-background rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold">Documentos Preservados</h4>
                    <Button size="sm" variant="outline" className="gap-1">
                      <Upload className="h-3 w-3" /> Novo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium text-sm">Contrato.pdf</p>
                        <p className="text-xs text-muted-foreground">11/04/2025</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Preservado</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium text-sm">Relatório.pdf</p>
                        <p className="text-xs text-muted-foreground">10/04/2025</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Iniciada</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                      <div>
                        <p className="font-medium text-sm">Documento.pdf</p>
                        <p className="text-xs text-muted-foreground">09/04/2025</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Preservado</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnologias */}
      <section className="w-full py-12 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Tecnologias Utilizadas</h2>
            <p className="max-w-[700px] text-muted-foreground">
              Construído com tecnologias modernas para garantir desempenho, segurança e escalabilidade
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">React/Next.js</p>
              <p className="text-xs text-muted-foreground">Frontend</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">NestJS</p>
              <p className="text-xs text-muted-foreground">Backend</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">Prisma</p>
              <p className="text-xs text-muted-foreground">ORM</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">PostgreSQL</p>
              <p className="text-xs text-muted-foreground">Banco de Dados</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">Archivematica</p>
              <p className="text-xs text-muted-foreground">Preservação Digital</p>
            </div>
            <div className="p-4 bg-background rounded-lg shadow-sm border">
              <p className="font-bold">Docker</p>
              <p className="text-xs text-muted-foreground">Containerização</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Comece sua jornada de preservação digital hoje
              </h2>
              <p className="max-w-[700px] text-muted-foreground">
                Garanta a integridade e acessibilidade de longo prazo dos seus documentos PDF com nossa plataforma
                integrada ao Archivematica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" onClick={() => router.push("/login")}>
                  Entrar na plataforma
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/register")}>
                  Criar uma conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

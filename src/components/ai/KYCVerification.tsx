import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Camera,
  Upload,
  Download,
  Eye,
  Lock,
  Star,
  Crown,
  Loader2,
  Verified,
  XCircle
} from 'lucide-react';

interface KYCVerification {
  id: string;
  churchId: string;
  churchName: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents: KYCDocument[];
  verificationScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  notes?: string;
  nextReviewDate?: string;
}

interface KYCDocument {
  id: string;
  type: 'registration' | 'tax_id' | 'address_proof' | 'leadership_id' | 'financial_statement' | 'other';
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
  fileUrl?: string;
}

interface ChurchProfile {
  id: string;
  name: string;
  denomination: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website?: string;
  foundedYear?: number;
  taxId?: string;
  registrationNumber?: string;
  leadership: ChurchLeader[];
  isVerified: boolean;
  verificationLevel: 'none' | 'basic' | 'premium' | 'enterprise';
  verificationExpiry?: string;
}

interface ChurchLeader {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  idDocument?: string;
}

interface KYCVerificationProps {
  churchProfile: ChurchProfile;
  onVerificationUpdate?: (verification: KYCVerification) => void;
  userType: 'church' | 'admin';
}

export function KYCVerification({ churchProfile, onVerificationUpdate, userType }: KYCVerificationProps) {
  const [verification, setVerification] = useState<KYCVerification | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [selectedDocumentType, setSelectedDocumentType] = useState<KYCDocument['type']>('registration');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [reviewNotes, setReviewNotes] = useState('');

  // Dados mockados de verificação
  useEffect(() => {
    const mockVerification: KYCVerification = {
      id: 'kyc-1',
      churchId: churchProfile.id,
      churchName: churchProfile.name,
      status: churchProfile.isVerified ? 'approved' : 'pending',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: churchProfile.isVerified ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
      reviewedBy: churchProfile.isVerified ? 'admin-001' : undefined,
      documents: [
        {
          id: 'doc-1',
          type: 'registration',
          name: 'Registro da Igreja.pdf',
          status: churchProfile.isVerified ? 'verified' : 'pending',
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedAt: churchProfile.isVerified ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          verifiedBy: churchProfile.isVerified ? 'admin-001' : undefined,
          notes: churchProfile.isVerified ? 'Documento válido e legível' : undefined
        },
        {
          id: 'doc-2',
          type: 'tax_id',
          name: 'CNPJ.pdf',
          status: churchProfile.isVerified ? 'verified' : 'pending',
          uploadedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedAt: churchProfile.isVerified ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          verifiedBy: churchProfile.isVerified ? 'admin-001' : undefined,
          notes: churchProfile.isVerified ? 'CNPJ ativo e válido' : undefined
        },
        {
          id: 'doc-3',
          type: 'address_proof',
          name: 'Comprovante de Endereço.pdf',
          status: churchProfile.isVerified ? 'verified' : 'pending',
          uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          verifiedAt: churchProfile.isVerified ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
          verifiedBy: churchProfile.isVerified ? 'admin-001' : undefined,
          notes: churchProfile.isVerified ? 'Endereço confirmado' : undefined
        }
      ],
      verificationScore: churchProfile.isVerified ? 95 : 45,
      riskLevel: churchProfile.isVerified ? 'low' : 'medium',
      notes: churchProfile.isVerified ? 'Igreja verificada com sucesso' : 'Aguardando análise dos documentos',
      nextReviewDate: churchProfile.isVerified ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    setVerification(mockVerification);
  }, [churchProfile]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovada';
      case 'in_review': return 'Em Análise';
      case 'rejected': return 'Rejeitada';
      default: return 'Pendente';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'Baixo';
      case 'medium': return 'Médio';
      case 'high': return 'Alto';
      default: return 'Desconhecido';
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'registration': return 'Registro da Igreja';
      case 'tax_id': return 'CNPJ/CPF';
      case 'address_proof': return 'Comprovante de Endereço';
      case 'leadership_id': return 'Documento de Liderança';
      case 'financial_statement': return 'Demonstração Financeira';
      case 'other': return 'Outro';
      default: return type;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getDocumentStatusText = (status: string) => {
    switch (status) {
      case 'verified': return 'Verificado';
      case 'rejected': return 'Rejeitado';
      default: return 'Pendente';
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmitDocuments = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simular upload e processamento
    for (let i = 0; i < 3; i++) {
      setProcessingStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Criar novos documentos
    const newDocuments: KYCDocument[] = uploadedFiles.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      type: selectedDocumentType,
      name: file.name,
      status: 'pending',
      uploadedAt: new Date().toISOString()
    }));

    if (verification) {
      const updatedVerification: KYCVerification = {
        ...verification,
        documents: [...verification.documents, ...newDocuments],
        status: 'in_review',
        verificationScore: Math.max(verification.verificationScore - 10, 0)
      };

      setVerification(updatedVerification);
      if (onVerificationUpdate) {
        onVerificationUpdate(updatedVerification);
      }
    }

    setUploadedFiles([]);
    setIsProcessing(false);
    setProcessingStep(0);
  };

  const handleReviewDocument = async (documentId: string, status: 'verified' | 'rejected', notes: string) => {
    if (!verification) return;

    setIsProcessing(true);
    setProcessingStep(0);

    // Simular processamento
    for (let i = 0; i < 2; i++) {
      setProcessingStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    const updatedDocuments = verification.documents.map(doc => 
      doc.id === documentId 
        ? { 
            ...doc, 
            status, 
            verifiedAt: new Date().toISOString(),
            verifiedBy: 'admin-001',
            notes 
          }
        : doc
    );

    // Calcular novo score
    const verifiedDocs = updatedDocuments.filter(doc => doc.status === 'verified').length;
    const totalDocs = updatedDocuments.length;
    const newScore = Math.round((verifiedDocs / totalDocs) * 100);

    // Determinar novo status
    let newStatus = verification.status;
    if (newScore >= 80 && verification.documents.every(doc => doc.status !== 'pending')) {
      newStatus = 'approved';
    } else if (updatedDocuments.some(doc => doc.status === 'rejected')) {
      newStatus = 'rejected';
    }

    const updatedVerification: KYCVerification = {
      ...verification,
      documents: updatedDocuments,
      status: newStatus,
      verificationScore: newScore,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'admin-001',
      notes: reviewNotes || verification.notes
    };

    setVerification(updatedVerification);
    if (onVerificationUpdate) {
      onVerificationUpdate(updatedVerification);
    }

    setIsProcessing(false);
    setProcessingStep(0);
    setReviewNotes('');
  };

  const getVerificationLevelBadge = () => {
    const level = churchProfile.verificationLevel;
    const colors = {
      none: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      enterprise: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };

    const icons = {
      none: null,
      basic: <Shield className="w-3 h-3 mr-1" />,
      premium: <Star className="w-3 h-3 mr-1" />,
      enterprise: <Crown className="w-3 h-3 mr-1" />
    };

    return (
      <Badge className={colors[level]}>
        {icons[level]}
        {level === 'none' ? 'Não Verificada' :
         level === 'basic' ? 'Verificação Básica' :
         level === 'premium' ? 'Verificação Premium' :
         'Verificação Enterprise'}
      </Badge>
    );
  };

  if (!verification) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin" />
          <p>Carregando verificação...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Verificação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Verificação KYC - {churchProfile.name}</span>
            </div>
            {getVerificationLevelBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{verification.verificationScore}%</div>
              <div className="text-sm text-muted-foreground">Score de Verificação</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Badge className={getStatusColor(verification.status)}>
                {getStatusText(verification.status)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-2">Status</div>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <Badge className={getRiskLevelColor(verification.riskLevel)}>
                {getRiskLevelText(verification.riskLevel)}
              </Badge>
              <div className="text-sm text-muted-foreground mt-2">Nível de Risco</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload de Documentos (apenas para igrejas) */}
      {userType === 'church' && verification.status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Enviar Documentos para Verificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tipo de Documento</label>
                <select
                  value={selectedDocumentType}
                  onChange={(e) => setSelectedDocumentType(e.target.value as KYCDocument['type'])}
                  className="w-full mt-1 px-3 py-2 border rounded-md bg-background"
                >
                  <option value="registration">Registro da Igreja</option>
                  <option value="tax_id">CNPJ/CPF</option>
                  <option value="address_proof">Comprovante de Endereço</option>
                  <option value="leadership_id">Documento de Liderança</option>
                  <option value="financial_statement">Demonstração Financeira</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Arquivos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="w-full mt-1"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Arquivos selecionados:</p>
                <div className="flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <Badge key={index} variant="outline">
                      {file.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={handleSubmitDocuments}
              disabled={uploadedFiles.length === 0 || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Documentos
                </>
              )}
            </Button>

            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    {processingStep === 1 && 'Validando arquivos...'}
                    {processingStep === 2 && 'Processando documentos...'}
                    {processingStep === 3 && 'Finalizando...'}
                  </span>
                  <span>{processingStep}/3</span>
                </div>
                <Progress value={(processingStep / 3) * 100} />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos da Verificação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {verification.documents.map((document) => (
              <div key={document.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium">{document.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {getDocumentTypeText(document.type)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getDocumentStatusColor(document.status)}>
                      {getDocumentStatusText(document.status)}
                    </Badge>
                    
                    {document.status === 'pending' && userType === 'admin' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleReviewDocument(document.id, 'verified', 'Documento aprovado')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewDocument(document.id, 'rejected', 'Documento rejeitado')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Enviado:</span> {new Date(document.uploadedAt).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {document.verifiedAt && (
                    <div>
                      <span className="font-medium">Verificado:</span> {new Date(document.verifiedAt).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  
                  {document.verifiedBy && (
                    <div>
                      <span className="font-medium">Por:</span> {document.verifiedBy}
                    </div>
                  )}
                  
                  {document.notes && (
                    <div className="col-span-2 md:col-span-1">
                      <span className="font-medium">Notas:</span> {document.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico e Notas */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico da Verificação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Submetido em:</span>
              <span>{new Date(verification.submittedAt).toLocaleString('pt-BR')}</span>
            </div>
            
            {verification.reviewedAt && (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium">Revisado em:</span>
                <span>{new Date(verification.reviewedAt).toLocaleString('pt-BR')}</span>
              </div>
            )}
            
            {verification.reviewedBy && (
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Revisado por:</span>
                <span>{verification.reviewedBy}</span>
              </div>
            )}
            
            {verification.nextReviewDate && (
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="font-medium">Próxima revisão:</span>
                <span>{new Date(verification.nextReviewDate).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>
          
          {verification.notes && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium mb-2">Notas da Verificação:</p>
              <p className="text-sm">{verification.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selos de Verificação */}
      {verification.status === 'approved' && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-300">
              <Verified className="w-5 h-5" />
              <span>Selos de Verificação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <Verified className="w-12 h-12 mx-auto mb-2 text-green-600" />
                <h4 className="font-semibold text-green-800 dark:text-green-200">Verificada</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Esta igreja foi verificada e aprovada
                </p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Shield className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">KYC Completo</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Documentação completa verificada
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <Star className="w-12 h-12 mx-auto mb-2 text-purple-600" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-200">Confiável</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Baixo risco, alta confiabilidade
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
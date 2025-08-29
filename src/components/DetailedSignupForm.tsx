import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Church, User, MapPin, Phone, Mail, Instagram, DollarSign, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DetailedSignupFormProps {
  userType: 'church' | 'user';
  onComplete: () => void;
  onBack: () => void;
}

export function DetailedSignupForm({ userType, onComplete, onBack }: DetailedSignupFormProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    denomination: '',
    phone: '',
    pixKey: '', // Apenas para igreja
    instagram: '', // Apenas para igreja
    profileImage: ''
  });

  const totalSteps = userType === 'church' ? 3 : 2;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setFormData(prev => ({ ...prev, profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simular cadastro
    setTimeout(() => {
      setIsLoading(false);
      onComplete();
    }, 2000);
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.name && formData.address;
    }
    if (step === 2) {
      return formData.denomination && formData.phone;
    }
    if (step === 3 && userType === 'church') {
      return formData.pixKey;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              {userType === 'church' ? (
                <Church className="w-full h-full text-blue-600" />
              ) : (
                <User className="w-full h-full text-blue-600" />
              )}
            </div>
            <CardTitle className="mb-2">
              {userType === 'church' ? 'Cadastro da Igreja' : 'Complete seu Perfil'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Etapa {step} de {totalSteps}
            </p>
            <Progress value={progress} className="w-full mt-3" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Etapa 1: Informações Básicas */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Informações Básicas</h3>
                  <p className="text-sm text-muted-foreground">
                    Vamos começar com suas informações principais
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">
                    {userType === 'church' ? 'Nome da Igreja' : 'Nome Completo'}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={userType === 'church' ? 'Ex: Igreja Batista Central' : 'Seu nome completo'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Rua, número, bairro, cidade, estado"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 2: Contato e Denominação */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Contato e Denominação</h3>
                  <p className="text-sm text-muted-foreground">
                    Informações de contato e denominação religiosa
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="denomination">Denominação</Label>
                  <Select onValueChange={(value) => handleInputChange('denomination', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua denominação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="catolica">Católica</SelectItem>
                      <SelectItem value="batista">Batista</SelectItem>
                      <SelectItem value="pentecostal">Pentecostal</SelectItem>
                      <SelectItem value="presbiteriana">Presbiteriana</SelectItem>
                      <SelectItem value="metodista">Metodista</SelectItem>
                      <SelectItem value="luterana">Luterana</SelectItem>
                      <SelectItem value="adventista">Adventista</SelectItem>
                      <SelectItem value="assembleia">Assembleia de Deus</SelectItem>
                      <SelectItem value="universal">Universal</SelectItem>
                      <SelectItem value="outra">Outra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Upload de foto de perfil */}
                <div className="space-y-2">
                  <Label htmlFor="profile-image">Foto de Perfil</Label>
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      {profileImage ? (
                        <AvatarImage src={profileImage} />
                      ) : (
                        <AvatarFallback>
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="file"
                        id="profile-image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('profile-image')?.click()}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Escolher Foto
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG ou GIF (máx. 2MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Etapa 3: Informações Específicas da Igreja */}
            {step === 3 && userType === 'church' && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Informações Adicionais</h3>
                  <p className="text-sm text-muted-foreground">
                    Configurações específicas para gestão da igreja
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pixKey">Chave PIX para Doações</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="pixKey"
                      value={formData.pixKey}
                      onChange={(e) => handleInputChange('pixKey', e.target.value)}
                      placeholder="Digite a chave PIX da igreja"
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Esta chave será usada para receber doações online
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram (Opcional)</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                      placeholder="@suaigreja"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Navegação */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <div className="space-x-2">
                {step < totalSteps ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            </div>

            {/* Indicadores de progresso */}
            <div className="flex justify-center space-x-2 pt-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i + 1 <= step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
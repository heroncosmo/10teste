import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight, Building, Users, BriefcaseIcon, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = [
  {
    id: "welcome",
    title: "Bem-vindo ao WhatsApp Lead Pilot",
    description: "Vamos configurar sua conta para você começar a usar a plataforma em poucos minutos."
  },
  {
    id: "business",
    title: "Sobre seu negócio",
    description: "Nos conte um pouco sobre sua empresa para personalizarmos sua experiência."
  },
  {
    id: "target",
    title: "Público-alvo",
    description: "Defina quais tipos de empresas você deseja prospectar."
  },
  {
    id: "whatsapp",
    title: "Conectar WhatsApp",
    description: "Conecte seu WhatsApp para começar a enviar mensagens."
  },
  {
    id: "complete",
    title: "Tudo pronto!",
    description: "Sua conta está configurada e pronta para uso."
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [businessType, setBusinessType] = useState("");
  const [businessSize, setBusinessSize] = useState("");
  const [targetSegment, setTargetSegment] = useState<string[]>([]);
  const [targetLocation, setTargetLocation] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const handleNextStep = async () => {
    if (isProcessing) return;

    if (currentStep === 1 && (businessType === "" || businessSize === "")) {
      toast.error("Preencha todos os campos", {
        description: "Selecione o tipo e tamanho do seu negócio para continuar."
      });
      return;
    }

    if (currentStep === 2 && (targetSegment.length === 0 || targetLocation.length === 0)) {
      toast.error("Preencha todos os campos", {
        description: "Selecione pelo menos um segmento e uma localização para continuar."
      });
      return;
    }

    if (currentStep === 1) {
      setIsProcessing(true);
      try {
        await updateProfile({
          business_type: businessType,
          business_size: businessSize
        });
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Erro ao salvar dados", {
          description: "Houve um problema ao salvar os dados do seu negócio."
        });
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
    }

    if (currentStep === 2 && user) {
      setIsProcessing(true);
      try {
        const { error } = await supabase
          .from('target_preferences')
          .upsert({
            user_id: user.id,
            target_segments: targetSegment,
            target_locations: targetLocation
          }, {
            onConflict: 'user_id'
          });

        if (error) throw error;
      } catch (error) {
        console.error("Error saving preferences:", error);
        toast.error("Erro ao salvar preferências", {
          description: "Houve um problema ao salvar suas preferências de público-alvo."
        });
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
    }

    if (currentStep === 3 && user) {
      // This is where you would typically handle WhatsApp connection
      // For now, we'll just skip it
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate("/dashboard");
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep) / (steps.length - 1)) * 100;
  };

  const toggleTargetSegment = (segment: string) => {
    if (targetSegment.includes(segment)) {
      setTargetSegment(targetSegment.filter(s => s !== segment));
    } else {
      setTargetSegment([...targetSegment, segment]);
    }
  };

  const toggleTargetLocation = (location: string) => {
    if (targetLocation.includes(location)) {
      setTargetLocation(targetLocation.filter(l => l !== location));
    } else {
      setTargetLocation([...targetLocation, location]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="mb-8">
            <Progress value={getProgressPercentage()} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Início</span>
              <span>Concluído</span>
            </div>
          </div>

          <Card className="p-6 shadow-md">
            <div className="space-y-6">
              {/* Step 1: Welcome */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg 
                        viewBox="0 0 24 24" 
                        className="h-16 w-16 text-brandBlue-600"
                        fill="currentColor"
                      >
                        <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5zM16.25 13.97c-.19-.1-1.12-.55-1.3-.61c-.17-.06-.3-.09-.42.09c-.12.19-.47.61-.58.74c-.11.13-.21.14-.4.05c-1.07-.54-1.77-.97-2.47-2.2c-.19-.32.19-.3.54-1c.06-.11.03-.21-.02-.3c-.05-.08-.42-1.01-.58-1.38c-.15-.36-.31-.31-.42-.32c-.11 0-.24-.03-.36-.03s-.33.05-.5.24c-.17.19-.64.63-.64 1.53c0 .9.67 1.77.76 1.89c.09.12 1.24 1.97 3.05 2.69c1.13.45 1.57.49 2.13.41c.34-.05 1.12-.46 1.28-.9c.16-.45.16-.83.11-.91c-.05-.08-.19-.14-.38-.24z"/>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Prospecção Automatizada</h3>
                        <p className="text-gray-600 text-sm">Acesso a milhares de leads atualizados diariamente com números de WhatsApp validados.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Mensagens Personalizadas</h3>
                        <p className="text-gray-600 text-sm">Crie variações de mensagens com dados dinâmicos para aumentar suas taxas de resposta.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Envio Seguro</h3>
                        <p className="text-gray-600 text-sm">Comportamento humano simulado para evitar bloqueios e garantir a entrega das mensagens.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Business */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual é o tipo do seu negócio?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Agência de Marketing", "Consultoria", "E-commerce", "Prestador de Serviços", "Indústria", "Outros"].map((type) => (
                          <div
                            key={type}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              businessType === type 
                                ? "border-brandBlue-600 bg-brandBlue-50 shadow-sm" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setBusinessType(type)}
                          >
                            <div className="flex items-center">
                              {businessType === type && (
                                <CheckCircle2 className="h-5 w-5 text-brandBlue-600 mr-2" />
                              )}
                              <span>{type}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Qual é o tamanho da sua empresa?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["Somente eu", "2-10 funcionários", "11-50 funcionários", "51-200 funcionários", "201+ funcionários"].map((size) => (
                          <div
                            key={size}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              businessSize === size 
                                ? "border-brandBlue-600 bg-brandBlue-50 shadow-sm" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => setBusinessSize(size)}
                          >
                            <div className="flex items-center">
                              {businessSize === size && (
                                <CheckCircle2 className="h-5 w-5 text-brandBlue-600 mr-2" />
                              )}
                              <span>{size}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Target */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quais segmentos você deseja prospectar? (selecione quantos quiser)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {["Restaurantes", "Clínicas e Consultórios", "Lojas de Varejo", "Academias", "Salões de Beleza", "Escritórios de Advocacia", "Escritórios de Contabilidade", "Agências de Viagem", "Pet Shops", "Imobiliárias", "Escolas e Cursos", "Outros"].map((segment) => (
                          <div
                            key={segment}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              targetSegment.includes(segment)
                                ? "border-brandBlue-600 bg-brandBlue-50 shadow-sm" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleTargetSegment(segment)}
                          >
                            <div className="flex items-center">
                              {targetSegment.includes(segment) && (
                                <CheckCircle2 className="h-5 w-5 text-brandBlue-600 mr-2" />
                              )}
                              <span>{segment}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Em quais regiões você deseja prospectar? (selecione quantas quiser)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {["São Paulo", "Rio de Janeiro", "Minas Gerais", "Distrito Federal", "Paraná", "Santa Catarina", "Rio Grande do Sul", "Bahia", "Pernambuco", "Ceará", "Goiás", "Todo o Brasil"].map((location) => (
                          <div
                            key={location}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              targetLocation.includes(location)
                                ? "border-brandBlue-600 bg-brandBlue-50 shadow-sm" 
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                            onClick={() => toggleTargetLocation(location)}
                          >
                            <div className="flex items-center">
                              {targetLocation.includes(location) && (
                                <CheckCircle2 className="h-5 w-5 text-brandBlue-600 mr-2" />
                              )}
                              <span>{location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Connect WhatsApp */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                    <p className="text-gray-600">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-medium">Conectar WhatsApp Web</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center">
                      <div className="bg-white p-6 border rounded-lg mb-6">
                        <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="flex justify-center mb-4">
                              <svg 
                                viewBox="0 0 24 24" 
                                className="h-12 w-12 text-gray-400"
                                fill="currentColor"
                              >
                                <path d="M17.6 6.32C16.27 4.8 14.27 4 12 4C7.59 4 4 7.59 4 12c0 1.47.5 2.89 1.44 4.09L4.55 20l3.96-.87c1.17.79 2.56 1.2 3.99 1.2h.03c4.41 0 8-3.59 8-8c0-2.52-1.17-4.58-2.93-6.01zM12 20c-1.29 0-2.56-.36-3.65-1.05l-.24-.14l-2.61.57l.57-2.55l-.16-.25c-.78-1.07-1.18-2.38-1.18-3.74c0-3.58 2.92-6.5 6.5-6.5c2.02 0 3.77.92 4.95 2.35C17.42 10.12 18 11.97 18 12.17c0 3.58-2.92 6.5-6.5 6.5z"/>
                              </svg>
                            </div>
                            <p className="text-gray-500 text-sm">QR Code para scan</p>
                          </div>
                        </div>
                      </div>
                      
                      <ol className="space-y-3 text-gray-600 text-sm mb-6 max-w-md">
                        <li className="flex items-start">
                          <span className="bg-brandBlue-100 text-brandBlue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                          <span>Abra o WhatsApp no seu celular</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-brandBlue-100 text-brandBlue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                          <span>Toque em Configurações (ou os três pontos) e selecione WhatsApp Web/Desktop</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-brandBlue-100 text-brandBlue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                          <span>Aponte seu celular para esta tela para capturar o código QR</span>
                        </li>
                        <li className="flex items-start">
                          <span className="bg-brandBlue-100 text-brandBlue-700 rounded-full w-5 h-5 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                          <span>Aguarde a confirmação de conexão</span>
                        </li>
                      </ol>
                      
                      <div className="text-center text-sm text-gray-500 max-w-md">
                        <p className="mb-2">O WhatsApp Lead Pilot utiliza apenas o seu próprio WhatsApp Web para enviar mensagens. Não armazenamos nenhuma senha ou acessamos sua conta.</p>
                        <p>Você pode pular essa etapa e conectar mais tarde no painel.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Complete */}
              {currentStep === 4 && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="rounded-full bg-green-100 p-4">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                    <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Building className="h-6 w-6 text-brandBlue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Leads Prontos</h3>
                        <p className="text-gray-600 text-sm">Você já tem empresas disponíveis para contato.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Users className="h-6 w-6 text-brandBlue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Perfil Configurado</h3>
                        <p className="text-gray-600 text-sm">Suas preferências foram salvas com sucesso.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <BriefcaseIcon className="h-6 w-6 text-brandBlue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Plano Ativado</h3>
                        <p className="text-gray-600 text-sm">Você está no plano gratuito. Faça upgrade quando quiser.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Zap className="h-6 w-6 text-brandBlue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium">Tudo Pronto</h3>
                        <p className="text-gray-600 text-sm">Você já pode enviar sua primeira campanha.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {currentStep > 0 && currentStep < steps.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    disabled={isProcessing}
                  >
                    Voltar
                  </Button>
                ) : (
                  <div></div>
                )}

                <Button 
                  onClick={handleNextStep} 
                  className="group"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "Ir para o Dashboard" : "Continuar"}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

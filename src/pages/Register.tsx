import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, EyeOffIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { validateEmail, normalizeEmail, getEmailSuggestion, SUGGESTED_DOMAINS } from "@/utils/emailValidation";
import BottomNavigation from "@/components/ui/BottomNavigation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [emailFocused, setEmailFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("register");
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Don't show validation errors immediately for empty fields
    if (newEmail) {
      const validation = validateEmail(newEmail);
      setEmailError(validation.message);
    } else {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    setEmailFocused(false);
    if (email) {
      const validation = validateEmail(email);
      setEmailError(validation.message);
    }
  };

  // Check if email domain is one of the suggested domains
  const isValidDomain = () => {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1].toLowerCase();
    return SUGGESTED_DOMAINS.includes(domain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      toast.error("E-mail inválido", {
        description: emailValidation.message
      });
      return;
    }
    
    if (password !== passwordConfirmation) {
      toast.error("Senhas não correspondem", {
        description: "Por favor, verifique se as senhas são iguais."
      });
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Termos e Condições", {
        description: "Você precisa aceitar os termos e condições para continuar."
      });
      return;
    }

    setIsLoading(true);

    try {
      const trimmedEmail = normalizeEmail(email);
      await signUp(trimmedEmail, password, { full_name: name });
      
      // Redireciona para o feed após registro bem-sucedido
      toast.success("Cadastro realizado com sucesso!");
      navigate("/feed");
    } catch (error) {
      console.error("Registration error:", error);
      
      // Verifica se o erro é de usuário já cadastrado
      if (error.message?.includes("User already registered")) {
        toast.error("Usuário já cadastrado", {
          description: "Este e-mail já está em uso. Tente fazer login ou use outro e-mail."
        });
      } else {
        toast.error("Erro ao criar conta", {
          description: "Ocorreu um erro ao criar sua conta. Tente novamente mais tarde."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Status Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center flex-1 gap-3">
          <div className="flex items-center shrink-0">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-500 text-sm">🚀</span>
            </div>
            <span className="font-bold text-lg ml-2 hidden sm:inline">Lead Pilot</span>
            <span className="font-bold text-lg ml-2 sm:hidden">LP</span>
          </div>
        </div>
        
        <div className="flex items-center ml-2">
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs"
            asChild
          >
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </div>
      
      {/* Add a persuasive explanation banner below the top status bar */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-2 border-b border-gray-200">
        <p className="text-xs text-gray-700 leading-tight">
          <span className="font-semibold">Crie sua conta gratuitamente</span> e comece a prospectar empresas de forma inteligente e automatizada.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-2 mb-20">
        <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Criar uma conta</CardTitle>
            <CardDescription className="text-center">
              Preencha os campos abaixo para começar a usar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input 
                  id="name"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus-visible:ring-blue-300 focus-visible:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className={emailError ? "text-red-500" : ""}>E-mail</Label>
                <div className="relative">
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="seu@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={handleEmailBlur}
                    required
                    className={`transition-all pl-4 ${
                      emailError 
                        ? "border-red-300 pr-10 focus-visible:ring-red-300 focus-visible:border-red-400" 
                        : isValidDomain() 
                          ? "border-green-300 pr-10 focus-visible:ring-green-300 focus-visible:border-green-400" 
                          : "focus-visible:ring-blue-300 focus-visible:border-blue-400"
                    }`}
                  />
                  {emailError && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  {!emailError && isValidDomain() && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {emailError ? (
                  <p className="text-xs text-red-500 mt-1">{emailError}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus-visible:ring-blue-300 focus-visible:border-blue-400"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={toggleShowPassword}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">Confirmar Senha</Label>
                <Input 
                  id="passwordConfirmation"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="focus-visible:ring-blue-300 focus-visible:border-blue-400"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Termos de Serviço
                  </a>
                  {" "}e{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Política de Privacidade
                  </a>
                </label>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium" 
                disabled={isLoading || !!emailError}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : "Criar conta"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t bg-gray-50">
            <div className="text-center text-sm text-gray-600 pt-2">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                Faça login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};

export default Register;

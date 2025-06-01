import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, EyeIcon, EyeOffIcon, Loader2, AlertCircle, CheckCircle, Search } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";
import { validateEmail, normalizeEmail, getEmailSuggestion, SUGGESTED_DOMAINS } from "@/utils/emailValidation";
import BottomNavigation from "@/components/ui/BottomNavigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const { signIn } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate e-mail
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid && email) {
      toast.error("E-mail inválido", {
        description: emailValidation.message
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const trimmedEmail = normalizeEmail(email);
      await signIn(trimmedEmail, password);
      
      // Redireciona para o feed após login bem-sucedido
      toast.success("Login realizado com sucesso!");
      navigate("/feed");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Erro ao fazer login", {
        description: "Verifique suas credenciais e tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Check if email domain is one of the suggested domains
  const isValidDomain = () => {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1].toLowerCase();
    return SUGGESTED_DOMAINS.includes(domain);
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
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            asChild
          >
            <Link to="/register">Criar Conta</Link>
          </Button>
        </div>
      </div>
      
      {/* Add a persuasive explanation banner below the top status bar */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 py-2 border-b border-gray-200">
        <p className="text-xs text-gray-700 leading-tight">
          <span className="font-semibold">Mais de 30 milhões de empresas</span> disponíveis para você prospectar. Acesse sua conta para começar.
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-2 mb-20">
        <Card className="w-full max-w-md shadow-lg border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="text-2xl text-center font-bold">Bem-vindo de volta!</CardTitle>
            <CardDescription className="text-center">
              Continue gerando oportunidades para seu negócio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                    Esqueceu a senha?
                  </Link>
                </div>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-4 focus-visible:ring-blue-300 focus-visible:border-blue-400"
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
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium text-white py-2 rounded-md shadow-md hover:shadow-lg transform hover:-translate-y-0.5" 
                disabled={isLoading || !!emailError}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : "Entrar"}
              </Button>
            </form>
            
            <div className="relative flex items-center justify-center mt-6 mb-2">
              <div className="border-t border-gray-200 w-full absolute"></div>
              <span className="bg-white px-3 relative z-10 text-sm text-gray-500">Ou continue com</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </Button>
              <Button variant="outline" className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
                <span>Facebook</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t bg-gray-50">
            <div className="text-center text-sm text-gray-600 pt-2">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors">
                Cadastre-se
              </Link>
            </div>
            <div className="text-center text-xs text-gray-500">
              Ao entrar, você concorda com nossos{" "}
              <a href="#" className="text-gray-600 underline underline-offset-4 hover:text-gray-700">
                Termos de Serviço
              </a>
              {" "}e{" "}
              <a href="#" className="text-gray-600 underline underline-offset-4 hover:text-gray-700">
                Política de Privacidade
              </a>
              .
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

export default Login;


import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gradient-to-r from-brandBlue-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-16 md:p-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para transformar sua prospecção?
              </h2>
              <p className="text-xl text-white/80 mb-10">
                Comece agora mesmo com nossa versão gratuita e veja o poder da automação em ação.
                Nenhum cartão de crédito necessário.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-brandBlue-600 hover:bg-gray-100 min-w-[200px] group">
                    Começar Grátis
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 min-w-[200px]">
                    Fazer Login
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-white/70 text-sm">
                Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;

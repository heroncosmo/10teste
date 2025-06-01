
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como os leads são obtidos pelo sistema?",
    answer: "Através de uma extensão de navegador que funciona 24h/dia, coletando dados públicos de empresas com CNPJ ativo. Os leads são validados automaticamente e organizados por cidade, CNAE, capital social e situação cadastral."
  },
  {
    question: "Preciso ter conhecimento técnico para usar a plataforma?",
    answer: "Não! A plataforma foi projetada para ser extremamente simples e intuitiva. Qualquer pessoa, mesmo sem conhecimento técnico, pode criar campanhas eficientes em poucos minutos."
  },
  {
    question: "É seguro usar o WhatsApp dessa forma?",
    answer: "Sim. O sistema usa seu próprio WhatsApp Web, simulando comportamento humano com delays aleatórios entre mensagens e pausas automáticas. Isso reduz drasticamente o risco de bloqueios e mantém a segurança da sua conta."
  },
  {
    question: "Preciso instalar algum software no meu computador?",
    answer: "Não. Todo o processo é feito diretamente pelo navegador. A plataforma é 100% online e pode ser acessada de qualquer dispositivo com internet."
  },
  {
    question: "Como funciona o limite de leads e mensagens?",
    answer: "Cada plano tem um limite mensal de leads que você pode acessar e mensagens que pode enviar. Quando esse limite é atingido, você pode fazer upgrade para um plano superior ou aguardar a renovação do seu ciclo."
  },
  {
    question: "O sistema pode ser usado por mais de uma pessoa na empresa?",
    answer: "Sim, nos planos Profissional e Avançado é possível adicionar múltiplos usuários, cada um com seu próprio acesso e permissões definidas."
  },
  {
    question: "É possível personalizar as mensagens para cada lead?",
    answer: "Sim! O sistema permite criar mensagens com variáveis dinâmicas como nome da empresa, cidade, CNAE e outras informações que são preenchidas automaticamente para cada lead."
  },
  {
    question: "Como faço para testar a plataforma antes de assinar?",
    answer: "Oferecemos uma versão gratuita com limites reduzidos para que você possa testar todas as funcionalidades antes de escolher um plano pago."
  }
];

const FaqSection = () => {
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Perguntas Frequentes</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossa plataforma de prospecção via WhatsApp.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Ainda tem dúvidas? Entre em contato com nosso suporte via{" "}
            <a href="#" className="text-brandBlue-600 hover:text-brandBlue-700 font-medium">
              WhatsApp
            </a>{" "}
            ou{" "}
            <a href="#" className="text-brandBlue-600 hover:text-brandBlue-700 font-medium">
              e-mail
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

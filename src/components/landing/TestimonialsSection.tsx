
import { Star } from "lucide-react";

const testimonials = [
  {
    content: "Em apenas duas semanas usando o sistema, conseguimos 14 novos clientes para nossa agência digital. O melhor investimento que fizemos este ano!",
    author: "Ana Silva",
    role: "Diretora de Marketing, AgênciaDigital"
  },
  {
    content: "Incrível como as mensagens personalizadas fazem diferença. Nossa taxa de resposta subiu de 2% para 11% em apenas um mês usando a plataforma.",
    author: "Carlos Mendes",
    role: "CEO, Empresa de Software"
  },
  {
    content: "Reduzi meu tempo de prospecção em 80% e aumentei as vendas em 35%. A funcionalidade de variações aleatórias é simplesmente genial.",
    author: "Marcela Alves",
    role: "Consultora Comercial, Seguradora"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Veja como a plataforma está transformando negócios de todos os tamanhos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-white rounded-lg shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
              <div className="rounded-full bg-brandBlue-100 p-4">
                <svg className="h-24 w-24 text-brandBlue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
            </div>
            <div className="md:w-2/3">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-4">Resultados Transformadores</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-3xl font-bold text-brandBlue-600">87%</p>
                    <p className="text-gray-600">Aumento médio na eficiência da prospecção</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-brandBlue-600">32%</p>
                    <p className="text-gray-600">Crescimento médio na taxa de conversão</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-brandBlue-600">73%</p>
                    <p className="text-gray-600">Redução no tempo dedicado à prospecção</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Baseado nas métricas de clientes que usam a plataforma por pelo menos 30 dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

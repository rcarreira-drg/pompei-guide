import Hero from '@/components/Hero';
import Quiz from '@/components/Quiz';

export default function QuizPage() {
  return (
    <div>
      <Hero kicker="PONTE A PRUEBA" title="QUIZ" subtitle="40 preguntas sobre Pompeya, por capítulo o todas de golpe" />
      <div className="container">
        <Quiz />
      </div>
    </div>
  );
}

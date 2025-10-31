import Hero from '@/components/home/Hero';
import Metrics from '@/components/home/Metrics';
import ServicesOverview from '@/components/home/ServicesOverview';
import CTASection from '@/components/home/CTA';

export default function HomePage() {
  return (
    <div className="space-y-24">
      <Hero />
      <Metrics />
      <ServicesOverview />
      <CTASection />
    </div>
  );
}

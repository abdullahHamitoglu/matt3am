import Collection from '@/components/home/collection'
import Features from '@/components/home/Features'
import ReadyToStart from '@/components/home/RedyToStart'
import Services from '@/components/home/Services'
import Steps from '@/components/home/Steps'
import Testimonials from '@/components/home/Testmenuals'
import ProductCard from '@/components/product/ProductCard'

export default function App() {
  return (
    <div className="flex flex-col gap-6 md:mx-auto px-3 container">
      <Collection />
      <Services />
      <Features />
      <Steps />
      <Testimonials />
      <ReadyToStart />
      <ProductCard />
    </div>
  )
}

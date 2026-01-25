import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl';
import React from 'react'

type Props = {}

const Services = (props: Props) => {
  const t = useTranslations();

  const services = () => {
    const liClassNames = 'font-normal text- text-colors-common-white text-xs';
    const ulClassNames = 'opacity-80 ps-5 list-disc';
    return [
      {
        name: "تقارير أداء وتحليلات",
        icon: "solar:chef-hat-minimalistic-bold-duotone",
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">احصل على تقارير دورية حول الطلبات الأكثر شيوعا وأوقات الذروة.</li>
          <li class="${liClassNames}">قم بتحسين أداء مطعمك بناءً على بيانات دقيقة.</li>
        </ul>
      `
      },
      {
        name: "إدارة الحجوزات والطاولات",
        icon: "solar:document-add-bold-duotone",
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">تمكين العملاء من حجز الطاولات.</li>
          <li class="${liClassNames}">ربط الطاولات برموز QR لتسهيل الطلب المباشر.</li>
        </ul>
      `
      },
      {
        name: "نظام دفع إلكتروني متكامل",
        icon: "solar:wallet-money-bold-duotone",
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">دعم لبطاقات الائتمان، الحافظ الإلكترونية، والدفع عند الاستلام.</li>
          <li class="${liClassNames}">وفر تجربة دفع سريعة وآمنة للعملاء.</li>
        </ul>
      `
      },
      {
        name: "إدارة الطلبات بسلاسة",
        icon: 'solar:bar-chair-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">تتبع الطلبات من الطاولات أو الطلبات الخارجية في الوقت الفعلي.</li>
          <li class="${liClassNames}">عرض حالة الطلب (قيد التحضير، جاهز، تم التوصيل).</li>
        </ul>
      `
      },
      {
        name: "إدارة القوائم الإلكترونية",
        icon: "solar:document-add-bold-duotone",
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">أنشئ وقم بتحديث قوائم الطعام بسهولة.</li>
          <li class="${liClassNames}">أضف صوراً للأطباق وأسعارها لجذب العملاء.</li>
        </ul>
      `
      }
    ]
  }

  const features = [
    {
      name: "متعدد اللغات",
      icon: 'solar:global-bold-duotone',
      description: "يدعم النطاقات متعددة لتلبية احتياجات العملاء للتنوع."
    },
    {
      name: "سهولة الاستخدام",
      icon: 'solar:star-bold-duotone',
      description: "واجهة بسيطة وبديهية لأصحاب المطعم والعملاء."
    },
    {
      name: "تكامل مع الخرائط",
      icon: 'solar:point-on-map-bold-duotone',
      description: "عرض مواقع الفروع وتوجيه العملاء إلى الطاولات بسهولة."
    },
    {
      name: "اشعارات فورية",
      icon: 'solar:bell-bold-duotone',
      description: "إشعارات فورية للمالك بالطلبات والتحديثات في الوقت المناسب."
    }
  ];


  return (
    <div className='gap-4 grid grid-cols-2 md:grid-cols-5'>
      {services().map((item, index) => (
        <div className={`flex flex-col items-start md:p-4 p-3 rounded-2xl text-white ${index % 2 ? 'bg-secondary-500' : 'bg-primary-400'} ${index === 4 ? 'md:col-span-1 col-span-2' : ''}`} key={index}>
          <Icon icon={item.icon as string} className='mb-3 text-2xl md:text-4xl' />
          <div className="[&>ul]:opacity-80 [&>ul]:md:ps-5 [&>ul]:ps-2 w-full [&>ul]:list-disc">
            <p className='mb-2 font-bold md:text-medium text-sm'>{item.name}</p>
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        </div>
      ))}

    </div>
  )
}

export default Services
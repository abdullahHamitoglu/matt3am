'use client'

import React from 'react'
import { LayoutGrid, ClipboardList, Clock, User, MoreHorizontal, CalendarDays } from 'lucide-react'
import type { DashboardViewProps } from '../types'
import { StatCard } from '../stats/StatCard'
import { ActivityItem } from '../stats/ActivityItem'
import { PopularItem } from '../stats/PopularItem'

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenModal, onOpenOrder }) => (
  <div className="space-y-6 animate-in duration-500 fade-in">
    {/* Top Stats Row */}
    <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="إجمالي المبيعات"
        value="₺12,450"
        subtext="اليوم"
        trendValue="15%"
        icon={LayoutGrid}
        trend="up"
      />
      <StatCard
        title="الطلبات النشطة"
        value="24"
        subtext="8 طاولات"
        trendValue="8+"
        icon={ClipboardList}
        trend="up"
      />
      <StatCard
        title="توقيت المطبخ"
        value="18 د"
        subtext="متوسط/طلب"
        trendValue="3 د"
        icon={Clock}
        trend="down"
      />
      <StatCard
        title="الموظفين"
        value="8/12"
        subtext="المناوبة الحالية"
        trendValue="مكتمل"
        icon={User}
        trend="up"
      />
    </div>

    {/* Main Dashboard Grid */}
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        {/* Revenue Chart Card */}
        <div className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                تحليل المبيعات (ساعة بساعة)
              </h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs">
                ذروة المبيعات اليوم كانت الساعة 2:00 م
              </p>
            </div>
            <button className="hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-full text-slate-400 dark:text-slate-500">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="flex justify-between items-end gap-3 px-2 h-64">
            {[40, 65, 30, 80, 55, 90, 45, 60, 75, 50, 85, 95].map((h, i) => (
              <div key={i} className="group flex flex-col justify-end items-center w-full h-full">
                <div className="relative flex flex-1 justify-center items-end pb-2 w-full">
                  <div
                    className="relative bg-orange-100 dark:bg-orange-900/30 dark:group-hover:bg-orange-600 group-hover:bg-orange-500 rounded-t-xl w-full transition-all duration-300"
                    style={{ height: `${h * 0.8}%` }}
                  >
                    <div className="-top-10 z-20 absolute bg-slate-800 dark:bg-slate-700 opacity-0 group-hover:opacity-100 shadow-lg px-2 py-1 rounded-lg font-bold text-[10px] text-white whitespace-nowrap transition-all translate-x-1/2 translate-y-2 group-hover:ltr:translate-y-0 duration-300 pointer-events-none start-1/2">
                      ₺{h * 150}
                      <div className="-bottom-1 absolute bg-slate-800 dark:bg-slate-700 w-2 h-2 rotate-45 -translate-x-1/2 start-1/2"></div>
                    </div>
                  </div>
                </div>
                <span className="flex items-center h-4 font-medium text-slate-400 dark:text-slate-500 text-xs whitespace-nowrap">
                  {12 + i}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">أحدث الطلبات</h3>
            <button className="font-medium text-orange-500 dark:text-orange-400 text-sm hover:underline">
              عرض الكل
            </button>
          </div>
          <div className="space-y-1">
            <ActivityItem
              onClick={() => onOpenOrder('1023')}
              orderId="1023"
              table="T-12"
              items="2x برجر دبل، 1x بيبسي"
              time="منذ دقيقتين"
              status="new"
            />
            <ActivityItem
              onClick={() => onOpenOrder('1022')}
              orderId="1022"
              table="T-04"
              items="1x مشاوي مشكل، سلطة"
              time="منذ 8 دقائق"
              status="cooking"
            />
            <ActivityItem
              onClick={() => onOpenOrder('1021')}
              orderId="1021"
              table="VIP-1"
              items="5x قهوة تركية"
              time="منذ 12 دقيقة"
              status="ready"
            />
            <ActivityItem
              onClick={() => onOpenOrder('1020')}
              orderId="1020"
              table="T-08"
              items="1x تشيز كيك"
              time="منذ 15 دقيقة"
              status="ready"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Actions */}
        <div className="relative bg-orange-500 shadow-lg shadow-orange-200 dark:shadow-orange-500/20 p-6 rounded-3xl overflow-hidden text-white">
          <div className="-top-10 absolute bg-white opacity-10 blur-3xl rounded-full w-40 h-40 -start-10"></div>
          <h3 className="z-10 relative mb-2 font-bold text-lg">إجراء سريع</h3>
          <p className="z-10 relative mb-6 text-orange-100 text-sm">إدارة العمليات بضغطة زر</p>
          <div className="z-10 relative gap-3 grid grid-cols-2">
            <button
              onClick={() => onOpenModal('newOrder')}
              className="flex flex-col justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
            >
              <ClipboardList size={24} className="mb-2" />
              طلب جديد
            </button>
            <button
              onClick={() => onOpenModal('reservation')}
              className="flex flex-col justify-center items-center bg-white/20 hover:bg-white/30 backdrop-blur-sm p-4 rounded-2xl font-bold text-sm hover:scale-105 transition-transform"
            >
              <CalendarDays size={24} className="mb-2" />
              حجز طاولة
            </button>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-100 text-lg text-start">
            الأكثر طلباً اليوم 🔥
          </h3>
          <PopularItem rank={1} name="برجر دبل تشيز" count="42" price="₺250" />
          <PopularItem rank={2} name="عصير برتقال" count="35" price="₺60" />
          <PopularItem rank={3} name="مشاوي مشكل" count="28" price="₺450" />
          <button className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mt-4 py-3 rounded-2xl w-full font-medium text-slate-500 dark:text-slate-400 text-sm transition-colors">
            تحليل المنيو الكامل
          </button>
        </div>
      </div>
    </div>
  </div>
)

'use client';

import { User, Calendar as CalendarIcon, CreditCard, Check } from 'lucide-react';

interface BookingWizardStepperProps {
    currentStep: number;
}

export default function BookingWizardStepper({ currentStep }: BookingWizardStepperProps) {
    const steps = [
        { id: 1, label: "Data Diri", icon: User },
        { id: 2, label: "Jadwal", icon: CalendarIcon },
        { id: 3, label: "Bayar", icon: CreditCard },
    ];

    return (
        <div className="w-full lg:w-1/4">
            {/* Mobile Horizontal Stepper */}
            <div className="lg:hidden">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
                    {/* Stepper Progress */}
                    <div className="flex items-center justify-between relative mb-6">
                        {/* Background Lines */}
                        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                            <div 
                                className="h-full bg-gradient-to-r from-[#D93F21] to-[#FF6B35] transition-all duration-500"
                                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                            ></div>
                        </div>

                        {/* Step Items */}
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center z-10 flex-1">
                                <div className={`
                                    w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 mb-2
                                    ${currentStep > step.id 
                                        ? 'bg-gradient-to-r from-[#D93F21] to-[#FF6B35] text-white' 
                                        : currentStep === step.id 
                                        ? 'bg-gradient-to-r from-[#D93F21] to-[#FF6B35] text-white shadow-lg ring-2 ring-[#FF6B35] ring-offset-2'
                                        : 'bg-gray-200 text-gray-400'}
                                `}>
                                    {currentStep > step.id ? (
                                        <Check className="w-5 h-5" />
                                    ) : (
                                        step.id
                                    )}
                                </div>
                                <span className={`text-xs font-bold text-center ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Step Description */}
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
                        <p className="text-xs text-gray-700 font-medium text-center">
                            {currentStep === 1 && "📝 Masukan data diri anda"}
                            {currentStep === 2 && "📅 Pilih jadwal pesanan anda"}
                            {currentStep === 3 && "💳 Pilih metode pembayaran"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop Vertical Stepper */}
            <div className="hidden lg:block space-y-4 sticky top-20 w-64">
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 shadow-sm">
                    <div className="flex items-end gap-2 mb-3">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Step</span>
                        <h2 className="text-5xl font-black text-[#D93F21] leading-none">{currentStep}</h2>
                    </div>
                    <div className="h-0.5 bg-gradient-to-r from-[#D93F21] to-[#FF6B35] rounded-full mb-3"></div>
                    <p className="text-gray-700 text-xs font-medium leading-snug">
                        {currentStep === 1 && "Masukan data diri"}
                        {currentStep === 2 && "Pilih jadwal pesanan"}
                        {currentStep === 3 && "Pilih pembayaran"}
                    </p>
                </div>

                <div className="relative space-y-4 pl-8">
                    {/* Garis Penghubung */}
                    <div className="absolute left-[22px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-[#D93F21] via-[#FF6B35] to-gray-200 -z-10"></div>

                    {steps.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                            <div className={`
                                w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 font-bold flex-shrink-0
                                ${currentStep >= item.id 
                                    ? 'bg-gradient-to-r from-[#D93F21] to-[#FF6B35]' 
                                    : 'bg-gray-300'}
                            `}>
                                {currentStep > item.id ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <item.icon className="w-5 h-5" />
                                )}
                            </div>
                            <span className={`text-sm font-semibold whitespace-nowrap transition-all ${currentStep === item.id ? 'text-gray-900' : currentStep > item.id ? 'text-gray-600' : 'text-gray-400'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
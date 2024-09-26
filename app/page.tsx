
"use client"

import { useState } from 'react';
import AuthLayout from '@/components/AuthLayout';
import { FotobuchContent } from '@/components/Dashboard/FotobuchContent';
import { LpWelleContent } from '@/components/Dashboard/LpWelleContent';
import { PrintContent } from '@/components/Dashboard/PrintContent';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('LpWelle');

  return (
    <AuthLayout>
    <main className="bg-gray-100 min-h-screen pb-20">
      <section className="pt-24 px-8 mx-auto">
        <div className="flex items-center space-x-8 mb-8">
          <div className="bg-gray-300 px-8 py-28 text-center rounded-lg flex-1">
            <p className="text-lg italic">Place for image</p>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-orange-500">
              Root Component
            </h1>
            <p className="text-lg">
              Follow these instructions for the best experience using HeartThink.
            </p>
          </div>
        </div>

        <div className="mb-8 flex justify-center flex-col items-center">
          <p className="text-lg mb-4">
            To ensure optimal results, make sure you carefully read and follow all instructions provided on this page. These guidelines are designed to help you navigate and fully utilize the features available.
          </p>
        </div>

        <div className="flex space-x-8">
          <div className="flex-1">
            <p className="text-lg mb-4 bg-orange-100 indent-12">
              For the best results, please ensure that you have completed all necessary preparations. Double-check your settings and familiarize yourself with the interface to avoid any issues.
            </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg flex-1 mt-20">
          <div className="flex">
            {['LpWelle', 'Fotobuch', 'Print'].map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 text-center py-2 ${
                  activeTab === tab 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                } ${
                  index === 0 ? 'rounded-br-lg rounded-tl-lg' : ''
                } ${
                  index === 1 ? 'rounded-b-lg' : ''
                } ${
                  index === 2 ? 'rounded-bl-lg rounded-tr-lg' : ''
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-4">
          {activeTab === 'LpWelle' && <LpWelleContent />}
          {activeTab === 'Fotobuch' && <FotobuchContent />}
          {activeTab === 'Print' && <PrintContent />}
          </div>
        </div>
        
      </section>
    </main>
    </AuthLayout>
  );
}

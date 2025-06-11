"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building } from "@/data/buildings";
import { generateTenantRedirectUrl } from "@/utils/tenant";

interface BuildingCardProps {
  building: Building;
  tenant: string;
}

export default function BuildingCardNew({ building, tenant }: BuildingCardProps) {
  return (
    <Link
      href={generateTenantRedirectUrl(tenant, `buildings/${building.id}`)}
      className="block"
    >
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={building.image || "/placeholder-building.jpg"}
            alt={building.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Badges on top right */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
              building.status === "Active" 
                ? "bg-emerald-500 text-white" 
                : building.status === "Archived"
                ? "bg-gray-600 text-white"
                : "bg-amber-500 text-white"
            }`}>
              {building.status}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-gray-800 shadow-lg">
              {building.id.startsWith("400") ? "Residential" : "Commercial"}
            </span>
          </div>
          
          {/* Building info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-2xl font-bold text-white mb-1">
              {building.name}
            </h3>
            <p className="text-white/90 text-sm font-medium">
              ID: {building.id}
            </p>
          </div>
        </div>
        
        {/* Content section */}
        <div className="p-6">
          {/* Division with icon */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              building.division === "Camden"
                ? "bg-emerald-100"
                : building.division === "Hampstead"
                ? "bg-blue-100"
                : building.division === "Ealing"
                ? "bg-purple-100"
                : "bg-gray-100"
            }`}>
              <svg className={`w-5 h-5 ${
                building.division === "Camden"
                  ? "text-emerald-600"
                  : building.division === "Hampstead"
                  ? "text-blue-600"
                  : building.division === "Ealing"
                  ? "text-purple-600"
                  : "text-gray-600"
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Division</p>
              <p className={`font-semibold ${
                building.division === "Camden"
                  ? "text-emerald-700"
                  : building.division === "Hampstead"
                  ? "text-blue-700"
                  : building.division === "Ealing"
                  ? "text-purple-700"
                  : "text-gray-700"
              }`}>
                {building.division}
              </p>
            </div>
          </div>
          
          {/* Metrics row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Compliance */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 font-medium mb-2">Compliance</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  building.compliance >= 75 
                    ? "bg-emerald-100" 
                    : building.compliance >= 50 
                    ? "bg-amber-100" 
                    : "bg-red-100"
                }`}>
                  <span className={`text-lg font-bold ${
                    building.compliance >= 75 
                      ? "text-emerald-700" 
                      : building.compliance >= 50 
                      ? "text-amber-700" 
                      : "text-red-700"
                  }`}>
                    {building.compliance}%
                  </span>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  building.compliance >= 75 
                    ? "bg-emerald-500" 
                    : building.compliance >= 50 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }`}>
                  {building.compliance >= 75 ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : building.compliance >= 50 ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            
            {/* Notifications */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-600 font-medium mb-2">Notifications</p>
              <div className="flex items-center gap-2">
                {building.inbox.urgent > 0 && (
                  <div className="relative">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {building.inbox.urgent}
                    </span>
                  </div>
                )}
                
                {building.inbox.warning > 0 && (
                  <div className="relative">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {building.inbox.warning}
                    </span>
                  </div>
                )}
                
                {building.inbox.email && (
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
                
                {!building.inbox.urgent && !building.inbox.warning && !building.inbox.email && (
                  <span className="text-gray-400 text-sm">No new</span>
                )}
              </div>
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Last updated: Today
            </span>
            <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
              View details
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}